import { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./DetailClinic.scss";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfor from "../Doctor/DoctorExtraInfor";
import ProfileDoctor from "../Doctor/ProfileDoctor";

import HomeHeader from "../../HomePage/HomeHeader";
import { getAllDetailClinicById } from "../../../services/userService";
import _ from "lodash";
import { LANGUAGES } from "../../../utils";
import { useParams } from 'react-router-domv6';
import { useDispatch, useSelector } from "react-redux";

export default function DetailClinic(){
  const [arrDoctorId, setArrDoctorId] = useState([]);
  const [dataDetailClinic, setDataDetailClinic] = useState({});

  const { id } = useParams();

  const { isLoggedIn, userInfo, language } = useSelector((state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  }));

  useEffect(() => {
    async function fetchData() {
      if (id) {
        let res = await getAllDetailClinicById({
          id: id,
        });
  
        if (res && res.errCode === 0) {
          let data = res.data;
  
          let arrDoctorId = [];
          if (data && !_.isEmpty(data)) {
            let arr = data.doctorClinic;
            if (arr && arr.length > 0) {
              arr.map((item) => {
                arrDoctorId.push(item.doctorId);
              });
            }
          }
  
          setDataDetailClinic(res.data)
          setArrDoctorId(arrDoctorId)
        }
      }
    }
    fetchData();
}, []);

    return (
      <div className="detail-specialty-container">
        <HomeHeader isShowBanner={false}/>
        <div className="detail-specialty-body">
          <div className="description-specialty">
            {dataDetailClinic && !_.isEmpty(dataDetailClinic) && (
              <>
                <div>{dataDetailClinic.name}</div>
                <div //neu khong co thuoc tinh nay se in ra noi dung HTML
                  dangerouslySetInnerHTML={{
                    __html: dataDetailClinic.descriptionHTML,
                  }}
                ></div>
              </>
            )}
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

