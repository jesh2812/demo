import React,{useState,useRef, useEffect} from "react";
import ReactDom from 'react-dom';
import {useSelector,useDispatch} from 'react-redux';
import { actions } from "../utils/dataCenter";

function ExecutPopUpComponent(props){
    const input=useRef();
    const dispatch=useDispatch();
    const [isInputValid,setInputValid]=useState(false);
    function inputValidation(){
        dispatch(actions.addColumnValue([props.res,props.obj,props.name,input.current.value]))
    }
    return(
        <div>
            <label>{props.name}</label>
            <input type={'text'} placeholder={'Enter Value'} ref={input} onChange={inputValidation}></input>
            {isInputValid&&<p>Don't Use Any Special Characters</p>}
        </div>
    )
}
export default ExecutPopUpComponent;