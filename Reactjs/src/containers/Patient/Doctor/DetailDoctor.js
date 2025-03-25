import { useRef, useState, useEffect } from "react";
import HomeHeader from "../../HomePage/HomeHeader";
import "./DetailDoctor.scss";
import { getDetailInforDoctor } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import DoctorSchedule from "./DoctorSchedule";
import DoctorExtraInfor from "./DoctorExtraInfor";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-domv6';

export default function DetailDoctor(){

  const [detailDoctor, setDetailDoctor] = useState({});
  const [currentDoctorId, setCurrentDoctorId] = useState(-1);

  const { id } = useParams();

  const { isLoggedIn, userInfo, language } = useSelector((state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  }));

  useEffect(() => {
    async function fetchData() {
      setCurrentDoctorId(id)
      let res = await getDetailInforDoctor(id);
      if (res && res.errCode === 0) {
        setDetailDoctor(res.data)
      }
    }

    fetchData();
  }, []);

    let nameVi = "",
      nameEn = "";
    if (detailDoctor && detailDoctor.positionData) {
      nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.lastName} ${detailDoctor.firstName}`;
      nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.firstName} ${detailDoctor.lastName}`;
    }

    return (
      <>
        <HomeHeader isShowBanner={false} />
        <div className="doctor-detail-container">
          <div className="intro-doctor">
            <div
              className="content-left "
              style={{
                backgroundImage: `url(${
                  detailDoctor && detailDoctor.image ? detailDoctor.image : ""
                })`,
              }}
            ></div>
            <div className="content-right">
              <div className="up">
                {language === LANGUAGES.VI ? nameVi : nameEn}
              </div>
              <div className="down">
                {detailDoctor &&
                  detailDoctor.Markdown &&
                  detailDoctor.Markdown.description && (
                    <span>{detailDoctor.Markdown.description}</span>
                  )}
              </div>
            </div>
          </div>
          <div className="schedule-doctor">
            <div className="content-left">
              <DoctorSchedule doctorIdFromParent={currentDoctorId} />
            </div>
            <div className="content-right">
              <DoctorExtraInfor
                doctorIdFromParent={currentDoctorId}
              />
            </div>
          </div>
          <div className="detail-infor-doctor">
            {detailDoctor &&
              detailDoctor.Markdown &&
              detailDoctor.Markdown.contentHTML && (
                <div //neu khong co thuoc tinh nay se in ra noi dung HTML
                  dangerouslySetInnerHTML={{
                    __html: detailDoctor.Markdown.contentHTML,
                  }}
                ></div>
              )}
          </div>
          <div className="comment-doctor"></div>
        </div>
      </>
    );
}


