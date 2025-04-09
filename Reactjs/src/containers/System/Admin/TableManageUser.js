import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./TableManageUser.scss";
import * as actions from "../../../store/actions";

import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";

import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from "@mui/material";
import Page from "../../../containers/AdminDashboard/components/Page";
import Label from "../../../containers/AdminDashboard/components/Label";
import Scrollbar from "../../../containers/AdminDashboard/components/Scrollbar";
import Iconify from "../../../containers/AdminDashboard/components/Iconify";
import SearchNotFound from "../../../containers/AdminDashboard/components/SearchNotFound";
import {
  UserListHead,
  UserListToolbar,
  UserMoreMenu,
} from "../../../containers/AdminDashboard/sections/@dashboard/user";

import { USER_ROLE, USER_POSITION } from "../../../utils";
import { sentenceCase } from "change-case";
import { withRouter } from '../../../utils/withRouter';

const mdParser = new MarkdownIt();

const TABLE_HEAD = [
  { id: "name", label: "Name", alignRight: false },
  { id: "email", label: "Email", alignRight: false },
  { id: "role", label: "Role", alignRight: false },
  { id: "address", label: "Address", alignRight: false },
  { id: "academicDegree", label: "Academic Degree", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
  { id: "" },
];

const TABLE_HEAD_VI = [
  { id: "name", label: "Tên", alignRight: false },
  { id: "email", label: "Email", alignRight: false },
  { id: "role", label: "Vai trò", alignRight: false },
  { id: "address", label: "Địa chỉ", alignRight: false },
  { id: "academicDegree", label: "Học vị", alignRight: false },
  { id: "status", label: "Trạng thái", alignRight: false },
  { id: "" },
];

class TableManageUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersRedux: [],
    };
  }

  componentDidMount() {
    if (this.props.listFilterUsers) {
      this.setState({
        usersRedux: this.props.listFilterUsers,
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.listFilterUsers !== this.props.listFilterUsers) {
      this.setState({
        usersRedux: this.props.listFilterUsers,
      });
    }
  }

  handleDeleteUser = (user) => {
    this.props.deleteAUserRedux(user.id);
    // Gọi handleReset từ UserRedux để làm mới danh sách
    this.props.handleReset();
  };

  handleEditUser = (user) => {
    this.props.navigate('/admin-dashboard/user/edit/' + user.id);
  };

  getValueRole = (roleId) => {
    let language = this.props.language;
    switch (roleId) {
      case USER_ROLE.ADMIN:
        return language === "en" ? (
          <Label variant="ghost" color={"success"}>
            {sentenceCase("ADMIN")}
          </Label>
        ) : (
          <Label variant="ghost" color={"success"}>
            {"Quản trị viên"}
          </Label>
        );
      case USER_ROLE.DOCTOR:
        return language === "en" ? (
          <Label variant="ghost" color={"info"}>
            {sentenceCase("DOCTOR")}
          </Label>
        ) : (
          <Label variant="ghost" color={"info"}>
            {"Bác sĩ"}
          </Label>
        );
      case USER_ROLE.PATIENT:
        return language === "en" ? (
          <Label variant="ghost" color={"warning"}>
            {sentenceCase("PATIENT")}
          </Label>
        ) : (
          <Label variant="ghost" color={"warning"}>
            {"Bệnh nhân"}
          </Label>
        );
      case USER_ROLE.EMPLOYEE:
        return language === "en" ? (
          <Label variant="ghost" color={"default"}>
            {sentenceCase("EMPLOYEE")}
          </Label>
        ) : (
          <Label variant="ghost" color={"default"}>
            {"Nhân viên"}
          </Label>
        );
      default:
        return "";
    }
  };

  getValuePosition = (positionId) => {
    let language = this.props.language;
    switch (positionId) {
      case USER_POSITION.BACHELOR:
        return language === "en" ? "Bachelor" : "Cử nhân";
      case USER_POSITION.MASTER:
        return language === "en" ? "Master" : "Thạc sĩ";
      case USER_POSITION.DOCTOR:
        return language === "en" ? "Doctor" : "Tiến sĩ";
      case USER_POSITION.ASSOCIATE_PROFESSOR:
        return language === "en" ? "Associate Professor" : "Phó giáo sư";
      case USER_POSITION.PROFESSOR:
        return language === "en" ? "Professor" : "Giáo sư";
      default:
        return "";
    }
  };

  getStatus = (statusId) => {
    let language = this.props.language;
    switch (statusId) {
      case 0:
        return language === "en" ? (
          <Label variant="ghost" color={"success"}>
            {sentenceCase("ACTIVE")}
          </Label>
        ) : (
          <Label variant="ghost" color={"success"}>
            {"Hoạt động"}
          </Label>
        );
      case 1:
        return language === "en" ? (
          <Label variant="ghost" color={"info"}>
            {sentenceCase("BANNED")}
          </Label>
        ) : (
          <Label variant="ghost" color={"info"}>
            {"Cấm"}
          </Label>
        );
      default:
        return "";
    }
  };

  render() {
    let arrUsers = this.state.usersRedux;
    let language = this.props.language;
    const { currentUserRoleId } = this.props; // Lấy roleId từ props được truyền từ UserRedux

    return (
      <React.Fragment>
        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  headLabel={language === "vi" ? TABLE_HEAD_VI : TABLE_HEAD}
                />
                <TableBody>
                  {arrUsers.map((row) => {
                    const {
                      address,
                      email,
                      firstName,
                      gender,
                      id,
                      image,
                      lastName,
                      phonenumber,
                      positionId,
                      roleId,
                      status,
                      createdAt,
                    } = row;
                    let imageBase64 = "";
                    if (image) {
                      imageBase64 = new Buffer(image, "base64").toString("binary");
                    }
                    let name = "";
                    if (lastName !== null && firstName != null) {
                      name = `${lastName} ${firstName}`;
                    } else if (lastName !== null && firstName == null) {
                      name = `${lastName}`;
                    } else if (lastName == null && firstName !== null) {
                      name = `${firstName}`;
                    }

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox">
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={firstName} src={imageBase64} />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{email}</TableCell>
                        <TableCell align="left">{this.getValueRole(roleId)}</TableCell>
                        <TableCell align="left">{address}</TableCell>
                        <TableCell align="left">{this.getValuePosition(positionId)}</TableCell>
                        <TableCell align="left">{this.getStatus(status)}</TableCell>
                        <TableCell align="right">
                          {/* Chỉ hiển thị nút Edit và Delete nếu roleId là "R1" */}
                          {currentUserRoleId === "R1" && (
                            <>
                              <button
                                className="btn-edit"
                                onClick={() => this.handleEditUser(row)}
                                title="Edit"
                              >
                                <i className="fas fa-pencil-alt"></i>
                              </button>
                              <button
                                className="btn-delete"
                                onClick={() => this.handleDeleteUser(row)}
                                title="Delete"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listUsers: state.admin.users,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
    deleteAUserRedux: (id) => dispatch(actions.deleteAUser(id)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TableManageUser));