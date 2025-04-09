import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import Navigator from "../../components/Navigator";
import { adminMenu, doctorMenu } from "./menuApp";
import "./Header.scss";
import { LANGUAGES, USER_ROLE } from "../../utils";
import { FormattedMessage } from "react-intl";
import jwt_decode from "jwt-decode"; // Giải mã JWT

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuApp: [],
      userData: null, // Lưu thông tin user từ token
    };
  }

  handleChangeLanguage = (language) => {
    this.props.changeLanguageAppRedux(language);
  };

  componentDidMount() {
    this.loadUserDataFromToken(); // Load user data từ token khi component mount
  }

  // Hàm giải mã token và lấy thông tin user (bao gồm role)
  loadUserDataFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token); // Giải mã token
        this.setState({ userData: decoded }); // Lưu thông tin user vào state
        this.setMenuApp(decoded.roleId); // Cập nhật menu dựa trên role
      } catch (error) {
        console.error("Failed to decode token:", error);
        this.handleLogout(); // Nếu token không hợp lệ, đăng xuất
      }
    } else {
      this.handleLogout(); // Nếu không có token, đăng xuất
    }
  };

  // Cập nhật menu dựa trên role
  setMenuApp = (roleId) => {
    let menu = [];
    if (roleId === USER_ROLE.ADMIN) {
      menu = adminMenu;
    } else if (roleId === USER_ROLE.DOCTOR) {
      menu = doctorMenu;
    }
    this.setState({ menuApp: menu });
  };

  // Xử lý đăng xuất
  handleLogout = () => {
    localStorage.removeItem("token"); // Xóa token
    this.props.processLogout(); // Dispatch action logout (nếu cần)
    this.props.history.push("/login"); // Chuyển hướng về trang login
  };

  render() {
    const { language } = this.props;
    const { userData, menuApp } = this.state;

    return (
      <div className="header-container">
        <div className="header-tabs-container">
          <Navigator menus={menuApp} />
        </div>

        <div className="languages">
          <span className="welcome">
            <FormattedMessage id="homeheader.welcome" />
            {userData?.firstName ? userData.firstName : "User"} !
          </span>
          <span
            className={
              language === LANGUAGES.VI ? "language-vi active" : "language-vi"
            }
            onClick={() => this.handleChangeLanguage(LANGUAGES.VI)}
          >
            VN
          </span>
          <span
            className={
              language === LANGUAGES.EN ? "language-en active" : "language-en"
            }
            onClick={() => this.handleChangeLanguage(LANGUAGES.EN)}
          >
            EN
          </span>
          <div
            className="btn btn-logout"
            onClick={this.handleLogout}
            title="Log out"
          >
            <i className="fas fa-sign-out-alt"></i>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language, // Chỉ cần language từ Redux
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeLanguageAppRedux: (language) =>
      dispatch(actions.changeLanguageApp(language)),
    processLogout: () => dispatch(actions.processLogout()), // Action logout
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);