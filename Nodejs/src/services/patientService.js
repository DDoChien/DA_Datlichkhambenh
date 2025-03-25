import { Op } from 'sequelize';
import db from "../models/index";
require("dotenv").config();
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";


let buildUrlEmail = (doctorId, token) => {
  let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;

  return result;
};

let postBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
       // Kiểm tra xem tất cả các tham số bắt buộc đã được truyền vào chưa.
      if (
        !data.email ||
        !data.doctorId ||
        !data.timeType ||
        !data.date ||
        !data.patientName
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",// Trả về lỗi nếu thiếu tham số.
        });
      } else {
         // Tìm người bệnh qua email.
        let user = await db.User.findOne({
          where: { email: data.email },
        });

        if (user) {
           // Kiểm tra xem bệnh nhân đã có lịch hẹn cho bác sĩ này chưa.
          let booking = await db.Booking.findOne({
            where: {
              doctorId: data.doctorId,
              patientId: user.id,
              date: data.date,
              timeType: data.timeType,
              clinicId: data.clinicId,
            },
          });

          if (booking) {
           // Lỗi nếu đã có lịch hẹn trùng.
            resolve({
              errCode: 4,
              errMessage: "Duplicate booking!",
            });
            return; // Stop execution if duplicate booking exists
          }
        }

        // Kiểm tra xem bác sĩ có còn chỗ trong lịch hẹn hay không.
        let schedule = await db.Schedule.findOne({
          where: {
            date: data.date,
            timeType: data.timeType,
            doctorId: data.doctorId,
          },
          raw: false, // Đảm bảo lấy được dữ liệu thực tế từ cơ sở dữ liệ
        });

        if (schedule) {
          // Nếu lịch còn chỗ, tăng số bệnh nhân đã đặt. 
          if (schedule.currentNumber < schedule.maxNumber) {
            schedule.currentNumber = parseInt(schedule.currentNumber) + 1;
            await schedule.save();
          } else {
            resolve({
              errCode: 3,
              errMessage: "Limit max number booking!",
            });
            return; // Lỗi nếu vượt quá số lượng tối đa.
          }
        } else {
          resolve({
            errCode: 3,
            errMessage: "No schedule available for the doctor!",
          });
          return; // Lỗi nếu không có lịch hẹn cho bác sĩ.
        }

        let token = uuidv4(); // tạo token cho lịch hẹn 

         // Gửi email xác nhận với thông tin lịch hẹn.
        await emailService.sendSimpleEmail({
          receiverEmail: data.email,
          patientName: data.patientName,
          time: data.timeString,
          doctorName: data.doctorName,
          language: data.language,
          redirectLink: buildUrlEmail(data.doctorId, token), // Link xác nhận lịch hẹn qua email.
        });

        // Lưu thông tin lịch hẹn vào cơ sở dữ liệu.
        await db.Booking.create({
          statusId: "S1", // lịch hẹn mới( chưa xác nhậnnhận)
          doctorId: data.doctorId,
          patientId: user.id,
          date: data.date,
          timeType: data.timeType,
          token: token, // Lưu mã token.
          patientName: data.patientName,
          patientPhoneNumber: data.phoneNumber,
          patientAddress: data.address,
          patientReason: data.reason,
          patientGender: data.selectedGender,
          patientBirthday: data.date,
          clinicId: data.clinicId,
        });

        resolve({
          errCode: 0,
          errMessage: "Save patient info succeed!", // Thành công khi lưu thông tin
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

//Hàm này xác nhận lịch hẹn khi bệnh nhân bấm vào liên kết trong email
let postVerifyBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token || !data.doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter", // Kiểm tra tham số.
        });
      } else {
          // Tìm lịch hẹn từ token và doctorId.
        let appointment = await db.Booking.findOne({
          where: { doctorId: data.doctorId, token: data.token, statusId: "S1" },
          raw: false, // Đảm bảo lấy dữ liệu thực tế.
        });

        if (appointment) {
          appointment.statusId = "S2"; // Cập nhật trạng thái thành "S2" (đã xác nhận).
          await appointment.save();
          resolve({
            errCode: 0,
            errMessage: "Update the appointment succeed!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Appointment has been activated or does not exist!",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};


//lấy lịch sử khám bệnh của bệnh nhân, có thể lọc theo ngày nếu có.
let filterHistory = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.patientId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",// Kiểm tra tham số.
        });
      } else {
        let startDate=data.startDate ? data.startDate : null
        let endDate=data.endDate ? data.endDate : null

        let dataHistories=[]
        if(startDate && endDate){
          // Lọc theo ngày.
            dataHistories = await db.History.findAll({
              where: {
                    patientId:data.patientId,
                    createdAt: {
                        [Op.lt]: new Date(new Date(endDate).getTime() + 60 * 60 * 24 * 1000 - 1),
                        [Op.gt]: new Date(startDate)
                    },
                },
                order: [['createdAt', 'DESC']],
                attributes: ["id", "patientId", "doctorId", "description", "drugs", "files", "reason", "createdAt", "updatedAt","image_sheet_medical_examination_result","pdf_sheet_medical_examination_result","pdf_remedy"],
                include: [
                  {
                    model: db.User,
                    as: "doctorDataHistory",
                    attributes: ["id","email", "firstName","lastName"],
                    include: [
                      {
                        model: db.Doctor_Infor,
                        attributes: ["id","doctorId","specialtyId","clinicId"],
                        include: [
                          {
                            model: db.Specialty,
                            as: "specialtyData",
                            attributes: ["name"],
                          },
                          {
                            model: db.Clinic,
                            as: "clinicData",
                            attributes: ["name"],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    model: db.Booking,
                    attributes: ["id","statusId", "doctorId","patientId","date","timeType","token","imageRemedy","patientName","patientPhoneNumber","patientAddress","patientReason","patientGender","patientBirthday","image_sheet_medical_examination_result","pdf_sheet_medical_examination_result","pdf_remedy"],
                    include: [
                      {
                        model: db.Invoice,
                        as: "invoiceData",
                        attributes: ["doctorId", "patientId", "specialtyId", "totalCost", "bookingId", "services", "image_invoice","pdf_invoice"],
                      },
                    ]
                  },
                ],
                raw: true,
                nest: true,
            })
        }else{
           // Nếu không có ngày, lấy tất cả lịch sử.
            dataHistories = await db.History.findAll({
              where: {
                    patientId:data.patientId,
                },
                order: [['createdAt', 'DESC']],
                attributes: ["id", "patientId", "doctorId", "description", "drugs", "files","reason","createdAt", "updatedAt","image_sheet_medical_examination_result"],
                include: [
                  {
                    model: db.User,
                    as: "doctorDataHistory",
                    attributes: ["id","email", "firstName","lastName"],
                    include: [
                      {
                        model: db.Doctor_Infor,
                        attributes: ["id","doctorId","specialtyId","clinicId"],
                        include: [
                          {
                            model: db.Specialty,
                            as: "specialtyData",
                            attributes: ["name"],
                          },
                          {
                            model: db.Clinic,
                            as: "clinicData",
                            attributes: ["name"],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    model: db.Booking,
                    attributes: ["id","statusId", "doctorId","patientId","date","timeType","token","imageRemedy","patientName","patientPhoneNumber","patientAddress","patientReason","patientGender","patientBirthday","image_sheet_medical_examination_result","pdf_sheet_medical_examination_result","pdf_remedy"],
                    include: [
                      {
                        model: db.Invoice,
                        as: "invoiceData",
                        attributes: ["doctorId", "patientId", "specialtyId", "totalCost", "bookingId", "services", "image_invoice","pdf_invoice"],
                      },
                    ]
                  },
                ],
                raw: true,
                nest: true,
            })
        }
       
          resolve({
            errCode: 0,
            data: dataHistories,
          });
      }
    } catch (e) {
      reject(e);
    }
  });
};

//lấy lịch sử các cuộc hẹn của bệnh nhân trong khoảng thời gian cho trước.
let filterHistoryBookings = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra nếu không có patientId (ID bệnh nhân) thì trả về lỗi
      if (!data.patientId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        // Xử lý các tham số ngày bắt đầu và ngày kết thúc
        let startDate=data.startDate ? data.startDate : null
        let endDate=data.endDate ? data.endDate : null

        let dataHistoryBookings=[]
        // Nếu có cả startDate và endDate, lọc các bookings theo khoảng thời gian
        if(startDate && endDate){
          dataHistoryBookings = await db.Booking.findAll({
              where: {
                    patientId:data.patientId,
                    createdAt: {
                        [Op.lt]: new Date(new Date(endDate).getTime() + 60 * 60 * 24 * 1000 - 1),
                        [Op.gt]: new Date(startDate)
                    },
                },
                order: [['createdAt', 'DESC']],// Sắp xếp theo thời gian tạo giảm dần
                attributes: ["statusId", "doctorId", "patientId", "date", "timeType", "token", "createdAt", "updatedAt", "imageRemedy", "patientName", "patientPhoneNumber", "patientAddress", "patientReason", "patientGender", "patientBirthday"],
                include: [
                  {
                    model: db.Allcode,
                    as: "timeTypeDataPatient",
                    attributes: ["id","keyMap", "type","valueEn","valueVi","createdAt","updatedAt","value"],
                  },
                  {
                    model: db.Allcode,
                    as: "statusDataPatient",
                    attributes: ["id","keyMap", "type","valueEn","valueVi","createdAt","updatedAt","value"],
                  },
                  {
                    model: db.User,
                    as: "doctorData",
                    attributes: ["id","email", "firstName","lastName"],
                    include: [
                      {
                        model: db.Doctor_Infor,
                        attributes: ["id","doctorId","specialtyId","clinicId"],
                        include: [
                          {
                            model: db.Specialty,
                            as: "specialtyData",
                            attributes: ["name"],
                          },
                          {
                            model: db.Clinic,
                            as: "clinicData",
                            attributes: ["name"],
                          },
                        ],
                      },
                    ],
                  }
                ],
                raw: true,
                nest: true,
            })
        }else{
          dataHistoryBookings = await db.Booking.findAll({
              where: {
                    patientId:data.patientId,
                },
                order: [['createdAt', 'DESC']],
                attributes: ["statusId", "doctorId", "patientId", "date", "timeType", "token", "createdAt", "updatedAt", "imageRemedy", "patientName", "patientPhoneNumber", "patientAddress", "patientReason", "patientGender", "patientBirthday"],
                include: [
                  {
                    model: db.Allcode,
                    as: "timeTypeDataPatient",
                    attributes: ["id","keyMap", "type","valueEn","valueVi","createdAt","updatedAt","value"],
                  },
                  {
                    model: db.Allcode,
                    as: "statusDataPatient",
                    attributes: ["id","keyMap", "type","valueEn","valueVi","createdAt","updatedAt","value"],
                  },
                  {
                    model: db.User,
                    as: "doctorData",
                    attributes: ["id","email", "firstName","lastName"],
                    include: [
                      {
                        model: db.Doctor_Infor,
                        attributes: ["id","doctorId","specialtyId","clinicId"],
                        include: [
                          {
                            model: db.Specialty,
                            as: "specialtyData",
                            attributes: ["name"],
                          },
                          {
                            model: db.Clinic,
                            as: "clinicData",
                            attributes: ["name"],
                          },
                        ],
                      },
                    ],
                  }
                ],
                raw: true,
                nest: true,
            })
        }
       
          resolve({
            errCode: 0,
            data: dataHistoryBookings,
          });
      }
    } catch (e) {
      reject(e);
    }
  });
};

//// Hàm lọc các bookings của bác sĩ theo ngày
let filterBookingsByDateTimestamp = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.doctorId) {
        resolve({
          errCode: 1,
          errMessage: "filterBookingsByDateTimestamp",
        });
      } else {
        let dataHistoryBookings=[]

        if(data.date){
          dataHistoryBookings = await db.Booking.findAll({
              where: {
                    doctorId:data.doctorId,
                    date: data.date,
                },
                order: [['createdAt', 'DESC']],
                attributes: ["statusId", "doctorId", "patientId", "date", "timeType", "token", "createdAt", "updatedAt", "imageRemedy", "patientName", "patientPhoneNumber", "patientAddress", "patientReason", "patientGender", "patientBirthday","image_sheet_medical_examination_result","pdf_sheet_medical_examination_result","pdf_remedy"],
                include: [
                  {
                    model: db.Allcode,
                    as: "timeTypeDataPatient",
                    attributes: ["id","keyMap", "type","valueEn","valueVi","createdAt","updatedAt","value"],
                  },
                  {
                    model: db.Allcode,
                    as: "statusDataPatient",
                    attributes: ["id","keyMap", "type","valueEn","valueVi","createdAt","updatedAt","value"],
                  },
                  {
                    model: db.Invoice,
                    as: "invoiceData",
                    attributes: ["id","doctorId", "patientId","specialtyId","totalCost","createdAt","updatedAt","bookingId","services","image_invoice","pdf_invoice"],
                  },
                ],
                raw: true,
                nest: true,
            })
        }
          resolve({
            errCode: 0,
            data: dataHistoryBookings,
          });
      }
    } catch (e) {
      reject(e);
    }
  });
};


// lọc các bookings theo các tiêu chí như trạng thái, ngày, bác sĩ, bệnh nhân, phòng khám
let filterBookings = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
        let dataBookings=[]
        let options = {};

        if(data.statusId) options.statusId= data.statusId;
        if(data.date) options.date= data.date;
        if(data.doctorId) options.doctorId = data.doctorId;
        if(data.patientId) options.patientId = data.patientId;
        if(data.clinicId) options.clinicId = data.clinicId;

        dataBookings = await db.Booking.findAll({
          where: options,
          order: [['createdAt', 'DESC']],
          attributes: ["id","statusId", "doctorId", "patientId", "date", "timeType", "token", "createdAt", "updatedAt","patientName", "patientPhoneNumber", "patientAddress", "patientReason", "patientGender", "patientBirthday","pdf_sheet_medical_examination_result","pdf_remedy"],
          include: [
            {
              model: db.Allcode,
              as: "timeTypeDataPatient",
              attributes: ["id","keyMap", "type","valueEn","valueVi","createdAt","updatedAt","value"],
            },
            {
              model: db.Allcode,
              as: "statusDataPatient",
              attributes: ["id","keyMap", "type","valueEn","valueVi","createdAt","updatedAt","value"],
            },
            {
              model: db.User,
              as: "doctorData",
              attributes: ["id","email", "firstName","lastName"],
              include: [
                {
                  model: db.Doctor_Infor,
                  attributes: ["id","doctorId","specialtyId","clinicId"],
                  include: [
                    {
                      model: db.Specialty,
                      as: "specialtyData",
                      attributes: ["name"],
                    },
                    {
                      model: db.Clinic,
                      as: "clinicData",
                      attributes: ["name"],
                    },
                  ],
                },
              ],
            }
          ],
          raw: true,
          nest: true,
        })
     
        resolve({
          errCode: 0,
          data: dataBookings,
        });
    } catch (e) {
      reject(e);
    }
  });
};

//  cập nhật trạng thái của một booking
let updateStatusBooking = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.statusId) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameter id || statusId",
        });
      }
      let booking = await db.Booking.findOne({
        where: { id: data.id },
        raw: false, //chu y cho nay do ben file config cau hinh cho query
      });
      if (booking) {
        booking.statusId = data.statusId;
        await booking.save();

        resolve({
          errCode: 0,
          message: "Update the status booking succeed!",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: `Update the status booking failed!`,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  postBookAppointment: postBookAppointment,
  postVerifyBookAppointment: postVerifyBookAppointment,
  filterHistory:filterHistory,
  filterHistoryBookings:filterHistoryBookings,
  filterBookingsByDateTimestamp:filterBookingsByDateTimestamp,
  filterBookings:filterBookings,
  updateStatusBooking:updateStatusBooking
};
