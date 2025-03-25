import { useRef, useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import "./CreateMedicalExaminationResultSheet.scss";

import { toast } from "react-toastify";
import moment from "moment";
import localization from "moment/locale/vi"; //su dung chung cho cai mac dinh la tieng viet
import { CommonUtils } from "../../../utils";
import {
  getBookingById,
  postCreateSheetMedicalExaminationResult,
} from "../../../services/userService";

import { useParams, useNavigate } from "react-router-domv6";
import { useDispatch, useSelector } from "react-redux";
import LoadingOverlay from "react-loading-overlay";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";

export default function CreateMedicalExaminationResultSheet() {
  const [email, setEmail] = useState("");
  const [patientName, setPatientName] = useState("");
  const [listDiseases, setListDiseases] = useState([]);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [doctorId, setDoctorId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [token, setToken] = useState("");
  const [timeType, setTimeType] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [reason, setReason] = useState("");
  let navigate = useNavigate();

  let { bookingId } = useParams();

  const { isLoggedIn, userInfo, language } = useSelector((state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  }));


  useEffect(() => {
    async function fetchData() {

      let patientInfo = await getBookingById(bookingId);
      if (
        patientInfo &&
        patientInfo.data &&
        patientInfo.data.patientName &&
        patientInfo.data.patientData.email
      ) {
        console.log("patientInfo", patientInfo);
        setEmail(patientInfo.data.patientData.email);
        setPatientName(patientInfo.data.patientName);
        setDoctorId(patientInfo.data.doctorId);
        setPatientId(patientInfo.data.patientId);
        setDate(patientInfo.data.date);
        setToken(patientInfo.data.token);
        setTimeType(patientInfo.data.timeType);
        let name =
          (userInfo.lastName ? userInfo.lastName : "") +
          " " +
          (userInfo.firstName ? userInfo.firstName : "");
        setDoctorName(name);
        setReason(patientInfo.data.patientReason);
      }
    }
    fetchData();
  }, []);

  const handleOnChangeEmail = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  const handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);

      // this.setState({
      //   imgBase64: base64,
      // });
    }
  };

  const handleCreateRemedyImage = () => {
    createRemedyImage();
  };

  const createRemedyImage = async () => {
    console.log("reason", reason);
    setIsShowLoading(true);

    let res = await postCreateSheetMedicalExaminationResult({
      email: email,
      doctorId: doctorId,
      patientId: patientId,
      timeType: timeType,
      date: date,
      token: token,
      language: language,
      patientName: patientName,
      doctorName: doctorName,
      patientReason: reason,
      listDiseases:listDiseases
    });

    if (res && res.errCode === 0) {
      setIsShowLoading(false);
      if (language == "en") {
        toast.success("Create Sheet Medical Examination Result succeed!");
      } else {
        toast.success("Tạo phiếu kết quả khám bệnh thành công!");
      }
    } else {
      setIsShowLoading(true);
      if (language == "en") {
        toast.error("Something wrongs...!");
      } else {
        toast.error("Lỗi!");
      }
    }
    setIsShowLoading(false);

    navigate("/admin-dashboard/doctor/manage-patient?date=" + date, {
      replace: true,
    });
  };

  const handleAddDisease = () => {
    let temp = [...listDiseases];

    temp = [...temp,
      { 
        name:"",
        description:""
      }
    ]

    setListDiseases(temp);
  };

  const handleRemoveDisease = (index) => {
    console.log("listDiseases",listDiseases);

    let temp = [...listDiseases];

    // temp = temp.filter(element => element.id != diseaseId);
    temp.splice(index, 1);

    setListDiseases(temp);
  };

  const handleOnChangeNameDisease = (event, index) => {
    let temp = [...listDiseases];

    temp[index].name=event.target.value;

    setListDiseases(temp);
  };

  const handleOnChangeDescriptionDisease = (event, index) => {
    let temp = [...listDiseases];

    temp[index].description=event.target.value;

    setListDiseases(temp);
  };

  return (
    <LoadingOverlay
      active={isShowLoading}
      spinner={<ClimbingBoxLoader color={"#86e7d4"} size={15} />}
    >
      <div className="row">
        <div class="col-12">
          <h5 className="">
            <FormattedMessage
              id={
                "admin.sheet-medical-examination.create-sheet-medical-examination-result"
              }
            />
          </h5>
        </div>
      </div>
      <div className="row">
        <div class="col-12">
          <div class="row">
            <div className="col-6 form-group">
              <label>
                <FormattedMessage id={"admin.manage-drug.email-patient"} />
              </label>
              <input
                className="form-control"
                type="email"
                value={email}
                // onChange={(event) => handleOnChangeEmail(event)}
              />
            </div>
            <div className="col-6 form-group">
              <label>
                <FormattedMessage id={"admin.manage-drug.name-patient"} />
              </label>
              <input
                className="form-control"
                type="text"
                value={patientName}
                // onChange={(event) => this.handleOnChangeEmail(event)}
              />
            </div>
            <div className="col-6 form-group">
              <label>
                <FormattedMessage
                  id={"admin.sheet-medical-examination.sheet"}
                />
              </label>
            </div>
            <div className="col-6 form-group text-right">
              <i class="fa fa-plus-circle fs-24 pointer" aria-hidden="true" onClick={()=>handleAddDisease()}></i>
            </div>

            <div class="col-12">
              <div class="row">
                <div class="col-12 form-group">
                  <div class="row align-items-center text-center mb-10">
                      <div class="col-4">
                        <FormattedMessage
              id={
                "admin.sheet-medical-examination.disease"
              }
            />
                      </div>
                      <div class="col-7">
                      <FormattedMessage
              id={
                "admin.sheet-medical-examination.disease-description"
              }
            />
                      </div>
                  </div>
                  {
                    listDiseases.map((disease, index)=>{
                        return(
                            <div key={index} class="row  text-center mb-10">
                                <div class="col-4">
                                  <input type="text" value={disease.name} class="form-control" placeholder="" onChange={(event) => handleOnChangeNameDisease(event, index)}/>
                                </div>
                                <div class="col-7">
                                  <textarea
                                    rows="4"
                                    className="form-control"
                                    value={disease.desciption}
                                    onChange={(event) => handleOnChangeDescriptionDisease(event,index)}
                                  ></textarea>
                                </div>
                                <div class="col-1 d-flex align-items-center">
                                  <i class="fas fa-trash pointer text-red" onClick={()=>handleRemoveDisease(index)}></i>
                                </div>
                          </div>
                        );
                    })
                  }

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => handleCreateRemedyImage()}
        type="button"
        class="btn btn-primary"
      >
        <FormattedMessage id={"admin.manage-drug.btn-create"} />
      </button>
    </LoadingOverlay>
  );
  // }
}

// const mapStateToProps = (state) => {
//   return { language: state.app.language, genders: state.admin.genders };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {};
// };

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(CreateMedicalExaminationResultSheet);
