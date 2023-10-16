import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet ,Image,TouchableOpacity,ScrollView} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import firebase from '../components/firebase';
import {useNavigation} from '@react-navigation/native';

const AdminDashboard = () => {
  const [recommendations, setRecommendations] = React.useState([]);
  const [demandData, setDemandData] = React.useState([]);
  const navigation = useNavigation();

  React.useEffect(() => {
    const ordersRef = firebase.firestore().collection('orders');

    ordersRef.onSnapshot((snapshot) => {
      const orderList = [];
      snapshot.forEach((doc) => {
        orderList.push({ id: doc.id, ...doc.data() });
      });

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

    setDemandData(demandData);

    calculateRecommendations(demandData);
  };

  const calculateRecommendations = (demandData) => {
    const sortedDemandData = [...demandData].sort((a, b) => b.demand - a.demand);
    const topRecommendedProducts = sortedDemandData.slice(0, 5);

    // Divide the recommendations into pairs
    const recommendationsInPairs = [];
    for (let i = 0; i < topRecommendedProducts.length; i += 2) {
      const pair = topRecommendedProducts.slice(i, i + 2);
      recommendationsInPairs.push(pair);
    }

    setRecommendations(recommendationsInPairs);
  };

  return (
    <View style={styles.container}>
     <View style={styles.headerContainer}>
        <Text style={styles.header}>Admin</Text>
        <View style={styles.headerButtons}>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Messages')}>
          <Image
            source={require('../assets/icons8-messages-24.png')} // Replace with the correct path to your messages icon
            style={styles.messagesIcon}
          />
        </TouchableOpacity>
        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.navigate('AdminLogout')}>
          <Image
            source={require('../assets/icons8-logout-30.png')} // Replace with the path to your logout icon
            style={styles.logoutIcon}
          />
        </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Demand Data</Text>
      <PieChart
        data={demandData.map((item) => ({
          name: item.productName,
          population: item.demand,
          color: `#${Math.floor(Math.random()*16777215).toString(16)}`, // Generate random colors
          legendFontColor: '#7F7F7F',
          legendFontSize: 15,
        }))}
        width={300}
        height={200}
        chartConfig={{
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
      <ScrollView>
      <Text style={styles.sectionTitle}>Top Recommendations</Text>
      <FlatList
        data={recommendations}
        renderItem={({ item }) => (
          <View style={styles.row}>
            {item.map((product, index) => (
              <View key={index} style={styles.recommendationItem}>
                <Text style={styles.productName}>Product: {product.productName}</Text>
                {/* <Text style={styles.productName}>Type: {product.type}</Text> */}
                <Text style={styles.demand}>Demand: {product.demand}</Text>
              </View>
            ))}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontFamily: 'YourCustomFont-Bold', // Replace with your custom font or system font
    color:'black'
  },
  headerButtons: {
    flexDirection: 'row',
  },
  notificationButton: {
   
    padding: 8,
    marginLeft: 8,
  },
  messagesIcon: {
    padding: 8,
    marginLeft: 8,
  },
  logoutButton: {
    padding: 8,
    backgroundColor: 'transparent', // Set the background color of the logout button
    borderRadius: 4,
  },
  logoutIcon: {
    width: 24,
    height: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    color:'black' 
  },
 
    recommendationItem: {
      flex: 1,
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 5,
      padding: 16,
      marginHorizontal: 8,
      backgroundColor: 'white',
    },
    productName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'black',
    },
    demand: {
      fontSize: 16,
      color: 'black',
    },
});

export default AdminDashboard;
