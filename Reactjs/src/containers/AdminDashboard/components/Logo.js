import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-domv6";
// material
import { Box } from "@mui/material";
import { useNavigate } from "react-router-domv6";
import "./Logo.scss";

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object,
};

export default function Logo({ sx }) {
  const navigate = useNavigate();

  return (
    <div class="pointer logo-avatar" style={{width:"48px",height:"48px"}} onClick={()=> navigate("/home")}></div>
  );
}
