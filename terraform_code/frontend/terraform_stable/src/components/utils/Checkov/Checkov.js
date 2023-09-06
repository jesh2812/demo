import React, { useState, useEffect } from "react";
import "./Checkov.css";
import AccordionItem from "../AccordionItem/AccordionItem";
import AxiosInstance from "../AxiosInstance";
import { useSelector } from "react-redux";
//import { Get_check } from "../lib/checkov_function";
import { Get_check } from "../Lib/checkov_function";
import templateDataSlice from "../../../slice/templateSlice";
import { temp_name } from "../../../slice/templateSlice";
import { updateCheckovTemplateCheckbox } from "../dataCenter";
import { FaSpinner } from "react-icons/fa";

import {
  Input,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

const Checkov = ({ isOpen, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const projects_data = useSelector(state=>state.templateDataSlice.checkovExecutionSelection)
  const temp_name = useSelector(state=>state.templateDataSlice.template_name)
  const projects = Object.keys(projects_data)
  const [data, setData] = useState([]);
  const [spinner, setSpinner] = useState(false)
  
  // async function get_check(templatename) {

  //   const response = await fetch('http://localhost:5000/api/checkov', {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body:JSON.stringify({
  //     templatename: templatename,
  //     })
  //   })
  //   console.log(templatename);
  

  //   response.blob().then((blob) => {
  //     let url = window.URL.createObjectURL(blob);
  //     console.log(url);
  //     let a = document.createElement("a");
  //     a.href = url;
  //     a.download = templatename + ".txt";
  //     a.click();
  //   });
  // }
  const get_check = ()=> Get_check(temp_name,setSpinner)
  
  async function get_infra(templatename) {

    const response = await fetch('http://localhost:5000/api/infracost', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body:JSON.stringify({
      templatename: templatename,
      })
    })
    console.log(templatename);
  

    response.blob().then((blob) => {
      let url = window.URL.createObjectURL(blob);
      console.log(url);
      let a = document.createElement("a");
      a.href = url;
      a.download = templatename + "_ic.txt";
      a.click();
    });
  }


  
  const handleToggle = (index) => {
    setActiveIndex((prevIndex) => (prevIndex == index ? -1 : index));
  };

  return (
    <div>
      <>
        <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
          <ModalOverlay />
          <ModalContent maxW="800px">
            <ModalHeader>Select Templates</ModalHeader>
            <ModalCloseButton />
            <ModalBody maxH="60vh" overflow={"auto"}>
              {projects &&
                projects.map((ele, index) => (
                  <AccordionItem maxH="10vh" overflow={"auto"}
                    title={ele}
                    content={
                      projects_data[ele].templates
                    }
                    isActive={activeIndex === index}
                    toggleAccordion={() => handleToggle(index)}
                  />
                ))}
            </ModalBody>

            <ModalFooter>
            <Button _hover={{ bg: "#FFC107" }}  bg="#FFA500" color="white" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button _hover={{ bg: "#FFC107" }} bg="#FFA500" color="white" mr={3} onClick={get_check} disabled={spinner}>
              {spinner ? (
        <FaSpinner className="spinner" />
      ) : (
        <>
          Check
        </>
      )}
              </Button>
              <Button _hover={{ bg: "#FFC107" }} bg="#FFA500" color="white" mr={3} onClick={()=>get_infra(temp_name)}>
                Cost check
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </div>
  );
};

export default Checkov;
