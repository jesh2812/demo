import React,{useState} from "react";
import {useDispatch,useSelector} from 'react-redux';
import TableColumnSubChildData from "./tableColumnSubChildData";
import {actions} from '../utils/dataCenter';
function TableRowHasChild2(props){
    const a=props.a;
    const deleteList1=useSelector(state=>state.datacenter.deleteList[props.data[2]]);
    const dispatch=useDispatch();
    const [expandingList,setExpandingList]=useState(false);
    const hide=useSelector(state=>state.datacenter.hiding);
    
    const data=useSelector(state=>state.datacenter.data);
    let hideStatus={}

    {/*for(const i in hide){
        if(hide[i].object_name==props.data[2]){
            for(const sub_arg in hide[i]['Arguments'][props.level_1_parent][a.Argument_Name]){
                hideStatus[sub_arg]=hide[i]['Arguments'][props.level_1_parent][a.Argument_Name][sub_arg];
            }
        }
    }*/}
    

    let content=[];
    if(expandingList==false){
        content=[<tr>
            {deleteList1.includes(a.Argument_Name)&&<td id="td1"><input id="checkBox" checked type={'checkbox'} onClick={()=>{props.addToDelete(a.Argument_Name)}} ></input></td>}
            {!deleteList1.includes(a.Argument_Name)&&<td id="td1"><input id="checkBox" type={'checkbox'} onClick={()=>{props.addToDelete(a.Argument_Name)}} ></input></td>}
            {a.Argument_Optional=='False'&&<td className="level-2-child" onClick={()=>{setExpandingList(true)}} >&#11166; {` ${a.Argument_Name} *`}</td> } 
            {a.Argument_Optional!='False'&&<td className="level-2-child" onClick={()=>{setExpandingList(true)}} >&#11166; {` ${a.Argument_Name}`}</td> } 
            <td></td>
            <td></td>
        </tr>]
    }
    else{
        content.push(
            <tr>
                {deleteList1.includes(a.Argument_Name)&&<td id="td1"><input id="checkBox" checked type={'checkbox'} onClick={()=>{props.addToDelete(a.Argument_Name)}} ></input></td>}
                {!deleteList1.includes(a.Argument_Name)&&<td id="td1"><input id="checkBox" type={'checkbox'} onClick={()=>{props.addToDelete(a.Argument_Name)}} ></input></td>}
                {a.Argument_Optional=='False'&&<td className="level-2-child" onClick={()=>{setExpandingList(false)}}>&#11167; {` ${a.Argument_Name} *`}</td>}
                {a.Argument_Optional!='False'&&<td className="level-2-child" onClick={()=>{setExpandingList(false)}}>&#11167; {` ${a.Argument_Name}`}</td>}
                <td></td>
                <td></td>
            </tr>
        )
            if(props.Child_Arguments!=undefined){
                for(const b of props.Child_Arguments) {
                    if(!Object.keys(props.children_of_child).includes(b.Argument_Name)){
                        content.push(
                            <tr>
                                {deleteList1.includes([a.Argument_Name,b.Argument_Name])&&<td id="td1"><input id="checkBox" checked type={'checkbox'} onClick={()=>{props.addToDelete([a.Argument_Name,b.Argument_Name])}}></input></td>}
                                {!deleteList1.includes([a.Argument_Name,b.Argument_Name])&&<td id="td1"><input id="checkBox" type={'checkbox'} onClick={()=>{props.addToDelete([a.Argument_Name,b.Argument_Name])}}></input></td>}
                                {b.Argument_Optional=='False'&&<td className="level-3-child">&#8226; {` ${b.Argument_Name} *`}</td>}
                                {b.Argument_Optional!='False'&&<td className="level-3-child">&#8226; {` ${b.Argument_Name}`}</td>}
                                {hideStatus[b.Argument_Name]&&<td><input id="checkBox" type={'checkbox'} onClick={()=>{dispatch(actions.addHideSubChildValue([props.data[1],props.data[2],a.Argument_Name,b.Argument_Name,props.level_1_parent]))}} checked></input></td>}
                                {!hideStatus[b.Argument_Name]&&<td><input id="checkBox" type={'checkbox'} onClick={()=>{dispatch(actions.addHideSubChildValue([props.data[1],props.data[2],a.Argument_Name,b.Argument_Name,props.level_1_parent]))}} ></input></td>}    
                                
                                {<td><TableColumnSubChildData  id={props.data[1]} obj={props.data[2]} level_1_parent={props.level_1_parent} name={a.Argument_Name} subName={b.Argument_Name} data={a.Argument_Default_Value}/></td>}
                            </tr>
                        )
                    }
                    
                }
            }
        }
    return(
        <div id="tablediv">
            {content}
        </div>
    )
}

export default TableRowHasChild2;