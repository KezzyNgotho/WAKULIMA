import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const ProductItem = ({ item, totalSales, analyzeProductState }) => {
  return (
    <View style={styles.productCard}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productDescription}>{item.description}</Text>
      <Text style={styles.salesInfo}>Total Sales: ${totalSales ? totalSales.toFixed(2) : 'N/A'}</Text>

      <Text style={styles.productStock}>In Stock: {item.stock}</Text>
      <Text style={styles.productAnalysis}>Analysis: {analyzeProductState(item)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  productCard: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: 'white', // Set your desired background color
    padding: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  salesInfo: {
    fontSize: 14,
  },
  productStock: {
    fontSize: 14,
    color: 'green',
  },
  productAnalysis: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'blue',
  },
});

export default ProductItem;
