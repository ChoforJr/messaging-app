import { useState, useEffect } from "react";
// const apiUrl = import.meta.env.VITE_MESSAGING_APP_API_URL;

export function useAppLogic() {
  const [auth, setAuth] = useState(false);
  // const [exploreGroups, setExploreGroups] = useState([]);
  // const [joinedGroups, setJoinedGroups] = useState([]);
  // const [account, setAccount] = useState([]);
  // const [contacts, setContacts] = useState([]);
  // const [people, setPeople] = useState([]);

  useEffect(() => {
    // const authToken = localStorage.getItem("authorization");
    // if (authToken) {
    // }
  }, []);

  useEffect(() => {
    // const authToken = localStorage.getItem("authorization");
    // if (authToken && auth) {
    // }
  }, [auth]);

  return {
    auth,
    setAuth,
  };
}
