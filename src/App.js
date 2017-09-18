import React, { Component } from 'react';
import './App.css';

const google = window.google;

class App extends Component {
  constructor(props) {
    super(props);

    this.markers = [];
    this.handleClick = this.handleClick.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleUndo = this.handleUndo.bind(this);
    this.setMarkers = this.setMarkers.bind(this);
    this.snapToRoad = this.snapToRoad.bind(this);
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

    this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(
      document.getElementById('search')
    );
    let autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autoc')
    );
    autocomplete.bindTo('bounds', this.map);
    autocomplete.addListener('place_changed', () => {
      let place = autocomplete.getPlace();
      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      } else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(15);
      }
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

    marker.addListener('drag', (event) => {
      this.handleDrag(event.latLng);
    });

    this.markers.push(marker);

    this.snapToRoad(path);

  }

  snapToRoad(path) {
    let pathValues = [];
    for (let i = 0; i < path.getLength(); i++) {
      pathValues.push(path.getAt(i).toUrlValue());
    }

    let apiKey = 'AIzaSyD3LUZ3dcsIib5YwgooRk-wNYKME99MWIc';

    $.get('https://roads.googleapis.com/v1/snapToRoads', {
      interpolate: true,
      key: apiKey,
      path: pathValues.join('|'),
    }, console.log('hi'));
  }

  handleDrag(location) {
    let path = this.polyline.getPath();
    path.pop();
    path.push(location);
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
        <div id='search'>
          <p className='auto'><input type='text' id='autoc'/></p>
        </div>
        <button className='undoButton' onClick={this.handleUndo}>Undo</button>
      </div>
    );
  }
}

export default App;
