import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageScheduleOneDoctor.scss";
import { FormattedMessage } from "react-intl";
import Select from "react-select";
import * as actions from "../../../store/actions";
import { LANGUAGES } from "../../../utils";
import DatePicker from "../../../components/Input/DatePicker";
import moment from "moment";
import { toast } from "react-toastify";
import _ from "lodash";
import { saveBulkScheduleDoctor } from "../../../services/userService";

class ManageScheduleOneDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listDoctors: [],
      selectedDoctor: {},
      currentDate: "",
      rangeTime: [],
    };
  }

  componentDidMount() {
    this.props.fetchAllDoctors();
    this.props.fetchAllScheduleTime();
  }

  buildDataInputSelect = (inputData) => {
    let result = [];
    let { language } = this.props;
    if (inputData && inputData.length > 0) {
      inputData.map((item) => {
        let object = {};
        let labelVi = `${item.lastName} ${item.firstName}`;
        let labelEn = `${item.firstName} ${item.lastName}`;
        object.label = language === LANGUAGES.VI ? labelVi : labelEn;
        object.value = item.id;
        result.push(object);
      });
    }
    return result;
  };

  componentDidUpdate(prevProps) {
    if (prevProps.allDoctors !== this.props.allDoctors) {
      let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
      this.setState({
        listDoctors: dataSelect,
      });
    }

    if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
      let data = this.props.allScheduleTime;
      if (data && data.length > 0) {
        data = data.map((item) => ({ ...item, isSelected: false }));
      }
      this.setState({
        rangeTime: data,
      });
    }
  }

  handleChangeSelect = async (selectedOption) => {
    this.setState({ selectedDoctor: selectedOption });
  };

  handleOnChangeDatePicker = (date) => {
    this.setState({
      currentDate: date[0],
    });

    let data = this.props.allScheduleTime;
    if (data && data.length > 0) {
      data = data.map((item) => ({ ...item, isSelected: false }));
    }
    this.setState({
      rangeTime: data,
    });
  };

  handleClickBtnTime = (time) => {
    let { rangeTime } = this.state;
    if (rangeTime && rangeTime.length > 0) {
      rangeTime = rangeTime.map((item) => {
        if (item.id === time.id) item.isSelected = !item.isSelected;
        return item;
      });
      this.setState({
        rangeTime: rangeTime,
      });
    }
  };

  handleSaveSchedule = async () => {
    let { rangeTime, selectedDoctor, currentDate } = this.state;
    let result = [];

    if (!currentDate) {
      toast.error(
        this.props.language === "en" ? "Invalid date!" : "Ngày không hợp lệ!"
      );
      return;
    }
    if (selectedDoctor && _.isEmpty(selectedDoctor)) {
      toast.error(
        this.props.language === "en"
          ? "Invalid selected doctor!"
          : "Bác sĩ được chọn không hợp lệ!"
      );
      return;
    }

    let formatedDate = new Date(currentDate).getTime();

    if (rangeTime && rangeTime.length > 0) {
      let selectedTime = rangeTime.filter((item) => item.isSelected === true);
      if (selectedTime && selectedTime.length > 0) {
        selectedTime.map((schedule) => {
          let object = {};
          object.doctorId = selectedDoctor.value;
          object.date = formatedDate;
          object.timeType = schedule.keyMap;
          result.push(object);
        });
      } else {
        toast.error(
          this.props.language === "en"
            ? "Invalid selected time!"
            : "Thời gian không hợp lệ!"
        );
        return;
      }
    }

    let res = await saveBulkScheduleDoctor({
      arrSchedule: result,
      doctorId: selectedDoctor.value,
      date: formatedDate,
    });

    if (res && res.errCode === 0) {
      toast.success(
        this.props.language === "en"
          ? "Save info succeed!"
          : "Lưu thông tin thành công!"
      );
    } else {
      toast.error(
        this.props.language === "en" ? "Error!" : "Lỗi!"
      );
    }
  };

  render() {
    let { rangeTime } = this.state;
    let { language } = this.props;
    let today = new Date(new Date().setDate(new Date().getDate()));

    return (
      <div className="manage-schedule-container">
        <div className="m-s-title">
          <FormattedMessage id="manage-schedule.title" />
        </div>
        <div className="container">
          <div className="row">
            {/* Chọn ngày trước */}
            <div className="col-6 form-group">
              <label>
                <FormattedMessage id="manage-schedule.choose-date" />
              </label>
              <DatePicker
                onChange={this.handleOnChangeDatePicker}
                className="form-control"
                value={this.state.currentDate}
                minDate={today}
              />
            </div>

            {/* Chọn bác sĩ sau */}
            <div className="col-6 form-group">
              <label>
                <FormattedMessage id="manage-schedule.choose-doctor" />
              </label>
              <Select
                value={this.state.selectedDoctor}
                onChange={this.handleChangeSelect}
                options={this.state.listDoctors}
              />
            </div>

            {/* Chọn khung giờ */}
            <div className="col-12 pick-hour-container">
              {rangeTime &&
                rangeTime.length > 0 &&
                rangeTime.map((item, index) => {
                  return (
                    <button
                      className={
                        item.isSelected === true
                          ? "btn btn-schedule active"
                          : "btn btn-schedule"
                      }
                      key={index}
                      onClick={() => this.handleClickBtnTime(item)}
                    >
                      {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                    </button>
                  );
                })}
            </div>

            {/* Nút lưu */}
            <div className="col-12">
              <button
                className="btn btn-primary btn-save-schedule"
                onClick={() => this.handleSaveSchedule()}
              >
                <FormattedMessage id="manage-schedule.save" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  language: state.app.language,
  allDoctors: state.admin.allDoctors,
  allScheduleTime: state.admin.allScheduleTime,
});

const mapDispatchToProps = (dispatch) => ({
  fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
  fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageScheduleOneDoctor);
