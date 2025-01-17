import React, { useState, useEffect } from "react";
import axios from "axios";

export const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showEditUserForm, setShowEditUserForm] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState("PetOwner");

  const fetchUsers = async () => {
    const response = await axios.get("/api/users");
    setUsers(response.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    const newUser = {
      firstName,
      lastName,
      email,
      password,
      phone,
      userType,
    };
    await axios.post("/api/users", newUser);
    setShowAddUserForm(false);
    fetchUsers();
  };

  const handleDeleteUser = async (userId) => {
    await axios.delete(`/api/users/${userId}`);
    fetchUsers();
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditUserForm(true);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
    setPassword(user.password);
    setPhone(user.phone);
    setUserType(user.userType);
  };

  const handleUpdateUser = async () => {
    const updatedUser = {
      firstName,
      lastName,
      email,
      password,
      phone,
      userType,
    };
    await axios.put(`/api/users/${selectedUser._id}`, updatedUser);
    setShowEditUserForm(false);
    setSelectedUser(null);
    fetchUsers();
  };

  const handleCancelEdit = () => {
    setShowEditUserForm(false);
    setSelectedUser(null);
  };

  return (
    <div>
      <h1>User Manager</h1>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Phone</th>
            <th>User Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.password}</td>
              <td>{user.phone}</td>
              <td>{user.userType}</td>
              <td>
                <button onClick={() => handleEditUser(user)}>Edit</button>
                <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setShowAddUserForm(true)}>Add User</button>
      {showAddUserForm && (
        <div>
          <h2>Add User</h2>
          <label>First Name:</label>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <br />
          <label>Last Name:</label>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
<br />
<label>Email:</label>
<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
<br />
<label>Password:</label>
<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
<br />
<label>Phone:</label>
<input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
<br />
<label>User Type:</label>
<select value={userType} onChange={(e) => setUserType(e.target.value)}>
<option value="PetOwner">Pet Owner</option>
<option value="Veterinarian">Veterinarian</option>
</select>
<br />
<button onClick={handleAddUser}>Add</button>
<button onClick={() => setShowAddUserForm(false)}>Cancel</button>
</div>
)}
{showEditUserForm && (
<div>
<h2>Edit User</h2>
<label>First Name:</label>
<input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
<br />
<label>Last Name:</label>
<input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
<br />
<label>Email:</label>
<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
<br />
<label>Password:</label>
<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
<br />
<label>Phone:</label>
<input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
<br />
<label>User Type:</label>
<select value={userType} onChange={(e) => setUserType(e.target.value)}>
<option value="PetOwner">Pet Owner</option>
<option value="Veterinarian">Veterinarian</option>
</select>
<br />
<button onClick={handleUpdateUser}>Save</button>
<button onClick={handleCancelEdit}>Cancel</button>
</div>
)}
</div>
);
};

export default UsersManager;
