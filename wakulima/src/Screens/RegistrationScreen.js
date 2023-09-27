import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from '../components/firebase';
import { TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

const RegistrationScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleRegistration = async () => {
    try {
      // Add email and password validation here if needed

      // Create a new user in Firebase Authentication
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);

      // Define user data to be stored in Firestore
      const userData = {
        role,
        status: 'Pending', // Default status, can be changed based on your approval process
      };

      // Store user data in Firestore
      await firebase.firestore().collection('users').doc(userCredential.user.uid).set(userData);

      // Redirect to a success page or display a success message
      navigation.navigate('RegistrationSuccess');
    } catch (error) {
      console.error('Registration error:', error);
      // Provide specific error messages for different failure scenarios
      setErrorMessage('Registration failed. Please try again.');
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Registration</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        mode="outlined"
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        mode="outlined"
      />
      <Text>Select Role:</Text>
      <Picker
        selectedValue={role}
        onValueChange={(itemValue) => setRole(itemValue)}
      >
        <Picker.Item label="Customer" value="customer" />
        <Picker.Item label="Salesperson" value="salesperson" />
        <Picker.Item label="Admin" value="admin" />
      </Picker>

      {errorMessage && (
        <Text style={{ color: 'red', marginBottom: 16 }}>{errorMessage}</Text>
      )}
      <TouchableOpacity onPress={handleRegistration}>
        <Text
          style={{
            backgroundColor: 'blue',
            textAlign: 'center',
            color: 'white',
            padding: 12,
            borderRadius: 5,
            marginTop: 16,
          }}
        >
          Register
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegistrationScreen;
