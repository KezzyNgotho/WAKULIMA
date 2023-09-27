import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from '../components/firebase';
import { TextInput, HelperText } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

const RegistrationScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [id, setId] = useState('');

  const handleRegistration = async () => {
    try {
      // Add email and password validation here if needed

      // Create a new user in Firebase Authentication
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      // Define user data to be stored in Firestore
      const userData = {
        role,
        username,
        fullName,
        mobileNumber,
        status: 'Pending', // Default status, can be changed based on your approval process
        id, // You can customize this field as needed
      };

      // Store user data in Firestore
      await firebase.firestore().collection('users').doc(userCredential.user.uid).set(userData);

      // Redirect to the login page after successful registration
      navigation.navigate('Login');
    } catch (error) {
      console.error('Registration error:', error);
      // Provide specific error messages for different failure scenarios
      setErrorMessage('Registration failed. Please try again.');
    }
  };

  // Conditional rendering of the ID field
  const renderIdField = () => {
    if (role !== 'customer') {
      return (
        <TextInput
          label="ID" // Customize the label as needed
          value={id}
          onChangeText={(text) => setId(text)}
          mode="outlined"
          style={styles.input}
        />
      );
    }
    return null; // Hide the field for customers
  };

  const handleLogin = () => {
    // Navigate to the registration screen when the "Register" button is pressed
    navigation.navigate('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Registration</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        mode="outlined"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Full Name"
        value={fullName}
        onChangeText={(text) => setFullName(text)}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Mobile Number"
        value={mobileNumber}
        onChangeText={(text) => setMobileNumber(text)}
        mode="outlined"
        keyboardType="phone-pad"
        style={styles.input}
      />
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Select Role:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={role}
            onValueChange={(itemValue) => setRole(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Customer" value="customer" />
            <Picker.Item label="Salesperson" value="salesperson" />
            <Picker.Item label="Admin" value="admin" />
          </Picker>
        </View>
      </View>

      {renderIdField()}
      {errorMessage && <HelperText type="error" style={styles.errorText}>{errorMessage}</HelperText>}
      <TouchableOpacity onPress={handleRegistration} style={styles.registerButton}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogin}>
        <Text style={styles.loginLink}>Already have an account? Login.</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    justifyContent: 'center',
  },
  header: {
    fontSize: 32,
    marginBottom: 24,
    textAlign: 'center',
    color: 'black',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: '#555',
  },
  inputContainer: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  registerButton: {
    backgroundColor: 'blue',
    padding: 16,
    borderRadius: 5,
    marginTop: 16,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
  },
  loginLink: {
    textAlign: 'center',
    color: 'blue',
    marginTop: 16,
  },
});

export default RegistrationScreen;
