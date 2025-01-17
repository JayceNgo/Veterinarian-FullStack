import { Navigate } from "react-router-dom";

export const Protected = ({
  condition,
  redirectTo,
  session,
  children,
}: any) => {
  if (condition) {
    session.setRedirectUrl(session.location);
    return <Navigate to={redirectTo} replace />;
  } else if (
    session.isAuthenticated &&
    session.isVeterinarian &&
    session.redirectUrl !== null
  ) {
    session.setRedirectUrl(null);
    return <Navigate to={session.redirectUrl} replace />;
  }
  return children;
};
