import { useRef, useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import "./ProfileDoctor.scss";
import { getProfileDoctorById } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import NumberFormat from "react-number-format";
import _ from "lodash";
import moment from "moment";
import localization from "moment/locale/vi"; //su dung chung cho cai mac dinh la tieng viet
import { Link } from "react-router-domv6";
import { useDispatch, useSelector } from "react-redux";

export default function ProfileDoctor({doctorId,isShowDescriptionDoctor,isShowLinkDetail,isShowPrice}){

  const [dataProfile, setDataProfile] = useState({});

  const { isLoggedIn, userInfo, language } = useSelector((state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  }));

  useEffect(() => {
    async function fetchData() {
      let data = await getInforDoctor(doctorId);
      if(data){
        setDataProfile(data)
      }
    }
    fetchData();
}, [doctorId]);

  const getInforDoctor = async (id) => {
    let result = {};
    if (id) {
      let res = await getProfileDoctorById(id);
      if (res && res.errCode === 0) {
        result = res.data;
      }
    }
    return result;
  };

  const renderTimeBooking = (dataTime) => {
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
      return (
        <>
          <div>
            {time} - {date}
          </div>
          <div>
            <FormattedMessage id="patient.booking-modal.priceBooking" />
          </div>
        </>
      );
    }
    return <></>;
  };
  
    let nameVi = "",
      nameEn = "";
    if (dataProfile && dataProfile.positionData) {
      nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`;
      nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`;
    }
    return (
      <div className="profile-doctor-container">
        <div className="intro-doctor">
          <div
            className="content-left "
            style={{
              backgroundImage: `url(${
                dataProfile && dataProfile.image ? dataProfile.image : ""
              })`,
            }}
          ></div>
          <div className="content-right">
            <div className="up">
              {language === LANGUAGES.VI ? nameVi : nameEn}
            </div>
            <div className="down">
              {isShowDescriptionDoctor === true ? (
                <>
                  {dataProfile &&
                    dataProfile.Markdown &&
                    dataProfile.Markdown.description && (
                      <span>{dataProfile.Markdown.description}</span>
                    )}
                </>
              ) : (
                <>{renderTimeBooking()}</>
              )}
            </div>
          </div>
        </div>
        {isShowLinkDetail === true && (
          <div className="view-detail-doctor">
            <Link to={`/detail-doctor/${doctorId}`}><FormattedMessage id="patient.detail-doctor.see-more" /></Link>
          </div>
        )}
        {isShowPrice === true && (
          <div className="price">
            <FormattedMessage id="patient.booking-modal.price" />
            {dataProfile &&
              dataProfile.Doctor_Infor &&
              language === LANGUAGES.VI && (
                <NumberFormat
                  className="currency"
                  value={dataProfile.Doctor_Infor.priceTypeData.valueVi}
                  displayType={"text"}
                  thousandSeparator={true}
                  suffix={"VND"}
                />
              )}
            {dataProfile &&
              dataProfile.Doctor_Infor &&
              language === LANGUAGES.EN && (
                <NumberFormat
                  className="currency"
                  value={dataProfile.Doctor_Infor.priceTypeData.valueEn}
                  displayType={"text"}
                  thousandSeparator={true}
                  suffix={"$"}
                />
              )}
          </div>
        )}
      </div>
    );
}




