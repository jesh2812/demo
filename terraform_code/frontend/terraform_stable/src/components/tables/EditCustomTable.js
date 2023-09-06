import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../utils/dataCenter";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import JSON5 from "json5";
import { type } from "@testing-library/user-event/dist/type";

function EditCustomTable(props) {
  const dispatch = useDispatch();

  const [hidding, setHide] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const editorRef = useRef(null);
  const [customCode, setCustomCode] = useState("");
  const [check, setCheck] = useState(0);

  const obj_name = props.object_name;
  const resource_name = props.resource;

  const editorStatus = useSelector(
    (state) => state.datacenter.customCodeResourceStatus
  );
  const custom = useSelector((state) => state.datacenter.editCustomData).filter(
    (ele) => ele.object_name == obj_name
  )[0].custom_code;
  console.log("filtered", custom);

  function handleEditorDidMount(editor, monaco) {
    console.log(editor);
    editorRef.current = editor;
    setTimeout(function () {
      editor.getAction("editor.action.formatDocument").run();
    }, 300);
  }

  const customTesting = () => {
    const data = custom.filter((ele) => {
      return ele.object_name == obj_name;
    });

    return JSON.stringify(data[0]["custom_code"]);
  };

  const setCustomData = () => {
    const data = custom.filter((ele) => {
      return ele.object_name == obj_name;
    });

    setCustomCode(JSON.stringify(data[0]["custom_code"]));
  };

  const testCode = () => {
    console.log("Pasted");
  };

  const handleEditorCodeChange = (newText) => {
    setCustomCode(newText);

    const resource_data = JSON5.parse(newText);
    const resource_type = Object.keys(resource_data)[0];
    const resource_name = Object.keys(resource_data[resource_type])[0];

    dispatch(
      actions.addCustomCodeForEdit([obj_name, resource_name, resource_data])
    );
  };

  /* useEffect(()=>{
        setCustomData();
    },[]); */

  return (
    <div id="div6">
      {hidding && (
        <label id="lab1">
          ⏷
          <span
            className="resource-title"
            onClick={() => {
              setHide(false);
            }}
          >{`${resource_name} - ${obj_name}`}</span>
          <select value={""}>
            <option>Actions</option>
            <option value={"Delete Selected"}>Delete Selected</option>
            <option value={"Delete All"}>Delete All</option>
            <option value={"Delete Resource"}>Delete Resource</option>
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
          >{`${resource_name} - ${obj_name}`}</span>
          <select value={""}>
            <option>Actions</option>
            <option value={"Delete Selected"}>Delete Selected</option>
            <option value={"Delete All"}>Delete All</option>
            <option value={"Delete Resource"}>Delete Resource</option>
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
            <Tab>Code Editor</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Editor
                height="90vh"
                defaultLanguage="json"
                theme="vs-light"
                defaultValue={JSON.stringify(custom)}
                onMount={handleEditorDidMount}
                onPaste={testCode}
                onChange={handleEditorCodeChange}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </div>
  );
}
export default React.memo(EditCustomTable);
