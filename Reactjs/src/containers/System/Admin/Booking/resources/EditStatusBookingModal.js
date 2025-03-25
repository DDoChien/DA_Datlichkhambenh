import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "../scss/EditStatusBookingModal.scss";
import { Modal } from "reactstrap";
import LoadingOverlay from "react-loading-overlay";
import { css } from "@emotion/react";
import BounceLoader from "react-spinners/BounceLoader";
import Lightbox from "react-image-lightbox";

import * as actions from "../../../../../store/actions";

import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../../utils";
import { toast } from "react-toastify";

import {updateStatusBooking} from "../../../../../services/bookingService"

class EditStatusBookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        eyeCurrentPassword:false,
        eyeNewPassword:false,
        eyeConfirmPassword:false,
        isShowLoading: false,
        statusOfBooking: [
            {
                keyMap: 'S1',
                tabTitleVi: 'Lịch hẹn mới',
                tabTitleEn: 'New',
            },
            {
                keyMap: 'S2',
                tabTitleVi: 'Đã xác nhận bởi bệnh nhân',
                tabTitleEn: 'Confirmed by patient',
            },
            {
                keyMap: 'S3',
                tabTitleVi: 'Đã xác nhận bởi phòng khám',
                tabTitleEn: 'Confirmed by clinic',
            },
            {
                keyMap: 'S4',
                tabTitleVi: 'Đã xác nhận bởi bác sĩ',
                tabTitleEn: 'Confirmed by doctor',
            },
            {
                keyMap: 'S5',
                tabTitleVi: 'Đã khám xong',
                tabTitleEn: 'Done',
            },
            {
                keyMap: 'S6',
                tabTitleVi: 'Đã hủy',
                tabTitleEn: 'Cancel',
            }
        ],
        currentStatusBooking:""
    };
  }

  componentDidMount() {
    this.setState({
      currentStatusBooking:this.props.currentBooking.statusId
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
      if (prevProps.userInfo !== this.props.userInfo) {
          
      }  

      if (prevProps.isOpenModalEditStatusBooking !== this.props.isOpenModalEditStatusBooking) {
        this.setState({
          currentStatusBooking:this.props.currentBooking.statusId
        });
      } 

      if (prevProps.currentBooking !== this.props.currentBooking) {
        this.setState({
          currentStatusBooking:this.props.currentBooking.statusId
        });
      }   
  }

  handleOnChangeSelect = (event) => {
    this.setState({
      currentStatusBooking:event.target.value
    });
  };
  
  checkValidateInput = () => {
    let isValid = true;
    let arrCheck = [
      "currentPassword",
      "newPassword",
      "confirmPassword",
    ];
    for (let i = 0; i < arrCheck.length; i++) {
      if (!this.state[arrCheck[i]]) {
        isValid = false;
        let language=this.props.language;
        if(language=="en"){
          toast.warn("Not enough information has been entered!");
        }else{
          toast.warn("Bạn chưa nhập đủ thông tin!");
        }
        break;
      }
    }
    return isValid;
  };

  checkNewPassworMatchConfirmPassword=()=>{
    let isValid = true;
    let language = this.props.language;
    if(this.state.newPassword!=this.state.confirmPassword){
      isValid=false;
      if(language=="en"){
        toast.warn("New password and confirm password do not match!");
      }else{
        toast.warn("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      }
    }
    return isValid
  }


  handleEditStatus = async () => {
    this.setState({ isShowLoading: true });
    let language = this.props.language;
    let status = this.state.currentStatusBooking;
    let booking = this.props.currentBooking;

    let data = {
      id:booking.id,
      statusId: status
    }

    let res = await updateStatusBooking(data)
      
    if(res && res.errCode===0){
        let message = language === LANGUAGES.VI ? "Cập nhật thành công!" : "Update succeed!"
        if(message) toast.success(message)

        this.setState({ isShowLoading: false });
        this.props.closeEditStatusBookingClose();
        this.props.getDataBooking();
    }else{
        let message = language === LANGUAGES.VI ? "Cập nhật thất bại!" : "Update failed!"
        if(message) toast.error(message)
        this.setState({ isShowLoading: false });
    }
  };

  render() {
    let { isOpenModalEditStatusBooking, closeEditStatusBookingClose } = this.props;

    let {statusOfBooking, currentStatusBooking}=this.state;

    let language = this.props.language;
    let userInfo = this.props.userInfo;

    let {
        currentPassword,
        newPassword,
        confirmPassword,
        eyeCurrentPassword,
        eyeNewPassword,
        eyeConfirmPassword
      } = this.state;
      
    return (
      <LoadingOverlay
        active={false}
        spinner={<BounceLoader color={"#86e7d4"} size={60} />}
      >
        <Modal
          isOpen={isOpenModalEditStatusBooking}
          className={"edit-profile-modal-container"}
          size="sm"
          centered
        >
          <div className="edit-profile-modal-content">
            <div className="edit-profile-modal-header">
              <span className="left">
                <FormattedMessage id="admin.manage-booking.modal-title" />
              </span>
              <span className="right">
                <i className="fas fa-times" onClick={closeEditStatusBookingClose}></i>
              </span>
            </div>
            <div className="edit-profile-modal-body">
                <div className="row">
                    <div className="col-12 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-booking.modal-status" />
                        </label>

                        <select class="custom-select custom-select-lg mb-3"
                            value={currentStatusBooking}
                            onChange={(event) =>
                                this.handleOnChangeSelect(event)
                                }
                        >
                            <option selected>{language==="en" ? "Open this select menu" : "Hãy chọn"}</option>
                            {
                              statusOfBooking.map((status,index)=>{
                                return(
                                  <option value={status.keyMap}>{language==="vi" ? status.tabTitleVi : status.tabTitleEn}</option>
                                );
                              })
                            }
                        </select>
                    </div>
                </div>       
            </div>
            <div className="edit-profile-modal-footer">
              <button
                className="btn-edit-profile-confirm"
                onClick={()=>this.handleEditStatus()}
              >
                <FormattedMessage id="manage-user.confirm" />
              </button>
              <button
                className="btn-edit-profile-cancel"
                onClick={closeEditStatusBookingClose}
              >
                <FormattedMessage id="manage-user.cancel" />
              </button>
            </div>
          </div>
        </Modal>
      </LoadingOverlay>
    );
  };
}

const mapStateToProps = (state) => {
    return {
      language: state.app.language,
      genderRedux: state.admin.genders,
      roleRedux: state.admin.roles,
      positionRedux: state.admin.positions,
      isLoadingGender: state.admin.isLoadingGender,
      listUsers: state.admin.users,
      userInfo: state.user.userInfo,
    };
  };

  const mapDispatchToProps = (dispatch) => {
    return {
      getGenderStart: () => dispatch(actions.fetchGenderStart()),
      getPositionStart: () => dispatch(actions.fetchPositionStart()),
      getRoleStart: () => dispatch(actions.fetchRoleStart()),
      createNewUser: (data) => dispatch(actions.createNewUser(data)),
      fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
      editOnlyOneUser: (data) => dispatch(actions.editOnlyOneUser(data)),
      userLoginSuccess: (userInfor) =>
      dispatch(actions.userLoginSuccess(userInfor)),
      // changeLanguageAppRedux: (language) =>
      //   dispatch(actions.changeLanguageApp(language)),
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(EditStatusBookingModal);
