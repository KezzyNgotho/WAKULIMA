import React, { useState, useEffect } from 'react';
import MapView, { Polyline } from 'react-native-maps';

const SalespersonMap = ({ routes }) => {
    // Initialize a state to store polylines for routes
    const [polylines, setPolylines] = useState([]);
  
    // Define the initial map region and polyline coordinates
    const initialRegionCoords = {
      latitude: 37.78825, // Replace with the latitude of your initial point
      longitude: -122.4324, // Replace with the longitude of your initial point
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    function decodePolyline(polyline) {
        const points = [];
        let index = 0;
        let lat = 0;
        let lng = 0;
      
        while (index < polyline.length) {
          let shift = 0;
          let result = 0;
      
          do {
            const byte = polyline.charCodeAt(index) - 63;
            index++;
            result |= (byte & 0x1f) << shift;
            shift += 5;
          } while (byte >= 0x20);
      
          const deltaLat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
          lat += deltaLat;
      
          shift = 0;
          result = 0;
      
          do {
            const byte = polyline.charCodeAt(index) - 63;
            index++;
            result |= (byte & 0x1f) << shift;
            shift += 5;
          } while (byte >= 0x20);
      
          const deltaLng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
          lng += deltaLng;
      
          points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
        }
      
        return points;
      }
      
  
    useEffect(() => {
      // Fetch and calculate directions between waypoints
      const waypoints = routes.map((route) => `${route.latitude},${route.longitude}`).join('|');
      const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${routes[0].latitude},${routes[0].longitude}&destination=${routes[routes.length - 1].latitude},${routes[routes.length - 1].longitude}&waypoints=${waypoints}&key=AIzaSyDjNhBqXIIpwS5CRwInWmiv1QFATSNbLdk`;
  
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.routes && data.routes.length > 0) {
            const polyline = data.routes[0].overview_polyline.points;
            setPolylines(polyline);
          }
        })
        .catch((error) => {
          console.error('Error fetching directions:', error);
        });
    }, [routes]);
  
    return (
      <MapView style={{ flex: 1 }} initialRegion={initialRegionCoords}>
        {polylines.length > 0 && (
          <Polyline
            coordinates={decodedPolylinePoints}
            strokeColor="#000" // Color of the route line
            strokeWidth={5} // Width of the route line
          />
        )}
      </MapView>
    );
  };
  
  export default SalespersonMap;
  