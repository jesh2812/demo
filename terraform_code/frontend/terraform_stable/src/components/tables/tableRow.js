import React from "react";
import { useDispatch, useSelector } from "react-redux";
import TableColumnsData from "./tableColumnsData";
import { actions } from "../utils/dataCenter";
import "./tableRow.css";
import { Switch } from "@chakra-ui/react";
import { Textarea } from "@chakra-ui/react";
import JSON5 from "json5";
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useState } from "react";

function TableRow(props) {
  const a = props.a;
  const t = props.t;
  let hideStatus = false;

  const dispatch = useDispatch();
  const [resize, setResize] = React.useState("vertical");
  const deleteList1 = useSelector((state) => state.datacenter.deleteList[props.data[2]]);
  const hide = useSelector((state) => state.datacenter.hiding);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [index, setIndex] = useState();
  const [policyIndex, setPolicyIndex] = useState();
  const [textboxstatus, setTextboxStatus] = useState();
  let [value, setValue] = useState("");

  if (index == undefined) {
    setIndex(0);
  }
  if (policyIndex == undefined) {
    setPolicyIndex(0);
  }

  for (const b of hide) {
    if (b["object_name"] == props.data[2]) {
      hideStatus = b["Arguments"][a.Argument_Name];
    }
  }
  function setHiding() {
    dispatch(
      actions.addHideValue([props.data[1], props.data[2], a.Argument_Name])
    );
  }

  let handleInputChange = (e) => {
    let inputValue = e.target.value;
    setValue(inputValue);
  };

  return (
    <div id="tablediv">
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Enter Custom Code</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Textarea
                placeholder="Custom Script"
                size="md"
                value={value}
                rows={10}
                resize={resize}
                onChange={handleInputChange}
                spellcheck={"false"}
              />
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  dispatch(
                    actions.addColumnValue([
                      props.data[1],
                      props.data[2],
                      a.Argument_Name,
                      JSON5.parse(value),
                    ])
                  );
                  onClose();
                }}
              >
                Save
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>

      {deleteList1.includes(a.Argument_Name) && (
        <td id="td1" className={props.id}>
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
        <td id="td1" className={props.id}>
          <input
            id="checkBox"
            type={"checkbox"}
            onClick={() => {
              props.addToDelete(a.Argument_Name);
            }}
          ></input>
        </td>
      )}
      {a.Argument_Optional == "False" && (
        <td className={props.id} id="td1-variable">
          <div className="wrapper1">
            {a.Argument_Name} *
            <div class="icon info">
              <div class="tooltip">{a.Argument_Description}</div>
              <span>
                <i class="fa-solid fa-circle-info"></i>
              </span>
            </div>
          </div>
        </td>
      )}
      {a.Argument_Optional != "False" && (
        <td className={props.id} id="td1-variable">
          <div className="wrapper1">
            {a.Argument_Name} <span id="desc-span"></span>
            <div class="icon info">
              <div class="tooltip">{a.Argument_Description}</div>
              <span>
                <i class="fa-solid fa-circle-info"></i>
              </span>
            </div>
          </div>
        </td>
      )}

      {hideStatus && (
        <td className={props.id} id="td2-variable">
          <input
            id="checkBox"
            checked
            type={"checkbox"}
            onClick={setHiding}
          ></input>
        </td>
      )}
      {!hideStatus && (
        <td className={props.id} id="td2-variable">
          <input
            id="checkBox"
            type={"checkbox"}
            onChange={setHiding}
            checked={props.is_variable}
            disabled={
              a.Argument_DataType == "string" || a.Argument_DataType == ""
                ? false
                : true
            }
          ></input>
        </td>
      )}

      <td className={`${props.id} text-center`} id="td4-variable">
        <Switch
          style={{marginLeft:"36%"}}
          id="email-alerts"
          onChange={() => setTextboxStatus(!textboxstatus)}
          isChecked={textboxstatus}
        />
      </td>

      {textboxstatus && (
        <td className={props.id} id="td3-variable">
          <button className="add-policy-btn" onClick={onOpen}>
            Open Textbox
          </button>
        </td>
      )}
      {!textboxstatus && (
        <td className={props.id} id="td3-variable">
          <TableColumnsData
            id={props.data[1]}
            obj={props.data[2]}
            name={a.Argument_Name}
            datatype={a.Argument_DataType}
            data={a.Argument_Default_Value}
          />
        </td>
      )}
    </div>
  );
}
export default TableRow;
