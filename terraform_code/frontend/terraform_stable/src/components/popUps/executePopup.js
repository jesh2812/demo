import React,{useState,useRef, useEffect} from "react";
import ReactDom from 'react-dom';
import {useSelector,useDispatch} from 'react-redux';
import { actions } from "../utils/dataCenter";
import ExecutPopUpComponent from "./exectePopUpComponet";
import ExecutPopUpChildComponent from "./executePopupChildComponent";
function ExecutPopUp(props){
    let content=[];
    const [expand,setExpand]=useState(false);
    for(const a of props.comp){
        if(a[1]==-1){
            content.push(<ExecutPopUpComponent res={props.res} obj={props.obj} name={a[0]}/>)
        }
        else{
            content.push(<ExecutPopUpChildComponent res={props.res} obj={props.obj} name={a[0]} subName={a[1]}/>)
        }
    }
    return(
        <div>
            {expand&&<label onClick={()=>{setExpand(false)}}>⏷ {props.res} - {props.obj}</label>}
            {!expand&&<label onClick={()=>{setExpand(true)}}>⏶ {props.res} - {props.obj}</label>}
            {!expand&&<div>{content}</div>}
        </div>
    )
}
export default ExecutPopUp;