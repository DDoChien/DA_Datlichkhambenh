import { Navigate, useRoutes } from "react-router-domv6";
import { useDispatch, useSelector } from "react-redux";

import Home from "../routes/Home";
import Login from "./Auth/Login";
import Logout from "./Auth/Logout";
import Signup from "./Auth/Signup";
import ForgotPassword from "./Auth/ForgotPassword";
import RetrievePassword from "./Auth/RetrievePassword";
import HomePage from "./HomePage/HomePage.js";
import DetailDoctor from "./Patient/Doctor/DetailDoctor";
import DetailSpecialty from "./Patient/Specialty/DetailSpecialty";
import DetailClinic from "./Patient/Clinic/DetailClinic";
import VerifyEmail from "./Patient/VerifyEmail";
import ListSpecialty from "./HomePage/SectionList/ListSpecialty";
import ListMedicalFacility from "./HomePage/SectionList/ListMedicalFacility";
import ListOutStandingDoctor from "./HomePage/SectionList/ListOutStandingDoctor";
import indexAdminDashboard from "./AdminDashboard/indexAdminDashboard";
import ProfileSetting from "./Profile/ProfileSetting";
import NotFound from "./System/NotFound";

import { path } from "../utils";

import {
    userIsAuthenticated,
    userIsNotAuthenticated,
  } from "../hoc/authentication";
import DashboardLayout from "./AdminDashboard/layouts/dashboard/index.js";
import DashboardApp from "./AdminDashboard/pages/DashboardApp.js";
import UserRedux from "./System/Admin/UserRedux.js";
import CreateUser from "./System/Admin/User/resources/CreateUser.js";
import EditUser from "./System/Admin/User/resources/EditUser.js";
import RestoreUser from "./System/Admin/RestoreUser/RestoreUser.js";
import ManageDoctor from "./System/Admin/ManageDoctor.js";
import EditDoctor from "./System/Admin/Doctor/resources/EditDoctor.js";
import ManageSchedule from "./System/Doctor/ManageSchedule.js";
import ManageClinic from "./System/Clinic/ManageClinic.js";
import CreateClinic from "./System/Clinic/resources/CreateClinic.js";
import EditClinic from "./System/Clinic/resources/EditClinic.js";
import ManageSpecialty from "./System/Specialty/ManageSpecialty.js";
import CreateSpecialty from "./System/Specialty/resources/CreateSpecialty.js";
import EditSpecialty from "./System/Specialty/resources/EditSpecialty.js";
import Drug from "./System/Admin/Drug/Drug.js";
import CreateDrug from "./System/Admin/Drug/resources/CreateDrug.js";
import EditDrug from "./System/Admin/Drug/resources/EditDrug.js";
import ManageBooking from "./System/Admin/Booking/ManageBooking.js";
import ManagePatient from "./System/Doctor/ManagePatient.js";
import CreateRemedy from "./System/Doctor/CreateRemedy.js";
import CreateMedicalExaminationResultSheet from "./System/Doctor/CreateMedicalExaminationResultSheet.js";
import IssueMedicalBill from "./System/Doctor/IssueMedicalBill.js";
import ManageScheduleOneDoctor from "./System/Doctor/ManageScheduleOneDoctor.js";
import HistoryOfExaminedCases from "./System/Doctor/HistoryOfExaminedCases.js";
import ManageBookingDoctor from "./System/Doctor/Booking/ManageBookingDoctor.js";
import ManageBookingEmployee from "./System/Employee/Booking/ManageBookingEmployee.js";
import MyAccount from "./Profile/resources/MyAccount.js";
import MedicalHistory from "./Profile/resources/MedicalHistory.js";
import BookingHistory from "./Profile/resources/BookingHistory.js";

export default function Router() {
  const { isLoggedIn, userInfo, language } = useSelector((state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  }));

  return useRoutes([
    {
      path: path.HOME,
      element: <Home/>,
    },
    {
      path: path.LOGIN,
      element: <Login/>,
    },
    {
        path: path.LOG_OUT,
        element: <Logout />,
    },
    {
        path: path.SIGNUP,
        element: <Signup />,
    },
    {
        path: path.FORGOT_PASSWORD,
        element: <ForgotPassword />,
    },
    {
        path: path.RETRIEVE_PASSWORD,
        element: <RetrievePassword />,
    },
    {
        path: path.HOMEPAGE,
        element: <HomePage />,
    },
    {
        path: path.DETAIL_DOCTOR,
        element: <DetailDoctor />,
    },
    {
        path: path.DETAIL_SPECIALTY,
        element: <DetailSpecialty />,
    },
    {
        path: path.DETAIL_CLINIC,
        element: <DetailClinic />,
    },
    {
        path: path.VERIFY_EMAIL_BOOKING,
        element: <VerifyEmail />,
    },
    {
        path: path.LIST_SPECIALTY,
        element: <ListSpecialty />,
    },
    {
        path: path.LIST_MEDICAL_FACILITY,
        element: <ListMedicalFacility />,
    },
    {
        path: path.LIST_OUSTANDING_DOCTOR,
        element: <ListOutStandingDoctor />,
    },
    {
        path: "/admin-dashboard",
        element: <DashboardLayout />,
        children: [
          { path: "app", element: <DashboardApp /> },
          { path: "user", element: <UserRedux /> }, //quan ly user
          { path: "user/create", element: <CreateUser /> }, //create user
          { path: "user/edit/:userId", element: <EditUser /> }, //edit user
  
          { path: "restore-user", element: <RestoreUser /> }, //quan ly user
  
          { path: "manage-doctor", element: <ManageDoctor /> }, //quan ly bac si
          { path: "manage-doctor/edit/:doctorId", element: <EditDoctor /> }, //quan ly bac si
  
          { path: "manage-schedule", element: <ManageSchedule /> }, //quan ly ke hoach kham benh bac si
  
          { path: "manage-clinic", element: <ManageClinic /> }, //quan ly phong kham
          { path: "manage-clinic/create", element: <CreateClinic /> }, //quan ly phong kham
          { path: "manage-clinic/edit/:clinicId", element: <EditClinic /> }, //quan ly phong kham
  
  
          { path: "manage-specialty", element: <ManageSpecialty /> }, //quan ly chuyen khoa
          { path: "manage-specialty/create", element: <CreateSpecialty /> }, //quan ly phong kham
          { path: "manage-specialty/edit/:specialtyId", element: <EditSpecialty /> }, //quan ly phong kham
  
          { path: "manage-drug", element: <Drug /> }, //quan ly thuoc
          { path: "manage-drug/create", element: <CreateDrug /> }, //create thuoc
          { path: "manage-drug/edit/:drugId", element: <EditDrug /> }, //edit thuoc
  
          { path: "manage-booking", element: <ManageBooking /> }, //quan ly dat lich
  
          { path: "", element: <Navigate to={(userInfo && userInfo.roleId==="R1") ? "/admin-dashboard/app" : "/admin-dashboard/doctor"} replace={true}/> }
        ],
      },
      {
        path: "/admin-dashboard/doctor",
        element: <DashboardLayout />,
        children: [
          { path: "manage-patient", element: <ManagePatient /> }, //quan ly benh nhan
          { path: "manage-patient/:bookingId", element: <CreateRemedy /> }, //tao don thuoc
          { path: "manage-patient/create-sheet-medical-examination-result/:bookingId", element: <CreateMedicalExaminationResultSheet /> }, //tao phieu ket qua kham benh
          { path: "manage-patient/issue-medical-bill/:bookingId", element: <IssueMedicalBill /> }, //tao hoa don kham benh
          {
            path: "manage-schedule-doctor",
            element: <ManageScheduleOneDoctor />,
          }, //quan ly ke hoach kham benh chi rieng mot bac si do
          {
            path: "history-of-examined-cases",
            element: <HistoryOfExaminedCases />,
          }, //lich su cac ca da kham
          { path: "manage-booking-doctor", element: <ManageBookingDoctor /> }, 
          { path: "", element: <Navigate to="/admin-dashboard/doctor/manage-patient" replace={true}/> }
        ],
      },
      {
        path: "/admin-dashboard/employee",
        element: <DashboardLayout />,
        children: [
          { path: "manage-booking-employee", element: <ManageBookingEmployee /> }, 
          { path: "", element: <Navigate to="/admin-dashboard/employee/manage-booking-employee" replace={true}/> }
        ],
      },
    {
        path: "/user",
        element: <ProfileSetting />,
        children: [
          { path: "profile-setting", element: <MyAccount /> }, 
          { path: "medical-history", element: <MedicalHistory /> }, 
          { path: "booking-history", element: <BookingHistory /> }, 
          { path: "", element: <Navigate to="/user/profile-setting" replace={true}/> }, 
        ],
    },
  ]);
}
