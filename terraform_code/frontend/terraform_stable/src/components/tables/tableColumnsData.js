import { type } from "@testing-library/user-event/dist/type";
import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../utils/dataCenter";
function TableColumnsData(props) {
  const [valueValid, setValueValid] = useState(false);
  const dispatch = useDispatch();
  const initialvalue = useRef();
  const datas = useSelector((state) => state.datacenter.data);
  const dataType = props.datatype;

  // function valueValidation() {
  //   dispatch(
  //     actions.addColumnValue([
  //       props.id,
  //       props.obj,
  //       props.name,
  //       initialvalue.current.value,
  //     ])
  //   );
  // }
  

  function valueValidation() {
        if (dataType.slice(0, 3) == "map") {
          try {
            var obj = String(initialvalue.current.value);
            var val = obj
              .slice(1, -1)
              .replaceAll('"', "")
              .replaceAll("'", "")
              .split(",");
            const map_val = {};
            for (const i of val) {
              let key = i.split(":")[0];
              let value = i.split(":")[1];
              if (dataType == "map(string)") map_val[[key]] = String(value);
              else if (dataType == "map(any)") map_val[[key]] = String(value);
            }
            dispatch(
              actions.addColumnValue([props.id, props.obj, props.name, map_val])
            );
          } catch {
            return;
          }
        } else if (dataType == "number") {
          dispatch(
            actions.addColumnValue([
              props.id,
              props.obj,
              props.name,
              parseInt(initialvalue.current.value),
            ])
          );
        } else if (dataType == "bool") {
          if (String(initialvalue.current.value) == "true")
            dispatch(
              actions.addColumnValue([props.id, props.obj, props.name, true])
            );
          else if (String(initialvalue.current.value) == "false")
            dispatch(
              actions.addColumnValue([props.id, props.obj, props.name, false])
            );
        } else if (dataType == "list(Number)") {
          try {
            const b = String(initialvalue.current.value);
            const val = b.slice(1, -1).split(",").map(Number);
            dispatch(
              actions.addColumnValue([props.id, props.obj, props.name, val])
            );
          } catch {
            return;
          }
        } else if (initialvalue.current.value.slice(0,1)=='[') {
          try {
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
              actions.addColumnValue([props.id, props.obj, props.name, val])
            )
    console.log(b);
          } catch {
            return;
          }
        } 
    else if(initialvalue.current.value[0]==="\""){
      //console.log("inside ths ")
      const temp = initialvalue.current.value 
      const val = "\""+temp.substring(1, temp.length -1 )+"\'"
      dispatch(
        actions.addColumnValue([
          props.id,
          props.obj,
          props.name,
          val,
        ])
      );
    }
    else if (dataType == ""){

      dispatch(
            actions.addColumnValue([
              props.id,
              props.obj,
              props.name,
              initialvalue.current.value,
            ])
          );
    }
    
      }
    

  useEffect(() => {
    console.log("Use effect called");
    for (const a of datas) {
      if (a["resource"] == props.id && a["object_name"] == props.obj) {
        for (const b in a["Arguments"]) {
          if (b == props.name) {
            if(typeof(a["Arguments"][b].value)=="object")
                initialvalue.current.value = JSON.stringify(a["Arguments"][b].value);
            else
                initialvalue.current.value = a["Arguments"][b].value;
            break;
          }
        }
        break;
      }
    }
  }, []);
  return (
    <div>
      {valueValid && <p>Don't Use Special Characters</p>}
      <input
        id="input3"
        placeholder="Enter Value"
        type={"text"}
        onChange={valueValidation}
        ref={initialvalue}
      ></input>
    </div>
  );
}
export default TableColumnsData;
