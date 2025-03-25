import { useRef, useState, useEffect } from "react";

// import * as actions from "../../store/actions";

import { FormattedMessage } from "react-intl";

import { useParams, useNavigate   } from "react-router-domv6";
import { useDispatch, useSelector } from "react-redux";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../../utils";
import * as actions from "../../../../../store/actions";
import { toast } from "react-toastify";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import DatePicker from "../../../../../components/Input/DatePicker";


export default function CreateUser(){
    const [genderArr, setGenderArr] = useState([]);
    const [positionArr, setPositionArr] = useState([]);
    const [roleArr, setRoleArr] = useState([]);
    const [previewImgURL, setPreviewImgURL] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [gender, setGender] = useState("");
    const [position, setPosition] = useState("");
    const [role, setRole] = useState("");
    const [avatar, setAvatar] = useState("");
    const [status, setStatus] = useState(0);
    const [action, setAction] = useState("");
    const [userEditId, setUserEditId] = useState("");
    const [birthday, setBirthday] = useState("");
    const [selectedClinic, setSelectedClinic] = useState("");
    const [listClinic, setListClinic] = useState([]);

    const { isLoggedIn, userInfo, language, genderRedux, roleRedux, positionRedux, isLoadingGender, listUsers, allRequiredDoctorInfor } = useSelector((state) => ({
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language,
        genderRedux: state.admin.genders,
        roleRedux: state.admin.roles,
        positionRedux: state.admin.positions,
        isLoadingGender: state.admin.isLoadingGender,
        listUsers: state.admin.users,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
      }));

    const dispatch = useDispatch();
    let navigate = useNavigate();

    useEffect(() => {
        dispatch(actions.fetchGenderStart())
        dispatch(actions.fetchPositionStart())
        dispatch(actions.fetchRoleStart())
        dispatch(actions.getRequiredDoctorInfor())
    }, []);

    useEffect(() => {
      let arrGenders = genderRedux;
      setGenderArr(arrGenders)

      let arrPositions = positionRedux;
      setPositionArr(arrPositions)

      let arrRoles = roleRedux;
      setRoleArr(arrRoles)
    }, [genderRedux,positionRedux,roleRedux]);

    useEffect(() => {
      let { resClinic } = allRequiredDoctorInfor;

      let dataSelectClinic = buildDataInputSelect(resClinic, "CLINIC");
      setListClinic(dataSelectClinic);
    }, [allRequiredDoctorInfor]);


      const onChangeInput = (event, id) => {
        switch(id) {
            case "email":
                setEmail(event.target.value)
                break;
            case "password":
                setPassword(event.target.value)
                break;
            case "firstName":
                setFirstName(event.target.value)
                break;
            case "lastName":
                setLastName(event.target.value)
                break;
            case "phoneNumber":
                setPhoneNumber(event.target.value)
                break;
            case "address":
                setAddress(event.target.value)
                break;
            case "gender":
                setGender(event.target.value)
                break;
            case "role":
                setRole(event.target.value)
                break;
            case "position":
                setPosition(event.target.value)
                break;
            case "status":
                setStatus(event.target.value)
                break;
            case "birthday":
                let date=event[0];
                setBirthday(date.getTime())
                break;
            default:
                break;
          }
      };

      const handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
          let base64 = await CommonUtils.getBase64(file);
          let objectUrl = URL.createObjectURL(file);
          setPreviewImgURL(objectUrl)
          setAvatar(base64)
        }
      };

      const openPreviewImage = () => {
        if (!previewImgURL) return;
        setIsOpen(true)
      };

      const checkValidateInput = () => {
        let isValid = true;
        let arrCheck = [
          email,
          password,
          firstName,
          lastName,
          phoneNumber,
          address,
        ];
        for (let i = 0; i < arrCheck.length; i++) {
          if (!arrCheck[i]) {
            isValid = false;
            if(language=="vi"){
                toast.warn("Bạn chưa nhập đủ thông tin");
            }else{
                toast.warn("Missing input");
            }
            break;
          }
        }
        return isValid;
      };

      const handleSaveUser = () => {
        let isValid = checkValidateInput();
        if (isValid === false) return;
    
          //fire redux create user
          dispatch(actions.createNewUser({
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            address: address,
            phonenumber: phoneNumber,
            gender: gender,
            roleId: role,
            positionId: position,
            avatar: avatar,
            status: status,
            birthday: birthday,
            employeeOfClinic: selectedClinic ? selectedClinic : null
          }));

          setTimeout(function(){ window.location.href = '/admin-dashboard/user';  }, 1000);
      };

      const handleOnChangeSelectClinic = (event)=>{
        setSelectedClinic(event.target.value);
      }

      const buildDataInputSelect = (inputData, type) => {
        let result = [];
        if (inputData && inputData.length > 0) {
          if (type === "CLINIC") {
            inputData.map((item, index) => {
              let object = {};
    
              object.label = item.name;
              object.value = item.id;
              result.push(object);
            });
          }
        }
        return result;
      };

    return (
      <div>
            <div class="title mb-60">
                <FormattedMessage id="manage-user.title-create-user" /> 
            </div>
            <div class="row">
            <div class="col-3">
                <label>
                  <FormattedMessage id="manage-user.email" />
                </label>
                <input
                  class="form-control"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    onChangeInput(event, "email");
                  }}
                  disabled={
                    action === CRUD_ACTIONS.EDIT ? true : false
                  }
                />
              </div>
              <div class="col-3">
                <label>
                  <FormattedMessage id="manage-user.password" />
                </label>
                <input
                  class="form-control"
                  type="password"
                  value={password}
                  onChange={(event) => {
                    onChangeInput(event, "password");
                  }}
                  disabled={
                    action === CRUD_ACTIONS.EDIT ? true : false
                  }
                />
              </div>
              <div class="col-3">
                <label>
                  <FormattedMessage id="manage-user.first-name" />
                </label>
                <input
                  class="form-control"
                  type="text"
                  value={firstName}
                  onChange={(event) => {
                    onChangeInput(event, "firstName");
                  }}
                />
              </div>
              <div class="col-3">
                <label>
                  <FormattedMessage id="manage-user.last-name" />
                </label>
                <input
                  class="form-control"
                  type="text"
                  value={lastName}
                  onChange={(event) => {
                    onChangeInput(event, "lastName");
                  }}
                />
              </div>
              <div class="col-3">
                <label>
                  <FormattedMessage id="manage-user.phone-number" />
                </label>
                <input
                  class="form-control"
                  type="text"
                  value={phoneNumber}
                  onChange={(event) => {
                    onChangeInput(event, "phoneNumber");
                  }}
                />
              </div>
              <div class="col-9">
                <label>
                  <FormattedMessage id="manage-user.address" />
                </label>
                <input
                  class="form-control"
                  type="text"
                  value={address}
                  onChange={(event) => {
                    onChangeInput(event, "address");
                  }}
                />
              </div>
              <div class="col-3">
                <label>
                  <FormattedMessage id="manage-user.gender" />
                </label>
                <select
                  class="form-control"
                  onChange={(event) => {
                    onChangeInput(event, "gender");
                  }}
                  value={gender}
                >
                     <option value="">
                          {language === LANGUAGES.VI
                            ? "Chọn giới tính"
                            : "Choose gender"}
                      </option>
                  {genderArr &&
                    genderArr.length > 0 &&
                    genderArr.map((item, index) => {
                      return (
                        
                        <option key={index} value={item.keyMap}>
                          {language === LANGUAGES.VI
                            ? item.valueVi
                            : item.valueEn}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div class="col-3">
                <label>
                  <FormattedMessage id="manage-user.role" />
                </label>
                <select
                  class="form-control"
                  onChange={(event) => {
                    onChangeInput(event, "role");
                  }}
                  value={role}
                >
                   <option value="">
                          {language === LANGUAGES.VI
                        ? "Chọn vai trò"
                        : "Choose role"}
                    </option>
                  {roleArr &&
                    roleArr.length > 0 &&
                    roleArr.map((item, index) => {
                      return (
                        <option key={index} value={item.keyMap}>
                          {language === LANGUAGES.VI
                            ? item.valueVi
                            : item.valueEn}
                        </option>
                      );
                    })}
                </select>
              </div>
{
  role === "R4" && (  
    <div className="col-4">
        <label>
          {language==="en" ? "Employee of Clinic" : "Nhân viên của phòng khám"}
        </label>

        <select class="form-control" id="exampleFormControlSelect1"
        value={selectedClinic}
        onChange={(event)=>handleOnChangeSelectClinic(event)}
        >
          <option value="">{language==="en" ? "Choose clinic" : "Chọn phòng khám"}</option>
          {
            listClinic.map((clinic)=>{
              return(<option value={clinic.value}>{clinic.label}</option>)
            })
          }
        </select>
    </div>
  )
}
            

              <div class="col-3">
                <label>
                  <FormattedMessage id="manage-user.position" />
                </label>
                <select
                  class="form-control"
                  onChange={(event) => {
                    onChangeInput(event, "position");
                  }}
                  value={position}
                >
                    <option value="">
                          {language === LANGUAGES.VI
                            ? "Chọn chức danh"
                            : "Choose positon"}
                        </option>
                  {positionArr &&
                    positionArr.length > 0 &&
                    positionArr.map((item, index) => {
                      return (
                        <option key={index} value={item.keyMap}>
                          {language === LANGUAGES.VI
                            ? item.valueVi
                            : item.valueEn}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div class="col-3">
                <label>
                  <FormattedMessage id="manage-user.status" />
                </label>
                <select
                  class="form-control"
                  onChange={(event) => {
                    onChangeInput(event, "status");
                  }}
                  value={status}
                >
                   {/* <option value="">
                          {language === LANGUAGES.VI
                            ? "Chọn trạng thái"
                            : "Choose status"}
                        </option> */}
                        <option value="0">
                          {language === LANGUAGES.VI
                            ? "Hoạt động"
                            : "Active"}
                        </option>
                        <option value="1">
                          {language === LANGUAGES.VI
                            ? "Cấm"
                            : "Banned"}
                        </option>
                </select>
              </div>

              <div class="col-3">
              <label>
                    <FormattedMessage id="patient.booking-modal.birthday" />
                  </label>
                  <DatePicker
                   onChange={(event) => {
                    onChangeInput(event, "birthday");
                  }}
                    className="form-control"
                    value={birthday}
                  />
              </div>

              <div class="col-3">
                <label>
                  <FormattedMessage id="manage-user.image" />
                </label>
                <div class="preview-img-container">
                  <input
                    id="previewImg"
                    type="file"
                    hidden
                    onChange={(event) => handleOnChangeImage(event)}
                  />
                  <label class="label-upload" htmlFor="previewImg">
                    Tải ảnh <i class="fas fa-upload"></i>
                  </label>
                  <div
                    class="preview-image"
                    style={{
                      backgroundImage: `url(${previewImgURL})`,
                    }}
                    onClick={() => openPreviewImage()}
                  ></div>
                </div>
              </div>
              <div class="col-12 mt-3">
                <button
                  class="btn btn-primary"
                  onClick={() => handleSaveUser()}
                >
                  <FormattedMessage id="manage-user.add" />
                </button>
              </div>
            </div>

            {isOpen === true && (
          <Lightbox
            mainSrc={previewImgURL}
            onCloseRequest={() => setIsOpen(false)}
          />
        )}

      </div>
    );
}

