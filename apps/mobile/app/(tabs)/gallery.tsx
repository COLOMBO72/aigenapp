import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Image,
} from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/color';
import { api } from '@/services/api';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 48) / 2;

interface Generation {
  id: string;
  prompt: string;
  imageUrl: string | null;
  status: string;
  createdAt: string;
}

export default function GalleryScreen() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Generation | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/generate/history');
      setGenerations(response.data.data.filter((g: Generation) => g.imageUrl));
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Обновляем при переходе на экран
  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, []),
  );

  const renderItem = ({ item }: { item: Generation }) => (
    <TouchableOpacity
      style={styles.imageContainer}
      onPress={() => setSelectedImage(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.imageUrl! }} style={styles.image} resizeMode="cover" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🖼️ Галерея</Text>
        <Text style={styles.headerSubtitle}>{generations.length} изображений</Text>
      </View>

      {generations.length === 0 && !isLoading ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🎨</Text>
          <Text style={styles.emptyText}>Пока нет изображений</Text>
          <Text style={styles.emptySubtext}>Сгенерируй первую картинку во вкладке Генерация</Text>
        </View>
      ) : (
        <FlatList
          data={generations}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={fetchHistory}
              tintColor={Colors.primary}
            />
          }
        />
      )}

      {/* Модалка просмотра */}
      <Modal
        visible={!!selectedImage}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedImage(null)}
        >
          {selectedImage && (
            <View style={styles.modalContent}>
              <Image
                source={{ uri: selectedImage.imageUrl! }}
                style={styles.modalImage}
                resizeMode="contain"
              />
              <Text style={styles.modalPrompt}>{selectedImage.prompt}</Text>
            </View>
          )}
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  grid: {
    padding: 16,
  },
  row: {
    gap: 16,
    marginBottom: 16,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    gap: 16,
  },
  modalImage: {
    width: '100%',
    height: width,
    borderRadius: 16,
  },
  modalPrompt: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
});
