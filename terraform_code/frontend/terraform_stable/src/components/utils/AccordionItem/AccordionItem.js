import React from "react";
import { Checkbox, Radio, RadioGroup } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import "./AccordionItem.css";
import { BsFillPlayCircleFill } from "react-icons/bs";
import {
  updateCheckovProjectCheckbox,
  updateCheckovTemplateCheckbox,
} from "../dataCenter";

function AccordionItem({ title, content, isActive, toggleAccordion }) {
  const dispatch = useDispatch();
  const templ_name = useSelector(
    (state) =>
      state.templateDataSlice.template_name
  );
  const [value, setValue] = React.useState('1')
  const projectCheckbox = useSelector(
    (state) =>
      state.templateDataSlice.checkovExecutionSelection[title].isChecked
  );
  const handleProjectCheckbox = () => {
    dispatch(updateCheckovProjectCheckbox(title));
  };

  const handleTemplateCheckbox = (template_name) => {
    dispatch(updateCheckovTemplateCheckbox([title,template_name]));

  };

  return (
    <div className={`accordion-item ${isActive ? "active" : "inactive"}`}>
      <div
        className="accordion-header"
        onClick={toggleAccordion}
        style={{
          cursor: "pointer",
        }}
      > 
        <div style={{ display: "flex", justifyContent: "space-between" }} > 
           <span style={{ fontSize: "16px", fontWeight: "500" }}>{title}</span> 
           {/* <div style={{ display: "flex" }}>
            <Checkbox
              style={{ marginRight: "30px", marginTop: "1px" }}
              color="#FFA500"
              onChange={handleProjectCheckbox}
              isChecked={projectCheckbox}
              sx={{
                ".chakra-checkbox__control": {
                  _checked: {
                    bg: "#FFA500",
                    borderColor: "#FFA500",
                    _hover: {
                      bg: "#FFA500",
                      borderColor: "#FFC107",
                    },
                  },
                  _indeterminate: {
                    bg: "#FFA500",
                    borderColor: "#FFA500",
                  },
                },
              }}
            /> 
            <BsFillPlayCircleFill
              style={{ marginRight: "6px" }}
              fontSize={19}
            />
          </div>  */}
         </div> 
       </div> 
       <div
        className={`accordion-content1 ${isActive ? "active" : "inactive"}`}
        style={{
          maxHeight: isActive ? "150px" : "0",
          overflow: "auto",
          transition: "all 0.3s ease-in-out",
        }}
      > 
         <hr /> 
        <div className="accordion-content-container">
          {(
            content.map((ele) => (
              <div
                className="accordion-content-element"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <span style={{ marginLeft: "8px" }}>{ele.template_name}</span>
                <div style={{ display: "flex" }}>
                <RadioGroup onChange={setValue} value={value}>
                  <Radio
                    sx={{
                      ".chakra-radio__control": {
                        _checked: {
                          bg: "#FFA500",
                          borderColor: "#FFA500",
                          _hover: {
                            bg: "#FFA500",
                            borderColor: "#FFC107",
                          },
                        },
                        _indeterminate: {
                          bg: "#FFA500",
                          borderColor: "#FFA500",
                        },
                      },
                    }}
                    style={{ marginRight: "30px", marginTop: "1px" }}
                    isChecked= {ele.isChecked}
                    onChange={() => handleTemplateCheckbox(ele.template_name)}
                    value={ele.template_name}
                  />
                  </RadioGroup>
                  <BsFillPlayCircleFill
                    style={{ marginRight: "6px" }}
                    fontSize={19}
                  />
                </div>
              </div>
            ))
          )}
        </div>
       </div> 
    </div>
  );
}

export default AccordionItem;
