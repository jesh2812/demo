import React,{useRef,useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom'
import {Alert,AlertIcon} from '@chakra-ui/react'
import axios from 'axios';
import AxiosInstance from "../utils/AxiosInstance";
import { updateUserRole } from "../utils/dataCenter";
import { useDispatch,useSelector } from "react-redux";


function LoginPage({ isLoggedIn, login }){
    const navigate=useNavigate();
    const email=useRef();
    const password=useRef();
    const [wrong_creds,set_wrong_creds] = useState(false);
    const [isEmailValid,setEmailValid]=useState(false);
    const [isPassswordValid,setPasswordValid]=useState(false);
    const [isSubmitValid,setSubmitValid]=useState(false);
    const [eemail, setEmail] = useState('');
    const [userRole, setUserRole] = useState(null);
    const [error, setError] = useState(null);
    const dispatch = useDispatch()
    
    function emailValidation(event) {
        const emailValue = event.target.value;
        // setEmail(emailValue)
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        setEmailValid(!emailRegex.test(emailValue));
    }

    function passwordValidation(){
        if(password.current.value.length>7&&password.current.value.length<17){
            setPasswordValid(false);
        }
        else{
            setPasswordValid(true);
        }
    }
    async function submitHandler(e){

        e.preventDefault();

        if(isEmailValid==true||isPassswordValid==true){
            setSubmitValid(true);
        }
        else{
            await login(email.current.value, password.current.value);
            if(isLoggedIn){
                navigate('/templates');
            }
            else{
                set_wrong_creds(true);
            }   
        }
    }

    const role = useSelector(
        (state) => state.templateDataSlice.userRole
      );
    const mail = useSelector(
        (state) => state.templateDataSlice.userRole
      );

    // const handleLogin = async (email) => {
    //     try {
    //       const response = await AxiosInstance.post('/get_user_role', {eemail});
    //       dispatch(updateUserRole(response.data))
    //       console.log(role,"userRole")
    //       setError(null);
    //     } catch (error) {
    //       setError(error.response.data.error);
    //       setUserRole(null);
    //     }
    //   };

    useEffect(() => {
        setTimeout(() => set_wrong_creds(false), 3000)
        }, [wrong_creds]);

    //  useEffect(() => {
    //         //console.log(role, 'userRole');
    //       }, [role]);

    return(
        <form className="login" onSubmit={submitHandler}>
            {
                wrong_creds&&
                <Alert status='error'>
                    <AlertIcon />
                    Invalid Password or Username!
                </Alert>

            }
            <br></br>
            <div onClick={()=>{setSubmitValid(false)}}>
                {isEmailValid&&<p>Don't Use Any Special Characters</p>}
                <label htmlFor="email">Email</label>
                <input type={'text'} name='email' onChange={emailValidation} ref={email} placeholder="Enter Email"></input>    
            </div>
            <div onClick={()=>{setSubmitValid(false)}}>
                {isPassswordValid&&<p>Password Must Be 8-16 Characters</p>}
                <label htmlFor="password">Password</label>
                <input type={'password'} name='password' onChange={passwordValidation} ref={password} placeholder="Enter Password"></input>    
            </div>
            {isSubmitValid&&<p>Please Enter Valid Email And Password</p>}
            <button type={'submit'} >Login</button>
        </form>
    )
}
export default LoginPage;