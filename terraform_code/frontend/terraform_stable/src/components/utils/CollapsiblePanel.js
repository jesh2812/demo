import { useState } from "react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import "./CollapsiblePanel.css";
import { transform } from "framer-motion";

export default function CollapsiblePanel({ style }) {
  const [isOpen, setOpen] = useState(false);

  const toggleDrawer = () => {setOpen(!isOpen); console.log("click")}

  return (
    <>
      <div
        className="new-template-div"
        id="div2"
        style={{ transition: "all 0.5s", transform:isOpen?"translateX(0%)": "translateX(-100%)",...style}}
      >
        <div id="upload-btn">
          <button>Upload</button>
        </div>
      </div>
      <span className="template_panel-controller-span" onClick={toggleDrawer}>
        <ChevronRightIcon />
      </span>
    </>
  ) 
}
