import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { clearClientSession, getClientUser, setClientSession } from "../lib/clientSession";

const ClientPrivateRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const current = getClientUser();
    if (current && !current.isAdmin) {
      setAllowed(true);
      setChecking(false);
      return;
    }

    apiRequest("/client/me", { auth: "client" })
      .then((data) => {
        if (data?.user) {
          setClientSession({ user: data.user });
          setAllowed(true);
        } else {
          clearClientSession();
          setAllowed(false);
        }
      })
      .catch(() => {
        clearClientSession();
        setAllowed(false);
      })
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center">Checking access...</div>;
  }

  if (!allowed) return <Navigate to="/client/auth" replace />;

  return children;
};

export default ClientPrivateRoute;
