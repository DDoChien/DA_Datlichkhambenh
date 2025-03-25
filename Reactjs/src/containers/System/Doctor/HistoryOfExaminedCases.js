import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./HistoryOfExaminedCases.scss";
import DatePicker from "../../../components/Input/DatePicker";
import { filterBookingsByDateTimestamp } from "../../../services/userService";
import moment from "moment";
import { LANGUAGES } from "../../../utils";
import SheetModal from "./SheetModal";
import InvoiceModal from "./InvoiceModal";
import RemedyModal from "./RemedyModal";
import CreateImageRemedyModal from "./CreateImageRemedyModal";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import { withRouter } from "../../../utils/withRouter"; //navigate
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import {
  viewPdf,
  downloadPdf
} from "../../../services/userService";

class HistoryOfExaminedCases extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(new Date()).startOf("day").valueOf(),
      dataHistory: [],
      isShowLoading: false,
      previewImgURL: "",
      isOpen : false
    };
  }

  async componentDidMount() {
    await this.getDataPatient();
  }

  getDataPatient = async () => {
    let { user } = this.props;
    let { currentDate } = this.state;
    let formatedDate = new Date(currentDate).getTime();
    if (user && user.id) {
      let res = await filterBookingsByDateTimestamp({
        doctorId: user.id,
        date: formatedDate,
      });
      if (res && res.errCode === 0) {
        console.log("res", res);

        this.setState({
          dataHistory: res.data,
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
    this.setState(
      {
        currentDate: date[0],
      },
      async () => {
        await this.getDataPatient();
      }
    );
  };
  
  openPreviewImageRemedy = async (item) => {
    console.log("item",item)
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

  getLabelStatus = (status) => {
    switch (status) {
      case "S1":
        return 'badge bg-primary'
        break;
      case "S2":
        return 'badge bg-info text-dark'
        break;
      case "S3":
        return 'badge bg-info text-dark'
        break;
      case "S4":
        return 'badge bg-info text-dark'
        break;
      case "S5":
        return 'badge bg-success'
        break;
      case "S6":
        return 'badge bg-danger'
        break;
      default:
        return 'badge bg-light text-dark'
    }
  };

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
  
  render() {
    let { dataHistory } = this.state;
    let { language } = this.props;

    return (
      <>
        <LoadingOverlay
          active={this.state.isShowLoading}
          spinner={<ClimbingBoxLoader color={"#86e7d4"} size={15} />}
        >
          <div className="manage-patient-container">
            <div className="m-p-title font-weight-bold">
              <FormattedMessage
                id={"manage-patient.history-of-examined-cases"}
              />{" "}
            </div>
            <div className="manage-patient-body row">
              <div className="col-4 form-group">
                <label>
                  <FormattedMessage id={"manage-patient.choose-date"} />
                </label>
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
                      <th scope="col" class="text-center">
                        #
                      </th>
                      <th scope="col" class="text-center">
                        <FormattedMessage id="booking-history.date-examination" />
                      </th>
                      <th scope="col" class="text-center">
                        <FormattedMessage id="booking-history.shift" />
                      </th>
                      <th scope="col" class="text-center">
                        <FormattedMessage id="booking-history.reason" />
                      </th>
                      <th scope="col" class="text-center">
                        <FormattedMessage id="booking-history.patient-name" />
                      </th>
                      <th scope="col" class="text-center">
                        <FormattedMessage id="booking-history.patient-phone-number" />
                      </th>
                      <th scope="col" class="text-center">
                        <FormattedMessage id="booking-history.address" />
                      </th>
                      <th scope="col" class="text-center">
                        <FormattedMessage id="booking-history.status" />
                      </th>
                      <th scope="col" class="text-center"><FormattedMessage id="medical-history.pdf-prescription" /></th>
                      <th scope="col" class="text-center"><FormattedMessage id="medical-history.pdf-sheet" /></th>
                      <th scope="col" class="text-center"><FormattedMessage id="medical-history.pdf-invoice" /></th>
                    </tr>
                    {dataHistory && dataHistory.length > 0 ? (
                        dataHistory.map((item, index) => {
                            //convert timestamp to date
                    const unixTimestamp = parseInt(item.date);
                    const dateObject = new Date(unixTimestamp);
                    let date =
                        dateObject.getDate() +
                        "/" +
                        (parseInt(dateObject.getMonth()) + 1) +
                        "/" +
                        dateObject.getFullYear();

                    return (
                        <tr>
                            <td class="text-center">{index + 1}</td>
                            <td class="text-center">{date}</td>
                            <td class="text-center">
                                {language === "en"
                                ? item.timeTypeDataPatient.valueEn
                                : item.timeTypeDataPatient.valueVi}
                            </td>
                            <td class="text-center">{item.patientReason}</td>
                            <td class="text-center">{item.patientName}</td>
                            <td class="text-center">{item.patientPhoneNumber}</td>
                            <td class="text-center">{item.patientAddress}</td>
                            <td className={`text-center`} >
                                <span className={`${this.getLabelStatus(item.statusId)}`} style={{ padding: '5px', fontSize: '14px' }}>  {language === "en"
                                ? item.statusDataPatient.valueEn
                                : item.statusDataPatient.valueVi}</span>
                            </td>
                            <td class="text-center">
                                    <div className="text-center">
                                      <span class="text-primary pointer" onClick={()=>this.openPreviewImageRemedy(item)}><FormattedMessage id={"manage-patient.view"} /></span>
                                      <span class="mx-5">/</span>
                                      <span class="text-success pointer" onClick={()=>this.handleDownloadImageRemedy(item)}><FormattedMessage id={"manage-patient.download"} /></span>
                                    </div>
                            </td>
                            <td class="text-center">
                                    <div className="text-center">
                                      <span class="text-primary pointer" onClick={()=>this.openPreviewImageSheet(item)}><FormattedMessage id={"manage-patient.view"} /></span>
                                      <span class="mx-5">/</span>
                                      <span class="text-success pointer" onClick={()=>this.handleDownloadImageSheet(item)}><FormattedMessage id={"manage-patient.download"} /></span>
                                    </div>
                            </td>
                            <td class="text-center">
                                    <div className="text-center">
                                        <span class="text-primary pointer" onClick={()=>this.openPreviewImageInvoice(item)}><FormattedMessage id={"manage-patient.view"} /></span>
                                        <span class="mx-5">/</span>
                                        <span class="text-success pointer" onClick={()=>this.handleDownloadImageInvoice(item)}><FormattedMessage id={"manage-patient.download"} /></span>
                                    </div>
                            </td>
                        </tr>
                    );
                      })
                    ) : (
                      <tr>
                        <td colSpan="11" style={{ textAlign: "center" }}>
                          {language === LANGUAGES.VI ? "Không có ca khám bệnh đã khám vào ngày này" : "There were no visits on this date"}
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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HistoryOfExaminedCases)
);
