import { useRef, useState, useEffect } from "react";

import { FormattedMessage } from "react-intl";
import * as actions from "../../../store/actions";
import { LANGUAGES } from "../../../utils";
import { getTopDoctorHomeService } from "../../../services/userService";
import { useNavigate } from "react-router-domv6";
import { useDispatch, useSelector } from "react-redux";


export default function OutStandingDoctor({settings}){

  const [arrDoctors, setArrDoctors] = useState([]);
  const [isShowLoadMore, setIsShowLoadMore] = useState(true);

  const navigate = useNavigate();

  const { isLoggedIn, userInfo, language } = useSelector((state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  }));

  useEffect(() => {
    async function fetchData() {
      let res = await getTopDoctorHomeService({limit:4});
      if (res && res.data) {
        if(res.length===res.data.length){
          setIsShowLoadMore(false)
        }
        setArrDoctors(res.data ? res.data : [])
      } 
    }

    fetchData();
  }, []);

  const handleViewDetailDoctor = (doctor) => {
    navigate(`/detail-doctor/${doctor.id}`);
  };

  const handleOnClickSeeMoreDoctor = () => {
    navigate(`/list-oustanding-doctor`);
  };

  const handleLoadMore=async () => {
    let total=arrDoctors.length+4;
    let res = await getTopDoctorHomeService({limit:total});

    if (res && res.errCode === 0) {
      if(res.length===res.data.length){
        setIsShowLoadMore(false)
      }
      setArrDoctors(res.data ? res.data : [])
    }
  }
    return (
      <div className="section-share section-outstanding-doctor pb-30">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">
              <FormattedMessage id="homepage.outstanding-doctor" />
            </span>
            <button
              className="btn-section"
              onClick={() => handleOnClickSeeMoreDoctor()}
            >
              <FormattedMessage id="homepage.more-infor" />
            </button>
          </div>

          <div className="row">
                {
                  arrDoctors &&
                  arrDoctors.length > 0 && arrDoctors.map((item,index)=>{
                    let imageBase64 = "";
                    if (item.image) {
                      imageBase64 = new Buffer(item.image, "base64").toString(
                        "binary"
                      );
                    }
                    let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`;
                    let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;
                    return (
                      <div className="col-lg-3 col-auto my-10">
                          <div className="card-bs-custom pointer" onClick={() => handleViewDetailDoctor(item)}>
                            <figure className="bg-cover bg-center" 
                              style={{
                                      backgroundImage: `url(${imageBase64})`,
                              }}></figure>
                              <div className="card-body">
                                  <h3 className="mb-5 font-weight-normal pointer specialty-name fs-15" >{language === LANGUAGES.VI ? nameVi : nameEn}</h3>
                                  <div className="fs-15">
                                    {item.Doctor_Infor &&
                                    item.Doctor_Infor.specialtyData &&
                                    item.Doctor_Infor.specialtyData.name
                                      ? item.Doctor_Infor.specialtyData.name
                                      : ""}
                                  </div>
                              </div>
                          </div>
                      </div>
                    );
                  })
                }
              </div>
              {isShowLoadMore===true && (<div className="d-flex justify-content-center">
                <button type="button" className="btn btn-primary my-15" onClick={() => handleLoadMore()}>{language=="en" ? "Load more" : "Tải thêm"}</button>
              </div>)}
        </div>
      </div>
    );
}




