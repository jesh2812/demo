import React from "react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { actions, updateUserRole } from "./dataCenter";
import { Tooltip } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";
import { WrapItem } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

const NavBar = ({ isLoggedIn, userName, logout }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const handleLogOut = () => {
    dispatch(updateUserRole("user"))
    logout()
  };
  return (
    <>
      <div id="div1" className="app-header_container">
        <img
          src="https://www.tigeranalytics.com/wp-content/uploads/logo.png"
          alt="Tiger Analytics"
        />
        <div className="login-profile">
          {isLoggedIn && (
            <Link
              to={"home"}
              onClick={() => {
                dispatch(actions.deleteAll());
              }}
            >
              <button className="home-button">
                <i class="fa-solid fa-house"></i>
              </button>
            </Link>
          )}
          {isLoggedIn && (
            <Menu>
              <MenuButton aria-label="Options">
                <WrapItem className="last">
                  <Tooltip label={userName} fontSize="md">
                    <Avatar
                      name={userName}
                      src="https://bit.ly/tioluwani-kolawole"
                    ></Avatar>
                  </Tooltip>
                </WrapItem>
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <i class="fa-solid fa-arrow-right-from-bracket"></i>
                  <button className="logout-button" onClick={handleLogOut}>
                    Log Out
                  </button>
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default NavBar;
