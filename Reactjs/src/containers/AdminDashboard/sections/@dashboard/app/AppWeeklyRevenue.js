// material
import { alpha, styled } from "@mui/material/styles";
import { Card, Typography } from "@mui/material";
// utils
import { fShortenNumber } from "../../../utils/formatNumber";
// component
import Iconify from "../../../components/Iconify";
import React, { useState, useEffect } from "react";
import { getWeeklyRevenue } from "../../../../../services/userService";
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from "react-redux";

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: "none",
  textAlign: "center",
  padding: theme.spacing(5, 0),
  color: theme.palette.primary.darker,
  backgroundColor: theme.palette.primary.lighter,
}));

const IconWrapperStyle = styled("div")(({ theme }) => ({
  margin: "auto",
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: "center",
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(
    theme.palette.primary.dark,
    0
  )} 0%, ${alpha(theme.palette.primary.dark, 0.24)} 100%)`,
}));

// ----------------------------------------------------------------------

const TOTAL = 714000;

const AppWeeklyRevenue = () => {
  const [totalWeeklyRevenue, setTotalWeeklyRevenue] = useState(0);

  const { isLoggedIn, userInfo, language } = useSelector((state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  }));


  useEffect(() => {
    let fetchTotalWeeklyRevenue = async () => {
      let res = await getWeeklyRevenue();
      if (res && res.errCode === 0) {
        let total = res.data.totalWeeklyRevenue;
        if (total) {
          setTotalWeeklyRevenue(total);
        }
      }
    };
    fetchTotalWeeklyRevenue();
  }, []);

  const convertToCurrency = (value,currency)=>{
    if(currency==="USD"){
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });
      return formatter.format(value);
    }
    else
      return value.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
  }

  return (
    <RootStyle>
      <IconWrapperStyle>
        <Iconify
          icon="flat-color-icons:sales-performance"
          width={24}
          height={24}
        />
      </IconWrapperStyle>
      <Typography variant="h3">
        {language==="vi" ? convertToCurrency(totalWeeklyRevenue,"") : convertToCurrency(totalWeeklyRevenue/23,"VND")}
      </Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
          <FormattedMessage id={"admin-dashboard.dashboard.weekly-revenue"} />
      </Typography>
    </RootStyle>
  );
};
export default AppWeeklyRevenue;
