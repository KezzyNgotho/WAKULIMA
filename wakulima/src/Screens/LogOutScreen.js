import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import firebase from '../components/firebase'; // Import your Firebase configuration

const LogoutScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Replace 'yourUserId' with the actual user ID or identifier
    const userId = 'yourUserId';

    // Make a Firebase query to fetch the user's information
    firebase
      .firestore()
      .collection('users')
      .doc(userId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          setUsername(userData.username || 'User'); // Set the username or a default value
        }
      })
      .catch((error) => {
        console.error('Error fetching user data: ', error);
      });
  }, []);

  // Handle the logout action with a confirmation dialog
  const handleLogout = () => {
    // Display a confirmation dialog
    Alert.alert(
      'Logout Confirmation',
      `Are you sure you want to logout, ${username}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            // Implement your logout logic here
            // For example, clearing user authentication token, etc.

            // After logging out, navigate to the login screen or any other screen as needed
            navigation.navigate('Login'); // Change 'Login' to your desired screen name
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Logout</Text>
      <Text style={styles.usernameText}>Logged in as: {username}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5', // Background color for the screen
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  usernameText: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default LogoutScreen;
