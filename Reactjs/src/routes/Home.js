import { useRef, useState, useEffect } from "react";
import { LANGUAGES, USER_ROLE } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useRoutes } from "react-router-domv6";

export default function Home(){
  const { isLoggedIn, userInfo, language } = useSelector((state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  }));

    let linkToRedirect='/';
    if(isLoggedIn){
        switch (userInfo.roleId) {
          case USER_ROLE.ADMIN:
            linkToRedirect='/admin-dashboard/app'
            break;
          case USER_ROLE.DOCTOR:
            linkToRedirect='/admin-dashboard/doctor'
            break;
          case USER_ROLE.EMPLOYEE:
            linkToRedirect='/admin-dashboard/employee'
            break;
          case USER_ROLE.PATIENT:
            linkToRedirect='/home'
            break;
          default:
            linkToRedirect='/home'
        } 
    }

  return <Navigate to={linkToRedirect} replace={true}/>;
}



