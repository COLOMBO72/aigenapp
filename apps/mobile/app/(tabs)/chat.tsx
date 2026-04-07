import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
  Switch,
  Image,
} from 'react-native';
import { useState, useRef } from 'react';
import { Colors } from '@/constants/color';
import { api } from '@/services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth.store';

const { width } = Dimensions.get('window');

interface Message {
  id: string;
  type: 'user' | 'image' | 'error' | 'loading';
  content: string;
  imageUrl?: string;
  isPremium?: boolean;
}

export default function ChatScreen() {
  const { user, refreshUser } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      type: 'image',
      content:
        'Привет! Опиши что хочешь увидеть ✨\n\nБесплатно: Flux Schnell (быстро)\nPremium: Flux Dev (высокое качество)',
    },
  ]);
  const [prompt, setPrompt] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  const canUsePremium = user?.plan === 'PREMIUM';
  const premiumCredits = user?.premiumCredits || 0;
  const balance = user?.balance?.amount || 0;

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    // Проверяем доступность Premium
    if (isPremium && !canUsePremium) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'error',
          content:
            'Premium генерация доступна только с подпиской VIP. Перейди в Профиль чтобы улучшить тариф.',
        },
      ]);
      return;
    }

    if (isPremium && premiumCredits === 0 && balance < 5) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'error',
          content: `Недостаточно средств. Кредиты: ${premiumCredits}, Баланс: ${balance}₽. Нужно минимум 5₽.`,
        },
      ]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: prompt.trim(),
      isPremium,
    };

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'loading',
      content: isPremium ? 'Генерирую Premium изображение...' : 'Генерирую изображение...',
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setPrompt('');
    setIsGenerating(true);

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const response = await api.post('/api/generate', {
        prompt: userMessage.content,
        isPremium,
      });

      const { generationId } = response.data.data;

      const pollStatus = async (): Promise<void> => {
        const statusResponse = await api.get(`/api/generate/${generationId}`);
        const generation = statusResponse.data.data;

        if (generation.status === 'COMPLETED') {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.type === 'loading'
                ? {
                    id: msg.id,
                    type: 'image',
                    content: userMessage.content,
                    imageUrl: generation.imageUrl,
                    isPremium,
                  }
                : msg,
            ),
          );
          setIsGenerating(false);
          await refreshUser(); // Обновляем кредиты и баланс
          setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        } else if (generation.status === 'FAILED') {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.type === 'loading'
                ? { id: msg.id, type: 'error', content: generation.errorMsg || 'Ошибка генерации' }
                : msg,
            ),
          );
          setIsGenerating(false);
        } else {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          return pollStatus();
        }
      };

      await pollStatus();
    } catch (error: any) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.type === 'loading'
            ? {
                id: msg.id,
                type: 'error',
                content: error?.response?.data?.error || 'Что-то пошло не так',
              }
            : msg,
        ),
      );
      setIsGenerating(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    if (item.type === 'user') {
      return (
        <View style={styles.userMessageContainer}>
          {item.isPremium && <Text style={styles.premiumBadge}>⭐ Premium</Text>}
          <View style={styles.userMessage}>
            <Text style={styles.userMessageText}>{item.content}</Text>
          </View>
        </View>
      );
    }

    if (item.type === 'loading') {
      return (
        <View style={styles.botMessage}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={Colors.primary} size="small" />
            <Text style={styles.loadingText}>{item.content}</Text>
          </View>
        </View>
      );
    }

    if (item.type === 'error') {
      return (
        <View style={styles.botMessage}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>❌ {item.content}</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.botMessage}>
        {item.imageUrl ? (
          <View>
            {item.isPremium && <Text style={styles.premiumImageBadge}>⭐ Premium — Flux Dev</Text>}
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.generatedImage}
              resizeMode="cover"
            />
            <Text style={styles.imageCaption}>{item.content}</Text>
          </View>
        ) : (
          <Text style={styles.botMessageText}>{item.content}</Text>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={60}
    >
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>✨ Velium Pictures</Text>
        {canUsePremium && (
          <Text style={styles.headerSubtitle}>
            {premiumCredits > 0
              ? `${premiumCredits} Premium кредитов • ${balance.toFixed(0)}₽`
              : `Баланс: ${balance.toFixed(0)}₽`}
          </Text>
        )}
      </View>

      {/* Список сообщений */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Переключатель Premium */}
      {canUsePremium && (
        <View style={styles.premiumToggle}>
          <Text style={styles.premiumToggleLabel}>
            {isPremium ? '⭐ Flux Dev (Premium)' : '⚡ Flux Schnell (Free)'}
          </Text>
          <Switch
            value={isPremium}
            onValueChange={setIsPremium}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor={Colors.text}
          />
        </View>
      )}

      {/* Поле ввода */}
      <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          style={styles.input}
          placeholder={isPremium ? 'Промпт для Premium генерации...' : 'Опиши изображение...'}
          placeholderTextColor={Colors.textMuted}
          value={prompt}
          onChangeText={setPrompt}
          multiline
          maxLength={1000}
          editable={!isGenerating}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            isPremium && styles.sendButtonPremium,
            (!prompt.trim() || isGenerating) && styles.sendButtonDisabled,
          ]}
          onPress={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
        >
          <Text style={styles.sendButtonText}>{isGenerating ? '⏳' : isPremium ? '⭐' : '🚀'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    color: Colors.primaryLight,
    marginTop: 4,
  },
  messagesList: {
    padding: 16,
    gap: 12,
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    gap: 4,
  },
  premiumBadge: {
    fontSize: 11,
    color: Colors.warning,
    fontWeight: '600',
  },
  userMessage: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '80%',
  },
  userMessageText: {
    color: Colors.text,
    fontSize: 15,
    lineHeight: 20,
  },
  botMessage: {
    alignSelf: 'flex-start',
    maxWidth: '85%',
  },
  botMessageText: {
    color: Colors.text,
    fontSize: 15,
    lineHeight: 20,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.error,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
  },
  premiumImageBadge: {
    fontSize: 11,
    color: Colors.warning,
    fontWeight: '600',
    marginBottom: 4,
  },
  generatedImage: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 16,
  },
  imageCaption: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 6,
    paddingHorizontal: 4,
  },
  premiumToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  premiumToggleLabel: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 10,
    backgroundColor: Colors.background,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonPremium: {
    backgroundColor: '#f59e0b',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendButtonText: {
    fontSize: 20,
  },
});
