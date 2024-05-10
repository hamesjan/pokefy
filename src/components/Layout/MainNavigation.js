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
        <div style={{ flex: 1 }} />
        <nav className={classes.site_nav}>
          <ul>
            <li>
              <a className={classes.sub_title} href="/about">
                About
              </a>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};
export default MainNavigation;
