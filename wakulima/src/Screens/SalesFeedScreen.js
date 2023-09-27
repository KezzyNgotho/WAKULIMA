import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const SalesFeedScreen = () => {
  const [feeds, setFeeds] = useState([]);
  const [newFeed, setNewFeed] = useState('');

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('feeds')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        const feedData = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          feedData.push({ ...data, id: doc.id });
        });
        setFeeds(feedData);
      });

    return () => unsubscribe();
  }, []);

  const addFeed = async () => {
    if (newFeed.trim() === '') {
      Alert.alert('Error', 'Please enter a valid feed.');
      return;
    }

    try {
      await firestore()
        .collection('feeds')
        .add({ text: newFeed, timestamp: firestore.FieldValue.serverTimestamp() });
      setNewFeed('');
    } catch (error) {
      console.error('Error adding feed:', error);
      Alert.alert('Error', 'An error occurred while adding the feed. Please try again later.');
    }
  };

  const updateFeed = async (id, newText) => {
    try {
      await firestore().collection('feeds').doc(id).update({ text: newText });
    } catch (error) {
      console.error('Error updating feed:', error);
      Alert.alert('Error', 'An error occurred while updating the feed. Please try again later.');
    }
  };

  const deleteFeed = async (id) => {
    try {
      await firestore().collection('feeds').doc(id).delete();
    } catch (error) {
      console.error('Error deleting feed:', error);
      Alert.alert('Error', 'An error occurred while deleting the feed. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sales Feed</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter your feed"
          value={newFeed}
          onChangeText={(text) => setNewFeed(text)}
          style={styles.input}
        />
        <TouchableOpacity onPress={addFeed} style={styles.addButton}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={feeds}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.feedItem}>
            <TextInput
              value={item.text}
              onChangeText={(text) => updateFeed(item.id, text)}
              style={styles.feedInput}
            />
            <TouchableOpacity onPress={() => deleteFeed(item.id)} style={styles.deleteButton}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 8,
    paddingHorizontal: 8,
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  feedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 5,
    elevation: 2,
  },
  feedInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 8,
    paddingHorizontal: 8,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SalesFeedScreen;
