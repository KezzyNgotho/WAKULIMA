import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const LocationSelectionScreen = ({ navigation }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);
  };

  const handleAssignSalesperson = () => {
    if (selectedLocation) {
      // Handle assigning the selected location to a salesperson
      // You can call a function here to assign the location to a salesperson
      // For example, assignSalesperson(selectedLocation);

      // After assigning, navigate back to the StaffScreen
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
     <MapView
  style={styles.map}
  onPress={handleMapPress}
  provider={MapView.PROVIDER_GOOGLE}
  customMapStyle={[]}
  initialRegion={{
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
  providerProps={{
    // Replace 'YOUR_API_KEY_HERE' with your actual API key
    apiKey: 'AIzaSyC-yt8kxemH8jXD634XaapR2362ESdhzYk',
  }}
>
  {selectedLocation && (
    <Marker
      coordinate={selectedLocation}
      title="Selected Location"
    />
  )}
</MapView>

      <Button
        title="Assign Salesperson"
        onPress={handleAssignSalesperson}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '80%',
  },
});

export default LocationSelectionScreen;

