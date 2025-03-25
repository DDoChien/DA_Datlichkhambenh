import { useRef, useState, useEffect } from "react";

// import * as actions from "../../store/actions";

import { FormattedMessage } from "react-intl";

import { useParams, useNavigate } from "react-router-domv6";
import { useDispatch, useSelector } from "react-redux";

import { createDrug } from "../../../../../services/drugService";

import { toast } from "react-toastify";

export default function CreateDrug() {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [units, setUnits] = useState([
    { key: "pill", valueVi: "Viên", valueEn: "Pill" },
    { key: "package", valueVi: "Gói", valueEn: "Package" },
    { key: "bottle", valueVi: "Chai", valueEn: "Bottle" },
    { key: "tube", valueVi: "Ống", valueEn: "Tube" },
    { key: "set", valueVi: "Bộ", valueEn: "Set" },
  ]);
  const [listSeletedDrugs, setListSeletedDrugs] = useState([]);

  const { isLoggedIn, userInfo, language } = useSelector((state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  }));

  const dispatch = useDispatch();
  let navigate = useNavigate();

  const handleOnChangeInput = (event,type) => {
    let valueInput = event.target.value;

    switch(type) {
      case 'name':
        setName(valueInput)
        break;
      case 'unit':
        setUnit(valueInput)
        break;
      default:
    }
  };

  const handleCreateDrug = async () => {
    let res = await createDrug({ name: name, unit: unit });
    setName("");
    setUnit("");
    if (res) {
      let message =
        language === "en"
          ? "Create new drug succeed!"
          : "Thêm thuốc thành công!";
      toast.success(message);
    }
    setTimeout(function () {
      window.location.href = "/admin-dashboard/manage-drug";
    }, 1000);
  };

  const handleGetValueUnit = (unitKey) => {
    let finded = units.find((item) => item.key == unitKey);
    if (finded) {
      if (language == "vi") return finded.valueVi;
      else return finded.valueEn;
    }
  };

  const handleOnchangeUnitDrug=(event, drugId)=>{
    let temp = [...this.state.listSeletedDrugs];

    temp.map((drug)=>{
      if(drug.id == drugId){
          drug.unit=event.target.value
      }

      return drug;
    })

    this.setState({
      listSeletedDrugs: temp
    })

    console.log(this.state.listSeletedDrugs)
  }

  return (
    <div>
      <div className="title mb-60">
        <FormattedMessage id={"admin.manage-drug.create-drugs"} />
      </div>

      <div class="row">
        <div class="col-6">
          <div class="form-group">
            <label for="exampleInputEmail1">
              <FormattedMessage id={"admin.manage-drug.name-drug"} />
            </label>
            <input
              type="text"
              value={name}
              class="form-control"
              id="name"
              onChange={(event) => handleOnChangeInput(event,'name')}
            />
          </div>
          <div class="form-group">
            <label for="exampleInputEmail1">
              <FormattedMessage id={"admin.manage-drug.unit-drug"} />
            </label>
            {
                <select class="form-control" onChange={(event)=>handleOnChangeInput(event,'unit')} value={unit}>
                  <option value="chooseUnits">{language==="vi" ? 'Chọn đơn vị' : 'Choose units'}</option>
                  {
                    language==="vi" ? units.map((unit)=>{
                      return(<option value={unit.key}>{unit.valueVi}</option>)
                    }) : units.map((unit)=>{
                      return(<option value={unit.key}>{unit.valueEn}</option>)
                    })
                  }
                </select>
            }
          </div>
          <button
            type="submit"
            class="btn btn-primary"
            onClick={() => handleCreateDrug()}
          >
            <FormattedMessage id={"admin.manage-drug.create"} />
          </button>
        </div>
      </div>

      <div class="row">
        <div class="col-6"></div>
      </div>
    </div>
  );
}
