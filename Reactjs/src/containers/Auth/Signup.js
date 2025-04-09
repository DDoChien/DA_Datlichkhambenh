import { useState } from "react";
import { useNavigate } from "react-router-domv6";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";

import * as actions from "../../store/actions";
import { createNewUserService } from "../../services/userService";

import "./Signup.scss";
import HomeHeader from "../HomePage/HomeHeader";

export default function Signup() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);

  const navigate = useNavigate();

  const { language } = useSelector((state) => ({
    language: state.app.language,
  }));

  const handleOnChangeInput = (event, id) => {
    let valueInput = event.target.value;

    switch (id) {
      case "email":
        setEmail(valueInput);
        break;
      case "password":
        setPassword(valueInput);
        break;
      case "firstName":
        setFirstName(valueInput);
        break;
      case "lastName":
        setLastName(valueInput);
        break;
      case "address":
        setAddress(valueInput);
        break;
      default:
        break;
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

  const checkValidateInput = () => {
    let isValid = true;
    let missingFields = [];

    if (!email) missingFields.push(language === "en" ? "Email" : "Email");
    if (!password) missingFields.push(language === "en" ? "Password" : "Mật khẩu");
    if (!firstName) missingFields.push(language === "en" ? "First Name" : "Tên");
    if (!lastName) missingFields.push(language === "en" ? "Last Name" : "Họ");
    if (!address) missingFields.push(language === "en" ? "Address" : "Địa chỉ");

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      toast.error(language === "en" ? "Invalid email format!" : "Định dạng email không hợp lệ!");
      return false;
    }

    if (missingFields.length > 0) {
      const message =
        language === "en"
          ? `Missing: ${missingFields.join(", ")}`
          : `Thiếu: ${missingFields.join(", ")}`;
      toast.error(message);
      isValid = false;
    }

    return isValid;
  };

  const createNewUser = async (data) => {
    try {
      let response = await createNewUserService(data);
      if (response && response.errCode !== 0) {
        toast.error(language === "en" ? "Sign up new account failed!" : "Đăng ký tài khoản thất bại!");
      } else {
        toast.success(language === "en" ? "User created successfully!" : "Tạo mới người dùng thành công!");
        setPassword("");
        setEmail("");
        setFirstName("");
        setLastName("");
        setAddress("");
        setIsShowPassword(false);
        navigate("/login");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleAddNewUser = () => {
    let isValid = checkValidateInput();
    if (isValid) {
      createNewUser({
        email,
        password,
        firstName,
        lastName,
        address,
      });
    }
  };

  return (
    <>
      <HomeHeader isShowBanner={false} />
      <div className="login-background">
        <div className="signup-container">
          <div className="login-content row">
            <div className="col-12 text-login">
              <FormattedMessage id={"login.sign-up"} />
            </div>
            <div className="col-12 form-group login-input">
              <label>Email:</label>
              <input
                type="text"
                className="form-control"
                placeholder={language === "en" ? "Enter your email" : "Nhập email của bạn"}
                value={email}
                onChange={(event) => handleOnChangeInput(event, "email")}
              />
            </div>
            <div className="col-12 form-group login-input">
              <label>
                <FormattedMessage id={"login.password"} />:
              </label>
              <div className="custom-input-password">
                <input
                  className="form-control"
                  type={isShowPassword ? "text" : "password"}
                  placeholder={language === "en" ? "Enter your password" : "Nhập mật khẩu của bạn"}
                  value={password}
                  onChange={(event) => handleOnChangeInput(event, "password")}
                  onKeyDown={(event) => handleKeyDown(event)}
                />
                <span onClick={handleShowHidePassword}>
                  <i className={isShowPassword ? "far fa-eye" : "fas fa-eye-slash"}></i>
                </span>
              </div>
            </div>
            <div className="col-12 form-group login-input">
              <label>
                <FormattedMessage id={"login.firstname"} />:
              </label>
              <input
                type="text"
                className="form-control"
                placeholder={language === "en" ? "Enter your firstname" : "Nhập tên của bạn"}
                value={firstName}
                onChange={(event) => handleOnChangeInput(event, "firstName")}
              />
            </div>
            <div className="col-12 form-group login-input">
              <label>
                <FormattedMessage id={"login.lastname"} />:
              </label>
              <input
                type="text"
                className="form-control"
                placeholder={language === "en" ? "Enter your lastname" : "Nhập họ của bạn"}
                value={lastName}
                onChange={(event) => handleOnChangeInput(event, "lastName")}
              />
            </div>
            <div className="col-12 form-group login-input">
              <label>
                <FormattedMessage id={"login.address"} />:
              </label>
              <input
                type="text"
                className="form-control"
                placeholder={language === "en" ? "Enter your address" : "Nhập địa chỉ của bạn"}
                value={address}
                onChange={(event) => handleOnChangeInput(event, "address")}
              />
            </div>
            <div className="col-12">
              <button className="btn-login" onClick={handleAddNewUser}>
                <FormattedMessage id={"login.sign-up"} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
