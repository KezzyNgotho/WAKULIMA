import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Modal,
  Button,
  Image,
  Alert
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import firebase from '../components/firebase';

import {useNavigation} from '@react-navigation/native';

const CustomerProfileScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [profileImage, setProfileImage] = useState(null); // To store the selected profile image
  const defaultProfileImage = 'https://th.bing.com/th/id/R.93a2edf3c93cd754c403ba3e14a3c0a0?rik=cuOtgvLbP5FxpA&pid=ImgRaw&r=0';
 // Set the URL of your default profile image
  const user = firebase.auth().currentUser;

  useEffect(() => {
    if (user) {
      setUsername(user.displayName || '');
      setUserEmail(user.email || '');
      setProfileImage(user.photoURL || defaultProfileImage); // Initialize the profile image with the user's current photo or the default image
    }
  }, [user]);

  const uploadProfileImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });

      setProfileImage(image.path); // Set the selected image
    } catch (error) {
      console.error('Error selecting profile image:', error);
    }
  };

  const saveProfileImageToStorage = async (userId) => {
    if (profileImage) {
      try {
        const { uri } = profileImage;

        const reference = storage()
          .ref(`profile_images/${userId}.jpg`)
          .putFile(uri);

        // Get the image URL after upload
        const imageUrl = await reference.getDownloadURL();
        console.log('Image URL:', imageUrl);

        return imageUrl;
      } catch (error) {
        console.error('Error uploading profile image:', error);
        throw error;
      }
    }
    return null;
  };

  const handleSaveProfile = async () => {
    setIsEditing(false);

    try {
      const userId = user.uid; // Assuming you have the user's UID
      const imageUrl = await saveProfileImageToStorage(userId);

      // Update user's profile data in Firebase Authentication
      await user.updateProfile({
        displayName: username,
        email: userEmail,
        photoURL: imageUrl, // Update the profile image URL
      });

      // Reload the user to reflect changes (optional)
      await user.reload();

      // Update local state with the edited user data
      setUsername(user.displayName || '');
      setUserEmail(user.email || '');
    } catch (error) {
      console.error('Error updating profile data:', error);
    }
  };

  const handleFeedbackSubmit = () => {
    setFeedbackModalVisible(false);
    
    // Send user feedback to your backend or handle it as needed
    // Example: Submit feedback to a server
    const userId = user.uid;
    const feedbackData = {
      text: feedbackText,
      timestamp: new Date().toISOString(),
    };
  
    firestore()
      .collection('feedback') // Reference the "feedback" collection directly
      .add(feedbackData) // Add the feedback data to the collection
      .then(() => {
        console.log('Feedback submitted successfully');
      })
      .catch((error) => {
        console.error('Error submitting feedback:', error);
      });
  };
  
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);


  // Function to show the logout confirmation modal
  const showLogoutModal = () => {
    setLogoutModalVisible(true);
  };

  // Function to hide the logout confirmation modal
  const hideLogoutModal = () => {
    setLogoutModalVisible(false);
  };

  const handleLogout = () => {
    // Display a confirmation dialog
    Alert.alert(
      'Logout Confirmation',
      `Are you sure you want to logout,?`,
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

  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Customer Profile</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <Image
          source={{ uri: profileImage }} // Use the profileImage state
          style={styles.profileImage}
        />
        <TouchableOpacity onPress={uploadProfileImage}>
          <Image
            source={require('../assets/icons8-edit-30.png')}
            style={styles.editButtonImage}
          />
        </TouchableOpacity>

        <Text style={styles.profileLabel}>Name</Text>
        {isEditing ? (
          <TextInput
            style={styles.profileInput}
            value={username}
            onChangeText={setUsername}
          />
        ) : (
          <Text style={styles.profileText}>{username}</Text>
        )}

        <Text style={styles.profileLabel}>Email</Text>
        {isEditing ? (
          <TextInput
            style={styles.profileInput}
            value={userEmail}
            onChangeText={setUserEmail}
          />
        ) : (
          <Text style={styles.profileText}>{userEmail}</Text>
        )}

        {isEditing ? (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveProfile}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.feedbackSection}>
        <TouchableOpacity
          style={styles.feedbackButton}
          onPress={() => setFeedbackModalVisible(true)}
        >
          <Text style={styles.feedbackButtonText}>Send Feedback</Text>
        </TouchableOpacity>
      </View>

      {/* Feedback Modal */}
      <Modal
        visible={feedbackModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Provide Feedback</Text>
            <TextInput
              style={styles.feedbackInput}
              multiline={true}
              value={feedbackText}
              onChangeText={setFeedbackText}
              placeholder="Your feedback..."
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleFeedbackSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setFeedbackModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,

  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color:'black'
  },
  logoutButton: {
    padding: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
  },
  profileSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 16,
  },
  profileLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'black'
  },
  profileText: {
    fontSize: 16,
    color:'black'
  },
  profileInput: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  editButtonImage: {
    width: 30,
    height: 30,
    alignSelf: 'flex-end',
    marginTop: -30,
    marginRight: 5,
  },
  editProfileButton: {
    backgroundColor: 'blue',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
  },
  editProfileButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: 'green',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  feedbackSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
  },
  feedbackButton: {
    backgroundColor: 'blue',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
  },
  feedbackButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    width: '80%',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color:'black'
  },
  feedbackInput: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    minHeight: 100,
    color:'black'
  },
  submitButton: {
    backgroundColor: 'blue',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'red',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CustomerProfileScreen;
