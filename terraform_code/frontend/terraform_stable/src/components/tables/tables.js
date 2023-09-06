import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  actions,
  addTableData,
  deleteFromTable,
  initTableData,
} from "../utils/dataCenter";
import DatalistInput, { useComboboxControls } from "react-datalist-input";
import TableRow from "./tableRow";
import TableRowHasChild from "./tableRowHasChild";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import TableOutput from "./TableOutput";
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
import { Button } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import JSON5 from "json5";
import { Tooltip } from "@chakra-ui/react";

function Tables(props) {
  const responseData = props.data;
  const output_data = props.output_data;
  const { setVal, val } = useComboboxControls({ initialValue: "" });
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();

  const body = useSelector((state) => state.datacenter.data);

  const lastIndex = useSelector(
    (state) =>
      state.datacenter.resourse[state.datacenter.resourse.length - 1][0]
  );
  const deleteList1 = useSelector(
    (state) => state.datacenter.deleteList[responseData[2]]
  );
  const attr_deleteList = useSelector(
    (state) => state.datacenter.attrDeleteList[responseData[2]]
  );

  const [iteration, setIteration] = useState(0);
  const tabledata = useSelector((state) => state.tablesSlice.tables[responseData[2]]);
  //const [tabledata, setTableData] = useState([]);
  const table = useSelector(
    (state) => state.datacenter.tableData[responseData[2]]
  );
  const [newTable, setNewTable] = useState([]);
  const [outputTable, setOutputTable] = useState([]);
  const [optionalArgs, setOptionalArgs] = useState([<td>.</td>]);
  const [hidding, setHide] = useState(false);
  const [selectingAdd, setSelectingAdd] = useState();
  const [confirmSelectDelete, setSelectDelete] = useState(false);
  const [confirmAllDelete, setAllDelete] = useState(false);
  const [inputArgs, setInputArgs] = useState([]);
  const [outputArgs, setOutputArgs] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalData, setModalData] = useState();
  const [tabIndex, setTabIndex] = useState(0);
  const attr_data = useSelector((state) => state.datacenter.attributes);
  const [customCodeStatus, setCustomCodeStatus] = useState(false);
  const editorRef = useRef(null);
  const [customCode, setCustomCode] = useState("");
  const editorStatus = useSelector(
    (state) => state.datacenter.customCodeResourceStatus
  );
  const custom = useSelector((state) => state.datacenter.customCodeData);
  const addAttributes = (item) => {
    dispatch(actions.addNewAttribute([responseData[2], item]));
    settingTableData();
  };

  console.log(newTable, tabledata);
  const changeEditorStatus = () => {
    setTabIndex(2);
    dispatch(actions.modifyEditorStatus([responseData[2]]));
  };

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

  const changeEditor = () => {
    if (customCodeStatus === false) {
      setCustomCodeStatus(true);
    } else {
      setCustomCodeStatus(false);
    }

    changeEditorStatus();
  };

  const handleEditorCodeChange = (newText) => {
    setCustomCode(newText);


    const resource_data = JSON5.parse(newText);
    const resource_type = Object.keys(resource_data)[0];
    const resource_name = responseData[1]; //Object.keys(resource_data[resource_type])[0]

    dispatch(
      actions.addCustomCode([responseData[2], resource_name, resource_data])
    );
  };

  function addingToDataCenter(e) {
    let content = [];
    let flag = 0;
    console.log("addingToDataCenter", e)
    for (const b of responseData[0]) {
      if (b.Argument_Name == e) {
        flag = 1;
        if (b.Child_Arguments == undefined) {
          dispatch(actions.addtoTableData([responseData[2], b]));
          dispatch(
            actions.addNew([
              responseData[1],
              responseData[2],
              `${e}`,
              `${b.Argument_Default_Value}`,
            ])
          );
          dispatch(
            actions.addHide([
              responseData[1],
              responseData[2],
              `${e}`,
              `${b.Argument_Default_Value}`,
            ])
          );
          {
            /* <TableRow
              addToDelete={addToDelete}
              a={b}
              data={responseData}
              is_variable={true}
            />, */
          }
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
          let children_of_child = {};
          for (const c of b.Child_Arguments) {
            if (c.Child_Arguments == undefined) {
              child[`${c.Argument_Name}`] = {
                value: `${c.Argument_Default_Value}`,
                is_variable: false,
              };
              if (c.Argument_Optional == "False") {
                importantchild[`${c.Argument_Name}`] = "";
                n = n + 1;
              }
            } else {
              let m = 0;
              children_of_child[`${c.Argument_Name}`] = c.Child_Arguments;
              child[`${c.Argument_Name}`] = {};
              for (const d of c.Child_Arguments) {
                if (d.Child_Arguments == undefined) {
                  child[`${c.Argument_Name}`][`${d.Argument_Name}`] = {
                    value: `${d.Argument_Default_Value}`,
                    is_variable: false,
                  };

                  if (c.Argument_Optional == "False") {
                    importantchild[`${d.Argument_Name}`] = "";
                    m += 1;
                  }
                }
              }
              //content.push([<TableRowHasChild addToDelete={addToDelete} a={c} Child_Arguments={c.Child_Arguments} data={responseData} />,c.Argument_Name])
            }
          }
          {
            /* <TableRowHasChild
              addToDelete={addToDelete}
              a={b}
              Child_Arguments={b.Child_Arguments}
              data={responseData}
              children_of_child={children_of_child}
            />, */
          }
          content.push(["", b.Argument_Name]);
          dispatch(
            actions.addNew([responseData[1], responseData[2], `${e}`, child])
          );
          dispatch(
            actions.addHide([responseData[1], responseData[2], `${e}`, child])
          );
          //if(n!=0){
          //qdispatch(actions.addImportantNew([responseData[1],responseData[2],`${e}`,importantchild]));
          //}
        }
      }
    }
    console.log("COntent=====>", content);
    dispatch(addTableData([responseData[2], content[0]]));
    //setTableData(content);
  }

  function deleteFromDataCenter(e) {
    let content = [];
    let res = table;
    dispatch(actions.remove([responseData[1], responseData[2], e]));
    dispatch(actions.removeHide([responseData[1], responseData[2], e]));

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
              content[i] = [
                <TableRowHasChild
                  addToDelete={addToDelete}
                  a={b}
                  Child_Arguments={Child_Arguments}
                  data={responseData}
                />,
                e[0],
              ];
              break;
            }
          }
        }
      }
    }
    console.log([responseData[2], content]);
    dispatch(addTableData([responseData[2], content]));
    //setTableData(content);
  }

  if (iteration == 0) {
    let n = 0;
    for (const a of responseData[0]) {
      if (a.Argument_Optional == "False") {
        n = n + 1;
      }
    }
    setCount(n);
    setIteration(1);
  }
  function DeleteResourse() {
    //console.log(responseData[2])
    dispatch(actions.deleteResourse([responseData[2]]));
    dispatch(actions.deleteResourceFromBody([responseData[2]]));
    dispatch(actions.deleteResourseNode([responseData[2]]));
  }

  function addToAttributeDelete(a) {
    dispatch(actions.addtoAttrDelete([responseData[2], a]));
  }

  function addToDelete(a) {
    console.log([responseData[2], a]);
    dispatch(actions.addtoDelete([responseData[2], a]));
  }

  function DeletingSelected() {
    console.log("Deleting", tabledata, deleteList1);
    for (let i = 0; i < tabledata.length; i++) {
      for (let b of deleteList1) {
        if (typeof b == "string") {
          // console.log(b,table[i], tabledata)
          if (tabledata[i][1] == b) {
            dispatch(actions.removeFromTableData([responseData[2], b]));
            dispatch(deleteFromTable([responseData[2], b]));
            deleteFromDataCenter(b);
          }
        } else {
          if (tabledata[i][1] == b[0]) {
            dispatch(actions.removeFromTableData([responseData[2], b]));
            deleteFromDataCenter(b);
          }
        }
      }
    }

    dispatch(actions.createDeleteList(responseData[2]));
    settingTableData();
  }

  const deleteSelectedAttributes = () => {
    for (let attr of attr_deleteList) {
      dispatch(actions.deleteAttr([responseData[2], attr]));
    }
    dispatch(actions.createAttrDeleteList(responseData[2]));
    settingTableData();
  };

  function settingTableData() {
    
    let content = [];
    let outContent = [];

    for (const e of responseData[0]) {
      if ((iteration == 1 && !objHasData()) || !objHasData()) {
        if (e.Argument_Optional == "False") {
          const arg_exists = tabledata.some(
            (ele) => ele[1] === e.Argument_Name
          );
          if (!arg_exists) {
            addingToDataCenter(e.Argument_Name);
          }
        } else {
          const arg_exists = tabledata.some(
            (ele) => ele[1] === e.Argument_Name
          );
          if (!arg_exists)
            content.push({ id: e.Argument_Name, value: e.Argument_Name });
            //console.log("if testing args", arg_exists, tabledata[responseData[2]],content);

        }
      } else {
        let flag = 0;
        for (const f of tabledata) {
          if (f[1] == e.Argument_Name) {
            flag = 1;
            break;
          }
        }
        if (flag == 0) {
          console.log("Added to the list", flag, e.Argument_Name)
          content.push({ id: e.Argument_Name, value: e.Argument_Name });
        }
        //console.log("else testing args", flag, tabledata[responseData[2]],content);

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
    console.log("Final content",content)
    setOptionalArgs(content);
    setInputArgs(content);
    setOutputArgs(outContent);

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

    console.log("table--->", table);
    if (table != undefined) {
      let content2 = [];
      let flag = "one";
      for (const a of table) {
        let flag1 = 0;

        if (flag1 == 0) {
          if (a.Child_Arguments == undefined) {
            content2.push(
              <TableRow
                id={flag}
                type={"Input"}
                addToDelete={addToDelete}
                a={a}
                data={responseData}
                is_variable={val}
              />
            );
          } else {
            let children_of_child = {};
            let grand_children = {};

            for (const child_arg of a.Child_Arguments) {
              if (child_arg.Child_Arguments != undefined) {
                for (const child_2_arg of child_arg.Child_Arguments) {
                  if (child_2_arg.Child_Arguments != undefined) {
                    grand_children[`${child_2_arg.Argument_Name}`] =
                      child_2_arg.Child_Arguments;
                  }
                }
                children_of_child[`${child_arg.Argument_Name}`] =
                  child_arg.Child_Arguments;
              }
            }

            content2.push(
              <TableRowHasChild
                id={flag}
                type={"Input"}
                addToDelete={addToDelete}
                a={a}
                Child_Arguments={a.Child_Arguments}
                data={responseData}
                children_of_child={children_of_child}
              />
            );
          }
        }

        if (flag == "one") flag = "two";
        else flag = "one";
      }
      console.log("content2-->", content2);
      setNewTable(content2);
      setOutputTable(output_content);
    }
  }

  function handleEditorDidMount(editor, monaco) {
    console.log("customCode");
    editorRef.current = editor;
    setTimeout(function () {
      editor.getAction("editor.action.formatDocument").run();
    }, 300);
  }

  const testCode = () => {
    console.log("Pasted");
  };

  function addOptionalArguments(e) {
    addingToDataCenter(e);
    settingTableData();
  }

  useEffect(() => {
    settingTableData();
  }, [iteration]);

  useEffect(() => {
    settingTableData();
  }, [table, attr_data, attr_deleteList]);

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
                      {
                        if (tabIndex == 0) {
                          DeletingSelected();
                          setSelectDelete(false);
                        }
                      }
                      {
                        if (tabIndex == 1) {
                          deleteSelectedAttributes();
                          setSelectDelete(false);
                        }
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
          <Tooltip label="Custom Code Editor">
            <i
              class="fa-solid fa-pen-to-square"
              style={{
                background: customCodeStatus ? "grey" : "white",
                color: customCodeStatus ? "white" : "black",
              }}
              onClick={() => {
                changeEditorStatus();
                console.log("ll");
              }}
            />
          </Tooltip>
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
                console.log("DELETING", tabledata);
                for (const a of tabledata) {
                  console.log(a, deleteList1);
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
            {!customCodeStatus && <Tab>Input</Tab>}
            {!customCodeStatus && <Tab>Output</Tab>}
            {customCodeStatus && <Tab>Code Editor</Tab>}
          </TabList>
          <TabPanels>
            {!customCodeStatus && (
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
            )}

            {!customCodeStatus && (
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
            )}

            {customCodeStatus && (
              <TabPanel>
                <Editor
                  height="90vh"
                  defaultLanguage="json"
                  theme="vs-light"
                  defaultValue={customCode}
                  onDidPaste={testCode}
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
export default React.memo(Tables);
