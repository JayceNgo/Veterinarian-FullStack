import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Protected } from "middlewares";
import { Auth, Default, Empty } from "layouts";
import { Error } from "components";
import {
  Appointment,
  Authentication,
  Discussion,
  File,
  Home,
  Pet,
  Redirect,
  Treatment,
  User,
} from "pages";
import { useApp } from "contexts";
import { Urls } from "utils";
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const { isAuthenticated, isVeterinarian, redirectUrl, setRedirectUrl } =
    useApp();
  const session = {
    location: window.location.pathname,
    isAuthenticated,
    isVeterinarian,
    redirectUrl,
    setRedirectUrl,
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={Urls.Route.Auth.Path}
          element={
            <Protected
              session={session}
              condition={isAuthenticated}
              redirectTo={Urls.Route.Page.Path}
            >
              <Auth />
            </Protected>
          }
        >
          <Route index element={<Authentication.Login />} />
          <Route
            path={Urls.Route.Auth.Register}
            element={<Authentication.Register />}
          />
          <Route
            path={Urls.Route.Auth.ForgotPassword}
            element={<Authentication.PasswordRecovery />}
          />
          <Route
            path={Urls.Route.Auth.PasswordReset}
            element={<Authentication.PasswordReset />}
          />
        </Route>

        <Route
          path={Urls.Route.Page.Path}
          element={
            <Protected
              session={session}
              condition={!isAuthenticated}
              redirectTo={Urls.Path.Auth.Index}
            >
              <Default />
            </Protected>
          }
        >
          <Route index element={<Home />} />
          <Route
            path={Urls.Route.Page.FileManagement}
            element={<File.FileManagement />}
          />
        </Route>

        <Route
          path={Urls.Route.Page.Discussion.Path}
          element={
            <Protected
              session={session}
              condition={!isAuthenticated}
              redirectTo={Urls.Path.Auth.Index}
            >
              <Default />
            </Protected>
          }
        >
          <Route index element={<Discussion.DiscussionBoard />} />
          <Route
            path={Urls.Route.Page.Discussion.Create}
            element={<Discussion.Create />}
          />
          <Route
            path={Urls.Route.Page.Discussion.View}
            element={<Discussion.View />}
          />
        </Route>

        <Route
          path={Urls.Route.Page.Appointment.Path}
          element={
            <Protected
              session={session}
              condition={!isAuthenticated}
              redirectTo={Urls.Path.Auth.Index}
            >
              <Default />
            </Protected>
          }
        >
          <Route index element={<Appointment.Appointment />} />
          <Route
            path={Urls.Route.Page.Appointment.MakeAppointment}
            element={<Appointment.MakeAppointment />}
          />
          <Route
            path={Urls.Route.Page.Appointment.View}
            element={<Appointment.View />}
          />
        </Route>

        <Route
          path={Urls.Route.Page.Pet.Path}
          element={
            <Protected
              session={session}
              condition={!isAuthenticated}
              redirectTo={Urls.Path.Auth.Index}
            >
              <Default />
            </Protected>
          }
        >
          <Route index element={<Pet.Pet />} />
          <Route path={Urls.Route.Page.Pet.Manage} element={<Pet.Manage />} />
          <Route path={Urls.Route.Page.Pet.View} element={<Pet.View />} />
        </Route>

        <Route
          path={Urls.Route.Page.Treatment.Path}
          element={
            <Protected
              session={session}
              condition={!isAuthenticated}
              redirectTo={Urls.Path.Auth.Index}
            >
              <Default />
            </Protected>
          }
        >
          <Route index element={<Treatment.Treatment />} />
          <Route
            path={Urls.Route.Page.Treatment.Manage}
            element={<Treatment.Manage />}
          />
        </Route>

        <Route
          path={Urls.Route.Page.User.Path}
          element={
            <Protected
              session={session}
              condition={!isAuthenticated}
              redirectTo={Urls.Path.Auth.Index}
            >
              <Default />
            </Protected>
          }
        >
          <Route index element={<User.UserManagement />} />
          <Route path={Urls.Route.Page.User.Manage} element={<User.Manage />} />
        </Route>

        <Route
          path={Urls.Route.QRCode.Path}
          element={
            <Protected
              session={session}
              condition={!isAuthenticated}
              redirectTo={Urls.Path.Auth.Index}
            >
              <Empty />
            </Protected>
          }
        >
          <Route path={Urls.Route.QRCode.Pet} element={<Redirect.Share />} />
        </Route>

        <Route path="*" element={<Empty />}>
          <Route index element={<Error.Error404 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
