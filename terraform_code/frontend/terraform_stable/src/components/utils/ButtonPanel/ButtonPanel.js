import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Get_check } from "../Lib/checkov_function";
import { actions } from "../dataCenter";
import { IoSaveOutline } from "react-icons/io5";
import { VscSaveAs } from "react-icons/vsc";
import { BiPlayCircle, BiGitMerge } from "react-icons/bi";
import { GrFormAdd,GrValidate } from "react-icons/gr";
import { useToast } from "@chakra-ui/react";
import CustomToolTip from "../CustomToolTip/CustomToolTip";
import { FaSpinner } from "react-icons/fa";
import "./ButtonPanel.css";

const ButtonPanel = ({
  saveClick,
  saveAsClick,
  executeClick,
  addResourceClick,
  gitClick,
}) => {
  const dipatch = useDispatch();
  const toast = useToast();
  const [spinner, setSpinner] = useState(false)
  const tables = useSelector((state) => state.datacenter.resourse);
  const moduleNodes = useSelector((state) => state.datacenter.moduleNodes);
  const template_name = useSelector(
    (state) => state.templateDataSlice.template_name
  );
  const editCustomData = useSelector(state=>state.datacenter.editCustomData)
  const template_saved = useSelector(state=>state.templateDataSlice.template_saved)
  const get_check = ()=> Get_check(template_name,setSpinner)

  const handleGitClick = ()=>{
    if(template_saved){
      gitClick()
    }
    else{
      toast({
        title: "Please save the template before commit.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  return (
    <>
      <div>
        <div className="action-elements-container">
          {/* <div
            className="options-panel-element"
            style={{ display: "flex", flexDirection: "row", fontSize: "18px" }}
            onClick={onTemplateModalOpen}
          >
            <span style={{ fontSize: "13px", marginRight: "3px" }}>
              {template_name}
            </span>
            <MdDriveFileRenameOutline />
          </div> */}

          {(tables.length > 0 || moduleNodes.length > 0 || editCustomData.length > 0) && (
            <>
              <CustomToolTip label={"Checkov"}>
                  <GrValidate
                    className="options-panel-element"
                    onClick={get_check}
                    disabled={spinner}
                  >
                    {spinner ? (
        <FaSpinner className="spinner" />
      ) : (
        <>
        </>
      )}
                    </GrValidate>
              </CustomToolTip>
              
              <CustomToolTip label={"Save"}>
                <IoSaveOutline
                  className="options-panel-element"
                  onClick={saveClick}
                />
              </CustomToolTip>

              <CustomToolTip label={"Save As"}>
                <VscSaveAs
                  className="options-panel-element"
                  onClick={saveAsClick}
                />
              </CustomToolTip>

              <CustomToolTip label={"Check In"}>
                <BiGitMerge
                  className="options-panel-element"
                  onClick={handleGitClick}
                />
              </CustomToolTip>

              <CustomToolTip label={"Execute"}>
                <BiPlayCircle
                  className="options-panel-element"
                  onClick={executeClick}
                />
              </CustomToolTip>
            </>
          )}

          <CustomToolTip label={"Add Resource"} sx={{left:"-40px"}}>
            <GrFormAdd
              className="options-panel-element my-form-add"
              color="white"
              style={{ background: "orange", fill: "white" }}
              onClick={addResourceClick}
            />
          </CustomToolTip>
        </div>
      </div>
    </>
  );
};

export default ButtonPanel;
