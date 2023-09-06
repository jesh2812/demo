import React,{useRef,useEffect,useState} from "react";
import {useDispatch,useSelector} from 'react-redux'
import { actions } from "../utils/dataCenter";
function TableColumnSubChildData(props){
    const [valueValid,setValueValid]=useState(false);
    const initialvalue=useRef();
    const dispatch=useDispatch();
    const datas=useSelector(state=>state.datacenter.data);
    const dataType = props.datatype;
    
    // function valueValidation(){
    //     if(dataType.slice(0,3)=="map"){
    //         try{
    //             var obj = String(initialvalue.current.value);
    //             var val = obj.slice(1,-1).replaceAll('"','').replaceAll("'","").split(",");
    //             const map_val = {};
    //             for(const i of val){
    //                 let key = i.split(":")[0]
    //                 let value = i.split(":")[1]
    //                 if(dataType=='map(string)')
    //                     map_val[[key]] = String(value);
    //                 else if(dataType=='map(any)')
    //                     map_val[[key]] = String(value);
    //             }
    //             dispatch(actions.addColumnSubChildValue([props.id,props.obj,props.name,props.subName,map_val,props.level_1_parent]))
    //         }
    //         catch{
    //             return;
    //         }
    //     }

    //     else if(dataType=="number"){
    //         dispatch(actions.addColumnSubChildValue([props.id,props.obj,props.name,props.subName,parseInt(initialvalue.current.value),props.level_1_parent]))
    //     }
    //     else if(dataType=="bool"){
    //         if(String(initialvalue.current.value)=='true')
    //             dispatch(actions.addColumnSubChildValue([props.id,props.obj,props.name,props.subName,true,props.level_1_parent]))
    //         else if(String(initialvalue.current.value)=='false')
    //             dispatch(actions.addColumnSubChildValue([props.id,props.obj,props.name,props.subName,false,props.level_1_parent]))
    //     }
    //     else if(dataType=='list(string)'){

    //         try{
    //             const b = String(initialvalue.current.value).replaceAll("'",'').replaceAll('"','');
    //             const val = b.slice(1,-1).split(",")//.map(String);
    //             dispatch(actions.addColumnSubChildValue([props.id,props.obj,props.name,props.subName,val,props.level_1_parent]))
    //         }
    //         catch{
    //             return;
    //         }
    //     }
    //     else if(dataType=='list(Number)'){
    //         try{
    //             const b = String(initialvalue.current.value);
    //             const val = b.slice(1,-1).map(Number);
    //             dispatch(actions.addColumnSubChildValue([props.id,props.obj,props.name,props.subName,val,props.level_1_parent]))
    //         }
    //         catch{
    //             return;
    //         }   
    //     }
    //     else{
    //         dispatch(actions.addColumnSubChildValue([props.id,props.obj,props.name,props.subName,initialvalue.current.value,props.level_1_parent]))
    //     }
    // }

    function valueValidation() {
        console.log(initialvalue.current.value)
        // if (dataType.slice(0, 3) == "map") {
        //   try {
        //     var obj = String(initialvalue.current.value);
        //     var val = obj
        //       .slice(1, -1)
        //       .replaceAll('"', "")
        //       .replaceAll("'", "")
        //       .split(",");
        //     const map_val = {};
        //     for (const i of val) {
        //       let key = i.split(":")[0];
        //       let value = i.split(":")[1];
        //       if (dataType == "map(string)") map_val[[key]] = String(value);
        //       else if (dataType == "map(any)") map_val[[key]] = String(value);
        //     }
        //     dispatch(
        //       actions.addColumnSubChildValue([props.id, props.obj, props.name, map_val])
        //     );
        //   } catch {
        //     return;
        //   }
        // } else if (dataType == "number") {
        //   dispatch(
        //     actions.addColumnSubChildValue([
        //       props.id,
        //       props.obj,
        //       props.name,
        //       parseInt(initialvalue.current.value),
        //     ])
        //   );
        // } else if (dataType == "bool") {
        //   if (String(initialvalue.current.value) == "true")
        //     dispatch(
        //       actions.addColumnSubChildValue([props.id, props.obj, props.name, true])
        //     );
        //   else if (String(initialvalue.current.value) == "false")
        //     dispatch(
        //       actions.addColumnSubChildValue([props.id, props.obj, props.name, false])
        //     );
        // } else if (dataType == "list(Number)") {
        //   try {
        //     const b = String(initialvalue.current.value);
        //     const val = b.slice(1, -1).split(",").map(Number);
        //     dispatch(
        //       actions.addColumnSubChildValue([props.id, props.obj, props.name, val])
        //     );
        //   } catch {
        //     return;
        //   }
        // } 
        if (initialvalue.current.value.slice(0,1)=='[') {
          try {
            console.log("entered loop")
            const a = initialvalue.current.value.length
            const b = String(initialvalue.current.value.slice(1,a-1));
            //const val = b.slice(1, -1).split(",").map(Number);
            // const val = b.split(",").replace(/\s/g, "")
            const res = b.split(",")
            let val = [];
             for (let i = 0; i < res.length; i++){
               val.push(res[i].substring(1, res[i].length - 1))
             }
            dispatch(
              actions.addColumnSubChildValue([props.id,props.obj,props.name,props.subName,val,props.level_1_parent])
            )
    console.log(b);
          } catch {
            return;
          }
        } 
    else if(initialvalue.current.value[0]==="\""){
      console.log("inside ths ")
      const temp = initialvalue.current.value 
      const val = "\""+temp.substring(1, temp.length -1 )+"\'"
      dispatch(
        actions.addColumnSubChildValue([
            props.id,props.obj,props.name,props.subName,val,props.level_1_parent
        ])
      );
    }
    else if (dataType == ""){
      console.log("entered child loop")
      dispatch(
            actions.addColumnSubChildValue([
                props.id,props.obj,props.name,props.subName,initialvalue.current.value,props.level_1_parent
            ])
          );
    }
    else if(initialvalue.current.value){
      console.log("entered ch loop")
      dispatch(
        actions.addColumnSubChildValue([
            props.id,props.obj,props.name,props.subName,initialvalue.current.value,props.level_2_parent
        ])
      );
    }
    // else{
    //     console.log("entered else")
    // }
    
      }
    
    useEffect(()=>{
        for(const a of datas){
            if(a["resource"]==props.id&&a["object_name"]==props.obj){
                for(const b in a['Arguments']){
                    if(b==props.level_1_parent){
                        for(const c in a['Arguments'][b]){
                            if(c==props.name){
                                for(const d in a['Arguments'][b][c]){
                                    if(d==props.subName){
                                        initialvalue.current.value=a["Arguments"][b][c][d].value
                                        break;
                                    }
                                }
                            }
                        }
                        break;
                    }
                }
                break;
            }
        }
    },[])
    
    return(
        <div>
            {valueValid&&<p>Don't Use Special Characters</p>}
            <input id='input3' placeholder="Enter Value" type={'text'} onChange={valueValidation} ref={initialvalue}></input>
        </div>
    )
}
export default TableColumnSubChildData;