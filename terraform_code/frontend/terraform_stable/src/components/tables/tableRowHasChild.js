import React, { useState } from "react";
import { createDispatchHook, useDispatch, useSelector } from "react-redux";
import TableColumnSubData from "./tableColumnSubData";
import { actions } from "../utils/dataCenter";
import TableRowHasChild1 from "./tableRowHasChild1";
import { Switch } from "@chakra-ui/react";

function TableRowHasChild(props) {
  const a = props.a;
  const deleteList1 = useSelector(
    (state) => state.datacenter.deleteList[props.data[2]]
  );
  const dispatch = useDispatch();
  const [expandingList, setExpandingList] = useState(false);
  const hide = useSelector((state) => state.datacenter.hiding);
  const data = useSelector((state) => state.datacenter.data);
  let hideStatus = {};

  for (const i in hide) {
    if (hide[i].object_name == props.data[2]) {
      for (const sub_arg in hide[i]["Arguments"][a.Argument_Name]) {
        hideStatus[sub_arg] = hide[i]["Arguments"][a.Argument_Name][sub_arg];
      }
    }
  }

  let content = [];
  if (expandingList == false) {
    content = [
      <tr>
        {deleteList1.includes(a.Argument_Name) && (
          <td id="td1">
            <input
              id="checkBox"
              checked
              type={"checkbox"}
              onClick={() => {
                props.addToDelete(a.Argument_Name);
              }}
            ></input>
          </td>
        )}
        {!deleteList1.includes(a.Argument_Name) && (
          <td id="td1">
            <input
              id="checkBox"
              type={"checkbox"}
              onClick={() => {
                props.addToDelete(a.Argument_Name);
              }}
            ></input>
          </td>
        )}

        <td
          onClick={() => {
            setExpandingList(true);
          }}
        >
          &#11166; {` ${a.Argument_Name} ${a.Argument_Optional ? "" : "*"}`}
        </td>

        <td></td>
        <td></td>
      </tr>,
    ];
  } else {
    content.push(
      <tr>
        {deleteList1.includes(a.Argument_Name) && (
          <td id="td1">
            <input
              id="checkBox"
              checked
              type={"checkbox"}
              onClick={() => {
                props.addToDelete(a.Argument_Name);
              }}
            ></input>
          </td>
        )}
        {!deleteList1.includes(a.Argument_Name) && (
          <td id="td1">
            <input
              id="checkBox"
              type={"checkbox"}
              onClick={() => {
                props.addToDelete(a.Argument_Name);
              }}
            ></input>
          </td>
        )}

        <td
          onClick={() => {
            setExpandingList(false);
          }}
        >
          &#11167; {` ${a.Argument_Name} ${a.Argument_Optional ? "" : "*"}`}
        </td>

        <td></td>
        <td></td>
      </tr>
    );
    if (props.Child_Arguments != undefined) {
      console.log("Testing",a,props.Child_Arguments)
      for (const b of props.Child_Arguments) {
        if ( props.children_of_child==undefined || !Object.keys(props.children_of_child).includes(b.Argument_Name)) {
          content.push(
            <tr>
              {deleteList1.includes([a.Argument_Name, b.Argument_Name]) && (
                <td id="td1">
                  <input
                    id="checkBox"
                    checked
                    type={"checkbox"}
                    onClick={() => {
                      props.addToDelete([a.Argument_Name, b.Argument_Name]);
                    }}
                  ></input>
                </td>
              )}
              {!deleteList1.includes([a.Argument_Name, b.Argument_Name]) && (
                <td id="td1">
                  <input
                    id="checkBox"
                    type={"checkbox"}
                    onClick={() => {
                      props.addToDelete([a.Argument_Name, b.Argument_Name]);
                    }}
                  ></input>
                </td>
              )}

              <td className="level-1-child" id="td1-variable">
                
                {` ${b.Argument_Name} ${b.Argument_Optional ? "" : "*"}`}
              </td>

              {hideStatus[b.Argument_Name] && (
                <td id="td2-variable">
                  <input
                    id="checkBox"
                    type={"checkbox"}
                    onClick={() => {
                      dispatch(
                        actions.addHideSubValue([
                          props.data[1],
                          props.data[2],
                          a.Argument_Name,
                          b.Argument_Name,
                        ])
                      );
                    }}
                    checked
                  ></input>
                </td>
              )}
              {!hideStatus[b.Argument_Name] && (
                <td id="td2-variable">
                  <input
                    id="checkBox"
                    type={"checkbox"}
                    onClick={() => {
                      dispatch(
                        actions.addHideSubValue([
                          props.data[1],
                          props.data[2],
                          a.Argument_Name,
                          b.Argument_Name,
                        ])
                      );
                    }}
                  ></input>
                </td>
              )}
              <td className={`${props.id} text-center`} id="td4-variable">
                <Switch
                  style={{marginLeft:"36%"}}
                  id="email-alerts"
                  /* onChange={() => setTextboxStatus(!textboxstatus)}
                  isChecked={textboxstatus} */
                />
              </td>
              <td id="td3-variable">
                <TableColumnSubData
                  id={props.data[1]}
                  obj={props.data[2]}
                  name={a.Argument_Name}
                  subName={b.Argument_Name}
                  data={a.Argument_Default_Value}
                  datatype={b.Argument_DataType}
                />
              </td>
            </tr>
          );
        } else {
          let grand_children = {};
          for (const i of b.Child_Arguments) {
            if (i.Child_Arguments != undefined) {
              grand_children[`${i.Argument_Name}`] = i.Child_Arguments;
            }
          }
          content.push(
            <TableRowHasChild1
              id={"one"}
              type={"Input"}
              addToDelete={props.addToDelete}
              a={b}
              level_1_parent={a.Argument_Name}
              Child_Arguments={props.children_of_child[b.Argument_Name]}
              data={props.data}
              datatype={a.Argument_DataType}
              children_of_child={grand_children}
            />
          );
        }
      }
    }
  }
  return <div id="tablediv">{content}</div>;
}
export default TableRowHasChild;
