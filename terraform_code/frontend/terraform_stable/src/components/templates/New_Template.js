import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactDom from "react-dom";
import Tables from "../tables/tables";
import { useSelector, useDispatch } from "react-redux";
import { actions, updateTemplateName } from "../utils/dataCenter";
import DatalistInput from "react-datalist-input";
import { useLocation } from "react-router-dom";
import { Textarea } from "@chakra-ui/react";
import EditTables from "../tables/editTables";
import { FormLabel } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import ButtonPanel from "../utils/ButtonPanel/ButtonPanel";
import TemplateDrawer from "../utils/TemplateDrawer/TemplateDrawer";
import TemplateModal from "../utils/TemplateModal/TemplateModal";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { nodeTypes } from "../nodes/FeaturesNode";
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

import "reactflow/dist/style.css";
import ReactFlow, {
  updateEdge,
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
  addEdge,
} from "reactflow";
import "../utils/SideBar/dnd.css";
import ContextMenu from "../utils/ContextMenu/contextMenu";
import useResourceNode from "../hooks/useResourceNode";
import AxiosInstance from "../utils/AxiosInstance";
import {
  updateProvider,
  updateModuleName,
  updateType,
  updateRegion,
  updateResourceName,
  clearTemplateDataState,
  updateTemplateSavedStatus,
  initTableData,
} from "../utils/dataCenter";
import GitModal from "../utils/GitModal/GitModal";

function New_Template() {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  //const [provid, setProvid] = useState("");
  //const [modul, setModul] = useState("");
  //const [resour, setResour] = useState("");
  //const [obj, setObj] = useState("");
  const obj = useSelector((state) => state.templateDataSlice.object_name);
  const modul = useSelector((state) => state.templateDataSlice.module_name);
  const type = useSelector((state) => state.templateDataSlice.type);
  const resour = useSelector((state) => state.templateDataSlice.resource_name);
  const region = useSelector((state) => state.templateDataSlice.region);

  //const [type, setType] = useState("");
  //const [region, setRegion] = useState("");
  const attr_data = useSelector((state) => state.datacenter.attributes);
  const provid = useSelector((state) => state.templateDataSlice.provider);
  const template_name = useSelector(
    (state) => state.templateDataSlice.template_name
  );
  const language_option = useSelector(
    (state) => state.templateDataSlice.language
  );
  const region_option = useSelector(
    (state) => state.templateDataSlice.region
  );
  const snowflakeID = useSelector(
    (state) => state.templateDataSlice.snowflakeId
  );
  //console.log(region_option,"shdh")
  const template_desc = useSelector(
    (state) => state.templateDataSlice.template_desc
  );

  const [exception, setException] = useState("");
  const [isException, setExceptionStatus] = useState(false);
  //const [provid, setProvid] = useState("");

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
    isOpen: saveModuleIsOpen,
    onOpen: saveModuleOnOpen,
    onClose: saveModuleOnClose,
  } = useDisclosure();

  const {
    isOpen: isGitModalOpen,
    onOpen: onGitModalOpen,
    onClose: onGitModalClose,
  } = useDisclosure();

  const {
    isOpen: isTemplateModalOpen,
    onOpen: onTemplateModalOpen,
    onClose: onTemplateModalClose,
  } = useDisclosure({ defaultIsOpen: true });

  const toast = useToast();

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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [executeTemplate, setExecutingTemplateName] = useState("");
  const [modalData, setModalData] = useState();
  const [executingTemplate, setExecuting] = useState(false);
  const [execute, setExecute] = useState([]);
  const [executeComponent, setExecuteComponent] = useState([]);
  const [isExecuteSelected, setExecuteSelected] = useState(false);

  const [nodeTableData, setNodeTableData] = useState([]);
  const [customModuleSwitch, setCustomModuleSwitch] = useState(false);
  const [customModule, setCustomModule] = useState("");

  const hidding = useSelector((state) => state.datacenter.hiding);
  const selectProvider = useSelector(
    (state) => state.templateDataSlice.validation.provider
  );
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
  const moduleNodes = useSelector((state) => state.datacenter.moduleNodes);
  const selectTemplate = useSelector(
    (state) => state.templateDataSlice.validation.template
  );
  const selectObject = useSelector(
    (state) => state.templateDataSlice.validation.object
  );

  // const region_option = useSelector(
  //   (state) => state.templateDataSlice.validation.object
  // );

  const dispatch = useDispatch();
  const [id, setId] = useState(0);
  const [loading, setLoading] = useState(false);

  const providerNames = useSelector(
    (state) => state.templateDataSlice.providerNames
  );
  const [modulesNames, setModules] = useState([]);
  const [typeNames, setTypenames] = useState([]);
  const [resourcesNames, setResourses] = useState([]);
  //const [selectTemplate, setTemplate] = useState(false);
  //const [selectProvider, setProvider] = useState(false);
  const [selectModule, setModule] = useState(false);
  //const [selectObject, setObject] = useState(false);
  const [selectType, setTypes] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [prompt, setPrompt] = useState(false);
  const [isValidTemplate, setTemplateValid] = useState(false);
  const [isValidProject, setProjectValid] = useState(false);
  const [isValidRole, setRoleValid] = useState(false);
  const [isValidObject, setObjectValid] = useState(false);
  const [isAccessTokenValid, setAccessTokenValid] = useState(false);
  const [isRepoNameValid, setRepoNameValid] = useState(false);
  const [isMessagevalid, setMessageValid] = useState(false);
  const [objectExist, setObjectExist] = useState(false);
  const [checkin, setCheckIn] = useState(false);
  const [fieldsCheck, setFiedlsCheck] = useState(false);
  const [saved, setSaved] = useState(false);
  const [checked, setChecked] = useState(false);
  const [isExistingTemplate, setExistingTemplate] = useState(false);
  const [isBranchValid, setBranchValid] = useState(false);
  const [moduleName, setModuleName] = useState("");

  const [moduleDescription, setModuleDescription] = useState("");
  const [customModules, setCustomModules] = useState([]);
  const isTemplatePanelOpen = useSelector(
    (state) => state.templateDataSlice.isTemplatePanelOpen
  );

  const template = useRef();
  const templateDescription = useRef();
  const project_name = useRef();
  const role_name = useRef();
  const object = useRef();
  const accessToken = useRef();
  const repoName = useRef();
  const message = useRef();
  const branch = useRef();
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
  const { project } = state;

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

  const snowRegions = () => {
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

  function afterExecution() {
    for (const a of execute) {
      if (a[3] == -1) {
        dispatch(actions.addColumnValue([a[0], a[1], a[2], a[4]]));
      } else {
        dispatch(actions.addColumnSubValue([a[0], a[1], a[2], a[3], a[4]]));
      }
    }
    setExecuteSelected(false);
  }

  async function checkingin() {
    const response = await AxiosInstance.post("/template", {
      id: "validate",
      AccessToken: accessToken.current.value,
      repo: repoName.current.value,
      Message: message.current.value,
      filename: template_name,
      branch: branch.current.value,
      edit: "no",
      provider: provid,
    });
    if (response.status == 200) {
      const data = response.data;
      setChecked(true);
    } else {
      const data = response.data;
      console.log(response);

      if (data.message == undefined) {
        setException(data);
        console.log(data);
      } else {
        console.log(data.message);
        setException(data.message);
      }
      setExceptionStatus(true);
    }
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

  async function selectingArguments(template_name) {
    let flag = 0;
    const valueBody = [];
    const custom_code_arr = [];

    const modulesList = moduleNodes.map((ele) => ele.id);

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
          if (body[a]["Arguments"][b].value == "") {
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
        console.log(attr_data);
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

      let call_url = "/savetemplate";
      if (data == "Failed") {
        call_url = "/edittemplate";
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
        template_desc: template_desc, //templateDescription.current?.value,
        data: valueBody,
        language: language_option,
        region: region_option,
        snowflakeId: snowflakeID,
        custom: custom_code_arr.length !== 0 ? true : false,
        custom_data: custom_code_arr,
        nodes: updated_nodes,
        edges: edges,
        modules_save: moduleNodes.length > 0 ? true : false,
        project: project,
        modulesList: modulesList,
      };

      console.log(body_object);
      if(prompt){
      const response1 = await AxiosInstance.post(call_url, {
        provider: provid,
        template_name: template_name,
        template_desc: template_desc, //templateDescription.current?.value,
        data: valueBody,
        custom: custom_code_arr.length !== 0 ? true : false,
        custom_data: custom_code_arr,
        language: language_option,
        region: region_option,
        snowflakeId: snowflakeID,
        nodes: updated_nodes,
        edges: edges,
        modules_save: moduleNodes.length > 0 ? true : false,
        project: project,
        modulesList: modulesList,
      });
      console.log(response1);
      if (response1.status == 200) {
        dispatch(updateTemplateSavedStatus(true));
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
      dispatch(updateTemplateSavedStatus(false));
      toast({
        title: "Please fill all required fields!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }
  else{
    dispatch(updateTemplateSavedStatus(false));
      toast({
        title: "Please fill all required fields!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
  }
  }

  async function submitHandler(e) {
    setLoading(true);
    console.log("Object_name", e);
    dispatch(actions.addNewResourceNode([obj, obj, e]));
    dispatch(initTableData(obj));
    console.log("provider", provid);
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

    console.log(attributes_data, arguments_data);

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
    dispatch(updateModuleName(""));
    dispatch(updateType(""));
    //dispatch(updateRegion(""));
    dispatch(updateResourceName(""));

    //setTypenames([]);
    //setResourses([]);
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

  function accessTokenValidation() {
    const name = accessToken.current.value;
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
      setAccessTokenValid(true);
    } else {
      setAccessTokenValid(false);
    }
  }
  function repoNameValidation() {
    const name = repoName.current.value;
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
      setRepoNameValid(true);
    } else {
      setRepoNameValid(false);
    }
  }
  function branchValidation() {
    const name = branch.current.value;
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
      setBranchValid(true);
    } else {
      setBranchValid(false);
    }
  }

  function messageValidation() {
    const name = message.current.value;
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
      setMessageValid(true);
    } else {
      setMessageValid(false);
    }
  }

  async function executingscript(template_name) {
    const temp_variables = handleVariableValues();
    console.log("temp_variables", temp_variables);
    const response = await AxiosInstance.post("/script", {
      template_name: template_name,
      variables: temp_variables,
    });
  }

  const removeCustomModules = () => {
    dispatch(actions.clearState());
    setNodes([]);
    setEdges([]);
  };

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
    console.log("features1")
    setNodes(resourceNodes);
  }, [resourceNodes]);

  useEffect(() => {
    setNodes(moduleNodes);
  }, [moduleNodes]);

  return (
    <div class="wrapper">
      <GitModal isOpen={isGitModalOpen} onClose={onGitModalClose} />
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
                  toast({
                    title: "Execution Successfull!",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "bottom-left",
                  });
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
                <FormLabel>Template Name</FormLabel>
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
                  //dispatch(updateTemplateName(save_template_name.current.value))
                  selectingArguments(save_template_name.current.value);
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
              {modalData == 0 && "Delete Template"}
              {modalData == 1 && "Execute Template"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {modalData == 0 &&
                "Are you sure, you want to delete the template?"}
              {modalData == 1 &&
                "Are you sure, you want to execute the template?"}
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
                        toast({
                          title: "Execution Successfull!",
                          status: "success",
                          duration: 3000,
                          isClosable: true,
                          position: "bottom-left",
                        });
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
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={saveModuleIsOpen}
          onClose={saveModuleOnClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Save As a Module</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <>
                <FormLabel>Module Name</FormLabel>
                <Input
                  ref={save_module_name}
                  type="text"
                  onKeyUp={(e) => setModuleName(e.target.value)}
                  placeholder="Enter Module name"
                />
                <Textarea
                  ref={save_module_desc}
                  onKeyUp={(e) => setModuleDescription(e.target.value)}
                  placeholder="Module Description"
                />
              </>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  selectingArguments(template_name);
                  saveModuleOnClose();
                }}
              >
                Save
              </Button>
              <Button
                onClick={() => {
                  saveModuleOnClose();
                }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>

      <TemplateDrawer
        isDrawerOpen={isDrawerOpen}
        onDrawerOpen={onDrawerOpen}
        onDrawerClose={onDrawerClose}
        removeCustomModules={removeCustomModules}
        submitHandler={(resource) => submitHandler(resource)}
      />

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
          position: "absolute",
          background: "white !important",
          zIndex: 100,
        }}
        onClick={onTemplateModalOpen}
      >
        <span style={{ fontSize: "13px", marginRight: "3px" }}>
          {template_name}
        </span>
        <MdDriveFileRenameOutline />
      </div>

      <div id="div3" style={{ width: isTemplatePanelOpen ? "100%" : "100%" }}>
        {loading && <div class="loader"></div>}

        <div
          id="div4"
          onClick={() => {
            setErrorMessage(false);
            setPrompt(true)
          }}
        >
          {nodeDisplay && (
            <button
              style={{
                background: "#5e5ee4",
                color: "white",
                padding: "10px",
                borderRadius: "5px",
                marginTop: "50px",
                zIndex: 1000,
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
                    nodeTypes={nodeTypes}
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

          {nodeDisplay &&
            !customModuleSwitch &&
            curr_node_data.map((data) => (
              <Tables
                key={data[1][2]}
                id={data[0]}
                data={data[1]}
                output_data={data[3]}
              />
            ))}

          {nodeDisplay &&
            customModuleSwitch &&
            curr_node_data.map((data) => (
              <EditTables
                key={data[1][2]}
                id={data[0]}
                data={data[1]}
                output_data={data[3]}
              />
            ))}
        </div>

        {checked && <p>Checked</p>}
        {isException && <p>{exception}</p>}

        <ButtonPanel
          onClick={() => console.log("kk")}
          saveClick={() => selectingArguments(template_name)}
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

                setModalData(1);
              }
            }
          }}
          style={{ marginLeft: "40% !important" }}
        />

        {checkin &&
          ReactDom.createPortal(
            <div
              id="backdrop"
              onClick={() => {
                setCheckIn(false);
              }}
            />,
            document.getElementById("root2")
          )}
        {checkin &&
          ReactDom.createPortal(
            <div id="confirmForm">
              <h4>Git Check-In</h4>
              <div>
                {isAccessTokenValid && (
                  <p id="p1">Please Enter Valid Access Token</p>
                )}
                <label htmlFor="token">Access Token *</label>
                <input
                  type={"text"}
                  name="token"
                  placeholder="Enter Access Token"
                  ref={accessToken}
                  onChange={accessTokenValidation}
                ></input>
              </div>
              <div
                onClick={() => {
                  setFiedlsCheck(false);
                }}
              >
                {isRepoNameValid && <p id="p1">Please Enter Valid Repo Name</p>}
                <label htmlFor="refoname">Repo Name *</label>
                <input
                  type={"text"}
                  name="refoname"
                  placeholder="Enter Repo Name"
                  ref={repoName}
                  onChange={repoNameValidation}
                ></input>
              </div>
              <div
                onClick={() => {
                  setFiedlsCheck(false);
                }}
              >
                {isBranchValid && <p id="p1">Please Enter Valid Branch</p>}
                <label htmlFor="branch">Branch *</label>
                <input
                  type={"text"}
                  name="branch"
                  placeholder="Enter Branch"
                  ref={branch}
                  onChange={branchValidation}
                ></input>
              </div>
              <div
                onClick={() => {
                  setFiedlsCheck(false);
                }}
              >
                {isMessagevalid && <p id="p1">Please Enter Valid Message</p>}
                <label htmlFor="message">Message</label>
                <input
                  type={"text"}
                  name="message"
                  placeholder="Enter Message"
                  ref={message}
                  onChange={messageValidation}
                ></input>
              </div>
              {fieldsCheck && <p id="p1">Please Fill All Required Fields(*)</p>}
              <button
                onClick={() => {
                  setCheckIn(false);
                }}
              >
                cancel
              </button>
              <button
                onClick={() => {
                  if (
                    accessToken.current.value != "" &&
                    repoName.current.value != ""
                  ) {
                    setCheckIn(false);
                    checkingin();
                  } else setFiedlsCheck(true);
                }}
              >
                confirm
              </button>
            </div>,
            document.getElementById("root3")
          )}
        {isExecuteSelected &&
          ReactDom.createPortal(
            <div id="backdrop" onClick={afterExecution} />,
            document.getElementById("root2")
          )}
        {isExecuteSelected &&
          ReactDom.createPortal(
            <div id="confirmForm">
              <h4>Execute - {template_name}</h4>
              {executeComponent}
              <button onClick={afterExecution}>cancel</button>
              <button onClick={afterExecution}>confirm</button>
            </div>,
            document.getElementById("root3")
          )}
      </div>
    </div>
  );
}
export default New_Template;
