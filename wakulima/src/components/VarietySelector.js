import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

const VarietySelector = ({
  product,
  selectedVariety,
  onSelectVariety,
  selectedQuantity,
  onSelectQuantity,
}) => {
  useEffect(() => {
    if (
      product &&
      product.varieties &&
      product.varieties.length > 0 &&
      !selectedVariety
    ) {
      // If the selected variety is not set, select the first variety by default
      onSelectVariety(product.varieties[0].name);
    }
  }, [product, selectedVariety, onSelectVariety]);

  if (!product || !product.varieties || product.varieties.length === 0) {
    // If no product or no varieties, render nothing
    return null;
  }

  const handleVarietyChange = (variety) => {
    onSelectVariety(variety);
  };

  const handleQuantityChange = (quantity) => {
    onSelectQuantity(quantity);
  };

  return (
    <View style={styles.varietySelector}>
      <Text style={styles.varietyLabel}>Variety:</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.varietyScrollView}
      >
        {product.varieties.map((item) => (
          <TouchableOpacity
            key={item.name}
            style={[
              styles.varietyButton,
              selectedVariety === item.name && styles.selectedVarietyButton,
            ]}
            onPress={() => handleVarietyChange(item.name)}
          >
            <Text
              style={[
                styles.varietyButtonText,
                selectedVariety === item.name &&
                  styles.selectedVarietyButtonText,
              ]}
            >
              {item.name} - Quantity: {item.quantity}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  varietySelector: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  varietyLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
  },
  varietyScrollView: {
    marginRight: 10,
  },
  varietyButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    marginRight: 10,
  },
  selectedVarietyButton: {
    backgroundColor: "#007BFF",
  },
  varietyButtonText: {
    fontSize: 16,
    color: "#333",
  },
  selectedVarietyButtonText: {
    color: "#fff",
  },
});

export default VarietySelector;
