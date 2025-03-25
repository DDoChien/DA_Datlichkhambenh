import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./RemedyModal.scss";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import { toast } from "react-toastify";
import moment from "moment";
import localization from "moment/locale/vi"; //su dung chung cho cai mac dinh la tieng viet
import { CommonUtils } from "../../../utils";

class RemedyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      pdf_remedy:""
    };
  }

  async componentDidMount() {
    if (
      this.props.dataModal &&
      this.props.dataModal.email && this.props.dataModal.pdf_remedy
    ) {
      this.setState({
        pdf_remedy: this.props.dataModal.pdf_remedy,
        email: this.props.dataModal.email,
      });
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
    if (this.props.dataModal.pdf_remedy !== prevProps.dataModal.pdf_remedy) {
      if (
        this.props.dataModal &&
        this.props.dataModal.pdf_remedy &&
        this.props.dataModal.email
      ) {
        this.setState({
          pdf_remedy: this.props.dataModal.pdf_remedy,
          email: this.props.dataModal.email,
        });
      }
    }
  }

  handleOnChangeEmail = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  handleSendRemedy = () => {
    this.props.sendRemedy(this.state);
  };

  render() {
    let { isOpenModal, closeRemedyModal, dataModal, sendRemedy } = this.props;

    return (
      <Modal
        isOpen={isOpenModal}
        className={"booking-modal-container"}
        size="md"
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title"><FormattedMessage id={"manage-patient.send-prescriptions-to-patients"} /></h5>
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={closeRemedyModal}
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
                this.props.dataModal.pdf_remedy ? (
                    <label><FormattedMessage id={"manage-patient.there-is-a-pre-created-prescription-file"} /></label>
                  ) : (
                    <label><FormattedMessage id={"manage-patient.prescription-file-has-not-been-created"} /></label>
                  )
              }
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          {this.props.dataModal.pdf_remedy && (<Button color="primary" onClick={() => this.handleSendRemedy()}>
            <FormattedMessage id={"manage-patient.send"} />
          </Button>)} 
          <Button color="secondary" onClick={closeRemedyModal}>
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

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
