import { useRef, useState, useEffect } from "react";

import "../scss/MedicalHistory.scss";
import { FormattedMessage } from "react-intl";

import { useNavigate } from "react-router-domv6";
import { useDispatch, useSelector } from "react-redux";

import EditProfileModal from "./EditProfileModal"
import * as actions from "../../../store/actions";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";

import { Modal } from "reactstrap";
import moment from "moment";

import {
  filterHistoriesPatient,
  viewPdf,
  downloadPdf
} from "../../../services/userService";


import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";

export default function MedicalHistory() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [patientId, setPatientId] = useState("");
    const [histories, setHistories] = useState([]);
    const [previewImgURL, setPreviewImgURL] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [units, setUnits] = useState([
      {key: "pill", valueVi:"Viên", valueEn:"Pill"},
      {key: "package", valueVi:"Gói", valueEn:"Package"},
      {key: "bottle", valueVi:"Chai", valueEn:"Bottle"},
      {key: "tube", valueVi:"Ống", valueEn:"Tube"},
      {key: "set", valueVi:"Bộ", valueEn:"Set"},
    ]);
    const [isShowLoading, setIsShowLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isLoggedIn, userInfo, language } = useSelector((state) => ({
      isLoggedIn: state.user.isLoggedIn,
      userInfo: state.user.userInfo,
      language: state.app.language,
    }));

    useEffect(async () => {
      console.log("userInfo",userInfo)
      if(userInfo && userInfo.id){
        setPatientId(userInfo.id)
      }

     await handleFilterHistoriesByDate(userInfo.id,startDate,endDate)
    }, []);

    console.log("userInfo",userInfo)

  const handleOnchangeDate=(event,type)=>{
      if(type=="startDate"){
        setStartDate(event.target.value)
      }else{
        setEndDate(event.target.value)
      }
      if(startDate)console.log("startDate",startDate)
      console.log("endDate",endDate)
  }

  const handleResetDate=async ()=>{
    setStartDate("")
    setEndDate("")

    await handleFilterHistoriesByDate(userInfo.id,"","")
}

const checkValidateInput=()=>{
    if(!startDate){
      if(language=="vi"){
          toast.error("Bạn chưa nhập ngày bắt đầu")
      }else{
        toast.error("You have not entered a start date")
      }
      return false;
    }

    if(!endDate){
      if(language=="vi"){
          toast.error("Bạn chưa nhập ngày kết thúc")
      }else{
        toast.error("You have not entered an end date")
      }
      return false;
    }

    return true;
}

const handleFilterHistoryByDateApply=async ()=>{
  let bool = checkValidateInput();
  if(!bool) return;

  setIsShowLoading(true)

  let data={
    patientId:patientId,
    startDate:startDate,
    endDate:endDate
  }

  let res = await filterHistoriesPatient(data)
  
  if(res && res.errCode==0){
      setHistories(res.data)
      setIsShowLoading(false)
  }else{
    setIsShowLoading(false)
  }
}

const handleFilterHistoriesByDate=async (patientId,startDate,endDate)=>{
    let data={
      patientId:patientId,
      startDate:startDate,
      endDate:endDate
    }
    let res = await filterHistoriesPatient(data)
    if(res && res.errCode==0){
        console.log("res.data",res.data)
        setHistories(res.data)
    }
}

const openPreviewImageRemedy = async (item) => {
  console.log("item",item)
  if(item.Booking && item.Booking.pdf_remedy){
    await viewPdf(item.Booking.pdf_remedy,"remedy")
  }else{
    if(language==="vi"){
      toast.info("Bác sĩ chưa tạo đơn thuốc cho bệnh nhân này!");
    }else{
      toast.info("The doctor has not created a prescription for this patient!");
    }
  }
};

const openPreviewImageSheet = async (item) => {
  console.log("item",item)
  if(item.Booking && item.Booking.pdf_sheet_medical_examination_result){
    await viewPdf(item.Booking.pdf_sheet_medical_examination_result,"sheet")
  }else{
    if(language==="vi"){
      toast.info("Bác sĩ chưa tạo phiếu kết quả khám bệnh cho bệnh nhân này!");
    }else{
      toast.info("The doctor has not created a medical examination sheet for this patient!");
    }
  }
};

const handleDownloadImageRemedy = async (item)=>{
  if(item.Booking && item.Booking.pdf_remedy){
    await downloadPdf(item.Booking.pdf_remedy,"remedy")
  }else{
    if(this.props.language==="vi"){
      toast.info("Bác sĩ chưa tạo đơn thuốc cho bệnh nhân này!");
    }else{
      toast.info("The doctor has not created a prescription for this patient!");
    }
  }
}



const handleDownloadImageSheet = async (item)=>{
  if(item.Booking && item.Booking.pdf_sheet_medical_examination_result){
    await downloadPdf(item.Booking.pdf_sheet_medical_examination_result,"sheet")
  }else{
    if(language==="vi"){
      toast.info("Chưa có thông tin phiếu kết quả khám bệnh!");
    }else{
      toast.info("There is no information on the medical examination result sheet!");
    }
  }
}

const handleGetValueUnit=(unitKey)=>{
    let finded = units.find(item=>item.key==unitKey)
    if(finded){
      if(language=="vi") return finded.valueVi
      else return finded.valueEn
    }
}


const openPreviewImageInvoice = async (item) => {
  if(item.Booking && item.Booking.invoiceData && item.Booking.invoiceData.pdf_invoice){
    await viewPdf(item.Booking.invoiceData.pdf_invoice,"invoice")
  }else{
    if(language==="vi"){
      toast.info("Bác sĩ chưa tạo hóa đơn cho bệnh nhân này!");
    }else{
      toast.info("The doctor has not billed this patient yet!");
    }
  }
};

const handleDownloadImageInvoice = async (item)=>{
  if(item.Booking && item.Booking.invoiceData && item.Booking.invoiceData.pdf_invoice){
    await downloadPdf(item.Booking.invoiceData.pdf_invoice,"invoice")
  }else{
    if(language==="vi"){
      toast.info("Chưa có thông tin hóa đơn!");
    }else{
      toast.info("No invoice information yet!");
    }
  }
}

  return (
    <LoadingOverlay
    active={isShowLoading}
    spinner={<ClimbingBoxLoader color={"#86e7d4"} size={15} />}
  >
        <div>
            <div class="d-flex justify-content-center">
              <h2><FormattedMessage id="medical-history.title" /></h2>
            </div>
            <div class="row">
                <div class="col-12 mb-20">
                  <h3><FormattedMessage id="medical-history.filters" /></h3>
                </div>
                <div class="col-12 mb-5">
                  <span style={{width:'100px',display:'inline-block'}}><FormattedMessage id="medical-history.from-date" /></span>
                  <input type="date" class="ml-5" value={startDate} onChange={(event)=>handleOnchangeDate(event,"startDate")}/>
                </div>
                <div class="col-12">
                  <span style={{width:'100px',display:'inline-block'}}><FormattedMessage id="medical-history.to-date" /></span>
                  <input type="date" class="ml-5" value={endDate} onChange={(event)=>handleOnchangeDate(event,"endDate")}/>
                </div>
                <div class="col-12 mt-10">
                    <button onClick={()=>handleFilterHistoryByDateApply()} type="button" class="btn btn-primary mr-5"><FormattedMessage id="medical-history.apply" /></button>
                    <button type="button" class="btn btn-primary" onClick={()=>handleResetDate()}><FormattedMessage id="medical-history.reset" /></button>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <table class="table table-hover mt-45">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col"><FormattedMessage id="medical-history.date-examination" /></th>
                          <th scope="col" class="text-center"><FormattedMessage id="medical-history.reason" /></th>
                          <th scope="col"  class="text-center"><FormattedMessage id="medical-history.doctor" /></th>
                          <th scope="col" class="text-center"><FormattedMessage id="medical-history.prescription" /></th>
                          <th scope="col" class="text-center"><FormattedMessage id="medical-history.doctor-advice" /></th>
                          <th scope="col" class="text-center"><FormattedMessage id="medical-history.pdf-prescription" /></th>
                          <th scope="col" class="text-center"><FormattedMessage id="medical-history.pdf-sheet" /></th>
                          <th scope="col" class="text-center"><FormattedMessage id="medical-history.pdf-invoice" /></th>
                          {/* <th scope="col" class="text-center">&nbsp;</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {
                          histories.map((item,index)=>{
                            let drugs = null;
                            if(item.drugs){
                              drugs=JSON.parse(item.drugs);
                            }
                           
                            return(
                              <tr>
                                  <th scope="row">{index+1}</th>
                                  <td>{moment(item.createdAt).format("DD/MM/YYYY")}</td>
                                  <td class="text-center">{item.reason}</td>
                                  <td class="text-center">
                                      <div class="pointer text-primary" onClick={()=>navigate(`/detail-doctor/${item.doctorId}`)}>{item.doctorDataHistory.lastName} {item.doctorDataHistory.firstName}</div>
                                      <div class="pointer text-primary" onClick={()=>navigate(`/detail-specialty/${item.doctorDataHistory.Doctor_Infor.specialtyId}`)}>{item.doctorDataHistory.Doctor_Infor.specialtyData.name}</div>
                                      <div class="pointer text-primary" onClick={()=>navigate(`/detail-clinic/${item.doctorDataHistory.Doctor_Infor.clinicId}`)}>{item.doctorDataHistory.Doctor_Infor.clinicData.name}</div>
                                  </td>
                                  <td>
                                  <ul class="list-group" style={{overflowY: 'scroll', maxHeight:'150px'}}>
                                      {drugs != null ? drugs.map((item)=>{
                                        return(
                                          <li class="list-group-item list-group-item-action">
                                            {item.name} |  {item.amount} {handleGetValueUnit(item.unit)} | {item.description_usage}
                                          </li>
                                        )
                                      }) : ""}
                                  </ul>
                                  </td>
                                  <td class="text-center">{item.description}</td>
                                  <td class="text-center">
                                    <div className="text-center">
                                      <span class="text-primary pointer" onClick={()=>openPreviewImageRemedy(item)}><FormattedMessage id={"manage-patient.view"} /></span>
                                      <span class="mx-5">/</span>
                                      <span class="text-success pointer" onClick={()=>handleDownloadImageRemedy(item)}><FormattedMessage id={"manage-patient.download"} /></span>
                                    </div>
                                  </td>
                                  <td class="text-center">
                                    <div className="text-center">
                                      <span class="text-primary pointer" onClick={()=>openPreviewImageSheet(item)}><FormattedMessage id={"manage-patient.view"} /></span>
                                      <span class="mx-5">/</span>
                                      <span class="text-success pointer" onClick={()=>handleDownloadImageSheet(item)}><FormattedMessage id={"manage-patient.download"} /></span>
                                    </div>
                                  </td>
                                  <td class="text-center">
                                    <div className="text-center">
                                        <span class="text-primary pointer" onClick={()=>openPreviewImageInvoice(item)}><FormattedMessage id={"manage-patient.view"} /></span>
                                        <span class="mx-5">/</span>
                                        <span class="text-success pointer" onClick={()=>handleDownloadImageInvoice(item)}><FormattedMessage id={"manage-patient.download"} /></span>
                                    </div>
                                  </td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </table>
                </div>
            </div>

            {isOpen === true && (
            <Lightbox
              mainSrc={previewImgURL}
              onCloseRequest={() => setIsOpen(false)}
            />
          )}
        </div>
    </LoadingOverlay>
  );
}
