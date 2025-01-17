import "assets/styles/default.css";
import { Outlet } from "react-router-dom";
import { Common } from "components";

export function Default(siteTitle) {
  return (
    <div className="App">
      <Common.NavBar />
      <div className="default-wrapper">
        <div className="default-inner">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
