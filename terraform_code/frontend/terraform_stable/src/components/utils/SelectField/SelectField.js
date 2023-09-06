import React, { useState, useEffect } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import "../SelectField/SelectField.css";

const SelectField = ({ options, default_option, onOptionSelect }) => {
  const [isOpen, setOpen] = useState(false);
  const [projectName, setProjectName] = useState(
    localStorage.getItem("selectedOption") || default_option
  );

  useEffect(() => {
    localStorage.setItem("selectedOption", projectName);
  }, [projectName]);

  const handleOptionChange = (event) => {
    if (event.target.classList.contains("select-element")) {
      const project_name = event.target.innerText;
      setProjectName(project_name);
      setOpen(!isOpen);
      onOptionSelect(project_name);

      if (!options.includes(default_option)) {
        options.unshift(default_option);
      }
    }
  };

  return (
    <div>
      <div className="btn" onClick={() => setOpen(!isOpen)}>
        <div className="select-header">
          <span style={{ fontFamily: "DM Sans", fontWeight: 400 }}>
            {projectName}
          </span>
          <span id="arrow-up">
            {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </span>

          {isOpen && (
            <div className="select-expand-div" onClick={handleOptionChange}>
              {options.map((e) => (
                <div className="select-element">{e}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectField;
