import React, { useRef, useState } from "react";
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
import { FormControl, FormLabel } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";
import "./TemplateModal.css";
import {
  updateTemplateName,
  updateProviderNames,
  updateTemplateDesc,
  updatetemplatedesc,
  updateLanguage
} from "../dataCenter";
import AxiosInstance from "../AxiosInstance";

const TemplateModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [isValidTemplate, setIsTemplateValid] = useState(false);
  const [isExistingTemplate, setIsExistingTemplate] = useState(false);
  const toast = useToast()
  const templateName = useSelector(
    (state) => state.templateDataSlice.template_name
  );
  const template_desc = useSelector(
    (state) => state.templateDataSlice.template_desc
  );

  const language = useSelector(
    (state) => state.templateDataSlice.language
  );

  async function templateValidation() {
    const name = templateName;
    dispatch(
      updateProviderNames([
        { id: "AWS", value: "AWS" },
        { id: "GCP", value: "GCP" },
        { id: "AZURE", value: "Azure" },
        { id: "SNOWFLAKE", value: "Snowflake" },
      ])
    );
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
        template_name: templateName,
      });
      const data = response.data;
      if (data == "Failed") {
        setIsExistingTemplate(true);
      } else {
        setIsExistingTemplate(false);
      }
    }
  }

  const handleTemplateNameChange = (e) => {
    templateValidation();
    console.log(e.target.value);
    dispatch(updateTemplateName(e.target.value));
  };

  const handleTemplateDescChange = (e) => {
    dispatch(updateTemplateDesc(e.target.value));
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={()=>{if(templateName==""){
            toast({
              title: "Please enter template name",
              status: "warning",
              duration: 3000,
              isClosable: true,
              position: "bottom-left",
            });
          }
          else{
            onClose()
          }
        }} size={"xl"}>
        <ModalOverlay />
        <ModalContent maxW="800px">
          <ModalHeader>Template Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="input-container">
              <div className="input-group">
                <FormControl variant="floating" id="template-name">
                  <Input
                    placeholder=" "
                    value={templateName}
                    onChange={handleTemplateNameChange}
                  />
                  <FormLabel>Template Name</FormLabel>
                </FormControl>
                <FormControl variant="floating" id="created-at">
                  <Input placeholder=" " bg="white" />
                  <FormLabel>Created At</FormLabel>
                </FormControl>
                <FormControl variant="floating" id="updated-at">
                  <Input placeholder=" " variant="filled" bg="white" />
                  <FormLabel>Updated At</FormLabel>
                </FormControl>
                <select defaultValue={language} id="language" onChange={(e)=>dispatch(updateLanguage(e.target.value))}>
                    <option value="hcl">HCL</option>
                    <option value="json" >JSON</option>
                  </select>
              </div>
              <div style={{ marginLeft: "16px" }}>
                <FormControl variant="floating" id="description">
                  <Textarea
                    placeholder=" "
                    maxW={"100%"}
                    rows={10}
                    cols={70}
                    className="textarea"
                    value= {template_desc}
                    onKeyUp={handleTemplateDescChange}
                  />
                  <FormLabel>Template Description</FormLabel>
                </FormControl>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={()=>{if(templateName==""){
            toast({
              title: "Please enter template name",
              status: "warning",
              duration: 3000,
              isClosable: true,
              position: "bottom-left",
            });
          }
          else{
            onClose()
          }
        }}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TemplateModal;