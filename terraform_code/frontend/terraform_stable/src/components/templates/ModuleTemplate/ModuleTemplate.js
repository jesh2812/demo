import React, { useState, useRef, useEffect, useCallback } from "react";
import Tables from "../../tables/tables";
import { useSelector, useDispatch } from "react-redux";
import { actions,initTableData } from "../../utils/dataCenter";
import DatalistInput from "react-datalist-input";
import { useLocation } from "react-router-dom";
import { FormLabel, FormControl, Switch } from "@chakra-ui/react";
import CustomDataListInput from "../../utils/CustomDataList/CustomDataListInput";
import { MdDriveFileRenameOutline } from "react-icons/md";
import TemplateModal from "../../utils/TemplateModal/TemplateModal";
import ButtonPanel from "../../utils/ButtonPanel/ButtonPanel";
import EditTables from "../../tables/editTables";

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
import { Input, useToast } from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

import "reactflow/dist/style.css";
import useResourceNode from "../../hooks/useResourceNode";
import ReactFlow, {
  updateEdge,
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
} from "reactflow";
import Sidebar from "../../utils/SideBar/Sidebar";
import "../../utils/SideBar/dnd.css";
import ContextMenu from "../../utils/ContextMenu/contextMenu";
import AxiosInstance from "../../utils/AxiosInstance";

function New_Template() {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const [provid, setProvid] = useState("");
  const [modul, setModul] = useState("");
  const [resour, setResour] = useState("");
  const [obj, setObj] = useState("");
  const [type, setType] = useState("");
  const [region, setRegion] = useState("");
  const attr_data = useSelector((state) => state.datacenter.attributes);
  const moduleNodes = useSelector((state) => state.datacenter.moduleNodes);
  const template_desc = useSelector(
    (state) => state.templateDataSlice.template_desc
  );

  const [exception, setException] = useState("");
  const [isException, setExceptionStatus] = useState(false);

  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();
  const {
    isOpen: variableIsOpen,
    onOpen: VariableOnOpen,
    onClose: variableOnClose,
  } = useDisclosure();
  const {
    isOpen: saveasIsOpen,
    onOpen: saveasOnOpen,
    onClose: saveasOnClose,
  } = useDisclosure();
  const {
    isOpen: isTemplateModalOpen,
    onOpen: onTemplateModalOpen,
    onClose: onTemplateModalClose,
  } = useDisclosure();
  const {
    isOpen: isGitModalOpen,
    onOpen: onGitModalOpen,
    onClose: onGitModalClose,
  } = useDisclosure();

  const {
    reactFlowWrapper,
    nodes,
    setNodes,
    edges,
    setEdges,
    reactFlowInstance,
    setReactFlowInstance,
    nodeData,
    setNodeData,
    isDeleteOpen,
    setIsOpen,
    position,
    setPosition,
    nodeDisplay,
    setNodeDisplay,
    currNodeSelected,
    setCurrNodeSelected,
    onConnect,
    handleMouseEnter,
    deleteNode,
    onDragOver,
    onNodeClick,
    onContextMenu,
    onEdgeUpdate,
    addNode,
    onNodesChange,
    onEdgesChange,
    onDrop,
    onNodeDrag,
  } = useResourceNode();

  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [executeTemplate, setExecutingTemplateName] = useState("");
  const [modalData, setModalData] = useState();
  const [executingTemplate, setExecuting] = useState(false);

  const [customModuleSwitch, setCustomModuleSwitch] = useState(false);
  const [customModule, setCustomModule] = useState("");

  const hidding = useSelector((state) => state.datacenter.hiding);
  const editorStatus = useSelector(
    (state) => state.datacenter.customCodeResourceStatus
  );
  const custom = useSelector((state) => state.datacenter.customCodeData);
  const resourceNodes = useSelector((state) => state.datacenter.resourceNodes);
  const body = useSelector((state) => state.datacenter.data);
  const importent = useSelector((state) => state.datacenter.important);
  const tables = useSelector((state) => state.datacenter.resourse);
  const curr_node_data = useSelector(
    (state) => state.datacenter.currentNodeActive
  );
  const template_name = useSelector(
    (state) => state.templateDataSlice.template_name
  );

  console.log(tables, body, importent);

  const dispatch = useDispatch();
  const [id, setId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [providerNames, setProviders] = useState([]);
  const [modulesNames, setModules] = useState([]);
  const [typeNames, setTypenames] = useState([]);
  const [resourcesNames, setResourses] = useState([]);
  const [selectTemplate, setTemplate] = useState(false);
  const [selectProvider, setProvider] = useState(false);
  const [selectModule, setModule] = useState(false);
  const [selectObject, setObject] = useState(false);
  const [selectType, setTypes] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [isValidTemplate, setTemplateValid] = useState(false);
  const [isValidProject, setProjectValid] = useState(false);
  const [isValidRole, setRoleValid] = useState(false);
  const [isValidObject, setObjectValid] = useState(false);
  const [objectExist, setObjectExist] = useState(false);
  const [checked, setChecked] = useState(false);
  const [isExistingTemplate, setExistingTemplate] = useState(false);
  const [moduleName, setModuleName] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [customModules, setCustomModules] = useState([]);

  const template = useRef();
  const templateDescription = useRef();
  const project_name = useRef();
  const role_name = useRef();
  const object = useRef();
  const save_module_name = useRef();
  const save_template_name = useRef();
  const save_module_desc = useRef();
  let temp = useRef(0);

  const [is_aws, setIsAws] = useState(false);
  const [regionNames, setRegionName] = useState([]);
  const [globalValueBody, setValueBody] = useState([]);
  const [argumentData, setArgumentData] = useState();
  const [attributeData, setAttributeData] = useState();
  const [variables, setVariables] = useState({});
  const [variblesExistance, setVariablesExistance] = useState();
  const [variableArguments, setVariableArguments] = useState([]);
  const itemsRef = useRef([]);
  const btnRef = React.useRef();

  const location = useLocation();

  const { state } = location;

  const createWorkflow = () => {
    console.log("WOrk flow");
  };

  const chooseRegions = () => {
    const regions = [
      "us-east-2",
      "us-east-1",
      "us-west-1",
      "us-west-2",
      "af-south-1",
      "ap-east-1",
      "ap-southeast-3",
      "ap-south-1",
      "ap-northeast-3",
      "ap-northeast-2",
      "ap-southeast-1",
      "ap-southeast-2",
      "ap-northeast-1",
      "ca-central-1",
      "eu-central-1",
      "eu-west-1",
      "eu-west-2",
      "eu-south-1",
      "eu-west-3",
      "eu-north-1",
      "me-south-1",
      "sa-east-1",
      "us-gov-east-1",
      "us-gov-west-1",
    ];
    let region_list = [];
    for (const ele of regions) {
      region_list.push({ id: ele, value: ele });
    }
    setRegionName(region_list);
  };

  const setProviderValue = (value) => {
    if (value == "aws") {
      setIsAws(true);
    } else {
      setIsAws(false);
    }
  };

  function find_in_attributes(name) {
    for (let index = 0; index < attributeData[0].length; index++) {
      if (name == attributeData[0][index]["Attribute_Name"]) {
        return true;
      }
    }

    return false;
  }

  function is_variable(argument_name, obj_name, is_child) {
    if (!is_child) {
      for (const hide_ele in hidding) {
        if (hidding[hide_ele]["object_name"] == obj_name) {
          for (const argument in hidding[hide_ele]["Arguments"]) {
            if (typeof hidding[hide_ele]["Arguments"][argument] == "boolean") {
              if (argument == argument_name) {
                if (hidding[hide_ele]["Arguments"][argument_name] == true) {
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
      for (const hide_ele in hidding) {
        if (hidding[hide_ele]["object_name"] == obj_name) {
          for (const argument in hidding[hide_ele]["Arguments"]) {
            if (typeof hidding[hide_ele]["Arguments"][argument] != "boolean") {
              for (const sub_attr in hidding[hide_ele]["Arguments"][argument]) {
                if (sub_attr == argument_name) {
                  if (
                    hidding[hide_ele]["Arguments"][argument][sub_attr] == true
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

  const getArgumentValue = (argument_name, obj_name, is_child) => {
    if (!is_child) {
      for (const body_ele in body) {
        if (body[body_ele]["object_name"] == obj_name) {
          for (const argument in body[body_ele]["Arguments"]) {
            if (argument == argument_name) {
              return body[body_ele]["Arguments"][argument_name].value;
            }
          }
        }
      }
    } else {
      for (const body_ele in body) {
        if (body[body_ele]["object_name"] == obj_name) {
          for (const argument in body[body_ele]["Arguments"]) {
            for (const sub_attr in body[body_ele]["Arguments"][argument]) {
              if (sub_attr == argument_name) {
                return body[body_ele]["Arguments"][argument][sub_attr].value;
              }
            }
          }
        }
      }
    }
  };

  const selectVariables = () => {
    const variable_arguments = [];

    for (const i in hidding) {
      for (const j in hidding[i]["Arguments"]) {
        if (typeof hidding[i]["Arguments"][j] == "boolean") {
          if (hidding[i]["Arguments"][j] == true) {
            const value = getArgumentValue(j, hidding[i]["object_name"], false);
            variable_arguments.push(value);
          }
        } else {
          for (const child in hidding[i]["Arguments"][j]) {
            if (hidding[i]["Arguments"][j][child] == true) {
              const value = getArgumentValue(
                child,
                hidding[i]["object_name"],
                true
              );
              variable_arguments.push(value);
            }
          }
        }
      }
    }
    return variable_arguments;
  };

  const hasCustomCode = (obj) => {
    for (const i of editorStatus) {
      if (i.object_name === obj) {
        return i.status;
      }
    }
  };

  const getCustomData = (obj) => {
    for (const i of custom) {
      if (i.object_name === obj) {
        return i;
      }
    }
  };

  const removeCustomModules = () => {
    dispatch(actions.clearState());

    setNodes([]);
    setEdges([]);
  };

  async function selectingArguments(modules_save) {
    let flag = 0;
    const valueBody = [];
    const custom_code_arr = [];

    if (selectVariables().length != 0) {
      setVariablesExistance(true);
      const variable_arguments = selectVariables();
      setVariableArguments(variable_arguments);
    } else {
      setVariablesExistance(false);
      setVariableArguments({});
    }

    for (let a = 0; a < body.length; a++) {
      if (hasCustomCode(body[a]["object_name"])) {
        continue;
      }

      for (const b in importent[a]["Arguments"]) {
        if (importent[a]["Arguments"][b] == "") {
          if (body[a]["Arguments"][b].value == "" && !find_in_attributes(b)) {
            flag = 1;
            break;
          }
        } else {
          for (const c in importent[a]["Arguments"][b]) {
            if (body[a]["Arguments"][b][c].value != undefined) {
              if (body[a]["Arguments"][b][c].value == "") {
                flag = 1;
                break;
              }
            } else {
              console.log("Undefined", body[a]["Arguments"][b][c].value);
            }
          }
        }
      }
    }

    if (flag == 0) {
      console.log("Body new template", body);
      for (const a of body) {
        if (hasCustomCode(a["object_name"])) {
          const customDataCall = getCustomData(a["object_name"]);
          const custom_args = {
            module: a["module"],
            resource: customDataCall["resource"],
            object_name: a["object_name"],
            custom_code: customDataCall["custom_code"],
          };
          custom_code_arr.push(custom_args);
          continue;
        }

        valueBody.push({
          module: a["module"],
          resource: a["resource"],
          object_name: a["object_name"],
          Resource_Type: a["Resource_type"],
          Arguments: {},
          Attributes:
            attr_data[a["object_name"]] != undefined
              ? attr_data[a["object_name"]]
              : [],
        });

        for (const b in a["Arguments"]) {
          if (a["Arguments"][b].value != undefined) {
            if (a["Arguments"][b].value != "") {
              if (is_variable(b, a["object_name"], false)) {
                let temp = {
                  value: a["Arguments"][b].value,
                  is_variable: true,
                };
                const temp_valBody = valueBody.map((ele) => {
                  if (ele.object_name === a["object_name"])
                    ele["Arguments"][b] = temp;
                  return ele;
                }, []);
              } else {
                let temp1 = {
                  value: a["Arguments"][b].value,
                  is_variable: false,
                };

                const temp_valBody = valueBody.map((ele) => {
                  if (ele.object_name === a["object_name"])
                    ele["Arguments"][b] = temp1;
                  return ele;
                }, []);
              }
            }
          } else {
            let valBody_obj = valueBody.filter((ele) => {
              return ele.object_name === a["object_name"];
            }, {});

            valBody_obj = valBody_obj[0];

            valBody_obj["Arguments"][b] = {};
            for (const c in a["Arguments"][b]) {
              if (
                a["Arguments"][b][c].value != undefined &&
                a["Arguments"][b][c].value != ""
              ) {
                let inner_flag = 0;
                for (let index = 0; index < argumentData.length; index++) {
                  if (argumentData[index]["Arguments_Name"] == b) {
                    valBody_obj["Arguments"] = b;
                    inner_flag = 1;
                    break;
                  }
                }
                if (!inner_flag) {
                  let var_string = a["Arguments"][b][c];
                  if (var_string.value != "") {
                    valBody_obj["Arguments"][b][c] = var_string;
                  }
                }
              } else if (a["Arguments"][b][c].value == undefined) {
                let temp_dict = {};
                for (const i in a["Arguments"][b][c]) {
                  if (
                    i.value != undefined ||
                    a["Arguments"][b][c][i].value == ""
                  ) {
                    continue;
                  } else {
                    temp_dict[i] = a["Arguments"][b][c][i];
                  }
                }

                if (Object.keys(temp_dict).length != 0) {
                  valBody_obj["Arguments"][b][c] = temp_dict;
                }
              }
            }
          }
        }
      }

      setValueBody([...globalValueBody, ...valueBody]);
      console.log("New Template valuebody", valueBody);
      const response = await AxiosInstance.post("/validation", {
        template_name: template_name,
      });

      const data = response.data;

      let call_url = "/saveModule";
      if (data == "Failed") {
        call_url = "/editModule";
      }

      const updated_nodes = [];
      for (const i of nodes) {
        for (const j of resourceNodes) {
          if (i.id === j.id) {
            updated_nodes.push({
              ...j,
              position: { x: i.position.x, y: i.position.y },
            });
          }
        }
      }

      let body_object = {
        provider: provid,
        template_name: template_name,
        template_desc: template_desc,
        data: valueBody,
        custom: custom_code_arr.length !== 0 ? true : false,
        custom_data: custom_code_arr,
        nodes: updated_nodes,
        edges: edges,
      };
      console.log("Modules save", body_object)

      const response1 = await AxiosInstance.post(call_url, {
        provider: provid,
        template_name: template_name,
        template_desc: template_desc,
        data: valueBody,
        custom: custom_code_arr.length !== 0 ? true : false,
        custom_data: custom_code_arr,
        nodes: updated_nodes,
        edges: edges,
      });

      if (response1.status == 200) {
        console.log("success");
        const data = response1.data;
        toast({
          title: "Saved Successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom-left",
        });
      } else {
        const data = response1.data;

        if (data.message == undefined) {
          setException(data);
        } else {
          setException(data.message);
        }
        setExceptionStatus(true);
      }
    } else {
      console.log("fail");
      toast({
        title: "Please fill all required fields!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  async function selectingModule(e) {
    setLoading(true);
    const response = await AxiosInstance.post("/template", {
      id: "module",
      provider: e,
    });
    const data = response.data;
    const modulesList = [];
    for (const a of data) {
      modulesList.push({ id: a, value: a });
    }
    setModules(modulesList);
    setLoading(false);
    setResourses([]);
    setModul("");
    setResour("");
  }

  const fetchCustomModules = async () => {
    const modules_response_data = await AxiosInstance.get("/listModules");

    const modules = modules_response_data.data;

    const display_modules_list = modules.map((ele) => {
      return { id: ele.module_name, value: ele.module_name };
    });

    setCustomModules(display_modules_list);
  };
  async function selectingResourses(e) {
    setLoading(true);
    const response = await AxiosInstance.post("/template", {
      id: "resource",
      provider: provid.toLowerCase(),
      type: e,
      modulename: modul,
    });

    const data = response.data;

    const resoursesList = [];
    for (const i of data) {
      resoursesList.push({ id: i, value: i });
    }
    setResourses(resoursesList);
    setLoading(false);
    setResour("");
  }

  async function customModuleSubmitHandler(r, m, t, o, p) {
    setLoading(true);
    dispatch(actions.addNewResourceNode([o, o, r]));
    const arguments_response = await AxiosInstance.post("/template", {
      id: "arguments",
      provider: p.toLowerCase(),
      modulename: m,
      type: t,
      resourcename: r,
    });

    const attributes_response = await AxiosInstance.post("/template", {
      id: "attributes",
      provider: p.toLowerCase(),
      modulename: m,
      type: t,
      resourcename: r,
    });

    const attributes_data = attributes_response.data;
    const arguments_data = arguments_response.data;

    setArgumentData(arguments_data);
    setAttributeData(attributes_data);

    arguments_data[1] = r;
    arguments_data[2] = o;
    setLoading(false);
    dispatch(actions.addingNew([m, r, o, t]));
    dispatch(actions.createHide([m, r, o]));
    dispatch(actions.addingImportantNew([m, r, o]));
    dispatch(actions.createDeleteList(o));
    dispatch(actions.createNewTableData(o));
    dispatch(actions.createAttrDeleteList(o));
    dispatch(
      actions.addNewResourse([
        temp.current,
        [temp.current, arguments_data, true, attributes_data],
      ])
    );
    temp.current = temp.current + 1;

    setProvid(p.toLowerCase());
    setModul("");
    setResour("");
    setType("");
    setModules([]);
    setProviders([]);
    setTypenames([]);
    setResourses([]);
    selectingModule(p);
  }

  async function addModules(module_name) {
    const response = await AxiosInstance.post("/getmodule", {
      module_name: module_name,
    });
    const data = response.data;
    console.log(data);
    if (data[0]["custom_data"]) {
      for (const i of data[1]["custom_data"]) {
        dispatch(
          actions.addCustomCodeForEdit([
            i["object_name"],
            i["resource"],
            i["custom_code"],
          ])
        );
        dispatch(actions.modifyEditorStatus([i["object_name"]]));
      }
    }

    for (const i of data[0].nodes) {
      dispatch(
        actions.addEditResourceNode([
          i.id,
          i.id,
          i.data.label,
          i.data.is_displayed,
          i.position.x,
          i.position.y,
        ])
      );
    }

    setNodes(data[0].nodes);
    setEdges(data[0].edges);

    for (const a of data[0].data) {
      const response = await AxiosInstance.get("/listModules");
      const data1 = response.data;

      for (const b of data1) {
        if (module_name == b.module_name) {
          template_name = b.module_name;
          templateDescription.current.value = b.module_desc;
          customModuleSubmitHandler(
            a.resource,
            a.module,
            a.Resource_Type,
            a.object_name,
            b.provider
          );
          console.log("Testing-------->", a, b);
          dispatch(
            actions.addtoEditData([a.object_name, a.Arguments, a.Attributes])
          );
          dispatch(actions.addToEditVariables([a.object_name, a.Variables]));
          dispatch(actions.createAttrDeleteList(a.object_name));
          for (const attr of a.Attributes) {
            dispatch(actions.addNewAttribute([a.object_name, attr]));
          }
          setProvid(b.provider);
        }
      }
    }
  }

  async function submitHandler(e) {
    setLoading(true);
    dispatch(actions.addNewResourceNode([obj, obj, e]));
    dispatch(initTableData(obj))
    const arguments_response = await AxiosInstance.post("/template", {
      id: "arguments",
      provider: provid.toLowerCase(),
      modulename: modul,
      type: type,
      resourcename: e,
    });

    const attributes_response = await AxiosInstance.post("/template", {
      id: "attributes",
      provider: provid.toLowerCase(),
      modulename: modul,
      type: type,
      resourcename: e,
    });

    const attributes_data = attributes_response.data;
    const arguments_data = arguments_response.data;

    setArgumentData(arguments_data);
    setAttributeData(attributes_data);

    arguments_data[1] = e;
    arguments_data[2] = obj;
    setLoading(false);
    dispatch(actions.addingNew([modul, e, obj, type]));
    dispatch(actions.createHide([modul, e, obj]));
    dispatch(actions.addingImportantNew([modul, e, obj, type]));
    dispatch(actions.createDeleteList(obj));
    dispatch(actions.createAttrDeleteList(obj));
    dispatch(actions.createNewTableData(obj));
    dispatch(
      actions.addNewResourse([id, [id, arguments_data, true, attributes_data]])
    );
    setId(id + 1);
    object.current.value = "";
    setModul("");
    setResour("");
    setType("");
    setTypenames([]);
    setResourses([]);
  }

  async function templateValidation() {
    const name = template_name;
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_,. ";
    let flag = 0;
    for (const a of name) {
      if (!characters.includes(a)) {
        flag = 1;
        break;
      }
    }
    if (flag != 0) {
      setTemplateValid(true);
    } else {
      setTemplateValid(false);
      const response = await AxiosInstance.post("/validation", {
        template_name: template_name,
      });
      const data = response.data;
      if (data == "Failed") {
        setExistingTemplate(true);
      } else {
        setExistingTemplate(false);

        setProviders([
          { id: "AWS", value: "AWS" },
          { id: "GCP", value: "GCP" },
          { id: "AZURE", value: "Azure" },
          { id: "SNOWFLAKE", value: "Snowflake" },
        ]);
      }
    }
  }

  function projectValidation() {
    const name = project_name.current.value;
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_,. ";
    let flag = 0;
    for (const a of name) {
      if (!characters.includes(a)) {
        flag = 1;
        break;
      }
    }
    if (flag != 0) {
      setProjectValid(true);
    } else {
      setProjectValid(false);
    }
  }

  function roleValidation() {
    const name = role_name.current.value;
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_,. ";
    let flag = 0;
    for (const a of name) {
      if (!characters.includes(a)) {
        flag = 1;
        break;
      }
    }
    if (flag != 0) {
      setRoleValid(true);
    } else {
      setRoleValid(false);
    }
  }

  function objectValidation() {
    const name = object.current.value;
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_,. ";
    let flag = 0;
    let flag1 = 0;
    for (const a of name) {
      if (!characters.includes(a)) {
        flag = 1;
        break;
      }
    }
    for (const a of body) {
      if (a["object_name"] == name) {
        flag1 = 1;
        break;
      }
    }
    if (flag1 == 1) {
      setObjectExist(true);
    } else {
      setObjectExist(false);
    }
    if (object.current.value == "") {
      setProviders([]);
    }

    if (flag != 0) {
      setObjectValid(true);
    } else {
      setObjectValid(false);
      setObj(object.current.value);
    }
  }

  async function executingscript(template_name) {
    const temp_variables = handleVariableValues();
    console.log("temp_variables", temp_variables);
    const response = await fetch("/script", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        template_name: template_name,
        variables: temp_variables,
      }),
    });
  }

  const handleVariableValues = () => {
    const final_variables = {};

    let idx = 0;
    for (const i of itemsRef.current) {
      if (i != null) {
        final_variables[variableArguments[idx++]] = i.value;
      }
    }

    return final_variables;
  };

  const handleWorkflowClick = () => {
    setNodeDisplay(false);
    setCurrNodeSelected("");
  };

  useEffect(() => {
    setTimeout(() => setExecuting(false), 3000);
  }, [executingTemplate]);

  useEffect(() => {
    setTimeout(() => setChecked(false), 3000);
  }, [checked]);

  useEffect(() => {
    setTimeout(() => setExceptionStatus(false), 3000);
  }, [isException]);

  useEffect(() => {
    setNodes(resourceNodes);
  }, [resourceNodes]);

  useEffect(() => {
    setNodes(moduleNodes);
  }, [moduleNodes]);

  return (
    <div class="wrapper">
      <>
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={variableIsOpen}
          onClose={variableOnClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Enter Variable Values</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {variblesExistance &&
                variableArguments.map((item, idx) => (
                  <>
                    <FormLabel>{item}</FormLabel>
                    <Input
                      type="text"
                      ref={(el) => (itemsRef.current[idx] = el)}
                      placeholder="Enter Value"
                    />
                  </>
                ))}
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  handleVariableValues();
                  setExecuting(true);
                  executingscript(executeTemplate);
                  onClose();
                  variableOnClose();
                }}
              >
                Execute
              </Button>
              <Button
                onClick={() => {
                  variableOnClose();
                }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>

      <>
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={saveasIsOpen}
          onClose={saveasOnClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Save</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <>
                <FormLabel>Module Name</FormLabel>
                <Input
                  type="text"
                  ref={save_template_name}
                  placeholder="Enter template name"
                />
              </>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  template_name = save_template_name.current.value;
                  selectingArguments(false);
                  saveasOnClose();
                }}
              >
                Save
              </Button>
              <Button
                onClick={() => {
                  saveasOnClose();
                }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>

      <>
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {modalData == 0 && "Delete Module"}
              {modalData == 1 && "Execute Module"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {modalData == 0 && "Are you sure, you want to delete the module?"}
              {modalData == 1 &&
                "Are you sure, you want to execute the module?"}
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme={
                  (modalData == 0 && "red") || (modalData == 1 && "blue")
                }
                mr={3}
                onClick={() => {
                  if (modalData == 0) {
                    onClose();
                  } else {
                    {
                      if (variblesExistance) {
                        VariableOnOpen();
                      } else {
                        setExecuting(true);
                        executingscript(executeTemplate);
                        onClose();
                      }
                    }
                  }
                }}
              >
                {modalData == 0 && "Delete"}
                {modalData == 1 && "Execute"}
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>

      <>
        <Drawer
          isOpen={isDrawerOpen}
          placement="left"
          onClose={onDrawerClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Create New Resource</DrawerHeader>

            <DrawerBody>
              <div
                onClick={() => {
                  if (template_name == "") {
                    setTemplate(true);
                    console.log("Empty template name");
                  }
                  templateValidation();
                  setProvider(false);
                }}
              >
                {selectTemplate && <p id="p1">Please Enter Template Name</p>}
                <DatalistInput
                  placeholder="Select Provider"
                  value={provid}
                  setValue={setProvid}
                  label="Provider *"
                  className="datalist"
                  onSelect={(item) => {
                    if (provid == "") {
                      selectingModule(item.value.toLowerCase());
                      setProvid(item.value.toLowerCase());
                      setProviderValue(item.value.toLowerCase());
                    }
                  }}
                  onChange={() => {
                    if (tables.length != 0) {
                      setProvid(provid);
                    }
                  }}
                  items={providerNames}
                />
              </div>
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="custom-modules" mb="0">
                  Use Custom Modules?
                </FormLabel>
                <Switch
                  onChange={(e) => {
                    if (e.target.checked) {
                      fetchCustomModules();
                    } else {
                      removeCustomModules();
                    }
                    setCustomModuleSwitch(!customModuleSwitch);
                  }}
                  id="custom-modules"
                />
              </FormControl>

              {customModuleSwitch && (
                <CustomDataListInput
                  options={customModules}
                  placeholder="Select Custom Module"
                  onSelect={(item) => {
                    setCustomModule(item.toLowerCase());
                    addModules(item);
                  }}
                />
              )}

              <div className="hide-divs">
                {isValidProject && <p id="p1">Don't Use Special Characters</p>}
                <label htmlFor="project">Project</label>
                <input
                  type={"text"}
                  placeholder={"Project Name"}
                  name="project"
                  onChange={projectValidation}
                  ref={project_name}
                ></input>
              </div>

              <div className="hide-divs">
                {isValidRole && <p id="p1">Don't Use Special Characters</p>}
                <label htmlFor="role">Role Name</label>
                <input
                  type={"text"}
                  placeholder={"Eg.Manager"}
                  name="role"
                  onChange={roleValidation}
                  ref={role_name}
                ></input>
              </div>

              <div
                onClick={() => {
                  if (provid == "") {
                    setProvider(true);
                  }
                  setModule(false);
                }}
              >
                {selectProvider && <p id="p1">Please Select Provider</p>}
                <DatalistInput
                  placeholder="Select Module"
                  value={modul}
                  setValue={setModul}
                  label="Module *"
                  className="datalist"
                  onSelect={(item) => {
                    setModul(item.value);
                    setTypenames([
                      { id: "Resource", value: "Resource" },
                      { id: "Data Source", value: "Data Source" },
                    ]);
                  }}
                  items={modulesNames}
                />
              </div>
              <div
                onClick={() => {
                  if (modul == "") {
                    setModule(true);
                  }
                  setTypes(false);
                }}
              >
                {selectModule && <p id="p1">Please Select Module</p>}
                <DatalistInput
                  placeholder="Select Type"
                  value={type}
                  setValue={setType}
                  label="Type *"
                  className="datalist"
                  onSelect={(item) => {
                    setType(item.value);
                    selectingResourses(item.value);
                    chooseRegions();
                  }}
                  items={typeNames}
                />
              </div>
              <div
                onClick={() => {
                  if (template_name == "") {
                    setObject(true);
                  }
                }}
              >
                {isValidObject && <p id="p1">Don't Use Special Characters</p>}
                {selectObject && <p id="p1">Please Enter Template Name</p>}
                {object == "" && (
                  <p id="p1">Object Name Null, Please fill it</p>
                )}
                {objectExist && (
                  <p id="p1">Object Name Already Exists, Please Try Another</p>
                )}
                <label htmlFor="objectName">Service Name * </label>
                <input
                  type={"text"}
                  placeholder={"Object Name"}
                  name="objectName"
                  ref={object}
                  onChange={() => {
                    if (template_name == "") {
                      object.current.value = "";
                    } else {
                      objectValidation();
                    }
                  }}
                ></input>
              </div>
              <div
                onClick={() => {
                  if (type == "") {
                    setTypes(true);
                  }
                }}
              >
                {selectType && <p>Please Select Type</p>}
                {is_aws && (
                  <DatalistInput
                    placeholder="Select Region"
                    value={region}
                    label="Region *"
                    setValue={setRegion}
                    className="datalist"
                    onSelect={(item) => {
                      setRegion(item.value);
                    }}
                    items={regionNames}
                  />
                )}

                <DatalistInput
                  placeholder="Select Resourse"
                  value={resour}
                  setValue={setResour}
                  label="Resourse *"
                  className="datalist"
                  id="resourceList"
                  onSelect={(item) => {
                    setResour(item.value);
                  }}
                  items={resourcesNames}
                />
              </div>
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onDrawerClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => {
                  submitHandler(resour, modul, type, obj, provid);
                }}
              >
                Add
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>

      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={onTemplateModalClose}
      />

      <div
        className="options-panel-element"
        style={{
          width: "max-content",
          display: "flex",
          flexDirection: "row",
          fontSize: "18px",
          margin: "10px 20px",
          position:"absolute",
          backgroundColor:"white !important",
          zIndex:100,
        }}
        onClick={onTemplateModalOpen}
      >
        <span style={{ fontSize: "13px", marginRight: "3px" }}>
          {template_name}
        </span>
        <MdDriveFileRenameOutline />
      </div>

      <div id="div3">
        {loading && <div class="loader"></div>}

        <div
          id="div4"
          onClick={() => {
            setErrorMessage(false);
          }}
        >
          {nodeDisplay && (
            <button
              style={{
                background: "#5e5ee4",
                color: "white",
                padding: "10px",
                borderRadius: "5px",
                marginTop:"50px"
              }}
              onClick={handleWorkflowClick}
            >
              <i class="fa-solid fa-arrow-left"></i> Workflow
            </button>
          )}
          
          {!nodeDisplay && (
            <div className="dndflow">
              <ReactFlowProvider>
                <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onInit={setReactFlowInstance}
                    onDrop={onDrop}
                    onNodeMouseEnter={handleMouseEnter}
                    onDragOver={onDragOver}
                    onNodeContextMenu={onContextMenu}
                    onNodeClick={onNodeClick}
                    onEdgeUpdate={onEdgeUpdate}
                    onNodeDrag={onNodeDrag}
                    zoom={0.8}
                    fitView={false}
                  >
                    <ContextMenu
                      isOpen={isDeleteOpen}
                      onMouseLeave={() => setIsOpen(false)}
                      position={position}
                      actions={[
                        { label: "Delete Resource", effect: deleteNode },
                        {
                          label: "Edit Resource",
                          effect: () => console.log("none"),
                        },
                      ]}
                    />

                    <Background />
                    <Controls
                      style={{ position: "absolute", bottom: "-14px" }}
                    ></Controls>
                    <MiniMap nodeStrokeWidth={3} />
                  </ReactFlow>
                </div>
              </ReactFlowProvider>
            </div>
          )}

          {nodeDisplay && !customModuleSwitch &&
            curr_node_data.map((data) => (
              <Tables
                key={data[1][2]}
                id={data[0]}
                data={data[1]}
                output_data={data[3]}
              />
            ))}

          {nodeDisplay && customModuleSwitch &&
            curr_node_data.map((data) => (
              <EditTables
                key={data[1][2]}
                id={data[0]}
                data={data[1]}
                output_data={data[3]}
              />
            ))}
        </div>

        <ButtonPanel
          onClick={() => console.log("kk")}
          saveClick={() => selectingArguments()}
          saveAsClick={() => saveasOnOpen()}
          addResourceClick={onDrawerOpen}
          gitClick={() => {
            onGitModalOpen();
          }}
          executeClick={() => {
            {
              {
                if (variblesExistance) {
                  VariableOnOpen();
                } else {
                  onOpen();
                }
                setExecutingTemplateName(template_name);
                toast({
                  title: "Execution Successfull!",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                  position: "bottom-left",
                });
                setModalData(1);
              }
            }
          }}
          style={{ marginLeft: "40% !important" }}
        />
      </div>
    </div>
  );
}
export default New_Template;
