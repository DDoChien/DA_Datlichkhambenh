import { useRef, useState, useEffect } from "react";

// import * as actions from "../../store/actions";

import { FormattedMessage } from "react-intl";

import { useParams, useNavigate   } from "react-router-domv6";
import { useDispatch, useSelector } from "react-redux";

import {
    getDrugInfoById,
    editDrug
} from "../../../../../services/drugService";

  import { toast } from "react-toastify";

export default function EditDrug(){
    const [name, setName] = useState("");
    const [unit, setUnit] = useState("");
    const [units, setUnits] = useState([
        { key: "pill", valueVi: "Viên", valueEn: "Pill" },
        { key: "package", valueVi: "Gói", valueEn: "Package" },
        { key: "bottle", valueVi: "Chai", valueEn: "Bottle" },
        { key: "tube", valueVi: "Ống", valueEn: "Tube" },
        { key: "set", valueVi: "Bộ", valueEn: "Set" },
      ]);
    const dispatch = useDispatch();
    let navigate = useNavigate();

    let { drugId } = useParams();

    const { isLoggedIn, userInfo, language } = useSelector((state) => ({
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language,
      }));
    
      useEffect(async () => {
            await initializeDrugInfo(drugId)
      }, []);

    const initializeDrugInfo=async ()=>{
        let res = await getDrugInfoById(drugId)
        console.log("res",res)
        if(res){
            setName(res.name)
            setUnit(res.unit)
        }
    }


    const handleOnChangeInput = (event,input) => {
        let valueInput = event.target.value;
        switch(input) {
          case 'name':
            setName(valueInput);
            break;
          case 'unit':
            setUnit(valueInput);            break;
          default:
            // code block
        }
    };

    const handleEditDrug = async ()=>{
        let res = await editDrug({id:drugId, name:name, unit:unit})

        if(res){
            let message = language==="en" ? "Update new drug succeed!" : "Cập nhật thuốc thành công!"
            toast.success(message);
        }

        setTimeout(function(){ window.location.href = '/admin-dashboard/manage-drug'; }, 1000);
    }

    return (
      <div>
            <div className="title mb-60">
                 <FormattedMessage id={"admin.manage-drug.edit-drug"} />
            </div>

            <div class="row">
                <div class="col-6">
                    <div class="form-group">
                        <label for="exampleInputEmail1"> <FormattedMessage id={"admin.manage-drug.name-drug"} /></label>
                        <input type="text" value={name} class="form-control" id="name" placeholder="Enter name drug" 
                         onChange={(event) =>
                            handleOnChangeInput(event,'name')
                          }
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
                    <button type="submit" class="btn btn-primary" onClick={()=>handleEditDrug()}><FormattedMessage id={"admin.manage-drug.update"} /></button>
                </div>
            </div>

            <div class="row">
                <div class="col-6"></div>
            </div>

            
      </div>
    );
}

