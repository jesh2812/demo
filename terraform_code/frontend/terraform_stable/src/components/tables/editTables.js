import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions, addTableData, deleteFromTable } from "../utils/dataCenter";
import ReactDom from "react-dom";
import DatalistInput, { useComboboxControls } from "react-datalist-input";
import TableRow from "./tableRow";
import TableRowHasChild from "./tableRowHasChild";
import TableOutput from "./TableOutput";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { Grid, GridItem } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import JSON5 from "json5";
import Editor from "@monaco-editor/react";

function EditTables(props) {
  const datas = useSelector((state) => state.datacenter.data);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalData, setModalData] = useState();
  const responseData = props.data;
  console.log(responseData, "responseData")
  const [outputTable, setOutputTable] = useState([]);
  const { setVal, val } = useComboboxControls({ initialValue: "" });
  const output_data = props.output_data;
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();
  const lastIndex = useSelector(
    (state) =>
      state.datacenter.resourse[state.datacenter.resourse.length - 1][0]
  );
  const deleteList1 = useSelector(
    (state) => state.datacenter.deleteList[responseData[2]]
  );
  const editorStatus = useSelector(
    (state) => state.datacenter.customCodeResourceStatus
  );
  const custom = useSelector((state) => state.datacenter.customCodeData);
  const attr_data = useSelector((state) => state.datacenter.attributes);
  const attr_deleteList = useSelector(
    (state) => state.datacenter.attrDeleteList[responseData[2]]
  );

  const editdata = useSelector(
    (state) => state.datacenter.editData[responseData[2]]
  );
  const editOutdata = useSelector(
    (state) => state.datacenter.editOutput[responseData[2]]
  );
  const editVariables = useSelector(
    (state) => state.datacenter.editVariables[responseData[2]]
  );
  const [iteration, setIteration] = useState(0);
  const tabledata = useSelector((state) => state.tablesSlice.tables[responseData[2]]);
  //const [tabledata, setTableData] = useState([]);
  const table = useSelector(
    (state) => state.datacenter.tableData[responseData[2]]
  );
  const body = useSelector((state) => state.datacenter.data);

  const [newTable, setNewTable] = useState([]);
  const hiding = useSelector((state) => state.datacenter.hiding);
  const [optionalArgs, setOptionalArgs] = useState([<td>.</td>]);
  const [hidding, setHide] = useState(false);
  const [selectingAdd, setSelectingAdd] = useState();
  const [confirmSelectDelete, setSelectDelete] = useState(false);
  const [confirmAllDelete, setAllDelete] = useState(false);
  const [inputArgs, setInputArgs] = useState([]);
  const [outputArgs, setOutputArgs] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [customCodeStatus, setCustomCodeStatus] = useState(false);
  const [customCode, setCustomCode] = useState("");

  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;

    setTimeout(function () {
      editor.getAction("editor.action.formatDocument").run();
    }, 300);
  }

  const changeEditorStatus = () => {
    dispatch(actions.modifyEditorStatus([responseData[2]]));
  };

  const changeEditor = () => {
    setCustomCodeStatus(!customCodeStatus);

    changeEditorStatus();
  };

  const handleEditorCodeChange = (newText) => {
    setCustomCode(newText);

    const resource_data = JSON5.parse(newText);
    const resource_type = Object.keys(resource_data)[0];
    const resource_name = responseData[1]; //Object.keys(resource_data[resource_type])[0];
    dispatch(
      actions.addCustomCode([responseData[2], resource_name, resource_data])
    );
  };

  const check_is_variable = (arg_name) => {
    for (const i in editdata) {
      if (i == arg_name) {
        return editdata[i].is_variable;
      }
    }
  };

  const check_sub_is_variable = (parent_arg, rsrc_name, obj_name) => {
    for (const i in editdata) {
      if (i == parent_arg) {
        for (const sub_arg in editdata[i]) {
          if (editdata[i][sub_arg].is_variable == true) {
            dispatch(
              actions.addHideSubValue([
                rsrc_name,
                obj_name,
                parent_arg,
                sub_arg,
              ])
            );
          }
        }
      }
    }
  };

  function addingToDataCenter(e) {
    let content = [];
    let flag = 0;
    for (const b of responseData[0]) {
      if (b.Argument_Name == e) {
        flag = 1;
        if (b.Child_Arguments == undefined) {
          dispatch(actions.addtoTableData([responseData[2], b]));
          let keys = Object.keys(editdata ? editdata : {});
          if (keys.includes(b.Argument_Name)) {
            dispatch(
              actions.addNew([
                responseData[1],
                responseData[2],
                `${e}`,
                editdata[b.Argument_Name],
              ])
            );
          } else {
            dispatch(
              actions.addNew([
                responseData[1],
                responseData[2],
                `${e}`,
                b.Argument_Default_Value,
              ])
            );
          }
          dispatch(
            actions.addHide([
              responseData[1],
              responseData[2],
              `${e}`,
              `${b.Argument_Default_Value}`,
            ])
          );
          /* <TableRow addToDelete={addToDelete} a={b} data={responseData} /> */
          content.push(["", b.Argument_Name]);

          if (b.Argument_Optional == "False") {
            dispatch(
              actions.addImportantNew([
                responseData[1],
                responseData[2],
                `${e}`,
                "",
              ])
            );
          }
        } else {
          dispatch(actions.addtoTableData([responseData[2], b]));
          let child = {};
          let importantchild = {};
          let n = 0;
          for (const c of b.Child_Arguments) {
            child[`${c.Argument_Name}`] = {
              value: `${c.Argument_Default_Value}`,
              is_variable: false,
            };
            if (c.Argument_Optional == "False") {
              importantchild[`${c.Argument_Name}`] = "";
              n = n + 1;
            }
          }
          let keys = Object.keys(editdata ? editdata : {});

          if (keys.includes(b.Argument_Name)) {
            dispatch(
              actions.addNew([
                responseData[1],
                responseData[2],
                `${e}`,
                editdata[b.Argument_Name],
              ])
            );
          } else {
            dispatch(
              actions.addNew([responseData[1], responseData[2], `${e}`, child])
            );
          }

          dispatch(
            actions.addHide([responseData[1], responseData[2], `${e}`, child])
          );
          console.log("FIrst Child_Arguments", b.Child_Arguments);
          {
            /* <TableRowHasChild
              addToDelete={addToDelete}
              a={b}
              Child_Arguments={b.Child_Arguments}
              is_variable={get_variable_data(
                b.Argument_Name,
                responseData[2],
                true
              )}
              data={responseData}
            /> */
          }
          content.push(["", b.Argument_Name]);

          if (n != 0) {
            dispatch(
              actions.addImportantNew([
                responseData[1],
                responseData[2],
                `${e}`,
                importantchild,
              ])
            );
          }
        }
      }
    }
    dispatch(addTableData([responseData[2], content[0]]));
    //setTableData(content);
  }

  function deleteFromDataCenter(e) {
    let content = [];
    let res = table;
    dispatch(actions.remove([responseData[1], responseData[2], e]));
    for (const a of responseData[0]) {
      if (typeof e == "string") {
        if (a.Argument_Name == e && a.Argument_Optional == "False") {
          dispatch(
            actions.removeImportant([responseData[1], responseData[2], e])
          );
          break;
        }
      } else {
        if (a.Argument_Name == e[0] && a.Argument_Optional == "False") {
          dispatch(
            actions.removeImportant([responseData[1], responseData[2], e])
          );
          break;
        }
      }
    }
    for (let i = 0; i < content.length; i++) {
      if (typeof e == "string") {
        if (content[i][1] == e) {
          content.splice(i, 1);
          break;
        }
      } else {
        if (content[i][1] == e[0]) {
          for (const b of res) {
            if (b.Argument_Name == e[0]) {
              let Child_Arguments = b.Child_Arguments.filter(
                (n) => n.Argument_Name != e[1]
              );
              console.log("Second Child_Arguments", Child_Arguments);
              /* <TableRowHasChild
                  addToDelete={addToDelete}
                  a={b}
                  Child_Arguments={Child_Arguments}
                  data={responseData}
                /> */
              content[i] = ["", e[0]];
              break;
            }
          }
        }
      }
    }
    dispatch(addTableData([responseData[2], content]));
    //setTableData(content);
  }
  if (iteration == 0) {
    let n = 0;
    if (editdata != undefined) {
      for (const a in editdata) {
        n = n + 1;
      }
    } else {
      for (const a of responseData[0]) {
        if (a.Argument_Optional == "False") {
          n = n + 1;
        }
      }
    }
    setCount(n);
    setIteration(1);
  }
  function DeleteResourse() {
    dispatch(actions.deleteResourse([responseData[2]]));
    dispatch(actions.deleteResourceFromBody([responseData[2]]));
    dispatch(actions.deleteResourseNode([responseData[2]]));
    /* dispatch(actions.deleteResourse([props.id, responseData[2]]));
    dispatch(actions.deleteDeleteList(responseData[2]));
    setAllDelete(false); */
  }

  function addToAttributeDelete(a) {
    dispatch(actions.addtoAttrDelete([responseData[2], a]));
  }

  const deleteSelectedAttributes = () => {
    for (let attr of attr_deleteList) {
      dispatch(actions.deleteAttr([responseData[2], attr]));
    }
    dispatch(actions.createAttrDeleteList(responseData[2]));
    settingTableData();
  };

  function addToDelete(a) {
    dispatch(actions.addtoDelete([responseData[2], a]));
  }

  function DeletingSelected() {
    console.log(deleteList1, tabledata);
    for (let i = 0; i < tabledata.length; i++) {
      for (let b of deleteList1) {
        if (typeof b == "string") {
          if (tabledata[i][1] == b) {
            dispatch(actions.removeFromTableData([responseData[2], b]));
            dispatch(deleteFromTable([responseData[2],b]));
            deleteFromDataCenter(b);
          }
        } else {
          if (tabledata[i][1] == b[0]) {
            dispatch(actions.removeFromTableData([responseData[2], b]));
            dispatch(deleteFromTable(responseData[2],b[0]));
            deleteFromDataCenter(b);
          }
        }
      }
    }
    dispatch(actions.createDeleteList(responseData[2]));
    settingTableData();
  }

  const setHiding = (rsrc_name, obj_name, argument_name) => {
    dispatch(actions.addHideValue([rsrc_name, obj_name, argument_name]));
  };

  function get_variable_data(argument_name, obj_name, is_child) {
    if (!is_child) {
      for (const hide_ele in hiding) {
        if (hiding[hide_ele]["object_name"] == obj_name) {
          for (const argument in hiding[hide_ele]["Arguments"]) {
            if (typeof hiding[hide_ele]["Arguments"][argument] == "boolean") {
              if (argument == argument_name) {
                if (hiding[hide_ele]["Arguments"][argument_name] == true) {
                  return true;
                } else {
                  return false;
                }
              }
            }
          }
        }
      }
    } else {
      for (const hide_ele in hiding) {
        if (hiding[hide_ele]["object_name"] == obj_name) {
          for (const argument in hiding[hide_ele]["Arguments"]) {
            if (typeof hiding[hide_ele]["Arguments"][argument] != "boolean") {
              for (const sub_attr in hiding[hide_ele]["Arguments"][argument]) {
                if (sub_attr == argument_name) {
                  if (
                    hiding[hide_ele]["Arguments"][argument][sub_attr] == true
                  ) {
                    return true;
                  } else {
                    return false;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  const objHasData = () => {
    for (const i of body) {
      if (i["object_name"] === responseData[2]) {
        if (Object.keys(i["Arguments"]).length > 0) {
          return true;
        }
      }
    }
    return false;
  };

  function settingTableData() {
    let content = [];
    let outContent = [];

    for (const e of responseData[0]) {
      if ((iteration == 1 || table.length == 0) && !objHasData()) {
        if (editdata != undefined) {
          for (const a in editdata) {
            if (e.Argument_Name == a) {
              const arg_exists = tabledata.filter(
                (ele) => ele[1] === e.Argument_Name
              );
              if (arg_exists.length == 0) {
                addingToDataCenter(e.Argument_Name);
              }
            }
          }
        } else {
          console.log("Edit data undefined",editdata)
          if (e.Argument_Optional == "False") {
            if (tabledata.length < count) {
              addingToDataCenter(e.Argument_Name);
            } else {
              let flag = 0;
              for (const f of tabledata) {
                if (f[1] == e.Argument_Name) {
                  flag = 1;
                }
              }
              if (flag == 0) {
                addingToDataCenter(e.Argument_Name);
              }
            }
          }
        }

        setIteration(2);
      }
      let flag = 0;
      for (const f of tabledata) {
        if (f[1] == e.Argument_Name) {
          flag = 1;
          break;
        }
      }
      if (flag == 0) {
        content.push({ id: e.Argument_Name, value: e.Argument_Name });
      }
    }
    for (const g of output_data[0]) {
      let flag = 0;
      if (attr_data[responseData[2]] != undefined) {
        for (const f of attr_data[responseData[2]]) {
          if (f == g.Attribute_Name) {
            flag = 1;
            break;
          }
        }
        if (flag == 0) {
          outContent.push({ id: g.Attribute_Name, value: g.Attribute_Name });
        }
      } else {
        outContent.push({ id: g.Attribute_Name, value: g.Attribute_Name });
      }
    }
    setInputArgs(content);
    setOutputArgs(outContent);
    setOptionalArgs(content);

    const output_content = [];
    const temp_attrs = [];

    for (const g of output_data[0]) {
      if (attr_data[responseData[2]] != undefined) {
        for (const a of attr_data[responseData[2]]) {
          if (g.Attribute_Name == a) {
            if (!temp_attrs.includes(a)) {
              temp_attrs.push(a);
              output_content.push(
                <TableOutput
                  type={"Output"}
                  addToAttributeDelete={addToAttributeDelete}
                  a={g}
                  data={responseData}
                />
              );
            }
          }
        }
      }
    }

    if (table != undefined) {
      let content2 = [];
      let flag = "one";

      for (const a of table) {
        let flag1 = 0;

        if (flag1 == 0) {
          if (a.Child_Arguments == undefined) {
            const val = check_is_variable(a.Argument_Name);
            if (val == true) {
              setHiding(responseData[1], responseData[2], a.Argument_Name);
            }
            content2.push(
              <TableRow
                id={flag}
                type={"Input"}
                addToDelete={addToDelete}
                a={a}
                data={responseData}
                is_variable={get_variable_data(
                  a.Argument_Name,
                  responseData[2],
                  false
                )}
              />
            );
          } else {
            check_sub_is_variable(
              a.Argument_Name,
              responseData[1],
              responseData[2]
            );
            console.log("Third Child_Arguments", a.Child_Arguments);
            content2.push(
              <TableRowHasChild
                id={flag}
                type={"Input"}
                addToDelete={addToDelete}
                a={a}
                Child_Arguments={a.Child_Arguments}
                data={responseData}
                parent_name={a.Argument_Name}
              />
            );
          }
        }
        if (flag == "one") flag = "two";
        else flag = "one";
      }
      console.log("content2",content2, table)
      setNewTable(content2);
      setOutputTable(output_content);
    }
  }

  const addAttributes = (item) => {
    dispatch(actions.addNewAttribute([responseData[2], item]));
    settingTableData();
  };

  function addOptionalArguments(e) {
    addingToDataCenter(e);
    settingTableData();
  }
  useEffect(() => {
    settingTableData();
  }, []);
  useEffect(() => {
    settingTableData();
  }, [table, attr_data]);
  useEffect(() => {
    if (lastIndex != props.id) {
      setHide(true);
    } else {
      setHide(false);
    }
  }, [lastIndex]);

  useEffect(() => {
    const status = editorStatus.filter(
      (ele) => ele.object_name === responseData[2]
    );
    if (status.length > 0)
      setCustomCodeStatus(
        status[0]["status"] != undefined ? status[0]["status"] : false
      );
  });

  useEffect(() => {
    const code = custom.filter((ele) => ele.object_name === responseData[2]);
    if (code.length > 0) {
      setCustomCode(JSON.stringify(code[0]["custom_code"]));
    }
  });
  return (
    <div id="div6">
      <>
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {modalData === 0 && "Delete Selected"}
              {modalData === 1 && "Delete All"}
              {modalData === 2 && "Delete Resource"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {modalData == 0 && (
                <div>
                  <p style={{ color: "black" }}>
                    Are you sure, you want to delete the following arguments?
                  </p>
                  <ul>
                    {deleteList1.map((item) => {
                      if (typeof item == "string") {
                        return <li>{item}</li>;
                      } else {
                        return (
                          <li>
                            {item[0]}-{item[1]}
                          </li>
                        );
                      }
                    })}
                  </ul>
                </div>
              )}
              {modalData == 1 &&
                "Are you sure, you want to delete all arguments?"}
              {modalData == 2 && (
                <h5>Are you sure, you want to delete '{props.data[1]}'?</h5>
              )}
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme={
                  (modalData == 0 && "red") ||
                  (modalData == 1 && "red") ||
                  (modalData == 2 && "red")
                }
                mr={3}
                onClick={() => {
                  {
                    if (modalData == 0 || modalData == 1) {
                      console.log("Inside if", tabIndex);
                      if (tabIndex == 0) {
                        console.log("Inside if if");
                        DeletingSelected();
                        setSelectDelete(false);
                      } else {
                        deleteSelectedAttributes();
                        setSelectDelete(false);
                      }
                    }
                  }
                  {
                    if (modalData == 2) {
                      DeleteResourse();
                    }
                  }
                  onClose();
                }}
              >
                {modalData == 0 && "Delete"}
                {modalData == 1 && "Delete"}
                {modalData == 2 && "Delete"}
              </Button>
              <Button
                onClick={() => {
                  onClose();
                  {
                    if (modalData == 0) {
                      setSelectDelete(false);
                      {
                        if (tabIndex == 0)
                          dispatch(actions.createDeleteList(responseData[2]));
                      }
                      {
                        if (tabIndex == 1)
                          dispatch(
                            actions.createAttrDeleteList(responseData[2])
                          );
                      }
                    }
                  }
                }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
      {hidding && (
        <label id="lab1">
          ⏷
          <span
            className="resource-title"
            onClick={() => {
              setHide(false);
            }}
          >{`${responseData[1]}  -  ${responseData[2]}`}</span>
          <select
            value={""}
            onChange={(e) => {
              if (
                e.target.value == "Delete Selected" &&
                deleteList1.length > 0
              ) {
                onOpen();
                setSelectDelete(true);
                dispatch(actions.createDeleteList(responseData[2]));
              }
              if (e.target.value == "Delete All") {
                for (const a of tabledata) {
                  addToDelete(a[1]);
                }
                setSelectDelete(true);
                onOpen();
                setModalData(1);
              }
              if (e.target.value == "Delete Resource") {
                onOpen();
                setModalData(2);
                setAllDelete(true);
              }
            }}
          >
            <option>Actions</option>
            <option
              value={"Delete Selected"}
              onClick={() => {
                onOpen();
                setSelectDelete(true);
                setModalData(0);
                {
                  if (tabIndex == 0) {
                    dispatch(actions.createDeleteList(responseData[2]));
                  }
                  {
                    if (tabIndex == 1) {
                      dispatch(actions.createAttrDeleteList(responseData[2]));
                    }
                  }
                }
              }}
            >
              Delete Selected
            </option>
            <option value={"Delete All"}>Delete All</option>
            <option
              value={"Delete Resource"}
              onClick={() => {
                onOpen();
                setModalData(2);
                setAllDelete(true);
              }}
            >
              Delete Resource
            </option>
          </select>
        </label>
      )}
      {!hidding && (
        <label id="lab1">
          ⏶
          <span
            className="resource-title"
            onClick={() => {
              setHide(true);
            }}
          >{`${responseData[1]}  -  ${responseData[2]}`}</span>
          <i
            class="fa-solid fa-pen-to-square"
            style={{
              background: customCodeStatus ? "grey" : "white",
              color: customCodeStatus ? "white" : "black",
            }}
            onClick={() => {
              changeEditor();
            }}
          ></i>
          <select
            value={""}
            onChange={(e) => {
              if (
                e.target.value == "Delete Selected" &&
                deleteList1.length > 0
              ) {
                onOpen();
                setSelectDelete(true);
                setModalData(0);
              }
              if (e.target.value == "Delete All") {
                for (const a of tabledata) {
                  if (!deleteList1.includes(a[1])) {
                    addToDelete(a[1]);
                  }
                }
                setSelectDelete(true);
                onOpen();
                setModalData(1);
              }
              if (e.target.value == "Delete Resource") {
                onOpen();
                setModalData(2);
                setAllDelete(true);
              }
            }}
          >
            <option>Actions</option>
            <option
              value={"Delete Selected"}
              onClick={() => {
                onOpen();
                setSelectDelete(true);
                setModalData(0);
              }}
            >
              Delete Selected
            </option>
            <option value={"Delete All"} onClick={onOpen}>
              Delete All
            </option>
            <option
              value={"Delete Resource"}
              onClick={() => {
                setAllDelete(true);
              }}
            >
              Delete Resource
            </option>
          </select>
        </label>
      )}
      {!hidding && (
        <Tabs
          colorScheme="gray"
          onChange={(index) => {
            setTabIndex(index);
          }}
        >
          <TabList>
            <Tab>Input</Tab>
            <Tab>Output</Tab>
            {customCodeStatus && <Tab>Code Editor</Tab>}
          </TabList>
          <TabPanels>
            <TabPanel>
              <div>
                <table>
                  <thead>
                    <div id="tablediv">
                      <th id="td1"></th>
                      <th id="th1-variable">Name</th>
                      <th id="th2-variable">Is Variable</th>
                      <th id="th4-variable">Textbox</th>
                      <th id="th3-variable">Value</th>
                    </div>
                  </thead>
                  <tbody>
                    {console.log("Table data--->", newTable)}
                    {newTable}
                    {selectingAdd && (
                      <div id="tablediv">
                        <td id="td1">
                          <input type="checkbox"></input>
                        </td>

                        <td id="td1-variable">
                          <DatalistInput
                            placeholder="Add Arguments"
                            value={val}
                            setValue={setVal}
                            className="datalist"
                            onSelect={(item) => {
                              addOptionalArguments(item.value);
                              setSelectingAdd(false);
                            }}
                            items={inputArgs}
                          />
                        </td>
                        <td id="td2-variable">
                          <input type="checkbox"></input>
                        </td>
                        <td id="td4-variable">
                          <input type="text"></input>
                        </td>
                        <td id="td3-variable">
                          <input type="text"></input>
                        </td>
                      </div>
                    )}
                  </tbody>
                </table>
                {!selectingAdd && (
                  <button
                    id="button1"
                    onClick={() => {
                      setSelectingAdd(true);
                    }}
                  >
                    Add
                  </button>
                )}
              </div>
            </TabPanel>
            <TabPanel>
              <Grid templateColumns="repeat(3, 1fr)" gap={5}>
                {outputTable}
                {selectingAdd && (
                  <GridItem>
                    <div className="grid-item">
                      <DatalistInput
                        placeholder="Add Arguments"
                        value={val}
                        setValue={setVal}
                        className="datalist"
                        onSelect={(item) => {
                          addAttributes(item.value);
                          setSelectingAdd(false);
                        }}
                        items={outputArgs}
                      />
                    </div>
                  </GridItem>
                )}
              </Grid>
              <div>
                {!selectingAdd && (
                  <button
                    id="button1"
                    onClick={() => {
                      setSelectingAdd(true);
                    }}
                  >
                    Add
                  </button>
                )}
              </div>
            </TabPanel>
            {console.log(customCodeStatus)}
            {customCodeStatus && (
              <TabPanel>
                <Editor
                  height="90vh"
                  defaultLanguage="json"
                  theme="vs-light"
                  defaultValue={customCode}
                  onChange={handleEditorCodeChange}
                  onMount={handleEditorDidMount}
                />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      )}
    </div>
  );
}
export default React.memo(EditTables);
