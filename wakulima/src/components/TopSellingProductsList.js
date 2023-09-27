import React from 'react';
import { FlatList, Text, StyleSheet, TouchableOpacity, View, Image } from 'react-native';

const TopSellingProductsList = ({ topSellingProducts, onProductPress }) => {
  return (
    <FlatList
      data={topSellingProducts}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onProductPress(item)}>
          <View style={styles.productItem}>
            <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>Price: ${item.price.toFixed(2)}</Text>
              {/* Add additional product details here */}
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 14,
    color: 'gray',
  },
  // Add styles for additional product details
});

export default TopSellingProductsList;
