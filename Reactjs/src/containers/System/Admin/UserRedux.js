import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import "./UserRedux.scss";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import TableManageUser from "./TableManageUser";
import { withRouter } from '../../../utils/withRouter';
import { filterUsers } from "../../../services/userService";

class UserRedux extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genderArr: [],
      positionArr: [],
      roleArr: [],
      previewImgURL: "",
      isOpen: false,

      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      gender: "",
      position: "",
      role: "",
      avatar: "",

      action: "",
      userEditId: "",
      listFilterUsers: [],
      currentUserRoleId: "", // Lưu roleId của người dùng hiện tại
    };
  }

  parseJwt(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  async componentDidMount() {
    this.props.getGenderStart();
    this.props.getPositionStart();
    this.props.getRoleStart();

    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = this.parseJwt(token);
      if (decodedToken && decodedToken.roleId) {
        this.setState({
          currentUserRoleId: decodedToken.roleId,
        });
      }
    }

    await this.handleFilterUsers();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.genderRedux !== this.props.genderRedux) {
      let arrGenders = this.props.genderRedux;
      this.setState({
        genderArr: arrGenders,
      });
    }
    if (prevProps.positionRedux !== this.props.positionRedux) {
      let arrPositions = this.props.positionRedux;
      this.setState({
        positionArr: arrPositions,
      });
    }
    if (prevProps.roleRedux !== this.props.roleRedux) {
      let arrRoles = this.props.roleRedux;
      this.setState({
        roleArr: arrRoles,
      });
    }
    if (prevProps.listUsers !== this.props.listUsers) {
      let arrGenders = this.props.genderRedux;
      let arrPositions = this.props.positionRedux;
      let arrRoles = this.props.roleRedux;

      this.setState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        gender: "",
        position: "",
        role: "",
        avatar: "",
        action: CRUD_ACTIONS.CREATE,
        previewImgURL: "",
      });
    }
  }

  handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      let objectUrl = URL.createObjectURL(file);
      this.setState({
        previewImgURL: objectUrl,
        avatar: base64,
      });
    }
  };

  openPreviewImage = () => {
    if (!this.state.previewImgURL) return;
    this.setState({
      isOpen: true,
    });
  };

  handleSaveUser = () => {
    let isValid = this.checkValidateInput();
    if (isValid === false) return;

    let { action } = this.state;

    if (action === CRUD_ACTIONS.CREATE) {
      this.props.createNewUser({
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        address: this.state.address,
        phonenumber: this.state.phoneNumber,
        gender: this.state.gender,
        roleId: this.state.role,
        positionId: this.state.position,
        avatar: this.state.avatar,
      });
    }
    if (action === CRUD_ACTIONS.EDIT) {
      this.props.editAUserRedux({
        id: this.state.userEditId,
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        address: this.state.address,
        phonenumber: this.state.phoneNumber,
        gender: this.state.gender,
        roleId: this.state.role,
        positionId: this.state.position,
        avatar: this.state.avatar,
      });
    }
  };

  checkValidateInput = () => {
    let isValid = true;
    let arrCheck = [
      "email",
      "password",
      "firstName",
      "lastName",
      "phoneNumber",
      "address",
    ];
    for (let i = 0; i < arrCheck.length; i++) {
      if (!this.state[arrCheck[i]]) {
        isValid = false;
        alert("This input is required: " + arrCheck[i]);
        break;
      }
    }
    return isValid;
  };

  onChangeInput = (event, id) => {
    let copyState = { ...this.state };
    copyState[id] = event.target.value;
    this.setState({
      ...copyState,
    });
  };

  handleEditUserFromParent = (user) => {
    let imageBase64 = "";
    if (user.image) {
      imageBase64 = new Buffer(user.image, "base64").toString("binary");
    }

    this.setState({
      email: user.email,
      password: "HARDCODE",
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phonenumber,
      address: user.address,
      gender: user.gender,
      position: user.positionId,
      role: user.roleId,
      avatar: user.avatar,
      previewImgURL: imageBase64,
      action: CRUD_ACTIONS.EDIT,
      userEditId: user.id,
    });
  };

  handleFilterUsers = async () => {
    let {
      email,
      firstName,
      lastName,
      phoneNumber,
      address,
      gender,
      position,
      role,
    } = this.state;

    let data = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      role: role,
      address: address,
      position: position,
      gender: gender,
    };

    let res = await filterUsers(data);
    if (res && res.data) {
      this.setState({
        listFilterUsers: res.data.reverse(),
      });
    }
  };

  handleReset = async () => {
    this.setState({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      gender: "",
      position: "",
      role: "",
      avatar: "",
      action: CRUD_ACTIONS.CREATE,
      previewImgURL: "",
    });

    let res = await filterUsers({});
    if (res && res.data) {
      this.setState({
        listFilterUsers: res.data.reverse(),
      });
    }
  };

  render() {
    let genders = this.state.genderArr;
    let roles = this.state.roleArr;
    let positions = this.state.positionArr;
    let language = this.props.language;
    let isGetGenders = this.props.isLoadingGender;

    let {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      address,
      gender,
      position,
      role,
      avatar,
      currentUserRoleId,
    } = this.state;

    return (
      <div className="user-redux-container">
        <div className="title">
          <FormattedMessage id="manage-user.title" />
        </div>
        <div>{isGetGenders === true ? "Loading genders" : ""}</div>
        <div className="user-redux-body">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h3>
                  <FormattedMessage id="medical-history.filters" />
                </h3>
              </div>
              <div className="col-3">
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">
                    <FormattedMessage id="manage-user.email" />
                  </label>
                  <input
                    value={email}
                    onChange={(event) => this.onChangeInput(event, "email")}
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder=""
                  />
                </div>
              </div>
              <div className="col-3">
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">
                    <FormattedMessage id="manage-user.first-name" />
                  </label>
                  <input
                    value={firstName}
                    onChange={(event) => this.onChangeInput(event, "firstName")}
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder=""
                  />
                </div>
              </div>
              <div className="col-3">
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">
                    <FormattedMessage id="manage-user.last-name" />
                  </label>
                  <input
                    value={lastName}
                    onChange={(event) => this.onChangeInput(event, "lastName")}
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder=""
                  />
                </div>
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id="manage-user.gender" />
                </label>
                <select
                  className="form-control"
                  onChange={(event) => this.onChangeInput(event, "gender")}
                  value={gender}
                >
                  <option value="">
                    {language === LANGUAGES.VI
                      ? "Chọn giới tính"
                      : "Choose gender"}
                  </option>
                  {genders &&
                    genders.length > 0 &&
                    genders.map((item, index) => (
                      <option key={index} value={item.keyMap}>
                        {language === LANGUAGES.VI
                          ? item.valueVi
                          : item.valueEn}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id="manage-user.role" />
                </label>
                <select
                  className="form-control"
                  onChange={(event) => this.onChangeInput(event, "role")}
                  value={role}
                >
                  <option value="">
                    {language === LANGUAGES.VI
                      ? "Chọn vai trò"
                      : "Choose role"}
                  </option>
                  {roles &&
                    roles.length > 0 &&
                    roles.map((item, index) => (
                      <option key={index} value={item.keyMap}>
                        {language === LANGUAGES.VI
                          ? item.valueVi
                          : item.valueEn}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col-3">
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">
                    <FormattedMessage id="manage-user.address" />
                  </label>
                  <input
                    value={address}
                    onChange={(event) => this.onChangeInput(event, "address")}
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder=""
                  />
                </div>
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id="manage-user.position" />
                </label>
                <select
                  className="form-control"
                  onChange={(event) => this.onChangeInput(event, "position")}
                  value={position}
                >
                  <option value="">
                    {language === LANGUAGES.VI
                      ? "Chọn chức danh"
                      : "Choose position"}
                  </option>
                  {positions &&
                    positions.length > 0 &&
                    positions.map((item, index) => (
                      <option key={index} value={item.keyMap}>
                        {language === LANGUAGES.VI
                          ? item.valueVi
                          : item.valueEn}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col-12">
                <button
                  onClick={() => this.handleFilterUsers()}
                  type="button"
                  className="btn btn-primary mr-5"
                >
                  <FormattedMessage id="medical-history.apply" />
                </button>
                <button
                  onClick={() => this.handleReset()}
                  type="button"
                  className="btn btn-primary"
                >
                  <FormattedMessage id="medical-history.reset" />
                </button>
              </div>

              <div className="col-12 mb-5 text-right">
                {/* Chỉ hiển thị nút Create nếu roleId là "R1" */}
                {currentUserRoleId === "R1" && (
                  <button
                    type="submit"
                    className="btn btn-primary pointer mr-5"
                    onClick={() => {
                      this.props.navigate(`/admin-dashboard/user/create`);
                    }}
                  >
                    <i className="fas fa-plus-circle mr-5"></i>
                    <FormattedMessage id="manage-user.btn-create" />
                  </button>
                )}
              </div>
              <div className="col-12 mb-5">
                <TableManageUser
                  listFilterUsers={this.state.listFilterUsers}
                  handleReset={this.handleReset}
                  handleEditUserFromParentKey={this.handleEditUserFromParent}
                  action={this.state.action}
                  currentUserRoleId={currentUserRoleId}
                />
              </div>
            </div>
          </div>
        </div>

        {this.state.isOpen === true && (
          <Lightbox
            mainSrc={this.state.previewImgURL}
            onCloseRequest={() => this.setState({ isOpen: false })}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genderRedux: state.admin.genders,
    roleRedux: state.admin.roles,
    positionRedux: state.admin.positions,
    isLoadingGender: state.admin.isLoadingGender,
    listUsers: state.admin.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
    getPositionStart: () => dispatch(actions.fetchPositionStart()),
    getRoleStart: () => dispatch(actions.fetchRoleStart()),
    createNewUser: (data) => dispatch(actions.createNewUser(data)),
    fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
    editAUserRedux: (data) => dispatch(actions.editAUser(data)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserRedux));