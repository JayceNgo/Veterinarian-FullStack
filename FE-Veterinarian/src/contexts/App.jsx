import React, { createContext, useContext } from "react";
import { Store } from "utils";

const initialState = {
  redirectUrl: null,
  user: Store.sessionStorage.get(),
  isAuthenticated: Store.sessionStorage.isAuthenticated(),
  isPetOwner: Store.sessionStorage.isPetOwner(),
  isVeterinarian: Store.sessionStorage.isVeterinarian(),
  isAdmin: Store.sessionStorage.isAdmin(),
};

export const AppContext = createContext({
  redirectUrl: initialState.redirectUrl,
  setRedirectUrl: () => {},
  user: initialState.user,
  setUser: () => {},
  isAuthenticated: initialState.isAuthenticated,
  isPetOwner: initialState.isPetOwner,
  isVeterinarian: initialState.isVeterinarian,
  isAdmin: initialState.isAdmin,
});

export const AppProvider = React.memo(({ initTheme, initLocale, children }) => {
  const [user, setUser] = React.useState(initialState.user);
  const [redirectUrl, setRedirectUrl] = React.useState(
    initialState.redirectUrl
  );

  const setUserCallback = React.useCallback((newUser) => {
    setUser((currentUser) => {
      const user = {
        ...currentUser,
        ...newUser,
      };
      if (newUser === null) {
        Store.sessionStorage.clear();
      } else {
        Store.sessionStorage.set(user);
      }
      return Store.sessionStorage.get();
    });
  }, []);

  const setRedirectUrlCallback = React.useCallback((newRedirectUrl) => {
    setRedirectUrl((currentRedirectUrl) => {
      return currentRedirectUrl === null || newRedirectUrl === null
        ? newRedirectUrl
        : currentRedirectUrl;
    });
  }, []);

  const isAuthenticated = Store.sessionStorage.isAuthenticated();

  const isAdmin = Store.sessionStorage.isAdmin();
  const isPetOwner = Store.sessionStorage.isPetOwner();
  const isVeterinarian = Store.sessionStorage.isVeterinarian();

  const MemoizedValue = React.useMemo(() => {
    const value = {
      redirectUrl,
      setRedirectUrl: setRedirectUrlCallback,
      user,
      setUser: setUserCallback,
      isAuthenticated,
      isAdmin,
      isPetOwner,
      isVeterinarian,
    };
    return value;
  }, [
    redirectUrl,
    setRedirectUrlCallback,
    user,
    setUserCallback,
    isAuthenticated,
    isAdmin,
    isPetOwner,
    isVeterinarian,
  ]);

  return (
    <AppContext.Provider value={MemoizedValue}>{children}</AppContext.Provider>
  );
});

export const useApp = () => useContext(AppContext);
