import { useRef, useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import "./BookingModal.scss";
import { Modal } from "reactstrap";
import ProfileDoctor from "../ProfileDoctor";
import _ from "lodash";
import DatePicker from "../../../../components/Input/DatePicker";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import Select from "react-select";
import { postPatientBookAppointment } from "../../../../services/userService";
import { toast } from "react-toastify";
import moment from "moment";
import localization from "moment/locale/vi"; //su dung chung cho cai mac dinh la tieng viet
import LoadingOverlay from "react-loading-overlay";
import { css } from "@emotion/react";
import BounceLoader from "react-spinners/BounceLoader";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-domv6';
import { useNavigate } from "react-router-domv6";


export default function BookingModal({ isOpenModal,closeBookingClose,dataTime }){

  const [patientName, setPatientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [reason, setReason] = useState("");
  const [birthday, setBirthday] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [clinicId, setClinicId] = useState("");
  const [genders, setGenders] = useState("");
  const [timeType, setTimeType] = useState("");
  const [isShowLoading, setIsShowLoading] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { id } = useParams();
  
  const { isLoggedIn, userInfo, language,genders_admin } = useSelector((state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
    genders_admin: state.admin.genders, 
  }));

  useEffect(() => {
    if (userInfo && userInfo.email) {
      setEmail(userInfo.email)
    }

    dispatch(actions.fetchGenderStart());
  }, []);

  const buildDataGender = (data) => {
    let result = [];

    if (data && data.length > 0) {
      data.map((item) => {
        let object = {};
        object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
        object.value = item.keyMap;
        result.push(object);
      });
    }
    return result;
  };

  useEffect(() => {
    // setGenders(buildDataGender(genders_admin))

    //
    if(userInfo) setEmail(userInfo.email)

    // //
    setGenders(buildDataGender(genders_admin))

    // //
    if (dataTime && !_.isEmpty(dataTime)) {
      let doctorId = dataTime.doctorId;
      let timeType = dataTime.timeType;
      let clinicId = dataTime.doctorData.Doctor_Infor.clinicId;

      setDoctorId(doctorId)
      setTimeType(timeType)
      setClinicId(clinicId)
    }
  }, [language,userInfo,genders_admin,dataTime]);


  const handleOnChangeInput = (event, id) => {
    let valueInput = event.target.value;
    switch(id) {
      case "patientName":
        setPatientName(valueInput)
        break;
      case "phoneNumber":
        setPhoneNumber(valueInput)
        break;
      case "email":
        setEmail(valueInput)
        break;
      case "address":
        setAddress(valueInput)
        break;
      case "reason":
        setReason(valueInput)
        break;
    }
  };

  const handleOnChangeDatePicker = (date) => {
    setBirthday(date[0])
  };

  const handleChangeSelect = (selectedOption) => {
    setSelectedGender(selectedOption)
  };

  const buildTimeBooking = (dataTime) => {
    if (dataTime && !_.isEmpty(dataTime)) {
      let time =
        language === LANGUAGES.VI
          ? dataTime.timeTypeData.valueVi
          : dataTime.timeTypeData.valueEn;

      let date =
        language === LANGUAGES.VI
          ? moment.unix(+dataTime.date / 1000).format("dddd - DD/MM/YYYY")
          : moment
              .unix(+dataTime.date / 1000)
              .locale("en")
              .format("ddd - MM/DD/YYYY");
      return `${time} - ${date}`;
    }
    return "";
  };

  const handleDoctorName = (dataTime) => {
    if (dataTime && !_.isEmpty(dataTime)) {
      let name =
        language === LANGUAGES.VI
          ? `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
          : `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`;

      return name;
    }
    return "";
  };
  

  const handleConfirmBooking = async () => {

     // Kiểm tra các trường bắt buộc
     if (!patientName || !phoneNumber || !email || !address || !reason || !birthday || !selectedGender) {
      // Nếu thiếu thông tin, hiển thị thông báo lỗi
      if (language === "en") {
          toast.error("Please fill in all required fields.");
      } else {
          toast.error("Vui lòng điền đầy đủ thông tin.");
      }
      return; // Dừng lại, không gửi yêu cầu
  }
    // Show loading spinner
    setIsShowLoading(true);
  
    // Validate input
    let date = new Date(birthday).getTime();
    let timeString = buildTimeBooking(dataTime);
    let doctorName = handleDoctorName(dataTime);
    let clinicId_temp = clinicId ? clinicId : (dataTime.doctorData.Doctor_Infor.clinicId ? dataTime.doctorData.Doctor_Infor.clinicId : null);
  
    try {
      // Post the booking request
      let res = await postPatientBookAppointment({
        patientName: patientName,
        phoneNumber: phoneNumber,
        email: email,
        address: address,
        reason: reason,
        date: dataTime.date,
        birthday: date,
        selectedGender: selectedGender.value,
        doctorId: doctorId,
        timeType: timeType,
        language: language,
        timeString: timeString,
        doctorName: doctorName,
        clinicId: clinicId_temp
      });
  
      // Handle response
      if (res && res.errCode === 0) {
        // Success
        if (language === "en") {
          toast.success("Book a new appointment successfully, please check your email for confirmation!");
        } else {
          toast.success("Đặt lịch khám thành công, hãy kiểm tra email của bạn để xác nhận!");
        }
        closeBookingClose();
        navigate(`/user/booking-history?date=${dataTime.date}`);
      } else if (res && res.errCode === 4) {
        // Appointment already booked
        if (language === "en") {
          toast.warn("You have already booked an appointment at this time, please choose a different time slot!");
        } else {
          toast.warn("Bạn đã đặt lịch hẹn vào khung giờ này rồi, vui lòng chọn khung giờ khác!");
        }
        closeBookingClose();
      } else {
        // Error
        if (language === "en") {
          toast.error("Error!");
        } else {
          toast.error("Khung giờ nãy đã hết chỗ, vui lòng chọn khung giờ khác!");
        }
        closeBookingClose();
      }
    } catch (error) {
      // Error in the request
      if (language === "en") {
        toast.error("An error occurred. Please try again later.");
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } finally {
      // Hide loading spinner after the request is completed
      setIsShowLoading(false);
    }
  };


  
    let doctorId_temp = dataTime && !_.isEmpty(dataTime) ? dataTime.doctorId : "";

    return (
      <LoadingOverlay
        active={isShowLoading}
        spinner={<BounceLoader color={"#86e7d4"} size={60} />}
      >
        <Modal
          isOpen={isOpenModal}
          className={"booking-modal-container"}
          size="lg"
          centered
        >
          <div className="booking-modal-content">
            <div className="booking-modal-header">
              <span className="left">
                <FormattedMessage id="patient.booking-modal.title" />
              </span>
              <span className="right" onClick={closeBookingClose}>
                <i className="fas fa-times"></i>
              </span>
            </div>
            <div className="booking-modal-body">
              {/* {JSON.stringify(dataTime)} */}
              <div className="doctor-infor">
                <ProfileDoctor
                  doctorId={doctorId_temp}
                  isShowDescriptionDoctor={false}
                  dataTime={dataTime}
                  isShowLinkDetail={false}
                  isShowPrice={true}
                />
              </div>

              <div className="row">
                <div className="col-6 form-group">
                  <label>
                    <FormattedMessage id="patient.booking-modal.patientName" />
                  </label>
                  <input
                    className="form-control"
                    value={patientName}
                    onChange={(event) =>
                      handleOnChangeInput(event, "patientName")
                    }
                  />
                </div>
                <div className="col-6 form-group">
                  <label>
                    <FormattedMessage id="patient.booking-modal.phoneNumber" />
                  </label>
                  <input
                    className="form-control"
                    value={phoneNumber}
                    onChange={(event) =>
                      handleOnChangeInput(event, "phoneNumber")
                    }
                  />
                </div>
                <div className="col-6 form-group">
                  <label>
                    <FormattedMessage id="patient.booking-modal.email" />
                  </label>
                  <input
                    className="form-control"
                    value={email}
                    onChange={(event) =>
                      handleOnChangeInput(event, "email")
                    }
                  />
                </div>
                <div className="col-6 form-group">
                  <label>
                    <FormattedMessage id="patient.booking-modal.address" />
                  </label>
                  <input
                    className="form-control"
                    value={address}
                    onChange={(event) =>
                      handleOnChangeInput(event, "address")
                    }
                  />
                </div>
                <div className="col-12 form-group">
                  <label>
                    <FormattedMessage id="patient.booking-modal.reason" />
                  </label>
                  <input
                    className="form-control"
                    value={reason}
                    onChange={(event) =>
                      handleOnChangeInput(event, "reason")
                    }
                  />
                </div>
                <div className="col-6 form-group">
                  <label>
                    <FormattedMessage id="patient.booking-modal.birthday" />
                  </label>
                  <DatePicker
                    onChange={handleOnChangeDatePicker}
                    className="form-control"
                    value={birthday}
                  />
                </div>
                <div className="col-6 form-group">
                  <label>
                    <FormattedMessage id="patient.booking-modal.gender" />
                  </label>
                  <Select
                    value={selectedGender}
                    onChange={handleChangeSelect}
                    options={genders}
                  />
                </div>
              </div>
            </div>
            <div className="booking-modal-footer">
              <button
                className="btn-booking-confirm"
                onClick={() => handleConfirmBooking()}
              >
                <FormattedMessage id="patient.booking-modal.btnConfirm" />
              </button>
              <button
                className="btn-booking-cancel"
                onClick={closeBookingClose}
              >
                <FormattedMessage id="patient.booking-modal.btnCancel" />
              </button>
            </div>
          </div>
        </Modal>
      </LoadingOverlay>
    );
}


