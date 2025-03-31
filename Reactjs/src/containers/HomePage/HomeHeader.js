import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./HomeHeader.scss";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../utils";


import MenuHomeHeader from "./MenuHomeHeader";
import * as actions from "../../store/actions";
import { useNavigate } from "react-router-domv6";

export default function HomeHeader({isShowBanner}){

  const [previewImgURL, setPreviewImgURL] = useState([]);

  const { isLoggedIn, userInfo, language } = useSelector((state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  }));

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const changeLanguage = (language) => {
    dispatch(actions.changeLanguageApp(language));
    //fire redux event: action
  };

  const returnToHome = () => {
    navigate(`/home`);
  };

  useEffect(() => {
      if(userInfo && userInfo.image){
        let imageBase64 = "";
        imageBase64 = new Buffer(userInfo.image, "base64").toString("binary");
        setPreviewImgURL(imageBase64)
      }
  }, [userInfo]);

    return (
      <>
        <div className="home-header-container">
          <div className="home-header-content">
            <div className="left-content">
              <div
                className="header-logo"
                onClick={() => {
                  returnToHome();
                }}
              ></div>
            </div>
            <div className="center-content">
              <div className="child-content">
                <div>
                  <b>
                    <FormattedMessage id="homeheader.speciality" />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id="homeheader.searchdoctor" />
                </div>
              </div>
              <div className="child-content">
                <div>
                  <b>
                    <FormattedMessage id="homeheader.health-facility" />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id="homeheader.select-room" />
                </div>
              </div>
              <div className="child-content">
                <div>
                  <b>
                    <FormattedMessage id="homeheader.doctor" />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id="homeheader.select-doctor" />
                </div>
              </div>
              <div className="child-content">
                <div>
                  <b>
                    <FormattedMessage id="homeheader.fee" />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id="homeheader.check-health" />
                </div>
              </div>
            </div>
            <div className="right-content">
              <div className="support">
                <i className="fas fa-question-circle"></i>
                <FormattedMessage id="homeheader.support" />
              </div>
              <div
                className={
                  language === LANGUAGES.VI
                    ? "language-vi active"
                    : "language-vi"
                }
              >
                <span onClick={() => changeLanguage(LANGUAGES.VI)}>
                  VN
                </span>
              </div>
              <div
                className={
                  language === LANGUAGES.EN //bien language duoc khai bao ben tren
                    ? "language-en active"
                    : "language-en"
                }
              >
                <span onClick={() => changeLanguage(LANGUAGES.EN)}>
                  EN
                </span>
              </div>


           

              <div
              class="avatar-profile mx-10"
              style={{
                backgroundImage: `url(${previewImgURL ? previewImgURL : ""})`,
              }}
              >
                </div>

              <div className="menu-home-header">
                <MenuHomeHeader />
              </div>
            </div>
          </div>
        </div>
        {isShowBanner === true && (
          <div className="home-header-banner">
            <div class="slide slide1"></div>
            <div class="slide slide2"></div>
            <div class="slide slide3"></div>
              <div class="slide slide4"></div>
  
    
            <div className="content-up position-relative">
              <div class="position-absolute" >
                {/* <div className="title1 pt-8">
                  <FormattedMessage id="banner.title1" />
                </div>
                <div className="title2 px-16">
                  <FormattedMessage id="banner.title2" />
                </div> */}
                
              </div>
            </div>
          </div>
        )}
      </>
    );
}

// https://medpro.vn/

