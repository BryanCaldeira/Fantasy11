import React, { Component } from "react";
import TeamSVG from "./images/team.svg";
import Navbar from "../authentication/navbar";
import axios from "axios";
import Background from "./images/background.jpg";
import "./css/team.css";


var apikey = "emBYZiXkANWVscCOVI0um4b2Unl2";
var uid, final_player_list=[], user_matches_list = [];

class Team extends Component {
  constructor(props){
    super(props);
    uid = props.location.state ? props.location.state["uid"] : false;
    console.log(uid);
    this.getSummary = this.getSummary.bind(this);
    this.changeName = this.changeName.bind(this)
  }

  componentDidMount() {
    document.body.style.background = `url(${Background})`;
    document.body.style.backgroundColor = "#000000";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover 100%";
    this.getSummary(uid);
  }

  componentWillUnmount() {
    document.body.style.background = "transparent";
    document.body.style.backgroundColor = "transparent";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover 100%";
  }

  changeName(){
    console.log("Inside change name")
    let result = document.cookie.match(new RegExp('userData=([^;]+)'));
    if(result){
      let json_data = JSON.parse(result[1]);
      user_matches_list = json_data.data[4];
    }

    var tagCounter = 1;
    var SVG = document.getElementById("team-object");

      var svgDoc = SVG.contentDocument;
      console.log(svgDoc)
      user_matches_list.forEach(match=>{
        var key = Object.keys(match)[0];
        var values = match[key];

        console.log(key, values);

        if(key === uid){ 
          for(let j=0; j<final_player_list.length; j++){
            for(let i=0; i<values.length; i++){
              if(values[i] === final_player_list[j].pid){
                let name = final_player_list[j].name;
                if(final_player_list[j].name.length > 11){
                  name = final_player_list[j].name.substring(0,11) + '...';
                }
                svgDoc.getElementById('player-'+tagCounter).innerHTML = "<tspan>"+ name +"</tspan>" ;
                tagCounter++;
              }
            }
          }
        }
      })
  
  }

  getSummary(){
    if(uid){
      axios
        .get(`http://localhost:5000/squad/${uid}/`)
        .then((response) => {
          final_player_list = response.data.final_data[0].players.concat(response.data.final_data[1].players)
          console.log(final_player_list);
          this.changeName();
        })
        .catch((error) => {
          console.log(error);
      });
    }
  }


  render() {
    return (
      <React.Fragment>
        <Navbar />
        <div id="team-container" className="container">
          <div id="team-row" className="row">
            <object data={TeamSVG} id="team-object" />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Team;
