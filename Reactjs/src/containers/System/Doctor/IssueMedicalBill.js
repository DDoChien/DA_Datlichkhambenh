import { useRef, useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import "./IssueMedicalBill.scss"; 

import { toast } from "react-toastify"; // Thư viện để thông báo người dùng
import moment from "moment"; // Thư viện xử lý thời gian
import localization from "moment/locale/vi"; // Sử dụng ngôn ngữ Tiếng Việt cho moment.js
import { CommonUtils } from "../../../utils"; // Import tiện ích chung

import { getBookingById, postCreateInvoice } from "../../../services/userService"; // API để lấy thông tin đặt lịch và tạo hóa đơn

import { useParams, useNavigate } from "react-router-domv6"; // Dùng để lấy tham số từ URL và điều hướng
import { useDispatch, useSelector } from "react-redux"; // Redux để quản lý trạng thái ứng dụng
import LoadingOverlay from "react-loading-overlay"; // Thư viện hiển thị overlay khi đang tải
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader"; // Loader spinner

export default function IssueMedicalBill() {
  // Khai báo các state để quản lý thông tin của bệnh nhân và hóa đơn
  const [email, setEmail] = useState("");
  const [patientName, setPatientName] = useState("");
  const [listServices, setListServices] = useState([]); // Danh sách các dịch vụ
  const [isShowLoading, setIsShowLoading] = useState(false); // Trạng thái hiển thị loading
  const [doctorId, setDoctorId] = useState(""); // ID bác sĩ
  const [patientId, setPatientId] = useState(""); // ID bệnh nhân
  const [date, setDate] = useState(""); // Ngày
  const [token, setToken] = useState(""); // Token
  const [timeType, setTimeType] = useState(""); // Loại thời gian
  const [doctorName, setDoctorName] = useState(""); // Tên bác sĩ
  const [reason, setReason] = useState(""); // Lý do khám
  const [totalAmount, setTotalAmount] = useState(0); // Tổng số tiền
  const [specialtyId, setSpecialtyId] = useState(""); // ID chuyên khoa

  let navigate = useNavigate(); // Hook để điều hướng

  let { bookingId } = useParams(); // Lấy tham số bookingId từ URL

  // Redux state để lấy thông tin người dùng và ngôn ngữ
  const { isLoggedIn, userInfo, language } = useSelector((state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  }));

  // Hàm useEffect để gọi API lấy thông tin về lịch khám
  useEffect(() => {
    async function fetchData() {
      let patientInfo = await getBookingById(bookingId); // Gọi API lấy thông tin đặt lịch theo bookingId
      console.log("patientInfo", patientInfo); // Hiển thị thông tin lấy được từ API
      if (
        patientInfo &&
        patientInfo.data &&
        patientInfo.data.patientName &&
        patientInfo.data.patientData.email
      ) {
        // Nếu dữ liệu hợp lệ, cập nhật các state tương ứng
        setEmail(patientInfo.data.patientData.email);
        setPatientName(patientInfo.data.patientName);
        setDoctorId(patientInfo.data.doctorId);
        setPatientId(patientInfo.data.patientId);
        setDate(patientInfo.data.date);
        setToken(patientInfo.data.token);
        setTimeType(patientInfo.data.timeType);
        let name =
          (userInfo.lastName ? userInfo.lastName : "") +
          " " +
          (userInfo.firstName ? userInfo.firstName : "");
        setDoctorName(name); // Lấy tên bác sĩ từ userInfo
        setReason(patientInfo.data.patientReason);
        setSpecialtyId(patientInfo.data.doctorInfor.specialtyId);
      }
    }
    fetchData();
  }, []); // useEffect chỉ chạy một lần khi component mount

  // Hàm xử lý tạo hóa đơn
  const handleCreateInvoiceImage = () => {
    createInvoiceImage(); // Gọi hàm tạo hóa đơn
  };

  // Hàm thực hiện việc tạo hóa đơn
  const createInvoiceImage = async () => {
    setIsShowLoading(true); // Hiển thị loading khi tạo hóa đơn
  
    let tempListService = [...listServices]; // Tạo một bản sao của danh sách dịch vụ
  
    let amountInLocalCurrency = totalAmount; // Sử dụng totalAmount theo đơn vị hiện tại
  
    if (language === "vi") {
      // Nếu ngôn ngữ Tiếng Việt, đảm bảo số tiền là VND
      amountInLocalCurrency = totalAmount; // Giả sử totalAmount là VND nếu ngôn ngữ là tiếng Việt
    } else {
      // Nếu ngôn ngữ Tiếng Anh, có thể muốn chuyển đổi sang USD (hoặc xử lý khác)
      // Cần thực hiện chuyển đổi tỷ giá nếu cần
      amountInLocalCurrency = totalAmount / 23000; // Giả sử tỷ giá 1 USD = 23,000 VND
    }

    // Gọi API để tạo hóa đơn
    let res = await postCreateInvoice({
      email: email,
      doctorId: doctorId,
      patientId: patientId,
      timeType: timeType,
      date: date,
      token: token,
      language: language,
      patientName: patientName,
      doctorName: doctorName,
      patientReason: reason,
      listServices: tempListService,
      totalAmount: amountInLocalCurrency, // Lưu số tiền đã chuyển đổi
      bookingId: bookingId,
      specialtyId: specialtyId,
    });
  
    // Kiểm tra kết quả trả về từ API
    if (res && res.errCode === 0) {
      setIsShowLoading(false); // Tắt loading
      if (language == "en") {
        toast.success("Create invoice succeed!"); // Thông báo thành công
      } else {
        toast.success("Tạo hóa đơn thành công!"); // Thông báo thành công (Tiếng Việt)
      }
    } else {
      setIsShowLoading(true); // Hiển thị lại loading
      if (language == "en") {
        toast.error("Something wrongs...!"); // Thông báo lỗi
      } else {
        toast.error("Lỗi!"); // Thông báo lỗi (Tiếng Việt)
      }
    }
    setIsShowLoading(false); // Tắt loading sau khi xử lý xong

    // Điều hướng về trang quản lý bệnh nhân
    navigate("/admin-dashboard/doctor/manage-patient?date=" + date, {
      replace: true,
    });
  };

  // Hàm thêm dịch vụ vào danh sách
  const handleAddService = () => {
    let temp = [...listServices];
    temp = [...temp, { name: "", amount: 0 }];
    setListServices(temp); // Cập nhật lại danh sách dịch vụ
  };

  // Hàm xóa dịch vụ khỏi danh sách
  const handleRemoveService = (index) => {
    let temp = [...listServices];
    temp.splice(index, 1); // Xóa dịch vụ tại index
    setListServices(temp); // Cập nhật lại danh sách
  };

  // Hàm xử lý thay đổi tên dịch vụ
  const handleOnChangeNameService = (event, index) => {
    let temp = [...listServices];
    temp[index].name = event.target.value; // Cập nhật tên dịch vụ
    setListServices(temp); // Cập nhật lại danh sách dịch vụ
  };

  // Hàm xử lý thay đổi số tiền dịch vụ
  const handleOnChangeAmountService = (event, index) => {
    let temp = [...listServices];
    temp[index].amount = event.target.value; // Cập nhật số tiền dịch vụ
    setListServices(temp); // Cập nhật lại danh sách dịch vụ
  };

  // Cập nhật tổng số tiền của các dịch vụ
  const updateTotalAmountServices = () => {
    let tempServices = [...listServices];
    if (tempServices) {
      let tempTotalAmount = 0;
      tempServices.map((service, index) => {
        tempTotalAmount = tempTotalAmount + parseInt(service.amount); // Tính tổng tiền
      });
      setTotalAmount(tempTotalAmount); // Cập nhật tổng số tiền
    } else {
      setTotalAmount(0); // Nếu không có dịch vụ, tổng tiền là 0
    }
  };

  // useEffect để cập nhật tổng tiền mỗi khi danh sách dịch vụ thay đổi
  useEffect(() => {
    updateTotalAmountServices();
  }, [listServices]);

  return (
    // Hiển thị giao diện với overlay khi đang tải
    <LoadingOverlay
      active={isShowLoading}
      spinner={<ClimbingBoxLoader color={"#86e7d4"} size={15} />}
    >
      <div className="row">
        <div class="col-12">
          <h5 className="">
            <FormattedMessage
              id={"admin.issue-medical-bill.issue-medical-bill"}
            />
          </h5>
        </div>
      </div>
      <div className="row">
        <div class="col-12">
          <div class="row">
            {/* Các input để điền thông tin bệnh nhân và các dịch vụ */}
            <div className="col-6 form-group">
              <label>
                <FormattedMessage id={"admin.manage-drug.email-patient"} />
              </label>
              <input
                className="form-control"
                type="email"
                value={email}
              />
            </div>
            <div className="col-6 form-group">
              <label>
                <FormattedMessage id={"admin.manage-drug.name-patient"} />
              </label>
              <input
                className="form-control"
                type="text"
                value={patientName}
              />
            </div>
            <div className="col-6 form-group">
              <label>
                <FormattedMessage id={"admin.issue-medical-bill.invoice"} />
              </label>
            </div>
            <div className="col-6 form-group text-right">
              <i class="fa fa-plus-circle fs-24 pointer" aria-hidden="true" onClick={() => handleAddService()}></i> {/* Thêm dịch vụ */}
            </div>
            {/* Hiển thị danh sách dịch vụ */}
            <div class="col-12">
              <div class="row">
                <div class="col-12 form-group">
                  <div class="row align-items-center text-center mb-10">
                    <div class="col-4">
                      <FormattedMessage id={"admin.issue-medical-bill.service"} />
                    </div>
                    <div class="col-1">
                      <FormattedMessage id={"admin.issue-medical-bill.amount-of-money"} />
                    </div>
                  </div>
                  {listServices.map((service, index) => {
                    return (
                      <div key={index} class="row  text-center mb-10">
                        <div class="col-4">
                          <input type="text" value={service.name} class="form-control" placeholder="" onChange={(event) => handleOnChangeNameService(event, index)} />
                        </div>
                        <div class="col-1">
                          <input type="text" value={service.amount} class="form-control" placeholder="" onChange={(event) => handleOnChangeAmountService(event, index)} />
                        </div>
                        <div class="col-1 d-flex align-items-center">
                          <i class="fas fa-trash pointer text-red" onClick={() => handleRemoveService(index)}></i> {/* Xóa dịch vụ */}
                        </div>
                      </div>
                    );
                  })}
                  <div class="row  text-center mb-10">
                    <div class="col-4">
                      <input type="text" value={language === "en" ? "Total Amount" : "Tổng tiền"} class="form-control" placeholder="" />
                    </div>
                    <div class="col-1">
                      <input type="text" value={totalAmount} class="form-control" placeholder="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => handleCreateInvoiceImage()} // Gọi hàm tạo hóa đơn
        type="button"
        class="btn btn-primary"
      >
        <FormattedMessage id={"admin.manage-drug.btn-create"} />
      </button>
    </LoadingOverlay>
  );
}
