import { useRef, useState, useEffect } from "react";
// import * as actions from "../store/actions";
import * as actions from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useGoogleAuth } from "../../containers/Auth/resources/googleAuth.js";
import { useNavigate } from "react-router-domv6";


export default function Logout() {

  const { signOut } = useGoogleAuth();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => { 
    handleLogout()
   }, []);

   const handleLogout = ()=>{
    dispatch(actions.processLogout()); //mapDispathToProps
    // signOut();
    navigate("/home");
   }

  return (
    <>
    </>
  );
}


