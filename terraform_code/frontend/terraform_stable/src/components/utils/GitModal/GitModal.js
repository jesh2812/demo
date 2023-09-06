import React, { useState, useRef } from "react";
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
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import AxiosInstance from "../AxiosInstance";
import "./GitModal.css"

const GitModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const template_name = useSelector(
    (state) => state.templateDataSlice.template_name
  );
  const toast = useToast();

  const repoName = useRef("");
  const branchName = useRef("");
  const accessToken = useRef("");
  const message = useRef("");

  const [isAccessTokenValid, setIsAccessTokenValid] = useState("");
  const [isRepoNameValid, setIsRepoNameValid] = useState("");
  const [isBranchNameValid, setIsBranchNameValid] = useState("");
  const [isMessageValid, setIsMessageValid] = useState("");

  function accessTokenValidation() {
    const name = accessToken.current.value;
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
      setIsAccessTokenValid(true);
    } else {
      setIsAccessTokenValid(false);
    }
  }
  function repoNameValidation() {
    const name = repoName.current.value;
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
      setIsRepoNameValid(true);
    } else {
      setIsRepoNameValid(false);
    }
  }
  function branchValidation() {
    const name = branchName.current.value;
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
      setIsBranchNameValid(true);
    } else {
      setIsBranchNameValid(false);
    }
  }

  function messageValidation() {
    const name = message.current.value;
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
      setIsMessageValid(true);
    } else {
      setIsMessageValid(false);
    }
  }
  //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
  const handleCommit = async () => {
    console.log({
      reponame: repoName.current.value,
      branch: branchName.current.value,
      token: accessToken.current.value,
      message: message.current.value,
      templatename: template_name,
    });

    let commit_response;

    try {
        commit_response = await AxiosInstance.post("/commit", {
        reponame: repoName.current.value,
        branch: branchName.current.value,
        token: accessToken.current.value,
        message: message.current.value,
        templatename: template_name,
      });
    } catch(exception) {
      console.log("kkk")
      toast({
        title: "Commit Failed!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }

    //const data  = "success"//commit_response.data;

    if (commit_response.data == "success") {
      toast({
        title: "Commit Successfull!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    } else {
      toast({
        title: "Commit Failed!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={"md"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Git Commit</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>
              {isRepoNameValid && (
                <p style={{ marginBottom: "10px" }}>
                  Please Enter valid Repo Name
                </p>
              )}
              <FormControl variant="floating" id="repo-name">
                <Input
                  placeholder=" "
                  ref={repoName}
                  required
                  onChange={repoNameValidation}
                />
                <FormLabel>Repo Name</FormLabel>
              </FormControl>
              {isBranchNameValid && (
                <p style={{ marginBottom: "10px" }}>
                  Please Enter valid Branch Name
                </p>
              )}
              <FormControl variant="floating" id="branch-name">
                <Input
                  placeholder=" "
                  ref={branchName}
                  onChange={branchValidation}
                />
                <FormLabel>Branch Name</FormLabel>
              </FormControl>
              {isAccessTokenValid && (
                <p style={{ marginBottom: "10px" }}>
                  Please Enter valid Access Token
                </p>
              )}
              <FormControl variant="floating" id="access-token">
                <Input
                  placeholder=" "
                  ref={accessToken}
                  required
                  type="password"
                  onChange={accessTokenValidation}
                  className={'password_inp'}
                />
                <FormLabel>Access Token</FormLabel>
              </FormControl>

              {isMessageValid && (
                <p style={{ marginBottom: "10px" }}>
                  Please Enter valid Message
                </p>
              )}
              <FormControl variant="floating" id="message">
                <Textarea
                  placeholder=" "
                  maxW={"100%"}
                  rows={4}
                  cols={50}
                  className="textarea"
                  ref={message}
                  onChange={messageValidation}
                />
                <FormLabel>Message</FormLabel>
              </FormControl>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              _hover={{ bg: "#FFC107" }}
              bg="#FFA500"
              color="white"
              mr={3}
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              _hover={{ bg: "#FFC107" }}
              bg="#FFA500"
              color="white"
              mr={3}
              onClick={() => {
                onClose();
                handleCommit();
              }}
            >
              Commit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GitModal;
