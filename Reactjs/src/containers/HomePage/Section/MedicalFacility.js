import { useRef, useState, useEffect } from "react";

import "./MedicalFacility.scss";

import { FormattedMessage } from "react-intl";
import { getAllClinic } from "../../../services/userService";

import { useNavigate } from "react-router-domv6";
import { useDispatch, useSelector } from "react-redux";

export default function MedicalFacility(){

  const [dataClinics, setDataClinics] = useState([]);
  const [isShowLoadMore, setIsShowLoadMore] = useState(true);

  const navigate = useNavigate();

  const { isLoggedIn, userInfo, language } = useSelector((state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  }));

  useEffect(() => {
    async function fetchData() {
      let res = await getAllClinic({limit:4});
      if (res && res.data) {
        if(res.length===res.data.length){
          setIsShowLoadMore(false)
        }
        
        setDataClinics(res.data ? res.data : [])
      }
    }
    fetchData();
  }, []);

  const handleViewDetailClinic = (clinic) => {
    navigate(`/detail-clinic/${clinic.id}`);
  };

  const handleSeeMoreMedicalFacility = () => {
    navigate(`/list-medical-facility`);
  };

  const handleLoadMore= async () => {
    let total=dataClinics.length+4;
    let res = await getAllClinic({limit:total});
    if (res && res.errCode === 0) {
      if(res.length===res.data.length){
        setIsShowLoadMore(false)
      }

      setDataClinics(res.data ? res.data : [])
    }
  }

    return (
      <div class="row">
        <div class="col-12">
          <div className="section-share section-medical-facility pb-30">
            <div className="section-container">
              <div className="section-header">
                <span className="title-section"><FormattedMessage id="homepage.outstanding-medical-facility" /></span>
                <button
                  className="btn-section"
                  onClick={() => handleSeeMoreMedicalFacility()}
                >
                    <FormattedMessage id="homepage.more-infor" />
                </button>
              </div>

              <div class="row">
                {
                  dataClinics &&
                  dataClinics.length > 0 && dataClinics.map((item,index)=>{
                    return (
                      <div class="col-lg-3 col-auto my-10">
                          <div class="card-bs-custom pointer" onClick={() => handleViewDetailClinic(item)}>
                            <figure class="bg-cover bg-center" 
                              style={{
                                      backgroundImage: `url(${item.image})`,
                              }}></figure>
                              <div class="card-body">
                                  <h3 class="mb-5 font-weight-normal pointer specialty-name fs-15" >{item.name}</h3>
                              </div>
                          </div>
                      </div>
                    );
                  })
                }
              </div>

              { isShowLoadMore===true && (   <div class="d-flex justify-content-center">
                <button type="button" class="btn btn-primary my-15" onClick={() => handleLoadMore()}>{language==="en" ? "Load more" : "Tải thêm"}</button>
              </div>)}
            </div>
          </div>
        </div>
      </div>
    );
}



