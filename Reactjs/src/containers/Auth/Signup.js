import { useRef, useState, useEffect } from "react";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";

import "./Signup.scss";
import { FormattedMessage } from "react-intl";
import { handleLoginApi } from "../../services/userService";

import { createNewUserService } from "../../services/userService";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-domv6";
import { useDispatch, useSelector } from "react-redux";
import HomeHeader from "../HomePage/HomeHeader";

export default function Signup(){

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  
  const navigate = useNavigate();

  const { isLoggedIn, userInfo, language } = useSelector((state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  }));

  const handleOnChangeInput = (event, id) => {
    let valueInput=event.target.value;

    switch(id) {
      case 'email':
        setEmail(valueInput)
        break;
      case 'password':
        setPassword(valueInput)
        break;
      case 'firstName':
        setFirstName(valueInput)
        break;
      case 'lastName':
        setLastName(valueInput)
        break;
      case 'address':
        setAddress(valueInput)
        break;
      default:
        // code block
    }
  };

  const handleShowHidePassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleAddNewUser();
    }
  };

  const createNewUser = async (data) => {
    try {
      let response = await createNewUserService(data);
      if (response && response.errCode !== 0) {
        if(language=="en"){
          toast.error("Sign up new account failed!");
        }else{
          toast.error("Đăng ký tài khoản thất bại!");
        }
      } else {
        if(language=="en"){
          toast.success("User created successfully!");
        }else{
          toast.success("Tạo mới người dùng thành công!");
        }
        setPassword("")
        setEmail("")
        setFirstName("")
        setLastName("")
        setAddress("")
        setIsShowPassword(false)
        
        navigate("/login")
      }
    } catch (e) {
      console.log(e);
    }
  };

  const checkValidateInput = () => {
    let isValid = true;
    
    if(!email || !password || !firstName || !lastName || !address){
      isValid = false;
    }

    if(language==="en"){
      toast.error("Missing parameter: ");
    }else{
      toast.error("Chưa nhập đủ thông tin");
    }

    return isValid;
  };

  const handleAddNewUser = () => {
    let isValid = checkValidateInput();
    if (isValid === true) {
      //call api create modal
      createNewUser({
        email:email,
        password:password,
        firstName:firstName,
        lastName:lastName,
        address:address
      }); //can kiem tra lai cac input trong state cho fit
    }
  };

    return (
      <>
      <HomeHeader isShowBanner={false} />
      <div className="login-background">
        <div className="signup-container">
          <div className="login-content row">
            <div className="col-12 text-login"><FormattedMessage id={"login.sign-up"} /></div>
            <div className="col-12 form-group login-input">
              <label>Email:</label>
              <input
                type="text"
                className="form-control"
                placeholder={language==="en" ? "Enter your email" : "Nhập email của bạn"}
                value={email}
                onChange={(event) => handleOnChangeInput(event, "email")}
              />
            </div>
            <div className="col-12 form-group login-input">
              <label><FormattedMessage id={"login.password"} />:</label>
              <div className="custom-input-password">
                <input
                  className="form-control"
                  type={isShowPassword ? "text" : "password"}
                  placeholder={language==="en" ? "Enter your password" : "Nhập mật khẩu của bạn"}
                  onChange={(event) =>
                    handleOnChangeInput(event, "password")
                  }
                  onKeyDown={(event) => handleKeyDown(event)}
                />
                <span
                  onClick={() => {
                    handleShowHidePassword();
                  }}
                >
                  <i
                    className={
                      isShowPassword
                        ? "far fa-eye"
                        : "fas fa-eye-slash"
                    }
                  ></i>
                </span>
              </div>
            </div>
            <div className="col-12 form-group login-input">
              <label><FormattedMessage id={"login.firstname"} />:</label>
              <input
                type="text"
                className="form-control"
                placeholder={language==="en" ? "Enter your firstname" : "Nhập tên của bạn"}
                value={firstName}
                onChange={(event) =>
                  handleOnChangeInput(event, "firstName")
                }
              />
            </div>
            <div className="col-12 form-group login-input">
              <label><FormattedMessage id={"login.lastname"} />:</label>
              <input
                type="text"
                className="form-control"
                placeholder={language==="en" ? "Enter your lastname" : "Nhập họ của bạn"}
                value={lastName}
                onChange={(event) =>
                  handleOnChangeInput(event, "lastName")
                }
              />
            </div>
            <div className="col-12 form-group login-input">
              <label><FormattedMessage id={"login.address"} />:</label>
              <input
                type="text"
                className="form-control"
                placeholder={language==="en" ? "Enter your address" : "Nhập địa chỉ của bạn"}
                value={address}
                onChange={(event) => handleOnChangeInput(event, "address")}
              />
            </div>
            <div className="col-12">
              <button
                className="btn-login"
                onClick={() => {
                  handleAddNewUser();
                }}
              >
                <FormattedMessage id={"login.sign-up"} />
              </button>
            </div>
          </div>
        </div>
      </div>
      </>
    );
}

