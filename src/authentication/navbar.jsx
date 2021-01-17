/*
;==========================================
; Title:  navbar component
; Author: Bryan Caldeira, Dinesh
; Date:   21 Dec 2020
;==========================================
*/

import React from "react";
import { Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import "./css/navbar.css";
import logo from "../logo.svg";
import userAvatar from "../main/images/user-avatar.png";

var collapse = true;
var checkLogin = false;
var history;

function Navbar() {
  history = createBrowserHistory();

  if(document.cookie.match(new RegExp('userData=([^;]+)'))){
    checkLogin = true;
  }

  const expandNavbar = () =>{
    let userPanel = document.getElementById('user-panel');

    if(collapse) {
      if (window.innerWidth <= 458)
        userPanel.style.animationName = 'ExpandUserPanelMobile';
      else
        userPanel.style.animationName = 'ExpandUserPanelLarge';

      document.body.style.overflowY = "hidden";
      collapse = false;
    }
    else{
      if (window.innerWidth <= 458)
        userPanel.style.animationName = 'CollapseUserPanelMobile';
      else
        userPanel.style.animationName = 'CollapseUserPanelLarge';

      document.body.style.overflowY = "auto";
      collapse = true;
    }
  }

  const  logOut = () => {
    var result = document.cookie;
    var cookies = result.split(";");
    for(let i = 0; i < cookies.length; i++) {
      var key = cookies[i].split("=");
      document.cookie = key[0]+" =; expires = Thu, 01 Jan 1970 00:00:00 UTC";
    }
  
    window.location.replace('/dashboard');
  }

  return (
    <React.Fragment>
      <nav>
        <p id="brand">
          Fantasy Eleven <object id="logo" data={logo}/>

          { !history.location.pathname.match("/login")
            ?
            checkLogin ? (
              <button id="user-btn" onClick={expandNavbar}>
                <img src={userAvatar} alt="user-img" width="40"/>
              </button>
            ) : <Link to="/login"><button id="user-lgn" className="btn">Login</button></Link> 
          
            : null
          }

        </p>
      </nav>
      <div id="user-panel">
        <ul id="user-option-list">
          { !history.location.pathname.match("/account") ? <Link to="/account" onClick={expandNavbar}><li>Account</li></Link> : null }
          { !history.location.pathname.match("/dashboard") ? <Link to="/dashboard" onClick={expandNavbar}><li>Dashboard</li></Link> : null }
          { !history.location.pathname.match("/matches") ? <Link to="/matches" onClick={expandNavbar}><li>My Matches</li></Link> : null }
          <li><button onClick={logOut} id="user-panel-lgout" className="btn">LogOut</button></li>
        </ul>
      </div>
    </React.Fragment>
  );
}

export default Navbar;