import { useEffect, useState } from "react";
import { AxiosGet } from "../axios/axios";

export const UsersHook = () => {
  const [users, setUsers] = useState([]);
  const [edituser,setEditUser] = useState({});
  const getUsers = async () => {
    try {
      const response = await AxiosGet("users");
      setUsers(response);
    } catch (error) {}
  };
  useEffect(() => {
     

    getUsers();
    console.log("Users Hook");
  }, [setUsers]);
  useEffect(() => {
    console.log(edituser);
  }, [edituser]);
  return {
    users,
    getUsers,
    edituser,
    setEditUser,
  }
};
