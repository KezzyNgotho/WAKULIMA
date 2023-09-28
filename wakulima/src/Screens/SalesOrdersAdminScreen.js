import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import firebase from '../components/firebase';
import Pie from 'react-native-pie-chart';
const AdminDashboard = () => {
  const [customerPreferences, setCustomerPreferences] = useState([]);
/*   const [demandData, setDemandData] = useState([]); */
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [recommendations, setRecommendations] = useState([]); // Define the 'recommendations' state

  useEffect(() => {
    const ordersRef = firebase.firestore().collection('orders');

    ordersRef.onSnapshot((snapshot) => {
      const orderList = [];
      snapshot.forEach((doc) => {
        orderList.push({ id: doc.id, ...doc.data() });
      });
      console.log(orderList); // Add this line to debug the fetched data

      // Calculate demand based on orders and set it in the demand collection
      calculateAndSetDemand(orderList);
    });
  }, []);

  // Function to calculate demand and store it in the demand collection
// Function to calculate demand and store it in the demand collection
const calculateAndSetDemand = (orders) => {
  const demandMap = new Map();

  // Calculate demand for each product based on orders
  orders.forEach((order) => {
    const productsOrdered = order.productsOrdered; // Assuming your order contains a 'productsOrdered' field
    if (productsOrdered) {
      productsOrdered.forEach((product) => {
        const productName = product.productName;
        const quantity = product.productQuantity;

        // Update the demand map
        if (demandMap.has(productName)) {
          demandMap.set(productName, demandMap.get(productName) + quantity);
        } else {
          demandMap.set(productName, quantity);
        }
      });
    } else {
      console.log('No products found in this order.');
    }
  });

  // Convert the demand map to an array of objects
  const demandData = Array.from(demandMap, ([productName, demand]) => ({
    productName,
    demand,
  }));

  // Store the demand data in the Firebase Firestore collection
  const demandRef = firebase.firestore().collection('demand_data');
  demandData.forEach((data) => {
    demandRef.add(data);
  });

  // Calculate recommendations based on demand data and set them
  calculateRecommendations(demandData);



    // Convert the demand map to an array of objects
   
    // Store the demand data in the Firebase Firestore collection
  
    // Calculate recommendations based on demand data and set them
    calculateRecommendations(demandData);
  };

  // Function to calculate recommendations based on demand data
  const calculateRecommendations = (demandData) => {
    // Implement your recommendation logic here
    // This can involve processing demandData and customerPreferences to generate recommendations

    // For demonstration purposes, let's assume you're recommending products
    // that have the highest demand.
    // You can replace this with your specific recommendation algorithm.

    // Sort demand data by demand in descending order
    const sortedDemandData = [...demandData].sort((a, b) => b.demand - a.demand);

    // Get the top N recommended products (e.g., top 5)
    const topRecommendedProducts = sortedDemandData.slice(0, 5);

    // Set the recommendations state with the top recommended products
    setRecommendations(topRecommendedProducts);
  };

  const submitFeedback = () => {
    // Implement feedback submission logic here, e.g., storing feedback in Firebase or sending it to a backend API
    // Example: You can use firebase.firestore() to save feedback to Firestore
    // Replace 'your_feedback_collection' with the actual collection name
    // firebase.firestore().collection('your_feedback_collection').add({
    //   feedbackText: feedback,
    //   // Add more fields if needed
    // });

    // Reset feedback input field
    setFeedback('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>
      <Text style={styles.sectionTitle}>Customer Preferences</Text>
      <FlatList
        data={customerPreferences}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedCustomer(item)}>
            <Text>{item.customerName}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
      {selectedCustomer && (
        <View>
          <Text style={styles.sectionTitle}>Customer Details</Text>
          <Text>Customer Name: {selectedCustomer.customerName}</Text>
          {/* Display other customer details here */}
        </View>
      )}
      <Text style={styles.sectionTitle}>Demand Data</Text>
      {/* Display demand data, demand calculations, etc. */}
     
      <FlatList
        data={recommendations}
        renderItem={({ item }) => (
          <View style={styles.recommendationItem}>
            <Text>Product: {item.productName}</Text>
            <Text>Demand: {item.demand}</Text>
            {/* Display other recommendation details */}
          </View>
        )}
        keyExtractor={(item) => item.productName}
      />
      <Text style={styles.sectionTitle}>Feedback</Text>
      <TextInput
        style={styles.feedbackInput}
        placeholder="Enter feedback"
        value={feedback}
        onChangeText={(text) => setFeedback(text)}
      />
      <Button title="Submit Feedback" onPress={submitFeedback} />
    </View>
  );
};

const styles = StyleSheet.create({
  pieChartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  recommendationItem: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 8,
    marginBottom: 8,
  },
  feedbackInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default AdminDashboard;
