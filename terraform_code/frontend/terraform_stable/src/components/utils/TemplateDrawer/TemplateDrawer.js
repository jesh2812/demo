import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import AxiosInstance from "../AxiosInstance";
import DatalistInput from "react-datalist-input";
import { Button } from "@chakra-ui/react";
import { FormLabel } from "@chakra-ui/react";
import CustomDataListInput from "../CustomDataList/CustomDataListInput";
import {
  updateValidation,
  updateProvider,
  updateModuleName,
  actions,
  updateType,
  updateTypeNames,
  updateResourceName,
  updateRegion,
  updateProviderNames,
  updateObjectName,
  updateTemplateDesc,
  updateSnowflakeId,
} from "../dataCenter";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  FormControl,
  Switch,
} from "@chakra-ui/react";

const TemplateDrawer = ({
  isDrawerOpen,
  onDrawerOpen,
  onDrawerClose,
  removeCustomModules,
  submitHandler,
}) => {
  const dispatch = useDispatch();
  const [customModuleSwitch, setCustomModuleSwitch] = useState(false);
  const [modulesNames, setModules] = useState([]);
  const [resourcesNames, setResourses] = useState([]);
  const [customModules, setCustomModules] = useState([]);
  const [objectExist, setObjectExist] = useState(false);
  const [isValidObject, setObjectValid] = useState(false);
  const [regionNames, setRegionName] = useState([]);
  const [snowflakeRegion, setSnowflakeRegion] = useState([])
  const [is_aws, setIsAws] = useState(false);
  const [is_snowflake, setIsSnowflake] = useState(false);
  const [is_azure, setIsAzure] = useState(false);

  const btnRef = React.useRef();

  const selectTemplate = useSelector(
    (state) => state.templateDataSlice.validation.template
  );

  const selectObject = useSelector(
    (state) => state.templateDataSlice.validation.object
  );

  const selectModule = useSelector(
    (state) => state.templateDataSlice.validation.module
  );

  const selectProvider = useSelector(
    (state) => state.templateDataSlice.validation.provider
  );

  const selectType = useSelector(
    (state) => state.templateDataSlice.validation.type
  );

  const template_name = useSelector(
    (state) => state.templateDataSlice.template_name
  );

  const snowflake_id = useSelector(
    (state) => state.templateDataSlice.snowflakeId
  );

  const provid = useSelector((state) => state.templateDataSlice.provider);
  const providerNames = useSelector(
    (state) => state.templateDataSlice.providerNames
  );

  const modul = useSelector((state) => state.templateDataSlice.module_name);
  const type = useSelector((state) => state.templateDataSlice.type);
  const typeNames = useSelector((state) => state.templateDataSlice.typeNames);
  const resour = useSelector((state) => state.templateDataSlice.resource_name);
  const region = useSelector((state) => state.templateDataSlice.region);
  const body = useSelector((state) => state.datacenter.data);
  const objectName = useSelector(
    (state) => state.templateDataSlice.object_name
  );

  const fetchCustomModules = async () => {
    const modules_response_data = await AxiosInstance.get("/listModules");

    const modules = modules_response_data.data;

    const display_modules_list = modules.map((ele) => {
      return { id: ele.module_name, value: ele.module_name };
    });

    setCustomModules(display_modules_list);
  };

  async function addModules(module_name) {
    dispatch(actions.addToModuleNodes(module_name));
  }

  async function selectingModule(e) {
    //setLoading(true);
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
    //setLoading(false);
    setResourses([]);
    dispatch(updateModuleName(""));
    dispatch(updateResourceName(""));
    //setModul("");
    //setResour("");
  }

  async function selectingResourses(e) {
    //setLoading(true);
    console.log({
      id: "resource",
      provider: provid.toLowerCase(),
      type: e,
      modulename: modul,
    });
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
    //setLoading(false);
    dispatch(updateResourceName(""));
  }

  function objectValidation(e) {
    const obj_name = e.target.value;
    if (obj_name === "") {
      dispatch(updateValidation([{ object: true }]));
      selectingResourses([]);
    } else {
      selectingResourses(type);
      dispatch(updateValidation([{ object: false }]));
      dispatch(updateObjectName(obj_name));
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_,. ";
      let flag = 0;
      let flag1 = 0;
      for (const a of obj_name) {
        if (!characters.includes(a)) {
          flag = 1;
          break;
        }
      }
      for (const a of body) {
        if (a["object_name"] == obj_name) {
          flag1 = 1;
          break;
        }
      }

      flag1 === 1 ? setObjectExist(true) : setObjectExist(false);
      flag !== 0 ? setObjectValid(true) : setObjectValid(false);
    }
  }

  const setProviderValue = (value) => {
    if (value == "aws") {
      setIsAws(true);
    } else {
      setIsAws(false);
    }
  };

  const setSnowflakeValue = (value) => {
    if (value == "snowflake") {
      setIsSnowflake(true);
    } else {
      setIsSnowflake(false);
    }
  };

  const setAzure = (value) => {
    if (value == "azure") {
      setIsAzure(true);
    } else {
      setIsAzure(false);
    }
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

  const snowRegions = () => {
    const snowregions = [
      "ap-southeast-1",
      "ap-south-1"
    ];
    let snowregion_list = [];
    for (const ele of snowregions) {
      snowregion_list.push({ id: ele, value: ele });
    }
    setSnowflakeRegion(snowregion_list);
  };

  return (
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
                  dispatch(updateValidation([{ template: true }]));
                } else {
                  dispatch(updateValidation([{ template: false }]));
                }
                dispatch(updateValidation([{ provider: false }]));
              }}
            >
              {selectTemplate && <p id="p1">Please Enter Template Name</p>}
              <DatalistInput
                placeholder="Select Provider"
                value={provid}
                label="Provider *"
                className="datalist"
                onSelect={(item) => {
                  selectingModule(item.value.toLowerCase());
                  dispatch(updateProvider(item.value.toLowerCase()));
                  //setProvid(item.value.toLowerCase());
                  if(item.value.toLowerCase()=='azure'){
                    dispatch(actions.addFeaturesNode({id:"features",type:"featuresNode",position:{x:100,y:100},data:{label:"features"}}))
                  }
                  setProviderValue(item.value.toLowerCase());
                  setSnowflakeValue(item.value.toLowerCase())
                  setAzure(item.value.toLowerCase())
                }}
                items={providerNames}
              />
              <FormControl>
                <FormLabel htmlFor="custom-modules" mb="0">
                  Use Custom Modules?
                </FormLabel>
              </FormControl>
              <Switch
                style={{ marginLeft: "0px" }}
                onChange={(e) => {
                  if (e.target.checked) {
                    fetchCustomModules();
                  } else {
                    removeCustomModules();
                  }
                  setCustomModuleSwitch(!customModuleSwitch);
                }}
              />

              {customModuleSwitch && (
                <CustomDataListInput
                  options={customModules}
                  placeholder="Select Custom Module"
                  onSelect={(item) => {
                    addModules(item);
                  }}
                />
              )}
            </div>
            {/* <div className="hide-divs">
              {isValidProject && <p id="p1">Don't Use Special Characters</p>}
              <label htmlFor="project">Project</label>
              <input
                type={"text"}
                placeholder={"Project Name"}
                name="project"
                onChange={projectValidation}
                ref={project_name}
              ></input>
            </div> */}

            {/* <div className="hide-divs">
              {isValidRole && <p id="p1">Don't Use Special Characters</p>}
              <label htmlFor="role">Role Name</label>
              <input
                type={"text"}
                placeholder={"Eg.Manager"}
                name="role"
                onChange={roleValidation}
                ref={role_name}
              ></input>
            </div> */}
            {!customModuleSwitch && (
              <>
                <div
                  onClick={() => {
                    if (provid == "") {
                      //setProvider(true);
                      dispatch(updateValidation([{ provider: true }]));
                    }
                    //setModule(false);
                  }}
                >
                  {selectProvider && <p id="p1">Please Select Provider</p>}
                  <DatalistInput
                    placeholder="Select Module"
                    value={modul}
                    label="Module *"
                    className="datalist"
                    onSelect={(item) => {
                      dispatch(updateModuleName(item.value));
                      console.log("Module", item.value);
                      //setModul(item.value);
                      dispatch(
                        updateTypeNames([
                          { id: "Resource", value: "Resource" },
                          { id: "Data Source", value: "Data Source" },
                        ])
                      );
                      /* setTypenames([
                    { id: "Resource", value: "Resource" },
                    { id: "Data Source", value: "Data Source" },
                  ]); */
                    }}
                    items={modulesNames}
                  />
                </div>
                <div
                  onClick={() => {
                    if (modul == "") {
                      dispatch(updateValidation([{ module: true }]));
                    }
                  }}
                >
                  {selectModule && <p id="p1">Please Select Module</p>}
                  <DatalistInput
                    placeholder="Select Type"
                    value={type}
                    label="Type *"
                    className="datalist"
                    onSelect={(item) => {
                      dispatch(updateType(item.value));
                      //setType(item.value);
                      chooseRegions();
                      snowRegions();
                    }}
                    items={typeNames}
                  />
                </div>
                <div
                  onClick={() => {
                    if (template_name == "") {
                      dispatch(updateValidation([{ object: true }]));
                    }
                  }}
                >
                  {isValidObject && <p id="p1">Don't Use Special Characters</p>}
                  {selectObject && (
                    <p id="p1">Object Name Null, Please fill it</p>
                  )}
                  {objectExist && (
                    <p id="p1">
                      Object Name Already Exists, Please Try Another
                    </p>
                  )}
                  <label htmlFor="objectName">Service Name * </label>
                  <input
                    type={"text"}
                    placeholder={"Object Name"}
                    name="objectName"
                    onChange={(e) => {
                      objectValidation(e);
                    }}
                  ></input>
                </div>
                <div
                  onClick={() => {
                    if (type == "") {
                      dispatch(updateValidation([{ type: true }]));
                      //setTypes(true);
                    }
                  }}
                >
                  {selectType && <p>Please Select Type</p>}

                  {is_aws && (
                    <DatalistInput
                      placeholder="Select Region"
                      value={region}
                      label="Region *"
                      className="datalist"
                      onSelect={(item) => {
                        dispatch(updateRegion(item.value));
                        console.log(item.value)
                        //setRegion(item.value);
                      }}
                      items={regionNames}
                    />
                  )}

                {is_snowflake && (
                    <DatalistInput
                      placeholder="Select Region"
                      value={region}
                      label="Region *"
                      className="datalist"
                      onSelect={(item) => {
                        dispatch(updateRegion(item.value));
                        console.log(item.value)
                        //setRegion(item.value);
                      }}
                      items={snowflakeRegion}
                    />
                  )}
                  <div>
                    {is_snowflake ? (
                         <div>
                          <label htmlFor="snowflake_id">Snowflake ID:</label>
                          <input type="text" id="snowflakeID" placeholder="Enter snowflake ID"  value={snowflake_id}
                          onChange={(e)=>dispatch(updateSnowflakeId(e.target.value))} />
                        </div>
                          ) : null}
                  </div>
                </div>

                <div
                  onClick={() => {
                    if (objectName == "") {
                      dispatch(updateValidation([{ object: true }]));
                    } else {
                      dispatch(updateValidation([{ object: false }]));
                    }
                  }}
                >
                  <DatalistInput
                    placeholder="Select Resourse"
                    value={resour}
                    label="Resourse *"
                    className="datalist"
                    id="resourceList"
                    onSelect={(item) => {
                      dispatch(updateResourceName(item.value));
                      console.log(item,item.value)
                      //setResour(item.value);
                    }}
                    items={resourcesNames}
                  />
                </div>
              </>
            )}
          </DrawerBody>

          <DrawerFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={() => {
                onDrawerClose();
                dispatch(updateModuleName(""));
                dispatch(updateType(""));
                dispatch(updateRegion(""));
                dispatch(updateResourceName(""));
                /* setModul("");
                setType("");
                setRegion("");
                setResour(""); */
              }}
            >
              Cancel
            </Button>
            {!customModuleSwitch && (
              <Button
                colorScheme="blue"
                onClick={() => {
                  //addModules("features");
                  submitHandler(resour);
                  console.log(resour)
                  onDrawerClose();
                  /* setModul("");
                setType("");
                setRegion("");
                setResour(""); */
                }}
              > 
                Add
              </Button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default TemplateDrawer;
