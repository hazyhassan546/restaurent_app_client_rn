// src/screens/HomeScreen.tsx
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getProducts } from '../../api/products/products';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { config } from '../../config/config';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<NavProp>();

  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(),
  });

  if (isLoading)
    return <ActivityIndicator style={styles.center} size="large" />;
  if (error) return <Text style={styles.center}>Failed to load products</Text>;

  return (
    <FlatList
      data={products?.data}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => {
        const primaryImage =
          item.product_images?.find(img => img.is_primary) ||
          item.product_images?.[0];
        console.log('first');
        return (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              // navigation.navigate('ProductDetail', { productId: item.id });
            }}
          >
            {primaryImage && (
              <Image
                source={{ uri: config.filesBaseUrl + primaryImage.image_url }}
                style={styles.image}
              />
            )}
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>${item.price}</Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 12 },
  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  image: { width: '100%', height: 180 },
  name: { fontSize: 16, fontWeight: '600', padding: 8 },
  price: {
    fontSize: 14,
    color: '#555',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
});
