import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_MESSAGING_APP_API_URL;

export function useAppLogic() {
  const [auth, setAuth] = useState(false);
  const [account, setAccount] = useState(null);

  const getAccountInfo = async (authToken) => {
    try {
      const response = await fetch(`${apiUrl}/user/self`, {
        method: "GET",
        headers: {
          authorization: `${authToken}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        setAccount({
          id: result.id,
          username: result.username,
          createdAt: result.createdAt,
          displayName: result.profile.displayName,
          bio: result.profile.bio,
          photo: result.profile.photo?.url || "default avatar.png",
          photoId: result.profile.photo?.id,
        });
        setAuth(true);
      } else if (response.status === 401) {
        setAuth(false);
        localStorage.removeItem("authorization");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    const authToken = localStorage.getItem("authorization");
    if (authToken) getAccountInfo(authToken);
  }, []);

  const logout = () => {
    localStorage.removeItem("authorization");
    setAuth(false);
    setAccount(null);
    navigate("/", { replace: false });
  };

  return {
    auth,
    setAuth,
    account,
    refreshAccount: () => getAccountInfo(localStorage.getItem("authorization")),
    logout,
  };
}
