import { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./DetailSpecialty.scss";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfor from "../Doctor/DoctorExtraInfor";
import ProfileDoctor from "../Doctor/ProfileDoctor";

import HomeHeader from "../../HomePage/HomeHeader";
import {
  getAllSpecialtyById,
  getAllCodeService,
} from "../../../services/userService";
import _ from "lodash";
import { LANGUAGES } from "../../../utils";

import { useParams } from 'react-router-domv6';
import { useDispatch, useSelector } from "react-redux";

export default function DetailSpecialty(){

  const [arrDoctorId, setArrDoctorId] = useState([]);
  const [dataDetailSpecialty, setDataDetailSpecialty] = useState({});
  const [listProvince, setListProvince] = useState([]);

  const { id } = useParams();

  const { isLoggedIn, userInfo, language } = useSelector((state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  }));

  useEffect(() => {
      async function fetchData() {
        let res = await getAllSpecialtyById({
          id: id,
          location: "ALL",
        });
        let resProvince = await getAllCodeService("PROVINCE");
        if (
          res &&
          res.errCode === 0 &&
          resProvince &&
          resProvince.errCode === 0
        ) {
          let data = res.data;
          let arrDoctorId = [];
          if (data && !_.isEmpty(data)) {
            let arr = data.doctorSpecialty;
            if (arr && arr.length > 0) {
              arr.map((item) => {
                arrDoctorId.push(item.doctorId);
              });
            }
          }
  
          let dataProvince = resProvince.data;
  
          if (dataProvince && dataProvince.length > 0) {
            dataProvince.unshift({
              createdAt: null,
              keyMap: "ALL",
              type: "PROVINCE",
              valueEn: "ALL",
              valueVi: "Toàn quốc",
            });
          }
  
          setDataDetailSpecialty(res.data)
          setArrDoctorId(arrDoctorId)
          setListProvince(dataProvince ? dataProvince : [])
        }
      }
      fetchData();
  }, []);


  const handleOnChangeSelect = async (event) => {
      let location = event.target.value;

      let res = await getAllSpecialtyById({
        id: id,
        location: location,
      });

      if (res && res.errCode === 0) {
        let data = res.data;
        let arrDoctorId = [];
        if (data && !_.isEmpty(res.data)) {
          let arr = data.doctorSpecialty;
          if (arr && arr.length > 0) {
            arr.map((item) => {
              arrDoctorId.push(item.doctorId);
            });
          }
        }

        setDataDetailSpecialty(res.data)
        setArrDoctorId(arrDoctorId)
      }
  };

    return (
      <div className="detail-specialty-container">
        <HomeHeader isShowBanner={false}/>
        <div className="detail-specialty-body">
          <div className="description-specialty">
            {dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty) && (
              <div //neu khong co thuoc tinh nay se in ra noi dung HTML
                dangerouslySetInnerHTML={{
                  __html: dataDetailSpecialty.descriptionHTML,
                }}
              ></div>
            )}
          </div>
          <div className="search-sp-doctor">
            <select onChange={(event) => handleOnChangeSelect(event)}>
              {listProvince &&
                listProvince.length > 0 &&
                listProvince.map((item, index) => {
                  return (
                    <option key={index} value={item.keyMap}>
                      {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                    </option>
                  );
                })}
            </select>
          </div>
          {arrDoctorId &&
            arrDoctorId.length > 0 &&
            arrDoctorId.map((item, index) => {
              return (
                <div className="each-doctor" key={index}>
                  <div className="dt-content-left">
                    <div className="profile-doctor">
                      <ProfileDoctor
                        doctorId={item}
                        isShowDescriptionDoctor={true}
                        isShowLinkDetail={true}
                        isShowPrice={false}
                      />
                    </div>
                  </div>
                  <div className="dt-content-right">
                    <div className="doctor-schedule">
                      <DoctorSchedule doctorIdFromParent={item} />
                    </div>
                    <div className="doctor-extra-infor">
                      <DoctorExtraInfor doctorIdFromParent={item} />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
}


