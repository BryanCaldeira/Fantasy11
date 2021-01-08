import React, { Component } from "react";

import Navbar from "../authentication/navbar";

class DashBoard extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <Navbar />
        <h1 style={{margin: "500px", textAlign: "center"}}>Logged In</h1>
      </React.Fragment>
    );
  }
}

export default DashBoard;
