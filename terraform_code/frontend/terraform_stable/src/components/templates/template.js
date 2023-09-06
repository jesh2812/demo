import React, { useEffect,Suspense, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {Route } from 'react-router-dom';
import New_Template from './New_Template';
import Existing_Template from './Existing_Template';

import {useLocation} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {actions} from '../utils/dataCenter';
const EditTemplate = React.lazy(() => import("./EditTemplate"));
function Templates(){
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const location=useLocation();


    /* function changePage(page){
        let listItems = document.getElementsByTagName('a');
        var length = listItems.length;
        for (var i = 0; i < length; i++) {
          listItems[i].className = listItems[i].id== page ? "active" : "";
        }
      }
    useEffect(()=>{changePage('link1');history.push('/templates/existingTemplate');dispatch(actions.deleteAll())},[]); */
    return(
        <div>
            
        </div>
    )
}
export default Templates;