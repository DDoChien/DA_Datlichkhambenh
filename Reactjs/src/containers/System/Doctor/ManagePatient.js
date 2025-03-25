import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManagePatient.scss";
import DatePicker from "../../../components/Input/DatePicker";
import {
  cancelBooking,
  getAllPatientForDoctor,
  postSendRemedy,
  postSendSheet,
  postSendInvoice,
  postCreateRemedy,
  viewPdf,
  downloadPdf
} from "../../../services/userService";
import moment from "moment";
import { LANGUAGES } from "../../../utils";
import SheetModal from "./SheetModal";
import InvoiceModal from "./InvoiceModal";
import RemedyModal from "./RemedyModal";
import CreateImageRemedyModal from "./CreateImageRemedyModal";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import {withRouter} from '../../../utils/withRouter';  //navigate
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
require('dotenv').config();


class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(new Date()).startOf("day").valueOf(),
      dataPatient: [],
      isOpenRemedyModal: false,
      isOpenSheetModal: false,
      isOpenInvoiceModal: false,
      isOpenCreateImageRemedyModal: false,
      dataModal: {},
      dataModalSheet: {},
      dataModalInvoice: {},
      dataModalCreateRemedy: {},
      isShowLoading: false,
      previewImgURL: "",
      dateQuery: null
    };
  }

  async componentDidMount() {
    if(this.props.location.search){
      let unixTimestamp=parseInt(this.props.location.search.split('=')[1])
      let dateObject = new Date(unixTimestamp)
   
      this.setState(
        {
          currentDate: dateObject,
        },
        async () => {
          await this.getDataPatient();
        }
      );
    }else{
      console.log("no")
      await this.getDataPatient();
    }
  }

  getDataPatient = async () => {
    let { user } = this.props;
    let { currentDate } = this.state;
    let formatedDate = new Date(currentDate).getTime();
    if (user && user.id) {
      let res = await getAllPatientForDoctor({
        doctorId: user.id,
        date: formatedDate,
      });
      if (res && res.errCode === 0) {
        console.log("res",res)
        this.setState({
          dataPatient: res.data,
        });
      }
    }
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
    if (this.props.user !== prevProps.user) {
      await this.getDataPatient();
    }
  }

  handleOnChangeDatePicker = (date) => {
    var d = new Date(date[0]);
    console.log(d.getTime());

    console.log("date",date)
    console.log("date[0]",date[0])
    this.setState(
      {
        currentDate: date[0],
      },
      async () => {
        await this.getDataPatient();
      }
    );
  };

  handleBtnSendPrescription = (item) => {
    let data = {
      doctorId: item.doctorId,
      patientId: item.patientId,
      email: item.patientData.email,
      timeType: item.timeType,
      patientName: item.patientData.firstName,
      imageRemedy: item.imageRemedy,
      pdf_remedy: item.pdf_remedy,
      token: item.token
    };

    this.setState({
      isOpenRemedyModal: true,
      dataModal: data,
    });
  };

  handleBtnSendSheet = (item) => {
    console.log("item",item)
    let data = {
      doctorId: item.doctorId,
      patientId: item.patientId,
      email: item.patientData.email,
      timeType: item.timeType,
      patientName: item.patientData.firstName,
      image_sheet_medical_examination_result: item.image_sheet_medical_examination_result,
      token: item.token,
      pdf_sheet_medical_examination_result: item.pdf_sheet_medical_examination_result
    };

    this.setState({
      isOpenSheetModal: true,
      dataModalSheet: data,
    });
  };

  handleBtnSendInvoice = (item) => {
    console.log("item",item)
    let data = {
      doctorId: item.doctorId,
      patientId: item.patientId,
      email: item.patientData.email,
      timeType: item.timeType,
      patientName: item.patientData.firstName,
      image_invoice: item.invoiceData ? (item.invoiceData.image_invoice ? item.invoiceData.image_invoice : null) : null ,
      token: item.token,
      pdf_invoice: item.invoiceData ? (item.invoiceData.pdf_invoice ? item.invoiceData.pdf_invoice : null) : null ,
    };
    this.setState({
      isOpenInvoiceModal: true,
      dataModalInvoice: data,
    });
  };

  handleBtnCreateRemedy = (item) => {
    const navigateLink=`/admin-dashboard/doctor/manage-patient/${item.id}`
    this.props.navigate(navigateLink);
  };

  handleBtnCreateSheetMedicalExaminationResult = (item) => {
    const navigateLink=`/admin-dashboard/doctor/manage-patient/create-sheet-medical-examination-result/${item.id}`
    this.props.navigate(navigateLink);
  };

  handleBtnIssueMedicalBill = (item) => {
    const navigateLink=`/admin-dashboard/doctor/manage-patient/issue-medical-bill/${item.id}`
    this.props.navigate(navigateLink);
  };

  handleBtnCancel = async (item) => {
    this.setState({ isShowLoading: true });
    let res = await cancelBooking({
      doctorId: item.doctorId,
      patientId: item.patientId,
      timeType: item.timeType,
      date: item.date,
      statusId: item.statusId,
    });
    if (res && res.errCode === 0) {
      this.setState({ isShowLoading: false });
      if(this.props.language==="en"){
        toast.success("cancel appointment succeed!");
      }else{
        toast.success("Hủy cuộc hẹn thành công!");
      }
      await this.getDataPatient();
    } else {
      this.setState({ isShowLoading: true });
      if(this.props.language==="en"){
        toast.error("Something wrongs...!");
      }else{
        toast.error("Lỗi!");
      }
    }
  };

  closeRemedyModal = () => {
    this.setState({
      isOpenRemedyModal: false,
      dataModal: {},
    });
  };

  closeSheetModal = () => {
    this.setState({
      isOpenSheetModal: false,
      dataModalSheet: {},
    });
  };

  closeInvoiceModal = () => {
    this.setState({
      isOpenInvoiceModal: false,
      dataModalInvoice: {},
    });
  };

  sendRemedy = async (dataChild) => {
    let { dataModal } = this.state;

    let totalCostData = null;
    let specialtyIdData = null;
    if (
      this.props.user &&
      this.props.user.Doctor_Infor &&
      this.props.user.Doctor_Infor.priceTypeData &&
      this.props.user.Doctor_Infor.priceTypeData.valueEn
    ) {
      totalCostData = this.props.user.Doctor_Infor.priceTypeData.valueEn;
    }
    if (
      this.props.user &&
      this.props.user.Doctor_Infor &&
      this.props.user.Doctor_Infor.specialtyId
    ) {
      specialtyIdData = this.props.user.Doctor_Infor.specialtyId;
    }

    
    //new code
    if(this.props.language==="en"){
      toast.success("Send Remedy succeed!");
    }else{
      toast.success("Gửi đơn thuốc thành công!");
    }
    this.closeRemedyModal();
    await this.getDataPatient();

    let res = await postSendRemedy({
      email: dataChild.email,
      pdf_remedy: dataChild.pdf_remedy,
      doctorId: dataModal.doctorId,
      patientId: dataModal.patientId,
      timeType: dataModal.timeType,
      language: this.props.language,
      patientName: dataModal.patientName,
      totalCost: totalCostData,
      specialtyId: specialtyIdData,
    });
  };


  sendSheet = async (dataChild) => {
    let { dataModalSheet } = this.state;
    // this.setState({ isShowLoading: true });

    let totalCostData = null;
    let specialtyIdData = null;
    if (
      this.props.user &&
      this.props.user.Doctor_Infor &&
      this.props.user.Doctor_Infor.priceTypeData &&
      this.props.user.Doctor_Infor.priceTypeData.valueEn
    ) {
      totalCostData = this.props.user.Doctor_Infor.priceTypeData.valueEn;
    }
    if (
      this.props.user &&
      this.props.user.Doctor_Infor &&
      this.props.user.Doctor_Infor.specialtyId
    ) {
      specialtyIdData = this.props.user.Doctor_Infor.specialtyId;
    }
    
    //new code
    if(this.props.language==="en"){
      toast.success("Send sheet medical examination result succeed!");
    }else{
      toast.success("Gửi phiếu khám bệnh thành công!");
    }
    this.closeSheetModal();
    await this.getDataPatient();

    let res = await postSendSheet({
      email: dataChild.email,
      pdf_sheet_medical_examination_result: dataChild.pdf_sheet_medical_examination_result,
      doctorId: dataModalSheet.doctorId,
      patientId: dataModalSheet.patientId,
      timeType: dataModalSheet.timeType,
      language: this.props.language,
      patientName: dataModalSheet.patientName,
      totalCost: totalCostData,
      specialtyId: specialtyIdData,
    });
  };


  sendInvoice = async (dataChild) => {
    let { dataModalInvoice } = this.state;

    let totalCostData = null;
    let specialtyIdData = null;
    if (
      this.props.user &&
      this.props.user.Doctor_Infor &&
      this.props.user.Doctor_Infor.priceTypeData &&
      this.props.user.Doctor_Infor.priceTypeData.valueEn
    ) {
      totalCostData = this.props.user.Doctor_Infor.priceTypeData.valueEn;
    }
    if (
      this.props.user &&
      this.props.user.Doctor_Infor &&
      this.props.user.Doctor_Infor.specialtyId
    ) {
      specialtyIdData = this.props.user.Doctor_Infor.specialtyId;
    }
    
    //new code
    if(this.props.language==="en"){
      toast.success("Send invoice succeed!");
    }else{
      toast.success("Gửi hóa đơn thành công!");
    }
    this.closeInvoiceModal();
    await this.getDataPatient();

    let res = await postSendInvoice({
      email: dataChild.email,
      pdf_invoice: dataChild.pdf_invoice,
      doctorId: dataModalInvoice.doctorId,
      patientId: dataModalInvoice.patientId,
      timeType: dataModalInvoice.timeType,
      language: this.props.language,
      patientName: dataModalInvoice.patientName,
      totalCost: totalCostData,
      specialtyId: specialtyIdData,
    });
  };

  openPreviewImageRemedy = async (item) => {
    if(item.pdf_remedy){
      await viewPdf(item.pdf_remedy,"remedy")
    }else{
      if(this.props.language==="vi"){
        toast.info("Bác sĩ chưa tạo đơn thuốc cho bệnh nhân này!");
      }else{
        toast.info("The doctor has not created a prescription for this patient!");
      }
    }
  };

  openPreviewImageSheet = async (item) => {
    if(item.pdf_sheet_medical_examination_result){
      await viewPdf(item.pdf_sheet_medical_examination_result,"sheet")
    }else{
      if(this.props.language==="vi"){
        toast.info("Bác sĩ chưa tạo phiếu kết quả khám bệnh cho bệnh nhân này!");
      }else{
        toast.info("The doctor has not created a medical examination sheet for this patient!");
      }
    }
  };

  openPreviewImageInvoice = async (item) => {
    if(item.invoiceData && item.invoiceData.pdf_invoice){
      await viewPdf(item.invoiceData.pdf_invoice,"invoice")
    }else{
      if(this.props.language==="vi"){
        toast.info("Bác sĩ chưa tạo hóa đơn cho bệnh nhân này!");
      }else{
        toast.info("The doctor has not billed this patient yet!");
      }
    }
  };

  handleDownloadImageRemedy = async (item)=>{
    if(item.pdf_remedy){
      await downloadPdf(item.pdf_remedy,"remedy")
    }else{
      if(this.props.language==="vi"){
        toast.info("Bác sĩ chưa tạo đơn thuốc cho bệnh nhân này!");
      }else{
        toast.info("The doctor has not created a prescription for this patient!");
      }
    }
  }

  handleDownloadImageSheet = async (item)=>{
    if(item.pdf_sheet_medical_examination_result){
      await downloadPdf(item.pdf_sheet_medical_examination_result,"sheet")
    }else{
      if(this.props.language==="vi"){
        toast.info("Chưa có thông tin phiếu kết quả khám bệnh!");
      }else{
        toast.info("There is no information on the medical examination result sheet!");
      }
    }
  }

  handleDownloadImageInvoice = async (item)=>{
    if(item.invoiceData && item.invoiceData.pdf_invoice){
      await downloadPdf(item.invoiceData.pdf_invoice,"invoice")
    }else{
      if(this.props.language==="vi"){
        toast.info("Chưa có thông tin hóa đơn!");
      }else{
        toast.info("No invoice information yet!");
      }
    }
  }
  
  
  render() {
    let {
      dataPatient,
      isOpenRemedyModal,
      isOpenSheetModal,
      isOpenCreateImageRemedyModal,
      isOpenInvoiceModal,
      dataModal,
      dataModalSheet,
      dataModalInvoice,
      dataModalCreateRemedy,
    } = this.state;
    let { language } = this.props;

    return (
      <>
        <LoadingOverlay
          active={this.state.isShowLoading}
          spinner={<ClimbingBoxLoader color={"#86e7d4"} size={15} />}
        >
          <RemedyModal
            isOpenModal={isOpenRemedyModal}
            dataModal={dataModal}
            closeRemedyModal={this.closeRemedyModal}
            sendRemedy={this.sendRemedy}
          />

          <SheetModal
            isOpenSheetModal={isOpenSheetModal}
            dataModalSheet={dataModalSheet}
            closeSheetModal={this.closeSheetModal}
            sendSheet={this.sendSheet}
          />

          <InvoiceModal
                isOpenInvoiceModal={isOpenInvoiceModal}
                dataModalInvoice={dataModalInvoice}
                closeInvoiceModal={this.closeInvoiceModal}
                sendInvoice={this.sendInvoice}
          />
      
          <div className="manage-patient-container">
            <div className="m-p-title font-weight-bold"><FormattedMessage id={"manage-patient.title"} /> </div>
            <div className="manage-patient-body row">
              <div className="col-4 form-group">
                <label><FormattedMessage id={"manage-patient.choose-date"} /></label>
                <DatePicker
                  onChange={this.handleOnChangeDatePicker}
                  className="form-control"
                  value={this.state.currentDate}
                />
              </div>
              <div className="col-12 table-manage-patient">
                <table>
                  <tbody>
                    <tr>
                      <th class="text-center">#</th>
                      <th class="text-center"><FormattedMessage id={"manage-patient.examination-time"} /></th>
                      <th class="text-center"><FormattedMessage id={"manage-patient.patient-name"} /></th>
                      <th class="text-center"><FormattedMessage id={"manage-patient.address"} /></th>
                      <th class="text-center"><FormattedMessage id={"manage-patient.phone-number"} /></th>
                      <th class="text-center"><FormattedMessage id={"manage-patient.gender"} /></th>
                      <th class="text-center"><FormattedMessage id={"manage-patient.reason"} /></th>
                      <th class="text-center"><FormattedMessage id={"manage-patient.prescription"} /></th>
                      <th class="text-center"><FormattedMessage id={"manage-patient.sheet-result"} /></th>
                      <th class="text-center"><FormattedMessage id={"manage-patient.invoice"} /></th>
                      <th class="text-center"><FormattedMessage id={"manage-patient.actions"} /></th>
                    </tr>
                    {dataPatient && dataPatient.length > 0 ? (
                      dataPatient.map((item, index) => {
                        let time =
                          language === LANGUAGES.VI
                            ? item.timeTypeDataPatient.valueVi
                            : item.timeTypeDataPatient.valueEn;
                        let gender=
                          language === LANGUAGES.VI
                            ? (item.patientGender=="M" ? "Nam" : "Nữ")
                            : (item.patientGender=="M" ? "Male" : "Female")
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{time}</td>
                            <td>{item.patientName}</td>
                            <td>{item.patientAddress}</td>
                            <td>
                              {item.patientPhoneNumber ? item.patientPhoneNumber : ""}
                            </td>
                            <td>{gender}</td>
                            <td>{item.patientReason}</td>
                            <td>
                              <div
                                className="text-center pointer text-primary"
                                onClick={() => this.openPreviewImageRemedy(item)}
                              ><FormattedMessage id={"manage-patient.view"} /></div>
                                <span class="mx-5">/</span>
                                <span class="text-success pointer" onClick={()=>this.handleDownloadImageRemedy(item)}><FormattedMessage id={"manage-patient.download"} /></span>
                            </td>
                            <td>
                              <div
                                className="text-center pointer text-primary"
                                onClick={() => this.openPreviewImageSheet(item)}
                              ><FormattedMessage id={"manage-patient.view"} /></div>
                              <span class="mx-5">/</span>
                              <span class="text-success pointer" onClick={()=>this.handleDownloadImageSheet(item)}><FormattedMessage id={"manage-patient.download"} /></span>
                            </td>
                            <td>
                              <div
                                className="text-center pointer text-primary"
                                onClick={() => this.openPreviewImageInvoice(item)}
                              ><FormattedMessage id={"manage-patient.view"} /></div>
                              <span class="mx-5">/</span>
                              <span class="text-success pointer" onClick={()=>this.handleDownloadImageInvoice(item)}><FormattedMessage id={"manage-patient.download"} /></span>
                            </td>
                            <td>
                              <button
                                className="btn btn-primary ml-5 my-5"
                                onClick={() => this.handleBtnSendPrescription(item)}
                              >
                                <FormattedMessage id={"manage-patient.send-prescriptions"} />
                              </button>
                              <button
                                className="btn btn-primary ml-5 my-5"
                                onClick={() => this.handleBtnSendSheet(item)}
                              >
                                <FormattedMessage id={"manage-patient.send-sheet"} />
                              </button>
                              <button
                                className="btn btn-primary ml-5 my-5"
                                onClick={() => this.handleBtnSendInvoice(item)}
                              >
                                <FormattedMessage id={"manage-patient.send-invoice"} />
                              </button>
                              <button
                                className="btn btn-info mx-5 my-5" 
                                onClick={() => this.handleBtnCreateRemedy(item)}
                              >
                                <FormattedMessage id={"manage-patient.create-prescriptions"} />
                              </button>
                              <button
                                className="btn btn-info mx-5 my-5"
                                onClick={() => this.handleBtnCreateSheetMedicalExaminationResult(item)}
                              >
                                <FormattedMessage id={"manage-patient.create-sheet-medical-examination-result"} />
                              </button>
                              <button
                                className="btn btn-info mx-5 my-5"
                                onClick={() => this.handleBtnIssueMedicalBill(item)}
                              >
                                <FormattedMessage id={"manage-patient.issue-medical-bills"} />
                              </button>
                              <button
                                className="btn btn-danger my-5"
                                onClick={() => this.handleBtnCancel(item)}
                              >
                                <FormattedMessage id={"manage-patient.cancel"} />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="11" style={{ textAlign: "center" }}>
                          {language === LANGUAGES.VI ? "Không có bệnh nhân đặt lịch vào ngày này" : "No patients booked for this date"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        
            {this.state.isOpen === true && (
            <Lightbox
              mainSrc={this.state.previewImgURL}
              onCloseRequest={() => this.setState({ isOpen: false })}
            />
          )}
         
        </LoadingOverlay>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return { language: state.app.language, user: state.user.userInfo };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ManagePatient));
