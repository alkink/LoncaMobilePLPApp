import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, StatusBar } from 'react-native';
import { Image } from 'expo-image';
import productsData from '../../assets/parent_products.json';



const ProductListScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLoadingStates, setImageLoadingStates] = useState({});

  useEffect(() => {
    setTimeout(() => {
      setProducts(productsData);
      setLoading(false);
    });
  }, []);

  const handleImageLoadStart = (id) => {
    setImageLoadingStates(prev => ({...prev, [id]: true}));
  };

  const handleImageLoadEnd = (id) => {
    setImageLoadingStates(prev => ({...prev, [id]: false}));
  };

  const renderProductItem = ({ item }) => {
    const id = item._id.$oid;
    const isLoading = imageLoadingStates[id];

    return (
      <TouchableOpacity
        style={styles.productItem}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      >
        <View style={styles.imageContainer}>
          <Image
            source={item.main_image}
            style={styles.productImage}
            contentFit="cover"
            transition={300}
            onLoadStart={() => handleImageLoadStart(id)}
            onLoad={() => handleImageLoadEnd(id)}
          />
          {isLoading && (
            <View style={styles.imageLoadingContainer}>
              <ActivityIndicator size="small" color="#FFFFFF" />
            </View>
          )}
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.brandName}>{item.vendor.name}</Text>
          <Text style={styles.productName} numberOfLines={2}>{item.names.en}</Text>
          <Text style={styles.price}>${item.price}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Ürünler yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Toptan Kadın Giyim</Text>
      </View>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item._id.$oid}
        numColumns={2}
        contentContainerStyle={styles.productList}
        initialNumToRender={8}
        maxToRenderPerBatch={4}
        windowSize={9}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  productList: {
    padding: 8,
    backgroundColor: '#F9F9F9',
  },
  productItem: {
    flex: 1,
    margin: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
  },
  productImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#F0F0F0',
  },
  imageLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  productInfo: {
    padding: 12,
  },
  brandName: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333333',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
});

export default ProductListScreen; 