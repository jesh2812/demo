import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import "./signUpPanel.css";
import { updateUserMail, updateUserName, updateUserRole, updateUsersList } from '../utils/dataCenter';


const SignUpPanel = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role:'',
  });

  const userName = useSelector(
    (state) => state.templateDataSlice.userName
  );

  const userMail = useSelector(
    (state) => state.templateDataSlice.userMail
  );

  const userRole = useSelector(
    (state) => state.templateDataSlice.userRole
  );

  const handleChangeName = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    dispatch(updateUserName(e.target.value))
  };

  const handleChangeMail = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    dispatch(updateUserMail(e.target.value))
  };

  // const handleChangeRole = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  //   dispatch(updateUserRole(e.target.value))
  // };

  const handleChangePassword = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleChangeRole = (e) => {
    dispatch(updateUserRole(e.target.value))
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleChangeSubmit = (e) => {
    dispatch(updateUsersList(true))
    handleChangeRole()
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Signup failed.');
      }

      const data = await response.json();
      console.log('Signup successful:', data);
      // Optionally, you can handle successful signup and redirect to another page.
    } catch (error) {
      console.error('Error during signup:', error.message);
      // Optionally, you can show an error message to the user.
    }
  };

  return (
    <div className="signup-panel">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChangeMail}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChangePassword}
            required
          />
          
        </div>
        {/* code added by jesh for dropdown. */}
        <div className="form-group">
        <label htmlFor="role">Role</label>
        <select
          type="text"
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChangeRole}
          className="custom-select"
          required
        >
        <option>Select Role</option>
        <option value="user" selected>User</option>
        <option value="admin">Admin</option>
        </select>
        </div>
        {/* <div className="form-group">
          <label htmlFor="role">role</label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChangeRole}
            required
          />
          
        </div> */}
        <button onClick={()=>dispatch(updateUsersList(true))} type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpPanel;
