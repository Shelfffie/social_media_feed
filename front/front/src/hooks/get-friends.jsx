import { useState, useEffect } from "react";
import { useAuth } from "../auth-hook";
import axios from "axios";

export function useFriendsList(id, type) {
  const [friends, setFriends] = useState([]);

  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) return;
    let url;
    if (type) {
      url = `/user/${type}`;
    } else if (id) {
      url = `/user/${id}/friends`;
    }

    const getFriends = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/un${url}`, {
          withCredentials: true,
        });

        setFriends(response.data?.friends || []);
      } catch (error) {
        console.log(
          "Error:",
          error.response ? error.response.data : error.message
        );
      }
    };
    getFriends();
  }, [isLoggedIn, id, type]);

  return { friends, setFriends };
}
