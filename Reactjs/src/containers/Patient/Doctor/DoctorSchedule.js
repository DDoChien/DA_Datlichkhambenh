import { useRef, useState, useEffect } from "react";

import moment from "moment";
import localization from "moment/locale/vi"; //su dung chung cho cai mac dinh la tieng viet

import "./DoctorSchedule.scss";
import Select from "react-select";
import { LANGUAGES } from "../../../utils";
import { getScheduleDoctorByDate } from "../../../services/userService";
import { FormattedMessage } from "react-intl";
import BookingModal from "./Modal/BookingModal";
import { useNavigate } from "react-router-domv6";
import { useDispatch, useSelector } from "react-redux";

export default function DoctorSchedule(props){

  const [allDays, setAllDays] = useState([]);
  const [allAvailableTime, setAllAvailableTime] = useState([]);
  const [isOpenModalBooking, setIsOpenModalBooking] = useState(false);
  const [dataScheduleTimeModal, setDataScheduleTimeModal] = useState({});
  const [today, setToday] = useState("");

  const { isLoggedIn, userInfo, language } = useSelector((state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  }));

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      let allDays = getArrDays(language);
      if (props.doctorIdFromParent) {
        let res = await getScheduleDoctorByDate(
          props.doctorIdFromParent,
          allDays[0].value
        );
  
        let copy_allAvailableTime=[]
        let currentHour = moment().format("HH");
  
        if(res && res.data){
            let copyRes=[...res.data];
            copy_allAvailableTime=copyRes.filter((element)=> element.timeTypeData.value > currentHour)
            setAllAvailableTime(copy_allAvailableTime ? copy_allAvailableTime : [])
        } 
  
        setToday(allDays[0].value)
      }
  
      if (allDays && allDays.length > 0) {
        setAllDays(allDays)
      }
    }

    fetchData();
  }, []);
 
  const capitalizeFirstLetter = (string)=>{
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const getArrDays = (language_va) => {
    let allDays = [];
    for (let i = 0; i < 7; i++) {
      let object = {};
      if (language_va === LANGUAGES.VI) {
        if (i === 0) {
          let ddMM = moment(new Date()).format("DD/MM");
          let today = `Hôm nay - ${ddMM}`;
          object.label = today;
        } else {
          let labelVi = moment(new Date())
            .add(i, "days")
            .format("dddd - DD/MM");
          object.label = capitalizeFirstLetter(labelVi);
        }
      } else {
        if (i === 0) {
          let ddMM = moment(new Date()).format("DD/MM");
          let today = `Today - ${ddMM}`;
          object.label = today;
        } else {
          object.label = moment(new Date())
            .add(i, "days")
            .locale("en")
            .format("ddd - DD/MM");
        }
      }

      object.value = moment(new Date()).add(i, "days").startOf("day").valueOf();

      allDays.push(object);
    }
    return allDays;
  };


  useEffect(() => {
    const prevProps = { ...props };

    async function fetchData() {
      if (props.language !== prevProps.language) { 
        let allDays = getArrDays(props.language);

        setAllDays(allDays)
    }

    if (props.doctorIdFromParent !== prevProps.doctorIdFromParent) { 
      let allDays = getArrDays(language);
      let res = await getScheduleDoctorByDate(
        props.doctorIdFromParent,
        allDays[0].value
      );

      let copy_allAvailableTime=[]
      let currentHour = moment().format("HH");

      if(res && res.data){
          let copyRes=[...res.data];
          copy_allAvailableTime=copyRes.filter((element)=> element.timeTypeData.value > currentHour)
          setAllAvailableTime(copy_allAvailableTime ? copy_allAvailableTime : [])
      } 
    }

    }
    fetchData();
  }, [language,props.doctorIdFromParent]);

  const handleOnChangeSelect = async (event) => {
    if (props.doctorIdFromParent && props.doctorIdFromParent !== -1) {
      let doctorId = props.doctorIdFromParent;
      let date = event.target.value;
      let res = await getScheduleDoctorByDate(doctorId, date);

      if (res && res.errCode === 0) {
        let copy_allAvailableTime=[]
        let currentHour = moment().format("HH");

        if(res && res.data && date && currentHour){
          if(date==today){
              copy_allAvailableTime=[...res.data].filter((element)=>
                element.timeTypeData.value > currentHour 
              )
              setAllAvailableTime(copy_allAvailableTime ? copy_allAvailableTime : [])
          }else{
            setAllAvailableTime(res.data ? res.data : [])
          }
      } 
      }
    }
  };

  const handleClickScheduleTime = (time) => {
    if(!isLoggedIn) 
      navigate("/login");

    setIsOpenModalBooking(true)
    setDataScheduleTimeModal(time)
  };

  const closeBookingClose = () => {
    setIsOpenModalBooking(false)
  };

    return (
      <>
        <div className="doctor-schedule-container">
          <div className="all-schedule">
            <select onChange={(event) => handleOnChangeSelect(event)}>
              {allDays &&
                allDays.length > 0 &&
                allDays.map((item, index) => {
                  return (
                    <option value={item.value} key={index}>
                      {item.label}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="all-availabel-time">
            <div className="text-calendar">
              <i className="fas fa-calendar-alt">
                <span>
                  &nbsp;
                  <FormattedMessage id="patient.detail-doctor.schedule" />
                </span>
              </i>
            </div>
            <div className="time-content">
              {allAvailableTime && allAvailableTime.length > 0 ? (
                <>
                  <div className="time-content-btns">
                    {allAvailableTime.map((item, index) => {
                      let timeDisplay =
                        language === LANGUAGES.VI
                          ? item.timeTypeData.valueVi
                          : item.timeTypeData.valueEn;

                      return (
                        <button
                          key={index}
                          className={
                            language === LANGUAGES.VI ? "btn-vi" : "btn-en"
                          }
                          onClick={() => handleClickScheduleTime(item)}
                        >
                          {timeDisplay}
                        </button>
                      );
                    })}
                  </div>

                  <div className="book-free">
                    <span>
                      <FormattedMessage id="patient.detail-doctor.choose" />
                      <i className="far fa-hand-point-up"></i>
                      <FormattedMessage id="patient.detail-doctor.book-free" />
                    </span>
                  </div>
                </>
              ) : (
                <div className="no-schedule">
                  <FormattedMessage id="patient.detail-doctor.no-schedule" />
                </div>
              )}
            </div>
          </div>
        </div>
        <BookingModal
          isOpenModal={isOpenModalBooking}
          closeBookingClose={closeBookingClose}
          dataTime={dataScheduleTimeModal}
        />
      </>
    );
}




