import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

function ProductItem({ item, isSelected, toggleProductSelection, onEditProduct }) {
  return (
    <TouchableOpacity onPress={() => toggleProductSelection(item.id)}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            width: 24,
            height: 24,
            backgroundColor: isSelected ? 'green' : 'gray',
            borderRadius: 12, // Make it circular
            marginRight: 8,
          }}
        ></View>
        <Text>{item.name}</Text>
        <TouchableOpacity
          style={{ marginLeft: 'auto' }}
          onPress={() => onEditProduct(item)}
        >
          <Image
            source={require('../assets/icons8-edit-30.png')}
            style={{ width: 30, height: 30 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default ProductItem;
