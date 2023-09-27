import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import LottieView from 'lottie-react-native'; // Import LottieView
import firebase from "../components/firebase"; // Import your Firebase configuration

const FeedScreen = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State to track loading state

  useEffect(() => {
    // Fetch posts from Firebase Firestore
    const postsRef = firebase.firestore().collection("posts");

    postsRef
      .orderBy("timestamp", "desc") // Order posts by timestamp (newest first)
      .get()
      .then((querySnapshot) => {
        const postsData = [];
        querySnapshot.forEach((doc) => {
          const post = doc.data();
          postsData.push(post);
        });
        setPosts(postsData);
        setIsLoading(false); // Set loading to false when posts are loaded
      })
      .catch((error) => {
        console.error("Error fetching posts: ", error);
        setIsLoading(false); // Set loading to false on error
      });
  }, []);

  // Render a single post item
  const renderPostItem = ({ item }) => {
    return (
      <View style={styles.postItem}>
        <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
        <Text style={styles.postCaption}>{item.caption}</Text>
        {/* Add additional post details here */}
      </View>
    );
  };

  // Render loading animation when isLoading is true
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require("../assets/icons8-loading-50.png")} // Replace with your animation file
          autoPlay
          loop
        />
      </View>
    );
  }

  // Render "Nothing here" message when there are no posts
  if (posts.length === 0) {
    return (
      <View style={styles.nothingHereContainer}>
        <LottieView
          source={require("../assets/icons8-loading-50.png")} // Replace with your animation file
          autoPlay
          loop={false}
        />
        <Text style={styles.nothingHereText}>Nothing here, buddy!</Text>
      </View>
    );
  }

  // Render the list of posts
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feed</Text>
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id}
        style={styles.postsList}
      />
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
  postItem: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  postImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 8,
  },
  postCaption: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  nothingHereContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  nothingHereText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
  // Add styles for additional post details
});

export default FeedScreen;
