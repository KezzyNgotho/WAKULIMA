import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import firebase from '../components/firebase';

const MessageScreen = ({ userId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!userId) {
      return;
    }
  
    const messagesRef = firebase.firestore().collection('feedback');
  
    messagesRef
      .orderBy('timestamp', 'desc')
      .onSnapshot(
        (snapshot) => {
          const messageList = [];
  
          snapshot.forEach((doc) => {
            messageList.push({ id: doc.id, ...doc.data() });
          });
  
          if (messageList.length === 0) {
            setMessages([{ id: 'no-messages', message: 'No messages yet' }]);
          } else {
            setMessages(messageList);
          }
        },
        (error) => {
          console.error('Error fetching messages:', error);
        }
      );
  }, [userId]);
     

  const sendMessage = () => {
    // Ensure that the user is logged in and userId is available
    if (!userId) {
      return; // Return early if userId is not available
    }

    const messagesRef = firebase.firestore().collection('messages');
    
    // Replace 'otherUserId' with the actual recipient's user ID
    const otherUserId = 'otherUserId'; 

    const newMessage = {
      sender: userId,
      receiver: otherUserId,
      message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    messagesRef
      .add(newMessage)
      .then(() => {
        setMessage('');
      })
      .catch((error) => {
        console.error('Error sending message: ', error);
      });
  };

  return (
    <View style={styles.container}>
      {/* Display messages */}
      {messages.map((msg) => (
  <View key={msg.id}>
    <Text>{msg.message}</Text>
    <TouchableOpacity
      onPress={() => handleReply(msg.id)} // Handle the reply action
    >
      <Text style={styles.replyButton}>Reply</Text>
    </TouchableOpacity>
  </View>
))}

      {/* Input field and send button */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={(text) => setMessage(text)}
          placeholder="Type your message"
        />
        <TouchableOpacity onPress={sendMessage}>
          <Text style={styles.sendButton}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  sendButton: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MessageScreen;
