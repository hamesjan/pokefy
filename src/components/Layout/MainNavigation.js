import { useState } from "react";
import classes from "./MainNavigation.module.css";
import { Link, useLocation } from "react-router-dom";

const MainNavigation = () => {
  const tab = useLocation();
  return (
    <>
      <header className={classes.header}>
        <a className={classes.site_title} href="/">
          Pokefy
        </a>
      </header>
    </>
  );
};
export default MainNavigation;
