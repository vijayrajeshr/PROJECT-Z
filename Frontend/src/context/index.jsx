import { createContext, useState } from "react";

export const authContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    usernam: "jaya",
    roles: ["admin", "user"],
  });

  return (
    <>
      <authContext.Provider value={{ user }}>{children}</authContext.Provider>
    </>
  );
};

export default AuthProvider;
