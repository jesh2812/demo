import React, { useEffect, useState, useRef } from "react";
import "./Existing_Template.css";
import Checkov from "../../utils/Checkov/Checkov";
import { Outlet, useNavigate } from "react-router-dom";
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
import { useSelector, useDispatch } from "react-redux";
import { FormLabel } from "@chakra-ui/react";
import { Input, Textarea } from "@chakra-ui/react";
import {
  actions,
  clearTemplateDataState,
  clearTablesState,
  intializeCheckovData,
  updateCheckUser
} from "../../utils/dataCenter";
import { useLocation } from "react-router-dom";
import { Checkbox, useToast } from "@chakra-ui/react";
import SelectField from "../../utils/SelectField/SelectField";
import awsIcon from "./awsIcon.png";
import azureIcon from "./azureIcon.png";
import gcpIcon from "./gcpIcon.png";
import snowflakeIcon from "./snowflakeIcon.png";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import AxiosInstance from "../../utils/AxiosInstance";

function Existing_Template() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const toast = useToast();

  const [templateList, setTemplateList] = useState([]);
  const [executing, setExecuting] = useState(false);
  const [deletion, setDeletion] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteTemplate, setDeleteTemplate] = useState("");
  const [executeTemplate, setExecutingTemplateName] = useState("");
  const [modalData, setModalData] = useState();
  const [hasVariables, setHasVariables] = useState(false);
  const userCheck = useSelector(
    (state) => state.templateDataSlice.check_user
  ); 
  const userMail = useSelector(
    (state) => state.templateDataSlice.email_check
  );

  const email_user = userMail.split("@")
  if(email_user[0]=="terrauser"){
      dispatch(updateCheckUser(true))
    }
  console.log(userCheck,"userCheck")
  console.log(userMail,"usermail")


  const {
    isOpen: variableIsOpen,
    onOpen: VariableOnOpen,
    onClose: variableOnClose,
  } = useDisclosure();

  const {
    isOpen: newProjectIsOpen,
    onOpen: newProjectOnOpen,
    onClose: newProjectOnClose,
  } = useDisclosure();

  const {
    isOpen: isCheckovOpen,
    onOpen: onCheckovOpen,
    onClose: onCheckovClose,
  } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const itemsRef = useRef([]);
  const project_name = useRef();
  const project_desc = useRef();

  const [projectName, setProjectName] = useState();
  const [projectDesc, setProjectDescription] = useState();
  const [variableArguments, setVariableArguments] = useState([]);
  const [totalTemplates, setTotalTemplates] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [projectsList, setProjects] = useState("");
  const [project, setProject] = useState("");
  const [modules, setModulesData] = useState([]);
  const [totalModules, setTotalModules] = useState(0);
  const [modulesEnabled, setModulesEnabled] = useState(false);
  const [moduleList, setModuleList] = useState([]);
  const [accordionData, setAccordionData] = useState([]);

  async function get_download(template_name) {
    const response = await fetch("http://localhost:5000/api/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        template_name: template_name,
      }),
    });

    response.blob().then((blob) => {
      let url = window.URL.createObjectURL(blob);
      console.log(url);
      let a = document.createElement("a");
      a.href = url;
      a.download = template_name + ".zip";
      a.click();
    });
  }
  /* async function get_download(template_name) {
    const response = await AxiosInstance.post("/download", {
        template_name: template_name,
    }, {
      responseType: "blob",
      });

    let blob = new Blob([response.data], { type: 'text/zip' });
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = template_name+".zip";
    a.click();

  } */

  const get_template_variables = async (template_name) => {
    console.log("Templates");
    const response = await AxiosInstance.post("/gettemplate", {
      template_name: template_name,
    });
    const data = response.data;
    console.log("Templates", data);
    let variables = [];
    for (const table of data[0].data) {
      for (const arg in table["Arguments"]) {
        if (table["Arguments"][arg].value != undefined) {
          if (table["Arguments"][arg].is_variable == true) {
            variables.push(table["Arguments"][arg].value);
          }
        } else {
          for (const sub_arg in table["Arguments"][arg]) {
            if (table["Arguments"][arg][sub_arg].is_variable == true) {
              variables.push(table["Arguments"][arg][sub_arg].value);
            }
          }
        }
      }
    }

    return variables;
  };

  const filterChange = (e) => {
    if (e.target.value != "") {
      setSearchValue(e.target.value);
      const filterData = dataSource.filter((o) =>
        Object.keys(o).some((k) =>
          String(o[k]).toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
      setFilteredData([...filterData]);
    } else {
      setSearchValue(e.target.value);
      setDataSource([...dataSource]);
    }
  };

  async function getttingTemplatesList(project_name) {
    setProject(project_name);
    const response = await AxiosInstance.post("/listtemplates", {
      project: project_name,
    });

    const data = response.data;

    console.log(data, project_name);
    let list = [];
    let flag = "two";
    console.log(data, "Templates--->");
    setDataSource(data);
    setTotalTemplates(data.length);
    for (const a of data) {
      const keys = Object.keys(a);
      const value = a[keys[0]][0];

      list.push(
        <tr>
          <td style={{ width: "24%" }}>{a.template_name}</td>
          <td>
            {a.provider === "aws" && (
              <img
                src={awsIcon}
                style={{
                  width: "2.95rem",
                  height: "2rem",
                  boxShadow: "0px 0px 7px rgb(0 0 0/0.2)",
                  borderRadius: "1.5rem",
                  objectFit: "contain",
                  background: "white",
                }}
              />
            )}
            {a.provider === "azure" && (
              <img
                src={azureIcon}
                style={{
                  width: "2.95rem",
                  height: "2rem",
                  boxShadow: "0px 0px 7px rgb(0 0 0/0.2)",
                  borderRadius: "1.5rem",
                  objectFit: "contain",
                  background: "white",
                  padding: "6px",
                }}
              />
            )}
            {a.provider === "gcp" && (
              <img
                src={gcpIcon}
                style={{
                  width: "2.95rem",
                  height: "2rem",
                  borderRadius: "1.5rem",
                  objectFit: "contain",
                  background: "white",
                  boxShadow: "0px 0px 7px rgb(0 0 0/0.2)",
                  padding: "2px",
                }}
              />
            )}
            {a.provider === "snowflake" && (
              <img
                src={snowflakeIcon}
                style={{
                  width: "2.95rem",
                  height: "2rem",
                  borderRadius: "1.5rem",
                  objectFit: "contain",
                  background: "white",
                  boxShadow: "0px 0px 7px rgb(0 0 0/0.2)",
                  padding: "2px",
                }}
              />
            )}
          </td>
          <td>{a.template_desc}</td>
          <td>
            <Menu>
              <MenuButton>
                <i class="fa-solid fa-ellipsis-vertical"></i>
              </MenuButton>
              <MenuList>
                {userCheck && (
                <MenuItem>
                  <button
                    onClick={() => {
                      editingTemplate(a.template_name, project_name);
                    }}
                  >
                    <i
                      class="fa-solid fa-pen-to-square"
                      style={{ marginRight: "10px" }}
                    ></i>
                    Edit Template
                  </button>
                </MenuItem>
                )}
                <MenuItem>
                                <button
                                  onClick={() => {
                                    viewingTemplate(a.template_name);
                                  }}
                                >
                                  <i
                                    class="fa-solid fa-pen-to-square"
                                    style={{ marginRight: "10px" }}
                                  ></i>
                                  View Template
                                </button>
                              </MenuItem>
                {userCheck && (           
                <MenuItem>
                  <button
                    onClick={() => {
                      onOpen();
                      setDeleteTemplate(a.template_name);
                      setModalData(0);
                    }}
                  >
                    <i
                      class="fa-solid fa-trash"
                      style={{ marginRight: "10px" }}
                    ></i>
                    Delete Template
                  </button>
                </MenuItem>
                )}
                <MenuItem>
                  <button
                    onClick={async () => {
                      {
                        const variable_arguments = await get_template_variables(
                          a.template_name
                        );
                        if (variable_arguments.length > 0) {
                          setExecutingTemplateName(a.template_name);
                          setVariableArguments(variable_arguments);
                          setHasVariables(true);
                          VariableOnOpen();
                        } else {
                          setVariableArguments([]);
                          setHasVariables(false);
                          onOpen();
                          setExecutingTemplateName(a.template_name);
                        }
                        setModalData(1);
                      }
                    }}
                  >
                    <i
                      class="fa-solid fa-play"
                      style={{ marginRight: "10px" }}
                    ></i>
                    Execute Template
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={() => {
                      get_download(a.template_name);
                    }}
                  >
                    <i
                      class="fa-solid fa-download"
                      style={{ marginRight: "10px" }}
                    ></i>
                    Download Template
                  </button>
                </MenuItem>
              </MenuList>
            </Menu>
          </td>
        </tr>
      );

      if (flag == "one") {
        flag = "two";
      } else {
        flag = "one";
      }
    }
    setTemplateList(list);
  }

  async function fetchModulesList() {
    const response = await AxiosInstance.get("/listModules");

    const data = response.data;
    let list = [];
    let flag = "two";

    setModulesData(data);
    setTotalModules(data.length);

    for (const a of data) {
      const keys = Object.keys(a);
      const value = a[keys[0]][0];

      list.push(
        <tr>
          <td>{a.module_name}</td>
          <td>
            {a.provider === "aws" && (
              <img
                src={awsIcon}
                style={{
                  width: "2.95rem",
                  height: "2rem",
                  boxShadow: "0px 0px 7px rgb(0 0 0/0.2)",
                  borderRadius: "1.5rem",
                  objectFit: "contain",
                  background: "white",
                }}
              />
            )}
            {a.provider === "azure" && (
              <img
                src={azureIcon}
                style={{
                  width: "2.95rem",
                  height: "2rem",
                  boxShadow: "0px 0px 7px rgb(0 0 0/0.2)",
                  borderRadius: "1.5rem",
                  objectFit: "contain",
                  background: "white",
                  padding: "6px",
                }}
              />
            )}
            {a.provider === "gcp" && (
              <img
                src={gcpIcon}
                style={{
                  width: "2.95rem",
                  height: "2rem",
                  borderRadius: "1.5rem",
                  objectFit: "contain",
                  background: "white",
                  boxShadow: "0px 0px 7px rgb(0 0 0/0.2)",
                  padding: "2px",
                }}
              />
            )}
            {a.provider === "snowflake" && (
              <img
                src={snowflakeIcon}
                style={{
                  width: "2.95rem",
                  height: "2rem",
                  borderRadius: "1.5rem",
                  objectFit: "contain",
                  background: "white",
                  boxShadow: "0px 0px 7px rgb(0 0 0/0.2)",
                  padding: "2px",
                }}
              />
            )}
            
          </td>
          <td>{a.module_desc}</td>
          <td>
            <Menu>
              <MenuButton>
                <i class="fa-solid fa-ellipsis-vertical"></i>
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <button
                    onClick={(e) => {
                      navigate(`/templates/editModule/${a.module_name}`);
                    }}
                  >
                    <i
                      class="fa-solid fa-pen-to-square"
                      style={{ marginRight: "10px" }}
                    ></i>
                    Edit Module
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={() => {
                      console.log("Delete Module");
                    }}
                  >
                    <i
                      class="fa-solid fa-trash"
                      style={{ marginRight: "10px" }}
                    ></i>
                    Delete Module
                  </button>
                </MenuItem>

                <MenuItem>
                  <button
                    onClick={() => {
                      console.log("DOwnload Module");
                    }}
                  >
                    <i
                      class="fa-solid fa-download"
                      style={{ marginRight: "10px" }}
                    ></i>
                    Download Module
                  </button>
                </MenuItem>
              </MenuList>
            </Menu>
          </td>
        </tr>
      );

      if (flag == "one") {
        flag = "two";
      } else {
        flag = "one";
      }
    }
    setModuleList(list);
  }

  async function editingTemplate(e, project_name) {
    navigate(`/templates/editTemplate/${e}`, {
      state: { project: project_name },
    });
  }

  async function viewingTemplate(e, project_name) {
    navigate(`/templates/viewTemplate/${e}`, {
      state: { project: project_name },
    });
  }

  async function executingscript(template_name) {
    console.log("Name", template_name);
    const vars = handleVariableValues();
    const response = await AxiosInstance.post("/script", {
      template_name: template_name,
      variables: vars,
    });

    getttingTemplatesList(project);
  }

  const getProjectsList = async () => {
    const response = await AxiosInstance.get("/listProjects");
    const projects = response.data;

    setProjects(projects);
  };

  const getAccordionList = async () => {
    const response = await AxiosInstance.get("/listProjects");
    const projectsList = response.data;

    // Use await before calling reduce
    const data = await projectsList.reduce(async (acc, curr) => {
      console.log(curr);
      const response = await AxiosInstance.post("/listtemplates", {
        project: curr,
      });

      return acc.then((result) => [
        ...result,
        {
          project_name: curr,
          isChecked: false,
          templates: response.data.reduce((acc, curr) => {
            return [
              ...acc,
              { template_name: curr.template_name, isChecked: false },
            ];
          }, []),
        },
      ]);
    }, Promise.resolve([]));

    const formatted_data = data.reduce((acc, curr) => {
      acc[curr.project_name] = { isChecked: false, templates: curr.templates };
      return acc;
    }, {});

    console.log(formatted_data);
    setAccordionData(data);
    dispatch(intializeCheckovData(formatted_data));
  };

  async function deletingscript(template_name) {
    const response = await AxiosInstance.post("/deletetemplate", {
      template_name: template_name,
    });
    getttingTemplatesList(project);
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

  function changePage(page) {
    let listItems = document.getElementsByTagName("a");
    var length = listItems.length;
    for (var i = 0; i < length; i++) {
      listItems[i].className = listItems[i].id == page ? "active" : "";
    }
  }

  const createProject = async () => {
    const response = await AxiosInstance.post("/createProject", {
      name: projectName,
      description: projectDesc || "",
    });
    const data = response.data;
    getProjectsList();
  };

  useEffect(() => {
    getProjectsList();
  }, []);

  useEffect(() => {
    getAccordionList();
  }, []);

  useEffect(() => {
    dispatch(actions.clearState());
    dispatch(clearTemplateDataState());
    dispatch(clearTablesState());
  }, []);

  useEffect(() => {
    getttingTemplatesList(localStorage.getItem("selectedOption") || "Default");
  }, []);

  return (
    <div>
      <>
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={newProjectIsOpen}
          onClose={newProjectOnClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Enter Project Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <>
                <FormLabel>Project Name</FormLabel>
                <Input
                  ref={project_name}
                  type="text"
                  onKeyUp={(e) => setProjectName(e.target.value)}
                  placeholder="Enter Project name"
                />
                <Textarea
                  ref={project_desc}
                  onKeyUp={(e) => setProjectDescription(e.target.value)}
                  placeholder="Project Description"
                />
              </>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  toast({
                    title: "Project Creation Successfull!",
                    status: "success",
                    position: "bottom-left",
                    duration: 3000,
                    isClosable: true,
                  });
                  createProject();
                  newProjectOnClose();
                }}
              >
                Create
              </Button>
              <Button
                onClick={() => {
                  newProjectOnClose();
                }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>

      <></>
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
              {hasVariables &&
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
                  toast({
                    title: "Script Execution Successfull!",
                    status: "success",
                    position: "bottom-left",
                    duration: 3000,
                    isClosable: true,
                  });
                  console.log("Executed");
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

      <></>

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
                    toast({
                      title: "Deleted Successfully!",
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                      position: "bottom-left",
                    });
                    deletingscript(deleteTemplate);
                    onClose();
                  } else {
                    {
                      if (hasVariables) {
                        VariableOnOpen();
                      } else {
                        onOpen();
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

      <Checkov
        isOpen={isCheckovOpen}
        onClose={onCheckovClose}
        projects={accordionData}
      />

      <div className="exisTemp">
        <div className="create-btn-container">
          <div className="existemp-header">
            <div className="existemp-header-ele">
              <span className=" total-template-span">
                {modulesEnabled && `${totalModules} Modules`}
                {!modulesEnabled && `${totalTemplates} Templates`}
              </span>
              <span
                className="modules-span"
                style={{
                  backgroundColor: modulesEnabled ? "#1D1CE5" : "white",
                  color: modulesEnabled ? "white" : "black",
                }}
                onClick={() => {
                  setModulesEnabled(!modulesEnabled);
                  fetchModulesList();
                }}
              >
                <i class="bi bi-boxes" style={{ fontSize: 21 }}></i>
              </span>
            </div>

            <div className="horizontal-flex" style={{ gap: "5px" }}>
              <span
                className="add-rsrc-btn"
                id="add-btn"
                onClick={onCheckovOpen}
                style={{ marginRight: "10px !important" }}
              >
                Checkov
              </span>
              <span
                className="add-rsrc-btn"
                id="add-btn"
                onClick={newProjectOnOpen}
              >
                +
              </span>
              <SelectField
                options={projectsList}
                default_option={"Default"}
                onOptionSelect={(option) => getttingTemplatesList(option)}
              />
              <div className="search-input">
                <input
                  placeholder="search templates"
                  data-provide="typeahead"
                  data-items="4"
                  type="text"
                  class="search-query"
                  onChange={filterChange}
                />
                <div className="icon">
                  <i class="fas fa-search"></i>
                </div>
              </div>
              {location.pathname == "/templates" && (
                <div id="div5">
                  {userCheck &&(
                  <button
                    onClick={() => {
                      changePage("link2");
                      modulesEnabled
                        ? navigate("/newModule")
                        : navigate("/templates/newTemplate", {
                            state: { project },
                          });
                      dispatch(actions.deleteAll());
                    }}
                  >
                    {modulesEnabled ? "New Module" : "New Template"}
                  </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div>
            <hr className="hr-custom"></hr>
          </div>
        </div>

        <table cellPadding={0} cellSpacing={0}>
          <thead>
            <tr>
              <th className="landing-th">
                <b>{modulesEnabled ? "Modules" : "Template Name"}</b>
              </th>
              <th>
                <b>Providers</b>
              </th>
              <th>
                <b>
                  {modulesEnabled
                    ? "Module Description"
                    : "Template Description"}
                </b>
              </th>
              <th>
                <b>Action</b>
              </th>
            </tr>
          </thead>
          <tbody>
            {!modulesEnabled &&
              (searchValue.length > 0
                ? filteredData.map((a) => {
                    return (
                      <tr>
                        <td className="left-align">{a.template_name}</td>
                        <td>
                          {a.provider === "aws" && (
                            <img
                              src={awsIcon}
                              style={{
                                width: "2.95rem",
                                height: "2rem",
                                boxShadow: "0px 0px 7px rgb(0 0 0/0.2)",
                                borderRadius: "1.5rem",
                                objectFit: "contain",
                                background: "white",
                              }}
                            />
                          )}
                          {a.provider === "azure" && (
                            <img
                              src={azureIcon}
                              style={{
                                width: "2.95rem",
                                height: "2rem",
                                boxShadow: "0px 0px 7px rgb(0 0 0/0.2)",
                                borderRadius: "1.5rem",
                                objectFit: "contain",
                                background: "white",
                                padding: "6px",
                              }}
                            />
                          )}
                          {a.provider === "gcp" && (
                            <img
                              src={gcpIcon}
                              style={{
                                width: "2.95rem",
                                height: "2rem",
                                borderRadius: "1.5rem",
                                objectFit: "contain",
                                background: "white",
                                boxShadow: "0px 0px 7px rgb(0 0 0/0.2)",
                                padding: "2px",
                              }}
                            />
                          )}
                          {a.provider === "snowflake" && (
                            <img
                              src={snowflakeIcon}
                              style={{
                                width: "2.95rem",
                                height: "2rem",
                                borderRadius: "1.5rem",
                                objectFit: "contain",
                                background: "white",
                                boxShadow: "0px 0px 7px rgb(0 0 0/0.2)",
                                padding: "2px",
                              }}
                            />
                          )}
                        </td>
                        <td className="left-align">{a.template_desc}</td>
                        <td>
                          <Menu>
                            <MenuButton>
                              <i class="fa-solid fa-ellipsis-vertical"></i>
                            </MenuButton>
                            <MenuList>
                              {userCheck&&(
                              <MenuItem>
                                <button
                                  onClick={() => {
                                    editingTemplate(a.template_name);
                                  }}
                                >
                                  <i
                                    class="fa-solid fa-pen-to-square"
                                    style={{ marginRight: "10px" }}
                                  ></i>
                                  Edit Template
                                </button>
                              </MenuItem>
                              )}
                              <MenuItem>
                                <button
                                  onClick={() => {
                                    viewingTemplate(a.template_name);
                                  }}
                                >
                                  <i
                                    class="fa-solid fa-pen-to-square"
                                    style={{ marginRight: "10px" }}
                                  ></i>
                                  View Template
                                </button>
                              </MenuItem>
                              {userCheck && (
                              <MenuItem>
                                <button
                                  onClick={() => {
                                    onOpen();
                                    setDeleteTemplate(a.template_name);
                                    setModalData(0);
                                  }}
                                >
                                  <i
                                    class="fa-solid fa-trash"
                                    style={{ marginRight: "10px" }}
                                  ></i>
                                  Delete Template
                                </button>
                              </MenuItem>
                              )}
                              <MenuItem>
                                <button
                                  onClick={async () => {
                                    {
                                      const variable_arguments =
                                        await get_template_variables(
                                          a.template_name
                                        );
                                      if (variable_arguments.length > 0) {
                                        setExecutingTemplateName(
                                          a.template_name
                                        );
                                        setVariableArguments(
                                          variable_arguments
                                        );
                                        setHasVariables(true);
                                        VariableOnOpen();
                                      } else {
                                        setVariableArguments([]);
                                        setHasVariables(false);
                                        onOpen();
                                        setExecutingTemplateName(
                                          a.template_name
                                        );
                                      }
                                      setModalData(1);
                                    }
                                  }}
                                >
                                  <i
                                    class="fa-solid fa-play"
                                    style={{ marginRight: "10px" }}
                                  ></i>
                                  Execute Template
                                </button>
                              </MenuItem>
                              <MenuItem>
                                <button
                                  onClick={() => {
                                    get_download(a.template_name);
                                  }}
                                >
                                  <i
                                    class="fa-solid fa-download"
                                    style={{ marginRight: "10px" }}
                                  ></i>
                                  Download templates
                                </button>
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </td>
                      </tr>
                    );
                  })
                : templateList)}

            {modulesEnabled && moduleList}
            <Outlet />
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Existing_Template;
