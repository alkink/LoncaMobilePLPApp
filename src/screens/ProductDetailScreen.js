import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');


const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [activeIndex, setActiveIndex] = useState(0);
  const [imagesLoading, setImagesLoading] = useState({});
  const flatListRef = useRef(null);

  
  const fabricInfo = product.description_details?.en?.fabric || '';
  const modelMeasurements = product.description_details?.en?.model_measurements || '';
  const productMeasurements = product.description_details?.en?.product_measurements || '';
  const sampleSize = product.description_details?.en?.sample_size || '';

  const handleImageLoadStart = (index) => {
    setImagesLoading(prev => ({...prev, [index]: true}));
  };

  const handleImageLoadEnd = (index) => {
    setImagesLoading(prev => ({...prev, [index]: false}));
  };

  const renderImageItem = ({ item, index }) => {
    return (
      <View style={styles.slideContainer}>
        <Image 
          source={item}
          style={styles.mainImage}
          contentFit="cover"
          transition={300}
          onLoadStart={() => handleImageLoadStart(index)}
          onLoad={() => handleImageLoadEnd(index)}
        />
        {imagesLoading[index] && (
          <View style={styles.imageLoadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        )}
      </View>
    );
  };

  // slider görünür olduğunda hangi resim görünür olduğunu belirlemek için
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  // Slaytlar arası daha pürüzsüz geçiş yapmak için
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  }).current;

  // Slaytlar arası geçiş yapmak için
  const goToSlide = (index) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header*/}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{product.vendor.name}</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Image Slider */}
        <View style={styles.sliderContainer}>
          <FlatList
            ref={flatListRef}
            data={product.images}
            renderItem={renderImageItem}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            initialNumToRender={2}
            maxToRenderPerBatch={2}
            windowSize={3}
          />
          
          {/* Pagination dots:  Slaytların altında hangi resimde olduğumuzu gösteren noktalar */}
          <View style={styles.paginationContainer}>
            {product.images.map((_, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.paginationDot,
                  activeIndex === index && styles.paginationDotActive
                ]}
                onPress={() => goToSlide(index)}
              />
            ))}
          </View>
        </View>

        {/* Thumbnail */}
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.thumbnailContainer}>
          {product.images.map((image, index) => (
            <TouchableOpacity 
              key={index} 
              onPress={() => goToSlide(index)}
              style={[
                styles.thumbnailButton,
                activeIndex === index && styles.selectedThumbnail
              ]}
            >
              <Image 
                source={image}
                style={styles.thumbnailImage}
                contentFit="cover"
                transition={300}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Product information */}
        <View style={styles.infoContainer}>
          <Text style={styles.brandName}>{product.vendor.name}</Text>
          <Text style={styles.productName}>{product.names.en}</Text>
          <Text style={styles.price}>${product.price}</Text>

          <View style={styles.divider} />

          {/* Product details */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>SKU:</Text>
              <Text style={styles.detailValue}>{product.product_code}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Series:</Text>
              <Text style={styles.detailValue}>{product.series.name} ({product.series.item_quantity} pieces)</Text>
            </View>

            {fabricInfo ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Fabric:</Text>
                <Text style={styles.detailValue}>{fabricInfo}</Text>
              </View>
            ) : null}

            {modelMeasurements ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Model Measurements:</Text>
                <Text style={styles.detailValue}>{modelMeasurements}</Text>
              </View>
            ) : null}

            {productMeasurements ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Product Measurements:</Text>
                <Text style={styles.detailValue}>{productMeasurements}</Text>
              </View>
            ) : null}

            {sampleSize ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Sample Size:</Text>
                <Text style={styles.detailValue}>{sampleSize}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  placeholder: {
    width: 40,
  },
  sliderContainer: {
    position: 'relative',
  },
  slideContainer: {
    width: width,
    height: width * 1.2,
    position: 'relative',
  },
  mainImage: {
    width: width,
    height: width * 1.2,
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
  paginationContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  thumbnailContainer: {
    padding: 16,
    flexDirection: 'row',
  },
  thumbnailButton: {
    marginRight: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    overflow: 'hidden',
  },
  selectedThumbnail: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  thumbnailImage: {
    width: 60,
    height: 60,
  },
  infoContainer: {
    padding: 16,
  },
  brandName: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 16,
  },
  detailsContainer: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailLabel: {
    width: 140,
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
  },
});

export default ProductDetailScreen; 