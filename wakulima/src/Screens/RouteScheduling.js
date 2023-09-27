import React, { useState } from "react";
import { View, Text, Button, TextInput, DatePickerIOS } from "react-native";
import MapView, { Marker } from "react-native-maps";

const RouteScheduling = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [routeDetails, setRouteDetails] = useState("");
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825, // Initial latitude for the map
    longitude: -122.4324, // Initial longitude for the map
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const handleScheduleRoute = () => {
    // Implement route scheduling logic, e.g., send data to server or store locally
    const scheduledRoute = {
      date: selectedDate,
      location: selectedLocation,
      details: routeDetails,
    };

    // You can save the scheduledRoute data as needed
  };

  const handleMapPress = (event) => {
    // When the user taps on the map, update the selectedLocation state
    setSelectedLocation({
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude,
    });
  };

  return (
    <View>
      <Text>Schedule a Route</Text>
      <Text>Select Date and Time:</Text>
      <DatePickerIOS
        date={selectedDate}
        onDateChange={(newDate) => setSelectedDate(newDate)}
        mode="datetime"
        minimumDate={new Date()} // Set minimum date to prevent selecting past dates
      />
      <Text>Location:</Text>
      {selectedLocation && (
        <MapView
          style={{ height: 200 }}
          initialRegion={mapRegion}
          onPress={handleMapPress}
        >
          <Marker
            coordinate={selectedLocation}
            title="Selected Location"
            description="Tap to change"
          />
        </MapView>
      )}
      <Button title="Pick Location on Map" onPress={() => setSelectedLocation(null)} />
      <Text>Route Details:</Text>
      <TextInput
        placeholder="Enter route details"
        value={routeDetails}
        onChangeText={(text) => setRouteDetails(text)}
        multiline
        numberOfLines={4}
      />
      <Button title="Schedule Route" onPress={handleScheduleRoute} />
    </View>
  );
};

export default RouteScheduling;
