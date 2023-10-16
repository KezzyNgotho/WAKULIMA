import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

const AdminLogoutScreen = ({ navigation }) => {
  const handleLogout = () => {
    // Display a confirmation alert before logging out
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            // Implement your logout functionality here, such as clearing user session or credentials
            // Example: Remove user authentication token

            // After logout, navigate to the login screen or any other desired screen
            navigation.navigate('Login');
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Admin Logout Screen</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default AdminLogoutScreen;
