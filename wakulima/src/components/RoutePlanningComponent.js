import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from '../components/config';

const RoutePlanningComponent = () => {
  const [coordinates, setCoordinates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace these with your origin and destination coordinates
    const origin = 'origin_latitude,origin_longitude';
    const destination = 'destination_latitude,destination_longitude';

    // Make a request to the Google Directions API
    axios
      .get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_MAPS_API_KEY}`
      )
      .then((response) => {
        const route = response.data.routes[0];
        const routeCoordinates = route.overview_polyline.points;
        const decodedCoordinates = decodePolyline(routeCoordinates);
        setCoordinates(decodedCoordinates);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  // Function to decode Google Maps Polyline
  const decodePolyline = (encoded) => {
    const polyline = require('@mapbox/polyline');
    return polyline.decode(encoded).map((coord) => {
      return {
        latitude: coord[0],
        longitude: coord[1],
      };
    });
  };

  return (
    <View style={styles.container}>
      {error ? (
        <Text>Error: {error}</Text>
      ) : (
        <MapView style={styles.map}>
          {coordinates.length > 0 && (
            <Polyline
              coordinates={coordinates}
              strokeColor="#3498db"
              strokeWidth={5}
            />
          )}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default RoutePlanningComponent;
