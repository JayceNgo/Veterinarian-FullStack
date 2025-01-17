import "assets/styles/navigations.css";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthService } from "services";
import { useApp } from "contexts";
import { Urls } from "utils";

export function NavBar() {
  const { isAuthenticated, isPetOwner, user } = useApp();
  const [click, setClick] = React.useState(false);
  const handleClick = () => setClick(!click);
  const Close = () => setClick(false);

  const handleSignOut = async () => {
    await AuthService.signout();
    // TODO : yet to be improved
    window.location.href = "/";
  };

  return (
    <>
      <div className={click ? "main-container" : ""} onClick={() => Close()} />
      <nav className="navbar" onClick={(e) => e.stopPropagation()}>
        <div className="nav-container">
          <NavLink to={Urls.Path.Page.Home} className="nav-logo">
            Home
          </NavLink>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <NavLink
                to={Urls.Path.Page.Discussion.Index}
                className="nav-links"
                onClick={click ? handleClick : null}
              >
                Discussion
              </NavLink>
            </li>
            {isPetOwner ? (
              <li className="nav-item">
                <NavLink
                  to={Urls.Path.Page.Appointment.Index}
                  className="nav-links"
                  onClick={click ? handleClick : null}
                >
                  Apointment
                </NavLink>
              </li>
            ) : null}
            <li className="nav-item">
              <NavLink
                to={Urls.Path.Page.Pet.Index}
                className="nav-links"
                onClick={click ? handleClick : null}
              >
                Pet
              </NavLink>
            </li>
            {isAuthenticated ? (
              <li className="nav-item">
                <span className="c-pointer" onClick={handleSignOut}>
                  Sign Out ({user.name})
                </span>
              </li>
            ) : null}
          </ul>
          <div className="nav-icon" onClick={handleClick}>
            <i className={click ? "fa fa-times" : "fa fa-bars"}></i>
          </div>
        </div>
      </nav>
    </>
  );
}
