import { useRef, useState, useEffect } from "react";
import * as actions from "../../store/actions";

import "./scss/ProfileSetting.scss";
import { FormattedMessage } from "react-intl";

import { useNavigate } from "react-router-domv6";
import { useDispatch, useSelector } from "react-redux";
import HomeHeader from "../HomePage/HomeHeader";

import LeftContent from "./resources/LeftContent"

import MyAccount from "./resources/MyAccount";
import MedicalHistory from "./resources/MedicalHistory";
import BookingHistory from "./resources/BookingHistory";

import { Outlet } from "react-router-domv6";


// import {
//   getHandleLoginGoogle
// } from "../../services/userService";

export default function ProfileSetting() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoggedIn, userInfo, language } = useSelector((state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  }));


  const handleBackHome = ()=>{
    navigate("/home")
  }

  useEffect(() => { 
    if(!isLoggedIn){
      navigate("/login")
    }
   }, [isLoggedIn]);


  return (
      <div class="">
        <HomeHeader isShowBanner={false} />
        <div class="custom-sidebar" style={{}}><LeftContent /></div>
        <div class="p-30" style={{marginLeft:"350px",backgroundColor:"#f5f6fd"}}>
              <nav aria-label="breadcrumb">
                      <ol class="breadcrumb breadcrumb-bg" style={{paddingLeft:"unset"}}>
                          <li style={{color:"#295dfb"}} class="breadcrumb-item pointer" onClick={()=>handleBackHome()}><FormattedMessage id="profile-setting.breadcrumb-home" /></li>
                          <li class="breadcrumb-item active" aria-current="page"><FormattedMessage id="profile-setting.breadcrumb-settings" /></li>
                      </ol>
              </nav>

              <Outlet />
        </div>
      </div>
  );
}
