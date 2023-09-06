import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../utils/AxiosInstance";
import axios from 'axios';
import { updateCheckUser,updateUserRole,updateemail } from "../utils/dataCenter";

const useLogin = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [eemail, setEmail] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState(null);

  // const handleEmailChange = (event) => {
  //   setEmail(event.target.value);
  // };


  useEffect(() => {
    if (sessionStorage.getItem("isLoggedIn")) {
      setLoggedIn(true);
      setUserName(sessionStorage.getItem("userName"));
    }
  }, []);
  const userMail = useSelector(
    (state) => state.templateDataSlice.email_check
  );
  const check = useSelector(
    (state) => state.templateDataSlice.check_user
  );
  const role = useSelector(
    (state) => state.templateDataSlice.userRole
  );

  const login = async (email, password) => {
    // const email_user1 = email.split("@")
    // if(email_user1[0]=="terrauser"){
    //   dispatch(updateCheckUser(true))
    // }
    console.log(email,"email")
    dispatch(updateemail(email))
    console.log(email)
    console.log(check, "check")
    console.log(userMail,"usermmmmail")
    const response = await AxiosInstance.post("/login", {
      email: email,
      password: password,
    });
    // const email_user = email.split("@")
    // if(email_user[0]=="terrauser"){
    //   dispatch(updateCheckUser(true))
    // }
    // console.log(email,"email")
    // dispatch(updateemail(email))
    // console.log(check, "check")
    // console.log(userMail,"usermmmmail")

    const data = response.data;
    console.log(data.role,"testtttt")
    // const handleLogin = async (email) => {
    //   try {
    //     const response = await AxiosInstance.post('/get_user_role', {eemail: email});
    //     dispatch(updateUserRole(response.data))
    //     setUserRole(response.data)
    //     setError(null);
    //     return response.data
    //   } catch (error) {
    //     setError(error.response.data.error);
    //     setUserRole(null);
    //   }
    // };

    //const data = "Success";
    if (data.message === "Success") {
      setLoggedIn(true);
      setEmail(email)
      //handleLogin(email)
      dispatch(updateUserRole(data.role))
      setUserRole(data.role)
      console.log(data.role,"kkkkkkkkkkkkkkkkkkkkkkkk")
      dispatch(updateemail(email))
      console.log(userMail,"llllllllllllll")
      setUserName(email);
      sessionStorage.setItem("isLoggedIn", true);
      sessionStorage.setItem("userName", userName);

      navigate("/home");
    } else {
      console.log("error");
      //error
    }
  };

  const logout = () => {
    setLoggedIn(false);
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userName");
    setUserName(null);
    navigate("/home");
  };
  useEffect(() => {
    dispatch(updateUserRole(userRole))
    dispatch(updateemail(eemail))
    //console.log(role, 'userRole');
  }, [role, userMail]);

  return { isLoggedIn, userName, login, logout };
};

export default useLogin;
