import React, { Component } from "react";
import axios from "axios";
import Navbar from "../authentication/navbar";
import Background from './images/background3.jpg';
import './css/details.css';

class Details extends Component {
  constructor(props){
    super(props);
    this.state = {
      squad: [],
      showMatchDetails: false,
    };
    this.matchInfo = this.matchInfo.bind(this);

    let uid = props.location.state === undefined ? false : props.location.state['uid'];
    if(uid)
      this.matchInfo(uid);
  }

  componentDidMount(){
    document.body.style.background= `url(${Background})`;
    document.body.style.backgroundColor = "#000000";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
  }

  componentWillUnmount() {
    document.body.style.background= 'transparent';
    document.body.style.backgroundColor = "transparent";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
  }

  matchInfo(uid){
    this.setState({
      squad: [],
      showMatchDetails: false,
    });
    axios
      .get(`http://localhost:5000/squad/${uid}/`)
      .then((response) => {
        console.log(response.data['final_data']);

        this.setState({
          squad: response.data['final_data'],
        });

        this.setState({
          showMatchDetails: true,
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }


  render() {
    return (
      <React.Fragment>
      <Navbar />
        <div className="container" style={{ marginTop: "100px", height: "80vh", overflow: "hidden" }}>
          <div className="row players" style={{ overflow: "scroll" }}>
            <div className="col-12 col-md-6 playernames-col">
              <div className="playernames-col-inner">
                <h3 className="country-tag">{ this.state.showMatchDetails ? this.state.squad[0].name : null } LIST</h3>
                { this.state.showMatchDetails ? this.state.squad[0]['players'].map((player, index) => (
                  <p className="player-name-tag">
                    <label htmlFor={'t1p'+index} className="player-name-tag">
                      <input type="checkbox" id={'t1p'+index} value={player.pid} />
                      <span className="player-name">{index + 1}&#41; {player.name}</span>
                    </label>
                  </p>
                )) : null }
              </div>
            </div>

            <div className="col-12 col-md-6 playernames-col">
              <div className="playernames-col-inner">
                <h3 className="country-tag">{ this.state.showMatchDetails ? this.state.squad[1].name : null } LIST</h3>
                { this.state.showMatchDetails ? this.state.squad[1]['players'].map((player, index) => (
                  <p className="player-name-tag">
                    <label htmlFor={'t2p'+index} className="player-name-tag">
                      <input type="checkbox" id={'t2p'+index} value={player.pid} />
                      <span className="player-name">{index + 1}&#41; {player.name}</span>
                    </label>
                  </p>
                )) : null }
              </div>
            </div>


            <div className="col-12 col-md-12 playernames-col">
              <div className="playernames-col-inner" style={{textAlign: "center", marginTop: "50px"}}>
                <button id="make-team-btn" className="btn btn-primary">Make your team</button>
              </div>
            </div>



          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Details;
