import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import "./DoctorExtraInfor.scss";
import { LANGUAGES } from "../../../utils";
import { getExtraInforDoctorById } from "../../../services/userService";
import { FormattedMessage } from "react-intl";
import NumberFormat from "react-number-format";

export default function DoctorExtraInfor(props) {
  const [isShowDetailInfor, setIsShowDetailInfor] = useState(false);
  const [extraInfor, setExtraInfor] = useState({});
  const prevProps = useRef({}); // Lưu trữ giá trị props trước đó

  const { language } = useSelector((state) => ({
    language: state.app.language,
  }));

  // useEffect để xử lý logic khi props thay đổi
  useEffect(() => {
    async function fetchExtraInfor() {
      if (
        props.doctorIdFromParent &&
        props.doctorIdFromParent !== prevProps.current.doctorIdFromParent
      ) {
        const res = await getExtraInforDoctorById(props.doctorIdFromParent);
        if (res && res.errCode === 0) {
          setExtraInfor(res.data);
        }
      }
      prevProps.current = props; // Cập nhật giá trị props hiện tại
    }

    fetchExtraInfor();
  }, [props.doctorIdFromParent]);

  const showHideDetailInfor = (status) => {
    setIsShowDetailInfor(status);
  };

  return (
    <div className="doctor-extra-infor-container">
      <div className="content-up">
        <div className="text-address">
          <FormattedMessage id="patient.extra-infor-doctor.text-address" />
        </div>
        <div className="name-clinic">
          {extraInfor && extraInfor.nameClinic ? extraInfor.nameClinic : ""}
        </div>
        <div className="detail-address">
          {extraInfor && extraInfor.addressClinic
            ? extraInfor.addressClinic
            : ""}
        </div>
      </div>
      <div className="content-down">
        {isShowDetailInfor === false && (
          <div className="short-infor">
            <FormattedMessage id="patient.extra-infor-doctor.price" />
            {extraInfor &&
              extraInfor.priceTypeData &&
              language === LANGUAGES.VI && (
                <NumberFormat
                  className="currency"
                  value={extraInfor.priceTypeData.valueVi}
                  displayType={"text"}
                  thousandSeparator={true}
                  suffix={" VND"}
                />
              )}
            {extraInfor &&
              extraInfor.priceTypeData &&
              language === LANGUAGES.EN && (
                <NumberFormat
                  className="currency"
                  value={extraInfor.priceTypeData.valueEn}
                  displayType={"text"}
                  thousandSeparator={true}
                  suffix={" $"}
                />
              )}
            <span
              className="detail"
              onClick={() => showHideDetailInfor(true)}
            >
              <FormattedMessage id="patient.extra-infor-doctor.detail" />
            </span>
          </div>
        )}
        {isShowDetailInfor === true && (
          <>
            <div className="title-price">
              <FormattedMessage id="patient.extra-infor-doctor.price" />
            </div>
            <div className="detail-infor">
              <div className="price">
                <span className="left">
                  <FormattedMessage id="patient.extra-infor-doctor.price" />
                </span>
                <span className="right">
                  {extraInfor &&
                    extraInfor.priceTypeData &&
                    language === LANGUAGES.VI && (
                      <NumberFormat
                        className="currency"
                        value={extraInfor.priceTypeData.valueVi}
                        displayType={"text"}
                        thousandSeparator={true}
                        suffix={" VND"}
                      />
                    )}
                  {extraInfor &&
                    extraInfor.priceTypeData &&
                    language === LANGUAGES.EN && (
                      <NumberFormat
                        className="currency"
                        value={extraInfor.priceTypeData.valueEn}
                        displayType={"text"}
                        thousandSeparator={true}
                        suffix={" $"}
                      />
                    )}
                </span>
              </div>
              <div className="note">
                {extraInfor && extraInfor.note ? extraInfor.note : ""}
              </div>
            </div>
            <div className="payment">
              <FormattedMessage id="patient.extra-infor-doctor.payment" />
              {extraInfor &&
              extraInfor.paymentTypeData &&
              language === LANGUAGES.VI
                ? extraInfor.paymentTypeData.valueVi
                : ""}
              {extraInfor &&
              extraInfor.paymentTypeData &&
              language === LANGUAGES.EN
                ? extraInfor.paymentTypeData.valueEn
                : ""}
            </div>
            <div className="hide-price">
              <span onClick={() => showHideDetailInfor(false)}>
                <FormattedMessage id="patient.extra-infor-doctor.hide-price" />
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
