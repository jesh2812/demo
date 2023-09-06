import React, { useState } from "react";
import {useDispatch,useSelector} from 'react-redux';
import TableColumnsData from "./tableColumnsData";
import {actions} from '../utils/dataCenter';
import DatalistInput from 'react-datalist-input';

function NewTableRow(props){
    const [val,setVal] = useState();
    const [add,setSelectingAdd] = useState();
    const dispatch=useDispatch();
    const deleteList1=useSelector(state=>state.datacenter.deleteList[props.data[2]]);
    const hide=useSelector(state=>state.datacenter.hiding);
    let hideStatus=false;

    return(
        <div id="tablediv">
            <input id="checkBox" checked type={'checkbox'}></input>
            {<td className={props.id} id="td1-variable">
                <div className="wrapper1">
                    <td>
                        <DatalistInput
                        placeholder="Add Arguments"
                        value={val}
                        setValue={setVal}
                        className="datalist"
                        onSelect={(item) => {setSelectingAdd(false)}}
                        items={props.optionalArgs}
                        />
                    </td>
                    
                </div>
                
                </td>} 
            <td className={props.id} id="td1-variable">
            </td>
            {<td className={props.id} id="td2-variable"><input id="checkBox" checked type={'checkbox'} ></input></td>}
            {<td className={props.id} id="td2-variable"><input id="checkBox" type={'checkbox'} ></input></td>}    
        </div>
    )
}
export default NewTableRow;