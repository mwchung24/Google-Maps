import React, { Component } from 'react';
import './App.css';

const google = window.google;

class App extends Component {
  // constructor(props) {
  //   super(props);
  // }

  componentDidMount() {
    const mapOptions = {
      center: {lat: 40.7128, lng: -74.0059},
      zoom: 15,
    };
    this.map = new google.maps.Map(this.mapNode, mapOptions);
  }



  render() {
    return (
      <div id='map-container' ref='map'>
        <div className='googlemaps' ref={map => this.mapNode = map}></div>
      </div>
    );
  }
}

export default App;
