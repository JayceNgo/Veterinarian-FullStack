import React from "react";
import { Outlet } from "react-router-dom";

export function Empty(props) {
  return (
    <div>
      <Outlet />
    </div>
  );
}
