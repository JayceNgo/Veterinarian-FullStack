import "assets/styles/auth.css";
import React from "react";
import { Outlet } from "react-router-dom";

export function Auth(props) {
  return (
    <div className="App">
      <div className="auth-wrapper">
        <div className="auth-inner">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
