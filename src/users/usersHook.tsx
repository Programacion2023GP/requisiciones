import { useEffect, useState } from "react";
import { AxiosGet } from "../axios/axios";

export const UsersHook = () => {
  const [users, setUsers] = useState([]);
  const [edituser,setEditUser] = useState({});
  const [get,setGet] = useState<boolean>(false);
  const [loading,setLoading] = useState<boolean>(true);
  const getUsers = async () => {
    setLoading(true)
    setUsers([])
    setGet(!loading);
  };
  const reloadUsers = async () => {
    try {
      const response = await AxiosGet("users");
      setUsers(response);
      setLoading(false)

    } catch (error) {
      setLoading(false)

    }
  };
  useEffect(() => {
  
    reloadUsers();
  }, [get]);
  useEffect(() => {
  }, [edituser]);
  return {
    users,
    getUsers,
    edituser,
    setEditUser,
    loading,
  }
};
