import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button, Card } from 'react-native-paper';
import firebase from '../components/firebase';
import TopSellingProductsList from '../components/TopSellingProductsList';
import ProductItem from '../components/ProductItem';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [TopSellingProducts, setTopSellingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productsRef = firebase.firestore().collection('products');
    const ordersRef = firebase.firestore().collection('orders');

    const fetchProducts = () => {
      productsRef.onSnapshot((snapshot) => {
        const productList = [];
        snapshot.forEach((doc) => {
          productList.push({ id: doc.id, ...doc.data() });
        });
        setProducts(productList);
      });
    };

    const calculateTotalSales = () => {
      ordersRef.onSnapshot((snapshot) => {
        let total = 0;
        snapshot.forEach((doc) => {
          const orderData = doc.data();
          if (orderData.products) {
            orderData.products.forEach((product) => {
              total += product.price;
            });
          }
        });
        setTotalSales(total);
        setLoading(false);
      });
    };

    fetchProducts();
    calculateTotalSales();
  }, []);

  const analyzeProductState = (product) => {
    if (product.stock <= 10) {
      return 'Low Stock';
    } else if (product.salesCount >= 50) {
      return 'High Demand';
    } else {
      return 'Normal';
    }
  };
  

  const performProductAnalysis = () => {
    setLoading(true);

    const productSalesCounts = {};
    const ordersRef = firebase.firestore().collection('orders');

    ordersRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const orderData = doc.data();
        if (orderData.products) {
          orderData.products.forEach((product) => {
            const productId = product.id;
            if (!productSalesCounts[productId]) {
              productSalesCounts[productId] = 0;
            }
            productSalesCounts[productId]++;
          });
        }
      });

      const sortedProducts = Object.keys(productSalesCounts).sort(
        (a, b) => productSalesCounts[b] - productSalesCounts[a]
      );

      setTopSellingProducts(sortedProducts);
      setLoading(false);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.salesInfo}>Total Sales: ${totalSales.toFixed(2)}</Text>
        <TouchableOpacity
          style={styles.analysisButton}
          onPress={performProductAnalysis}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Perform Product Analysis</Text>
        </TouchableOpacity>
      </View>
  
      {loading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" color="#007BFF" />
      ) : (
        <View>
          <ProductList products={products} totalSales={totalSales} analyzeProductState={analyzeProductState} />
  
          <Text style={styles.analysisLabel}>Top Selling Products:</Text>
        <TopSellingProductsList topSellingProducts={TopSellingProducts} />
        </View>
      )}
    </View>
  );
};

const ProductList = ({ products, totalSales, analyzeProductState }) => {
  // Create pairs of products for rendering in rows
  const pairedProducts = [];
  for (let i = 0; i < products.length; i += 2) {
    const pair = [products[i]];
    if (i + 1 < products.length) {
      pair.push(products[i + 1]);
    }
    pairedProducts.push(pair);
  }

  return (
    <FlatList
      data={pairedProducts}
      keyExtractor={(item, index) => `product_pair_${index}`}
      renderItem={({ item }) => (
        <View style={styles.productRow}>
          {item.map((product) => (
            <ProductItem
              key={product.id}
              item={product}
              totalSales={totalSales}
              analyzeProductState={analyzeProductState}
            />
          ))}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  salesInfo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  analysisButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  analysisLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  productCard: {
    marginBottom: 16,
    borderRadius: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default AdminDashboard;
