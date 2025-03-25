import { useRef, useState, useEffect } from "react";
import "./Specialty.scss";
import { FormattedMessage } from "react-intl";
import { getAllSpecialty } from "../../../services/userService";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-domv6";

export default function Specialty({settings}){

  const [dataSpecialty, setDataSpecialty] = useState([]);
  const [isShowLoadMore, setIsShowLoadMore] = useState(true);

  const navigate = useNavigate();

  const { isLoggedIn, userInfo, language } = useSelector((state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  }));


  useEffect(() => {
    async function fetchData() {
      let res = await getAllSpecialty({limit:4});
      if (res && res.errCode === 0) {
        if(res.length===res.data.length){
          setIsShowLoadMore(false)
        }
        setDataSpecialty(res.data ? res.data : [])
      }
    }
    fetchData();
  }, []);

  const handleViewDetailSpecialty = (item) => {
    navigate(`/detail-specialty/${item.id}`);
  };

  const handleClickSeeMoreSpecialty = () => {
    navigate(`/list-specialty`);
  };

  const handleLoadMore=async () => {
    let total=dataSpecialty.length+4;
    let res = await getAllSpecialty({limit:total});
    if (res && res.errCode === 0) {
      if(res.length===res.data.length){
        setIsShowLoadMore(false)
      }
      setDataSpecialty(res.data ? res.data : [])
    }
  }

    return (
      <div class="row">
        <div class="col-12">
          <div className="section-share section-specialty pb-30">
            <div className="section-container">
              <div className="section-header">
                <span className="title-section">
                  <FormattedMessage id="homepage.specialty-popular" />
                </span>
                <button
                  className="btn-section"
                  onClick={() => handleClickSeeMoreSpecialty()}
                >
                  <FormattedMessage id="homepage.more-infor" />
                </button>
              </div>

              <div class="row">
                {
                  dataSpecialty &&
                  dataSpecialty.length > 0 && dataSpecialty.map((item,index)=>{
                    return (
                      <div class="col-lg-3 col-auto my-10">
                          <div class="card-bs-custom pointer" onClick={() => handleViewDetailSpecialty(item)}>
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

              {isShowLoadMore===true && ( <div class="d-flex justify-content-center">
                <button type="button" class="btn btn-primary my-15" onClick={() => handleLoadMore()}>{language==="en" ? "Load more" : "Tải thêm"}</button>
              </div>) }
             
            </div>
          </div>
        </div>
      </div>
    );
}

