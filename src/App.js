import React, { Component } from 'react';
import './App.css';

const google = window.google;

class App extends Component {
  constructor(props) {
    super(props);

    this.markers = [];
    this.handleClick = this.handleClick.bind(this);
    this.handleUndo = this.handleUndo.bind(this);
    this.setMarkers = this.setMarkers.bind(this);
  }

  componentDidMount() {
    const mapOptions = {
      center: {lat: 40.7128, lng: -74.0059},
      zoom: 15,
    };
    this.map = new google.maps.Map(this.mapNode, mapOptions);
    this.polyline = new google.maps.Polyline({
      strokeColor: '#779ECB',
      strokeOpacity: 1.0,
      strokeWeight: 3,
    });
    this.polyline.setMap(this.map);

    this.map.addListener('click', (event) => {
      this.handleClick(event.latLng);
    });
  }

  handleClick(location) {
    let path = this.polyline.getPath();
    path.push(location);

    let marker = new google.maps.Marker({
      position:location,
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      title: '#' + path.getLength(),
    });

    this.markers.push(marker);

  }

  setMarkers(map, lastMarker) {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }

    if (lastMarker) {
      lastMarker.setMap(null);
    }
  }

  handleUndo() {
    let path = this.polyline.getPath();
    path.pop();

    let lastMarker = this.markers.pop();
    this.setMarkers(this.map, lastMarker);
  }

  render() {
    return (
      <div id='map-container' ref='map'>
        <div className='googlemaps' ref={map => this.mapNode = map}></div>
        <button className='undoButton' onClick={this.handleUndo}>Undo</button>
      </div>
    );
  }
}

export default App;
