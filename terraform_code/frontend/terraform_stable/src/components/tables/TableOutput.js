import React from "react";
import {useDispatch,useSelector} from 'react-redux';
import TableColumnsData from "./tableColumnsData";
import {actions} from '../utils/dataCenter';
import { Grid, GridItem } from '@chakra-ui/react'

function TableOutput(props){
    const a=props.a;
    const t=props.t;
    const dispatch=useDispatch();
    const deleteList1=useSelector(state=>state.datacenter.attrDeleteList[props.data[2]]);
    const hide=useSelector(state=>state.datacenter.hiding);
    let hideStatus=false;

    for(const b of hide){
        if(b['object_name']==props.data[2]){
            hideStatus=b['Arguments'][a.Attribute_Name]
        }
    }
    function setHiding(){
        dispatch(actions.addHideValue([props.data[1],props.data[2],a.Attribute_Name]))
    }

    return(
        <GridItem w='100%'>
                <div className="grid-item">
                    {deleteList1.includes(a.Attribute_Name)&&<input id="checkBox" className="input-check" checked type={'checkbox'} onClick={()=>{props.addToAttributeDelete(a.Attribute_Name)}} ></input>}
                    {!deleteList1.includes(a.Attribute_Name)&&<input id="checkBox" className="input-check" type={'checkbox'} onClick={()=>{props.addToAttributeDelete(a.Attribute_Name)}} ></input>}
                    
                    {a.Attribute_Optional!='False'&&
                        <div className="wrapper1">
                                <p>{a.Attribute_Name} <span id="desc-span"></span></p>
                                <div class="icon info">
                                    <div class="tooltip">
                                        {a.Attribute_Description}
                                    </div>
                                    <span><i class="fa-solid fa-circle-info"></i></span>
                                </div>
                            </div>
                        }

                        {a.Attribute_Optional=='False'&&
                                <div className="wrapper1">
                                    <p>{a.Attribute_Name} *</p>
                                    <div class="icon info">
                                        <div class="tooltip">
                                            {a.Attribute_Description}
                                        </div>
                                        <span><i class="fa-solid fa-circle-info"></i></span>
                                    </div>
                                </div>
                            } 
                </div>
        </GridItem>
        
    )
}
export default TableOutput;