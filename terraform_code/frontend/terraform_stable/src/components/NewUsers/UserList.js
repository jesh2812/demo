import React, { useState, useEffect } from 'react';
import  './UserList.css';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import { updateInitialUsers, updateUsersList } from '../utils/dataCenter';

const UserList = () => {
  const dispatch = useDispatch();
  // const initialUsers = [
  //   { name: 'terraformAdmin', email: 'terraform@tigeranalytics.com', role: 'Admin' }
  // ];

  const initialUsers = useSelector(
    (state) => state.templateDataSlice.initialUsers
  );

  const userName = useSelector(
    (state) => state.templateDataSlice.userName
  );

  const userMail = useSelector(
    (state) => state.templateDataSlice.userMail
  );

  const userRole = useSelector(
    (state) => state.templateDataSlice.userRole
  );

  const newUser = useSelector(
    (state) => state.templateDataSlice.usersList
  );
  const [users, setUsers] = useState(initialUsers);
  const [newValue, setNewValue] = useState('');
  //console.log(initialUsers)
  
  // const saveList = async (updatedList) => {
  //   const response = await fetch('http://localhost:5000/api/userlist', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   });
  
  //   if (response.ok) {
  //     console.log(response)
  //     console.log('List saved to backend successfully');
  //   } else {
  //     console.error('Failed to save list to backend');
  //   }
  // };
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    // Define the API URL
    const apiUrl = 'http://localhost:5000/api/userlist'; // Replace with the actual API URL

    // Make the GET request to the API
    axios.get(apiUrl)
      .then((response) => {
        // Set the users list in the state
        
        setUsersList(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Error fetching users list:', error);
      });
  }, []);

  // if(newUser==true){
  //     //dispatch(updateInitialUsers(({name: userMail, email: userMail, role: 'user'})))
  //     console.log(initialUsers)
  //     saveList(initialUsers)
  //     dispatch(updateUsersList(false))
  // }

  // useEffect(() => {
  //   if (newUser == true) {
  //     setUsers((prevList) => [...prevList, newValue]);
  //     setNewValue({name: userMail, email: userMail, role: 'user'}); // Clear the newValue state
  //     dispatch(updateUsersList(false))

  //   }
  // }, [newValue]);

  

// Updating the list


  // const initialUsers = useSelector(
  //   (state) => state.templateDataSlice.usersList
  // );

  //const [users, setUsers] = useState(initialUsers);
  const [showAddUser, setShowAddUser] = useState(false);
  // useEffect(() => {
  //   const newUser = { name: userMail, email: userMail, role: 'User' };
  //   setUsers([...users, newUser]);
  // }, [users]);

  const handleAddUserClick = () => {
    setShowAddUser(true);
  };

  const handleCancelAddUser = () => {
    setShowAddUser(false);
  };

  const handleSaveUser = (newUser) => {
    setUsers([...users, newUser]);
    setShowAddUser(false);
  };

  return (
    <div className="user-list-container">
      <div className='addUserHeader'>
  <h2>User List</h2>
  <Link to="/signup">
    <button className="add-user-button" onClick={handleAddUserClick}>+ Add New User</button>
  </Link>
  </div>
  <table className="user-list">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
      </tr>
    </thead>
    <tbody>
      {usersList.map((user) => (
        <tr key={user.id} className="user-item">
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>{user.role}</td>
        </tr>
      ))}
    </tbody>
  </table>

</div>

  );
};

export default UserList;
