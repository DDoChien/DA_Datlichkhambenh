import { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { postVerifyBookAppointment } from "../../services/userService";
import HomeHeader from "../HomePage/HomeHeader";
import "./VerifyEmail.scss";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from 'react-router-domv6';


export default function VerifyEmail(){
  const [statusVerify, setStatusVerify] = useState(false);
  const [errCode, setErrCode] = useState(0);

  const location = useLocation();

  const { isLoggedIn, userInfo, language } = useSelector((state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  }));

  useEffect(() => {
    async function fetchData() {
      if (location && location.search) {
        let urlParams = new URLSearchParams(location.search);
        let token = urlParams.get("token");
        let doctorId = urlParams.get("doctorId");
        let res = await postVerifyBookAppointment({
          token: token,
          doctorId: doctorId,
        });
        if (res && res.errCode === 0) {
          setStatusVerify(true)
          setErrCode(res.errCode)
        } else {
          setStatusVerify(true)
          setErrCode(res && res.errCode ? res.errCode : -1)
        }
      }
    }
    fetchData();
}, []);

    return (
      <>
        <HomeHeader isShowBanner={false}/>
        <div className="verify-email-container">
          {statusVerify === false ? (
            <div>Loading data...</div>
          ) : (
            <div>
              {+errCode === 0 ? (
                <div className="infor-booking">
                  Xác nhận lịch hẹn thành công!
                </div>
              ) : (
                <div className="infor-booking">
                  Lịch hẹn không tồn tại hoặc đã được xác nhận!
                </div>
              )}
            </div>
          )}
        </div>
      </>
    );
}




