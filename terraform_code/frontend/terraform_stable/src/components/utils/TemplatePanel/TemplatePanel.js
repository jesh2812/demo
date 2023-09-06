import { useState, useRef } from "react";
import DatalistInput from "react-datalist-input";
import CustomDataListInput from "../CustomDataList/CustomDataListInput";
import { FormControl, FormLabel, Switch } from "@chakra-ui/react";
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { useSelector } from "react-redux";
import { addModules } from "../helpers/ModuleHelpers";
import AxiosInstance from "../AxiosInstance";
import { useDispatch } from "react-redux";
import {
  actions,
  updateValidation,
  updateTemplateName,
  updateProvider,
  updateTemplatePanelOpen,
} from "../../utils/dataCenter";

const TemplatePanel = ({
  location,
  removeCustomModules,
  selectingModule,
  onDrawerOpen,
}) => {
  //const [isTemplatePanelOpen, setIsTemplatePanelOpen] = useState(true);
  const [selectTemplate, setTemplate] = useState(false);
  const [isValidTemplate, setIsTemplateValid] = useState(false);
  const [isExistingTemplate, setIsExistingTemplate] = useState(false);
  const [provid, setProvid] = useState("");
  const [customModuleSwitch, setCustomModuleSwitch] = useState(false);
  const [customModules, setCustomModules] = useState([]);
  const [is_aws, setIsAws] = useState(false);
  const [selectProvider, setProvider] = useState(false);
  const [providerNames, setProviders] = useState([]);
  const [selectObject, setObject] = useState(false);

  const tables = useSelector((state) => state.datacenter.resourse);
  const template_name = useSelector(
    (state) => state.templateDataSlice.template_name
  );
  const isTemplatePanelOpen = useSelector(
    (state) => state.templateDataSlice.isTemplatePanelOpen
  );

  const btnRef = useRef();
  const template = useRef();
  const templateDescription = useRef();
  const dispatch = useDispatch();

  const toggleDrawer = () => dispatch(updateTemplatePanelOpen());

  const setProviderValue = (value) => {
    if (value == "aws") {
      setIsAws(true);
    } else {
      setIsAws(false);
    }
  };

  function addModules(module_name) {
    dispatch(actions.addToModuleNodes(module_name));
  }

  async function templateValidation() {
    const name = template.current.value;
    dispatch(updateTemplateName(name));
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
      setIsTemplateValid(true);
    } else {
      setIsTemplateValid(false);
      const response = await AxiosInstance.post("/validation", {
        template_name: template.current.value,
      });
      const data = response.data;
      if (data == "Failed") {
        setIsExistingTemplate(true);
      } else {
        setIsExistingTemplate(false);

        setProviders([
          { id: "AWS", value: "AWS" },
          { id: "GCP", value: "GCP" },
          { id: "AZURE", value: "Azure" },
          { id: "SNOWFLAKE", value: "Snowflake" },
        ]);
      }
    }
  }

  const fetchCustomModules = async () => {
    const modules_response_data = await AxiosInstance.get("/listModules");
    const modules = modules_response_data.data;

    const display_modules_list = modules.map((ele) => {
      return { id: ele.module_name, value: ele.module_name };
    });
    setCustomModules(display_modules_list);
  };

  return (
    <div style={{ position: "relative", zIndex: 1000 }}>
      <div
        className="new-template-div"
        id="div2"
        style={{
          zIndex: -1,
          transition: "all 0.5s",
          transform: isTemplatePanelOpen
            ? "translateX(0%)"
            : "translateX(-100%)",
          width: isTemplatePanelOpen ? "25%" : "0%",
        }}
      >
        {/*         <div id="upload-btn">
          {location.pathname != "/templates/existingTemplate" && (
            <button>Upload</button>
          )}
        </div> */}

        <div
          onClick={() => {
            dispatch(updateValidation([{ template: false }]));
            dispatch(updateValidation([{ object: false }]));
          }}
        >
          {isValidTemplate && <p id="p1">Don't Use Special Characters</p>}
          {isExistingTemplate && <p id="p1">Template Name Already Exists</p>}
          <label htmlFor="template">Template Name * </label>
          <input
            type={"text"}
            placeholder={"Template Name"}
            name="template"
            onChange={templateValidation}
            ref={template}
          ></input>
        </div>
        <div>
          <label>Template Description</label>
          <textarea ref={templateDescription} rows={"3"}></textarea>
        </div>

        <div
          onClick={() => {
            if (template.current.value == "") {
              dispatch(updateValidation([{ template: true }]));
            }
            dispatch(updateValidation([{ provider: false }]));
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
                dispatch(updateProvider(item.value.toLowerCase()));
                //setProvid(item.value.toLowerCase());
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
        <FormControl>
          <FormLabel htmlFor="custom-modules" mb="0">
            Use Custom Modules?
          </FormLabel>
          
        </FormControl>
        <Switch
          style={{marginLeft:"0px"}}
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

        {!customModuleSwitch && (
          <button ref={btnRef} onClick={onDrawerOpen} className="add-rsrc-btn">
            Add Resource
          </button>
        )}
      </div>
      <span
        className="template_panel-controller-span"
        onClick={toggleDrawer}
        style={{
          transition: "all 0.5s",
          transform: isTemplatePanelOpen
            ? "translateX(0%)"
            : "translateX(-110%)",
          zIndex: 1,
        }}
      >
        {isTemplatePanelOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </span>
    </div>
  );
};
export default TemplatePanel;
