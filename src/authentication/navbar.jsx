/*
;==========================================
; Title:  navbar component
; Author: Bryan Caldeira
; Date:   21 Dec 2020
;==========================================
*/

import React, { Component } from "react";
import "./css/navbar.css";
import logo from "../logo.svg";

class Navbar extends Component {

  render() {
    return (
      <nav>
        <p id="brand">
          Fantasy Eleven <object id="logo" data={logo}></object>
        </p>
      </nav>
    );
  }
}

export default Navbar;
