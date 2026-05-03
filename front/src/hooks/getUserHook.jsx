import axios from "axios";
import { useAuth } from "../auth-hook";
import { useState, useEffect } from "react";

export function useUserInfo(userId) {
  const { isLoggedIn, user } = useAuth();
  const [data, setData] = useState();

  useEffect(() => {
    if (userId === user) return;
    const getProfileData = async () => {
      try {
        const response = await axios.get(
          !userId
            ? "http://localhost:5000/un/user"
            : `http://localhost:5000/un/users/${userId}`,
          { withCredentials: true }
        );
        const data = response.data.user;

        setData(data);
      } catch (error) {
        console.log(
          "Error:",
          error.response ? error.response.data : error.message
        );
      }
    };

    getProfileData();
  }, [isLoggedIn, userId]);

  return {
    data,
    setData,
  };
}
