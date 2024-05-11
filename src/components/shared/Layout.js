import React, { useState } from "react";
import TopNav from "./TopNav";
import Wrapper from "./Wrapper";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  let [shownav, setShownav] = useState(false);
  let handleShowNav = () => {
    setShownav(!shownav);
  };
  return (
    <>
      <Wrapper shownav={shownav}>
        <Sidebar handleShowNav={handleShowNav} />
        <div className="layout-page">
          <TopNav handleShowNav={handleShowNav} />
          <div class="content-wrapper">{children}</div>
        </div>
      </Wrapper>
    </>
  );
};

export default Layout;
