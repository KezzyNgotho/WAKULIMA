import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import firebase from "../components/firebase"; // Import your Firebase configuration

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications from Firebase Firestore
    const notificationsRef = firebase.firestore().collection("notifications");

    notificationsRef
      .orderBy("timestamp", "desc") // Order notifications by timestamp (newest first)
      .get()
      .then((querySnapshot) => {
        const notificationsData = [];
        querySnapshot.forEach((doc) => {
          const notification = doc.data();
          notificationsData.push(notification);
        });
        setNotifications(notificationsData);
      })
      .catch((error) => {
        console.error("Error fetching notifications: ", error);
      });
  }, []);

  // Render a single notification item
  const renderNotificationItem = ({ item }) => {
    return (
      <View style={styles.notificationItem}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationContent}>{item.content}</Text>
        <Text style={styles.notificationTimestamp}>
          {item.timestamp.toDate().toLocaleString()}
        </Text>
      </View>
    );
  };

  // Render a message when there are no notifications
  const renderEmptyMessage = () => (
    <View style={styles.emptyMessage}>
      <Text style={styles.emptyMessageText}>No messages here, buddy! 😊</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      {notifications.length === 0 ? (
        renderEmptyMessage()
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          style={styles.notificationsList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  notificationItem: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  notificationContent: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  notificationTimestamp: {
    fontSize: 14,
    color: "#007BFF",
  },
  notificationsList: {
    flex: 1,
  },
  emptyMessage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyMessageText: {
    fontSize: 18,
    fontWeight: "bold",
    color:"orange"
  },
});

export default NotificationsScreen;
