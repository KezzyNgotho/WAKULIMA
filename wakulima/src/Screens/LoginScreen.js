import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import firebase from '../components/firebase';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLogin = async () => {
    try {
      // Query Firestore to find the user's email by username
      const userQuerySnapshot = await firebase.firestore()
        .collection('users')
        .where('username', '==', username)
        .get();

      if (!userQuerySnapshot.empty) {
        // Get the first document from the query (assuming usernames are unique)
        const userDoc = userQuerySnapshot.docs[0];
        const userData = userDoc.data();

        // Sign in with email and password
        await auth().signInWithEmailAndPassword(userData.email, password);

        // Redirect the user based on their role
        const userRole = userData.role;
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
        setErrorMessage('User not found.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Login failed. Please check your credentials.');
    }
  };

  return (
    
    <ImageBackground source={require('../assets/backgroundcharles.jpg')} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          label="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
          mode="outlined"
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
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        <Button mode="contained" onPress={handleLogin} style={styles.loginButton}>
          Login
        </Button>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
          <Text style={styles.registerLink}>Don't have an account? Register here.</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '80%',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: '100%',
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  loginButton: {
    width: '100%',
    backgroundColor: 'blue',
  },
  forgotPassword: {
    color: 'blue',
    marginTop: 16,
  },
  registerLink: {
    color: 'blue',
    marginTop: 16,
  },
});

export default LoginScreen;
