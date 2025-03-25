import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./SheetModal.scss";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import { toast } from "react-toastify";
import moment from "moment";
import localization from "moment/locale/vi"; //su dung chung cho cai mac dinh la tieng viet
import { CommonUtils } from "../../../utils";

class SheetModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      pdf_sheet_medical_examination_result: ""
    };
  }

  async componentDidMount() {
    if (
      this.props.dataModalSheet &&
      this.props.dataModalSheet.pdf_sheet_medical_examination_result &&
      this.props.dataModalSheet.email
    ) {
      this.setState({
        pdf_sheet_medical_examination_result: this.props.dataModalSheet.pdf_sheet_medical_examination_result,
        email: this.props.dataModalSheet.email,
      });
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }

    if (this.props.dataModalSheet.pdf_sheet_medical_examination_result !== prevProps.dataModalSheet.pdf_sheet_medical_examination_result) {
      if (
        this.props.dataModalSheet &&
        this.props.dataModalSheet.pdf_sheet_medical_examination_result &&
        this.props.dataModalSheet.email
      ) {
        this.setState({
          pdf_sheet_medical_examination_result: this.props.dataModalSheet.pdf_sheet_medical_examination_result,
          email: this.props.dataModalSheet.email,
        });
      }
    }
  }

  handleOnChangeEmail = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  handleSendSheet = () => {
    this.props.sendSheet(this.state);
  };

  render() {
    let { isOpenSheetModal, closeSheetModal, dataModalSheet, sendSheet } = this.props;

    return (
      <Modal
        isOpen={isOpenSheetModal}
        className={"booking-modal-container"}
        size="md"
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title"><FormattedMessage id={"manage-patient.send-sheet-to-patients"} /></h5>
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={closeSheetModal}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <ModalBody>
          <div className="row">
            <div className="col-6 form-group">
              <label><FormattedMessage id={"manage-patient.email-patient"} /></label>
              <input
                className="form-control"
                type="email"
                value={this.state.email}
                onChange={(event) => this.handleOnChangeEmail(event)}
              />
            </div>
            <div className="col-6 form-group">
              {this.props.dataModalSheet.pdf_sheet_medical_examination_result ? (
                  <label><FormattedMessage id={"manage-patient.there-is-a-pre-created-sheet-file"} /></label>
                ) : ( <label><FormattedMessage id={"manage-patient.no-previously-created-sheet"} /></label>)}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          {this.props.dataModalSheet.pdf_sheet_medical_examination_result && (<Button color="primary" onClick={() => this.handleSendSheet()}>
          <FormattedMessage id={"manage-patient.send"} />
          </Button>)}
            <Button color="secondary" onClick={closeSheetModal}>
                <FormattedMessage id={"manage-patient.cancel"} />
            </Button>
          </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return { language: state.app.language, genders: state.admin.genders };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SheetModal);
