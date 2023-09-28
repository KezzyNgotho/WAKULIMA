import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import firebase from '../components/firebase';

const AdminDashboard = () => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const ordersRef = firebase.firestore().collection('orders');

    ordersRef.onSnapshot((snapshot) => {
      const orderList = [];
      snapshot.forEach((doc) => {
        orderList.push({ id: doc.id, ...doc.data() });
      });

      // Calculate demand based on orders and set it in the demand collection
      calculateAndSetDemand(orderList);
    });
  }, []);

  const calculateAndSetDemand = (orders) => {
    const demandMap = new Map();

    orders.forEach((order) => {
      const productsOrdered = order.productsOrdered;

      if (productsOrdered) {
        productsOrdered.forEach((product) => {
          const productName = product.productName;
          const quantity = product.productQuantity;

          if (demandMap.has(productName)) {
            demandMap.set(productName, demandMap.get(productName) + quantity);
          } else {
            demandMap.set(productName, quantity);
          }
        });
      }
    });

    const demandData = Array.from(demandMap, ([productName, demand]) => ({
      productName,
      demand,
    }));

    const demandRef = firebase.firestore().collection('demand_data');
    demandData.forEach((data) => {
      demandRef.add(data);
    });

    calculateRecommendations(demandData);
  };

  const calculateRecommendations = (demandData) => {
    const sortedDemandData = [...demandData].sort((a, b) => b.demand - a.demand);
    const topRecommendedProducts = sortedDemandData.slice(0, 5);

    setRecommendations(topRecommendedProducts);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>
      <Text style={styles.sectionTitle}>Demand Data</Text>
      <FlatList
        data={recommendations}
        renderItem={({ item }) => (
          <View style={styles.recommendationItem}>
            <Text style={styles.productName}>Product: {item.productName}</Text>
            <Text style={styles.demand}>Demand: {item.demand}</Text>
          </View>
        )}
        keyExtractor={(item) => item.productName}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
    padding: 16,
    marginBottom: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  demand: {
    fontSize: 16,
  },
});

export default AdminDashboard;
