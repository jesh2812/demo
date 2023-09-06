import './App.css';
import React,{useEffect, Suspense, useState} from 'react';
import AxiosInstance from './components/utils/AxiosInstance';
import { Routes,Route, useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LoginPage from './components/pages/LoginPage';
import { actions, updateCheckUser, updateUserCheckCount, updateUserRole, updateemail } from "./components/utils/dataCenter";
import {useDispatch, useSelector} from 'react-redux';
import { Tooltip } from '@chakra-ui/react'
import { Avatar} from '@chakra-ui/react'
import { WrapItem } from '@chakra-ui/react'
import {Menu,MenuButton,MenuList,MenuItem,} from '@chakra-ui/react'
import Existing_Template from './components/templates/Existing_Template/Existing_Template'
import New_Template from './components/templates/New_Template';
import useLogin from './components/Login/useLogin'
import ModuleTemplate from './components/templates/ModuleTemplate/ModuleTemplate'
import EditModuleTemplate from './components/templates/ModuleTemplate/EditModuleTemplate';
import LandingPage from "./components/pages/LandingPage";
import SignUpPanel from './components/SignUp/signUpPanel';
import UserList from './components/NewUsers/UserList';
const EditTemplate = React.lazy(() => import("./components/templates/EditTemplate"));
const ViewTemplate = React.lazy(() => import("./components/templates/ViewTemplate"));


function App() {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const location = useLocation();
  const userMail = useSelector(
    (state) => state.templateDataSlice.email_check
  );
  const userRole = useSelector(
    (state) => state.templateDataSlice.userRole
  );
  const userCheck = useSelector(
    (state) => state.templateDataSlice.check_user
  ); 
  const count = useSelector(
    (state) => state.templateDataSlice.userCheckCount
  ); 
  //const { isLoggedIn, userName, login, logout } = useLogin();
  const terraformLoginObj = useLogin({
    module: "terraform",
    url: "/login",
  });
  const { isLoggedIn, userName, login, logout } = terraformLoginObj;
  console.log(userName,"usernaaaame")
  const [eemail, setEmail] = useState('');
  const [userRoles, setUserRole] = useState(null);
  const [error, setError] = useState(null);
  dispatch(updateemail(userName))
  // const handleLogin = async (email) => {
  //   try {
  //     const response = await AxiosInstance.post('/get_user_role', {eemail: email});
  //     dispatch(updateUserRole(response.data))
  //     setUserRole(response.data)
  //     console.log(response.data,"llll")
  //     dispatch(updateUserRole(response.data))
  //     console.log(userRole,"////")
  //     setError(null);
  //     return response.data
  //   } catch (error) {
  //     setError(error.response.data.error);
  //     setUserRole(null);
  //   }
  // };
  //handleLogin(userName)
  
  if(userRole=="admin"){
    console.log(userRole,"qqqq")
    console.log(userRole,"if")
    dispatch(updateCheckUser(true))
  }
  else{
    console.log(userRole,"else")
    console.log(userRole,"qqq")
    dispatch(updateCheckUser(false))
  }


  
  useEffect(() => {
    if(location.pathname==='/'){
      navigate('/home')
    }
  }, [location])

  return (
    <div className='app'>
      <div id='div1' className='app-header_container'>
        <img src='https://www.tigeranalytics.com/wp-content/uploads/logo.png' alt="Tiger Analytics" />
        <h1 className='header' style={{ fontSize:"30px",fontWeight:"bold" }}>Tiger DataOps</h1>
        <div className='login-profile'>
        {(isLoggedIn&&userRole=="admin") &&(
          <Link to={'/users'}>
              <button className='signup-button'><i class="fas fa-user-plus"></i></button>
              </Link>
            )}
          {isLoggedIn&&(
            <Link to={'/templates'} onClick={()=>{dispatch(actions.deleteAll())}}>
              <button className='home-button'><i class="fa-solid fa-house"></i></button>
            </Link>
            )}
          {isLoggedIn&&
            
            <Menu>
            <MenuButton aria-label='Options' >
                <WrapItem className='last' >
                  <Tooltip label={userName} fontSize='md'>
                    <Avatar name={userName} src='https://bit.ly/tioluwani-kolawole'>
                    </Avatar>
                  </Tooltip>
                </WrapItem>
            </MenuButton>
            <MenuList>
              <MenuItem>
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
                <button className="logout-button" onClick={logout}>Log Out</button>
              </MenuItem>
            </MenuList>
          </Menu>
          }
          
        </div>
      </div>
      <div>
        <Routes>
          {!isLoggedIn&&<Route path={'/login'} element={<LoginPage isLoggedIn={isLoggedIn} login={login}/>}/>}
          ?{!isLoggedIn&&<Route path={'*'} element={<LoginPage isLoggedIn={isLoggedIn} login={login} />} />}
          {/* isLoggedIn&&<Route path='/' element={<Existing_Template/>}></Route> */}
          {isLoggedIn&&<Route path='/templates'>
            <Route index element={<Existing_Template/>}/>
            <Route path={'newTemplate'} element={<New_Template/>}/>
            <Route path={'existingTemplate'} element={<Existing_Template/>}/>
            <Route path={'editTemplate/:name'} element={<Suspense><EditTemplate/></Suspense>}/>
            <Route path={'viewTemplate/:name'} element={<Suspense><ViewTemplate/></Suspense>}/>
            <Route path={'editModule/:name'} element={<EditModuleTemplate/>} />
          </Route>}
          {isLoggedIn && <Route path="/home" element={<LandingPage/>}/>}
          {isLoggedIn && <Route path="/users" element={<UserList/>}/>}
          {isLoggedIn && <Route path="/signup" element={<SignUpPanel/>}/>}
          {isLoggedIn && <Route path="/newModule" element={<ModuleTemplate/>}/>}
        </Routes>
      </div>
    </div>

  );
}

export default App;
