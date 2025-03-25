import { useRef, useState, useEffect } from "react";

import { FormattedMessage } from "react-intl";

import { useNavigate } from "react-router-domv6";
import { useLocation } from "react-router-domv6";
import { useDispatch, useSelector } from "react-redux";

import * as actions from "../../.././store/actions";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../.././utils";

import { Modal } from "reactstrap";
import moment from "moment";

import {
  filterHistoriesPatient,
  filterBookingHistory,
} from "../../.././services/userService";

import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";

import {
  filterBookings,
  updateStatusBooking
} from "../../.././services/bookingService";
import DatePicker from "../../.././components/Input/DatePicker";

export default function BookingHistory() {
  const [currentTab, setCurrentTab] = useState('S1');
  const [isOpenModalEditStatusBooking, setIsOpenModalEditStatusBooking] = useState(false);
  const [currentDate, setCurrentDate] = useState();
  const [currentBooking, setCurrentBooking] = useState({});

  const location = useLocation();
  
  const tabs = [
    {
        keyMap: 'S1',
        tabTitleVi: 'Lịch hẹn mới',
        tabTitleEn: 'New',
    },
    {
        keyMap: 'S2',
        tabTitleVi: 'Đã xác nhận bởi bệnh nhân',
        tabTitleEn: 'Confirmed by patient',
    },
    {
        keyMap: 'S3',
        tabTitleVi: 'Đã xác nhận bởi phòng khám',
        tabTitleEn: 'Confirmed by clinic',
    },
    {
        keyMap: 'S4',
        tabTitleVi: 'Đã xác nhận bởi bác sĩ',
        tabTitleEn: 'Confirmed by doctor',
    },
    {
        keyMap: 'S5',
        tabTitleVi: 'Đã khám xong',
        tabTitleEn: 'Done',
    },
    {
        keyMap: 'S6',
        tabTitleVi: 'Đã hủy',
        tabTitleEn: 'Cancel',
    }
];

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [patientId, setPatientId] = useState("");
  const [bookings, setBookings] = useState([]);

  const [previewImgURL, setPreviewImgURL] = useState([]);
  const [units, setUnits] = useState([
    { key: "pill", valueVi: "Viên", valueEn: "Pill" },
    { key: "package", valueVi: "Gói", valueEn: "Package" },
    { key: "bottle", valueVi: "Chai", valueEn: "Bottle" },
    { key: "tube", valueVi: "Ống", valueEn: "Tube" },
    { key: "set", valueVi: "Bộ", valueEn: "Set" },
  ]);
  const [isShowLoading, setIsShowLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoggedIn, userInfo, language } = useSelector((state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  }));

  useEffect(() => {
    if(location.search){
      let unixTimestamp=parseInt(location.search.split('=')[1])
      let dateObject = new Date(unixTimestamp)
   
      setCurrentDate(dateObject)
    }else{
      setCurrentDate(moment(new Date()).startOf("day").valueOf())
    }
  }, []);

  const handleOnchangeDate = (event, type) => {
    if (type == "startDate") {
      setStartDate(event.target.value);
    } else {
      setEndDate(event.target.value);
    }
    if (startDate) console.log("startDate", startDate);
  };

  const checkValidateInput = () => {
    if (!startDate) {
      if (language == "vi") {
        toast.error("Bạn chưa nhập ngày bắt đầu");
      } else {
        toast.error("You have not entered a start date");
      }
      return false;
    }

    if (!endDate) {
      if (language == "vi") {
        toast.error("Bạn chưa nhập ngày kết thúc");
      } else {
        toast.error("You have not entered an end date");
      }
      return false;
    }

    return true;
  };

  const handleFilterHistoryByDateApply = async () => {
    let bool = checkValidateInput();
    if (!bool) return;

    setIsShowLoading(true);

    let data = {
      patientId: patientId,
      startDate: startDate,
      endDate: endDate,
    };

    let res = await filterBookingHistory(data);
    if (res && res.errCode == 0) {
      setBookings(res.data);
      setIsShowLoading(false);
    } else {
      setIsShowLoading(false);
    }
  };

  const getLabelStatus = (status) => {
    switch (status) {
      case "S1":
        return 'badge bg-primary'
        break;
      case "S2":
        return 'badge bg-info text-dark'
        break;
      case "S3":
        return 'badge bg-info text-dark'
        break;
      case "S4":
        return 'badge bg-info text-dark'
        break;
      case "S5":
        return 'badge bg-success'
        break;
      case "S6":
        return 'badge bg-danger'
        break;
      default:
        return 'badge bg-light text-dark'
    }
  };
 
  useEffect(() => {
      async function fetchData() {
        await getDataBooking();
      }
      fetchData();
  }, [currentTab]);

  useEffect(() => {
    async function fetchData() {
      await getDataBooking();
    }
    fetchData();
  }, [currentDate]);

  const handleOnChangeDatePicker = (date) => {
    setCurrentDate(date[0]);
  };

  const handleOnchangeTab = async (keyMap) => {
    setCurrentTab(keyMap);
  }

  const getDataBooking = async () => {
    setIsShowLoading(true);
    let formatedDate = new Date(currentDate).getTime();

    let options={}
    options.date=formatedDate;
    options.statusId=currentTab;
    options.patientId=userInfo.id;
    
    let res = await filterBookings(options);
    if (res && res.errCode === 0) {
      setBookings(res.data)
      setIsShowLoading(false);
    }
    setIsShowLoading(false);
  };

  const handleConfirmStatus = async (booking) => {
    let data = {
        id:booking.id,
        statusId: "S2" //Đã xác nhận bởi bệnh nhân
    }
  
    let res = await updateStatusBooking(data)

    if(res && res.errCode===0){
        let message = language === LANGUAGES.VI ? "Cập nhật thành công!" : "Update succeed!"
        if(message) toast.success(message)

        getDataBooking();
    }else{
        let message = language === LANGUAGES.VI ? "Cập nhật thất bại!" : "Update failed!"
        if(message) toast.error(message)
    }
  };

  const handleCancelConfirmStatus = async (booking) => {
    let data = {
        id:booking.id,
        statusId: "S1" //Lịch hẹn mới
    }

    let res = await updateStatusBooking(data)

    if(res && res.errCode===0){
        let message = language === LANGUAGES.VI ? "Cập nhật thành công!" : "Update succeed!"
        if(message) toast.success(message)

        getDataBooking();
    }else{
        let message = language === LANGUAGES.VI ? "Cập nhật thất bại!" : "Update failed!"
        if(message) toast.error(message)
    }
  };

  return (
    <LoadingOverlay
      active={isShowLoading}
      spinner={<ClimbingBoxLoader color={"#86e7d4"} size={15} />}
    >
      <div>
        <div class="d-flex justify-content-center">
          <h2>
            <FormattedMessage id="booking-history.title" />
          </h2>
        </div>
     
        <div class="row">
            <div className="col-4 form-group">
                    <label>
                      <FormattedMessage id={"manage-patient.choose-date"} />
                    </label>
                    <DatePicker
                      onChange={(event)=>handleOnChangeDatePicker(event)}
                      className="form-control"
                      value={currentDate}
                    />
             </div>
        </div>

        <div class="row" style={{height: "100vh"}}>
            <div class="col-12">
                <div className='tabs'>
                                {tabs.map((tab, i) =>
                                    <button key={i} disabled={currentTab === `${tab.keyMap}`} onClick={()=>handleOnchangeTab(tab.keyMap)}>{language==="vi" ? tab.tabTitleVi : tab.tabTitleEn}</button>
                                )}
                </div>
                <div className='content'>
                    <table class="table table-hover">
                      <thead>
                          <tr>
                            <th scope="col" class="text-center">
                                #
                            </th>
                            <th scope="col" class="text-center">
                                <FormattedMessage id="booking-history.date-examination" />
                            </th>
                            <th scope="col" class="text-center">
                                <FormattedMessage id="booking-history.shift" />
                            </th>
                            <th scope="col" class="text-center">
                                <FormattedMessage id="booking-history.reason" />
                            </th>
                            <th scope="col" class="text-center">
                                <FormattedMessage id="booking-history.doctor" />
                            </th>
                            <th scope="col" class="text-center">
                                <FormattedMessage id="booking-history.patient-name" />
                            </th>
                            <th scope="col" class="text-center">
                                <FormattedMessage id="booking-history.patient-phone-number" />
                            </th>
                            <th scope="col" class="text-center">
                                <FormattedMessage id="booking-history.address" />
                            </th>
                            <th scope="col" class="text-center">
                                <FormattedMessage id="booking-history.status" />
                            </th>
                            {
                                currentTab==="S1" && (
                                    <th scope="col" class="text-center">
                                        {language==="vi" ? "Xác nhận" : "Confirm"}
                                    </th>
                                )
                            }
                            {
                                currentTab==="S2" && (
                                    <th scope="col" class="text-center">
                                        {language==="vi" ? "Hủy xác nhận" : "Cancel confirmation"}
                                    </th>
                                )
                            }
                          </tr>
                      </thead>
                      <tbody>
                          {bookings.map((item, index) => {

                          //convert timestamp to date
                          const unixTimestamp = parseInt(item.date);
                          const dateObject = new Date(unixTimestamp);
                          let date =
                              dateObject.getDate() +
                              "/" +
                              (parseInt(dateObject.getMonth()) + 1) +
                              "/" +
                              dateObject.getFullYear();

                          return (
                              <tr>
                                <td class="text-center">{index + 1}</td>
                                <td class="text-center">{date}</td>
                                <td class="text-center">
                                    {language === "en"
                                    ? item.timeTypeDataPatient.valueEn
                                    : item.timeTypeDataPatient.valueVi}
                                </td>
                                <td class="text-center">{item.patientReason}</td>
                                <td class="text-center">
                                    <div
                                    class="pointer text-primary"
                                    onClick={() =>
                                      navigate(`/detail-doctor/${item.doctorId}`)
                                    }
                                    >
                                    {item.doctorData.lastName} {item.doctorData.firstName}
                                    </div>
                                    <div
                                    class="pointer text-primary"
                                    onClick={() =>
                                      navigate(
                                        `/detail-specialty/${item.doctorData.Doctor_Infor.specialtyId}`
                                        )
                                    }
                                    >
                                    {item.doctorData.Doctor_Infor.specialtyData.name}
                                    </div>
                                    <div
                                    class="pointer text-primary"
                                    onClick={() =>
                                      navigate(
                                        `/detail-clinic/${item.doctorData.Doctor_Infor.clinicId}`
                                        )
                                    }
                                    >
                                    {item.doctorData.Doctor_Infor.clinicData.name}
                                    </div>
                                </td>
                                <td class="text-center">{item.patientName}</td>
                                <td class="text-center">{item.patientPhoneNumber}</td>
                                <td class="text-center">{item.patientAddress}</td>
                                <td className={`text-center`} >
                                    <span 
                                      className={`${getLabelStatus(item.statusId)}`} 
                                      style={{ padding: '5px', fontSize: '14px' }}
                                      >  
                                      {language === "en"
                                    ? item.statusDataPatient.valueEn
                                    : item.statusDataPatient.valueVi}</span>
                                </td>
                                {
                                    currentTab==="S1" && (
                                        <td class="text-center">
                                            <i class="fas fa-check pointer text-success fs-24"
                                                onClick={()=>handleConfirmStatus(item)}
                                            ></i>
                                        </td>
                                    )
                                }
                                {
                                    currentTab==="S2" && (
                                        <td class="text-center">
                                            <i class="fas fa-times fs-24 text-danger pointer"
                                            onClick={()=>handleCancelConfirmStatus(item)}
                                            ></i>
                                        </td>
                                    )
                                }
                              </tr>
                          );
                          })}
                      </tbody>
                    </table>
                </div>
            </div>
        </div>


      </div>
    </LoadingOverlay>
  );
}
