// component
import Iconify from "../../components/Iconify";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const sidebarConfigDoctor = [
  {
    title: "Manage Doctor's patient",
    path: "/admin-dashboard/doctor/manage-patient",
    icon: getIcon("medical-icon:i-inpatient"),
  },
  {
    title: "Manage Doctor's schedule",
    path: "/admin-dashboard/doctor/manage-schedule-doctor",
    icon: getIcon("healthicons:i-schedule-school-date-time"),
  },
  {
    title: "History of examined cases",
    path: "/admin-dashboard/doctor/history-of-examined-cases",
    icon: getIcon("material-symbols:history"),
  },
  {
    title: "Manage booking",
    path: "/admin-dashboard/doctor/manage-booking-doctor",
    icon: getIcon("medical-icon:i-inpatient"),
  },
];

export default sidebarConfigDoctor;
