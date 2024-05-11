import { Fragment } from "react";
import MainNavigation from "./MainNavigation";
import "./Layout.css";
import Footer from "./Footer/Footer";

const Layout = (props) => {
  return (
    <Fragment>
      <MainNavigation />
      <main>{props.children}</main>
      <Footer />
    </Fragment>
  );
};

export default Layout;
