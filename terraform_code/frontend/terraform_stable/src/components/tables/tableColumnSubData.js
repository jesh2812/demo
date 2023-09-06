import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../utils/dataCenter";
function TableColumnSubData(props) {
  const [valueValid, setValueValid] = useState(false);
  const initialvalue = useRef();
  const dispatch = useDispatch();
  const datas = useSelector((state) => state.datacenter.data);
  const dataType = props.datatype;
  // function valueValidation() {
  //   dispatch(
  //     actions.addColumnSubValue([
  //       props.id,
  //       props.obj,
  //       props.name,
  //       props.subName,
  //       initialvalue.current.value,
  //     ])
  //   );
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
    //       actions.addColumnSubValue([props.id, props.obj, props.name, map_val])
    //     );
    //   } catch {
    //     return;
    //   }
    // } else if (dataType == "number") {
    //   dispatch(
    //     actions.addColumnSubValue([
    //       props.id,
    //       props.obj,
    //       props.name,
    //       parseInt(initialvalue.current.value),
    //     ])
    //   );
    // } else if (dataType == "bool") {
    //   if (String(initialvalue.current.value) == "true")
    //     dispatch(
    //       actions.addColumnSubValue([props.id, props.obj, props.name, true])
    //     );
    //   else if (String(initialvalue.current.value) == "false")
    //     dispatch(
    //       actions.addColumnSubValue([props.id, props.obj, props.name, false])
    //     );
    // } else if (dataType == "list(Number)") {
    //   try {
    //     const b = String(initialvalue.current.value);
    //     const val = b.slice(1, -1).split(",").map(Number);
    //     dispatch(
    //       actions.addColumnSubValue([props.id, props.obj, props.name, val])
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
          actions.addColumnSubValue([props.id,
            props.obj,
            props.name,
            props.subName,
            val
            ])
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
    actions.addColumnSubValue([
      props.id,
        props.obj,
        props.name,
        props.subName,
        val
    ])
  );
}
else if (dataType == ""){

  dispatch(
        actions.addColumnSubValue([
          props.id,
        props.obj,
        props.name,
        props.subName,
        initialvalue.current.value,
        ])
      );
}
else{
    console.log("entered else")
}

  }
  useEffect(() => {
    for (const a of datas) {
      if (a["resource"] == props.id && a["object_name"] == props.obj) {
        for (const b in a["Arguments"]) {
          if (b == props.name) {
            for (const c in a["Arguments"][b]) {
              if (c == props.subName) {
                /*if(a["Arguments"][b][c][0]=="$"){
                                    const arr = a["Arguments"][b][c].split(".");
                                    initialvalue.current.value = arr[1].slice(0,arr[1].length-1)
        
                                }
                                else{
                                    initialvalue.current.value=a["Arguments"][b][c].value
                                }*/
                initialvalue.current.value = a["Arguments"][b][c].value;
                break;
              }
            }
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
export default TableColumnSubData;
