// component
import Iconify from "../../components/Iconify";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const sidebarConfigEmployee = [
  {
    title: "Manage booking",
    path: "/admin-dashboard/employee/manage-booking-employee",
    icon: getIcon("medical-icon:i-inpatient"),
  },
];

export default sidebarConfigEmployee;
