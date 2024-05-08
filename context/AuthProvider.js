"use client";
import { bufferToFile } from "@/helpers/helper";
import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext();

export function useSystemData() {
  return useContext(AuthContext);
}

export function AuthProvider({ user, operator, children }) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (image?.preview) URL.revokeObjectURL(image.preview);
    setImage(bufferToFile(user.image));
  }, [user.image]);

  return (
    <AuthContext.Provider value={{ user, operator, image }}>
      {children}
    </AuthContext.Provider>
  );
}
