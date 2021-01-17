import React, { Component } from "react";
import axios from "axios";

import Navbar from "../authentication/navbar";
import "./css/dashboard.css"

import Background from './images/background.jpg'

import { Link } from "react-router-dom";

var apikey = "emBYZiXkANWVscCOVI0um4b2Unl2";

class DashBoard extends Component {
  constructor(){
    super();
    this.state={
      titles: [],
      squad: [],
      load: false,
    };
    this.matches = this.matches.bind(this);
    this.matchTiming = this.matchTiming.bind(this);
    this.matches();
  }

  matches(){
    axios
      .get(`https://fantasy11api.herokuapp.com//matches/`)
      .then((response) => {
        console.log("final_data: ",response.data);
        
        response.data['final_data'].forEach(match=>{
        this.state.titles.push({"uid": match.uid, "title": match.title, "dateTime": match.dateTime});
        });
        this.setState({
          load: true
        })   
      })
      .catch((error) => {
        console.log(error);
      });
  }

  matchTiming(uid){
    axios
      .get(`https://cricapi.com/api/fantasySummary?apikey=${apikey}&unique_id=${uid}`)
      .then((response) => {
        console.log(response.data);
        var matchDateTime = new Date(response.data.dateTimeGMT).toLocaleTimeString({},
            {timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric', day: 'numeric', month: 'numeric', year: 'numeric'}
        );
        console.log(matchDateTime)

      })
      .catch((error) => {
        console.log(error);
      })
  }

  componentDidMount(){
    document.body.style.background= `url(${Background})`;
    document.body.style.backgroundColor = "#FFFFFF";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "";
  }

  componentWillUnmount() {
    document.body.style.background= 'transparent';
    document.body.style.backgroundColor = "transparent";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "contain";
  }

  render() {
    if(!this.state.load){
      return <Navbar />
    }
    return (
    <React.Fragment>
      <Navbar />
        <div className="container" style={{marginTop: '100px', height:'80vh', overflow: 'hidden'}}>
          <div className="row matches" style={{overflow: 'scroll'}}>
            {this.state.titles.map((d)=>

              <div className="col-12 col-md-6 matches-outer">
                <div className="matches-inner">
                  <h5>{d.title}</h5>
                  <h6>{d.dateTime}</h6>
                  <Link to={{pathname: '/details' , state: { 'uid': d.uid }}}><button className="details-btn">Details</button></Link>
                </div>
              </div>
            )}
          </div>
        </div>
    </React.Fragment>
    );
  
  }
}



export default DashBoard;
