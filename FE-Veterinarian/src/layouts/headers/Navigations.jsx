import "assets/styles/navigations.css";
import React from "react";
import { NavLink } from "react-router-dom";

function NavBar() {
  const [click, setClick] = React.useState(false);

  const handleClick = () => setClick(!click);
  const Close = () => setClick(false);

  return (
    <div>
      <div className={click ? "main-container" : ""} onClick={() => Close()} />
      <nav className="navbar" onClick={(e) => e.stopPropagation()}>
        <div className="nav-container">
          <NavLink exact to="/" className="nav-logo">
            G4-W23-COMP231-FE
          </NavLink>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <NavLink
                exact
                to="/"
                activeClassName="active"
                className="nav-links"
                onClick={click ? handleClick : null}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/sign-in"
                activeClassName="active"
                className="nav-links"
                onClick={click ? handleClick : null}
              >
                Sign In
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/register"
                activeClassName="active"
                className="nav-links"
                onClick={click ? handleClick : null}
              >
                Sign up
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/search"
                activeClassName="active"
                className="nav-links"
                onClick={click ? handleClick : null}
              >
                Search Vets
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/apointment"
                activeClassName="active"
                className="nav-links"
                onClick={click ? handleClick : null}
              >
                Apointment
              </NavLink>
            </li>
          </ul>
          <div className="nav-icon" onClick={handleClick}>
            <i className={click ? "fa fa-times" : "fa fa-bars"}></i>
          </div>
        </div>
      </nav>
    </div>
  );
}
export function Navigations() {
  return (
    <header>
      <NavBar />
    </header>
  );
}
