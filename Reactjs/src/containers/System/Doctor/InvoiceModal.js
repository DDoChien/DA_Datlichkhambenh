import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./InvoiceModal.scss";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import { toast } from "react-toastify";
import moment from "moment";
import localization from "moment/locale/vi"; //su dung chung cho cai mac dinh la tieng viet
import { CommonUtils } from "../../../utils";

class InvoiceModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      pdf_invoice: "",
    };
  }

  async componentDidMount() {
    if (
      this.props.dataModalInvoice &&
      this.props.dataModalInvoice.pdf_invoice &&
      this.props.dataModalInvoice.email
    ) {
      this.setState({
        pdf_invoice: this.props.dataModalInvoice.pdf_invoice,
        email: this.props.dataModalInvoice.email,
      });
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {

    }

    if (this.props.dataModalInvoice.pdf_invoice !== prevProps.dataModalInvoice.pdf_invoice) {
      if (
        this.props.dataModalInvoice &&
        this.props.dataModalInvoice.pdf_invoice &&
        this.props.dataModalInvoice.email
      ) {
        this.setState({
          email: this.props.dataModalInvoice.email,
          pdf_invoice: this.props.dataModalInvoice.pdf_invoice
        });
      }
    }
  }

  handleOnChangeEmail = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  handleSendInvoice = () => {
    this.props.sendInvoice(this.state);
  };

  render() {
    let { isOpenInvoiceModal, closeInvoiceModal, dataModalInvoice, sendInvoice } = this.props;

    return (
      <Modal
        isOpen={isOpenInvoiceModal}
        className={"booking-modal-container"}
        size="md"
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title"><FormattedMessage id={"manage-patient.send-invoice-to-patient"} /></h5>
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={closeInvoiceModal}
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
                {
                  this.props.dataModalInvoice.pdf_invoice ?
                  (
                    <label><FormattedMessage id={"manage-patient.there-is-a-pre-created-invoice-file"} /></label>
                  ) :
                  (
                    <label><FormattedMessage id={"manage-patient.no-invoice-file-created-before"} /></label>
                  )
                }
              </div>
            </div>
          </ModalBody>
        <ModalFooter>
          {this.props.dataModalInvoice.pdf_invoice && (<Button color="primary" onClick={() => this.handleSendInvoice()}>
            <FormattedMessage id={"manage-patient.send"} />
          </Button>)}
         
          <Button color="secondary" onClick={closeInvoiceModal}>
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

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceModal);
