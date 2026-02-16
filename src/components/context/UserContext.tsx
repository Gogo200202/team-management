/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { LOCAL_STORAGE_KEYS } from "../../config/localStorage.config";
import { useGetAllUsers } from "../../api/user.controller";
import type { User } from "../../api/userTypes";

export type UserStored = {
  userName: string;
  email: string;
  secretWord: string;
};

type UserContextType = {
  isCheckCompleted: boolean;
  currentUser: UserStored | null;
  handleLogin: (data: UserStored) => void;
  handleLogOut: () => void;
};

const initialValues = {
  isCheckCompleted: false,
  currentUser: null,

  handleLogin: () => null,
  handleLogOut: () => null,
  authenticationContext: () => null,
};

export const UserContext = createContext<UserContextType>(initialValues);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data = [] } = useGetAllUsers();

  const [isCheckCompleted, setIsCheckCompleted] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserStored | null>(
    initialValues.currentUser,
  );

  const handleLogin = (data: UserStored) => {
    setCurrentUser(data);

    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(data));
  };

  const handleLogOut = () => {
    setCurrentUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
  };
  useEffect(() => {
    if (data?.length === 0) {
      return;
    }

    if (!localStorage.getItem(LOCAL_STORAGE_KEYS.USER)) {
      setIsCheckCompleted(true);
      return;
    }
    const user: UserStored = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.USER) || "",
    );

    const checkIfDb = data.find((x: User) => x.email == user.email);

    if (checkIfDb?.secretWord != user.secretWord) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    }

    if (checkIfDb) {
      setCurrentUser({
        email: checkIfDb.email,
        secretWord: checkIfDb.secretWord,
        userName: checkIfDb.displayName,
      });
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    }

    setIsCheckCompleted(true);
  }, [data]);

  return (
    <UserContext
      value={{ isCheckCompleted, currentUser, handleLogin, handleLogOut }}
    >
      {children}
    </UserContext>
  );
};

export const useUserContext = () => {
  return useContext<UserContextType>(UserContext);
};
