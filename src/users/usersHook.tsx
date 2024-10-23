import { useEffect, useState } from "react";
import { AxiosGet } from "../axios/axios";

export const UsersHook = () => {
  const [users, setUsers] = useState([]);
  const [edituser,setEditUser] = useState({});
  const [loading,setLoading] = useState<boolean>(false);
  const getUsers = async () => {
    setLoading(!loading);
  };
  const reloadUsers = async () => {
    try {
      const response = await AxiosGet("users");
      setUsers(response);
    } catch (error) {}
  };
  useEffect(() => {
  
    reloadUsers();
  }, [loading]);
  useEffect(() => {
  }, [edituser]);
  return {
    users,
    getUsers,
    edituser,
    setEditUser,
  }
};
