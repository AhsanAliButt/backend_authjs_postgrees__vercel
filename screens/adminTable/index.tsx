"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import DataTableDemo from "./DataTable";
const UsersList = () => {
  const [users, setUsers] = useState([]);
  const { data: session } = useSession();
  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>All Users List</h1>
      <ul>
        <DataTableDemo users={users} />
      </ul>
    </div>
  );
};

export default UsersList;
const getAllUsers = async () => {
  try {
    const response = await fetch("/api/admin/get-all-users", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await response.json();
    console.log("Fetched users:", data);

    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
