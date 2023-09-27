import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    try {
      // Check if the username exists in your Firestore collection
      const userDoc = await firestore()
        .collection('users')
        .where('username', '==', username)
        .limit(1)
        .get();

      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data();

        // Sign in the user with Firebase Authentication using the associated email
        await auth().signInWithEmailAndPassword(userData.email, password);

        // Redirect the user based on their role
        if (userData && userData.role) {
          const userRole = userData.role;
          // Redirect the user based on their role
          if (userRole === 'customer') {
            navigation.navigate('CustomerScreen');
          } else if (userRole === 'salesperson') {
            navigation.navigate('SalespersonScreen');
          } else if (userRole === 'admin') {
            navigation.navigate('AdminScreen');
          } else {
            setErrorMessage('Invalid user role.');
          }
        } else {
          setErrorMessage('User role not found.');
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
    <ImageBackground source={require('../assets/Screenshot 2023-09-28 011220.png')} style={styles.container}>
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
