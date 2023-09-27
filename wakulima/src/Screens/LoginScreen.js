import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';
import auth from '@react-native-firebase/auth'; // Import Firebase Auth module
import firestore from '@react-native-firebase/firestore'; // Import Firestore module
import firebase from '../components/firebase';
const LoginScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      // Use Firebase Authentication to sign in
      await auth().signInWithEmailAndPassword(email, password);

      // Fetch the user's role from Firestore
      const user = await firestore().collection('users').doc(auth().currentUser.uid).get();
      const userData = user.data();

      if (userData && userData.role) {
        const userRole = userData.role;
        // Redirect the user based on their role
        if (userRole === 'customer') {
          navigation.navigate('Main');
        } else if (userRole === 'salesperson') {
          navigation.navigate('SalesStack');
        } else if (userRole === 'admin') {
          navigation.navigate('AdminStack');
        } else {
          setErrorMessage('Invalid user role.');
        }
      } else {
        setErrorMessage('User role not found.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Login failed. Please check your credentials.');
    }
  };

  const handleRegistration = () => {
    // Navigate to the registration screen when the "Register" button is pressed
    navigation.navigate('Registration');
  };

  const handleForgotPassword = () => {
    // Implement password reset logic here (e.g., Firebase password reset)
    // Send a password reset email to the user's email address
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Login</Text>
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
      {errorMessage && (
        <Text style={{ color: 'red', marginBottom: 16 }}>{errorMessage}</Text>
      )}
      <TouchableOpacity onPress={handleLogin}>
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
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={{ textAlign: 'center', color: 'blue', marginTop: 16 }}>
          Forgot Password?
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleRegistration}>
        <Text style={{ textAlign: 'center', color: 'blue', marginTop: 16 }}>
          Don't have an account? Register.
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
