import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/color';
import { useAuthStore } from '@/store/auth.store';
import { Linking } from 'react-native';
import { PLAN_LIMITS } from '@ai-image-app/shared';

export default function ProfileScreen() {
  const { user, logout, deleteAccount } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Выход', 'Вы уверены что хотите выйти?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Удалить аккаунт',
      'Это действие необратимо. Все ваши данные и сгенерированные изображения будут удалены.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            // Второе подтверждение
            Alert.alert('Вы уверены?', 'Аккаунт и все данные будут удалены безвозвратно.', [
              { text: 'Отмена', style: 'cancel' },
              {
                text: 'Да, удалить',
                style: 'destructive',
                onPress: async () => {
                  try {
                    await deleteAccount();
                    router.replace('/(auth)/login');
                  } catch {
                    Alert.alert('Ошибка', 'Не удалось удалить аккаунт. Попробуйте позже.');
                  }
                },
              },
            ]);
          },
        },
      ],
    );
  };

  const plan = user?.plan === 'FREE' ? 'free' : 'premium';
  const limit = PLAN_LIMITS[plan].generationsPerDay;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>👤 Профиль</Text>
      </View>

      {/* Аватар и имя */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.username?.[0]?.toUpperCase() || '?'}</Text>
        </View>
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* Тариф */}
      <View style={styles.planCard}>
        <View style={styles.planHeader}>
          <Text style={styles.planTitle}>
            {user?.plan === 'FREE' ? '🆓 Бесплатный тариф' : '⭐ Premium'}
          </Text>
          {user?.plan === 'FREE' && (
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={() => Linking.openURL('https://aigenapp-backend.vercel.app')}
            >
              <Text style={styles.upgradeText}>Улучшить</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.planLimit}>
          {limit === Infinity ? 'Безлимитные генерации' : `${limit} генераций в день`}
        </Text>
        <Text style={styles.planResolution}>
          Макс. разрешение: {PLAN_LIMITS[plan].maxResolution}
        </Text>
        {user?.plan === 'PREMIUM' && (
          <Text style={styles.planCredits}>⭐ Premium кредитов: {user?.premiumCredits || 0}</Text>
        )}
      </View>

      {/* Баланс */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>💰 Баланс</Text>
        <Text style={styles.balanceAmount}>{user?.balance?.amount?.toFixed(2) || '0.00'}₽</Text>
        <TouchableOpacity
          style={styles.topUpButton}
          onPress={() => Linking.openURL('https://aigenapp-backend.vercel.app/dashboard')}
        >
          <Text style={styles.topUpText}>Пополнить на сайте →</Text>
        </TouchableOpacity>
      </View>

      {/* Кнопки */}
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Выйти из аккаунта</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteText}>Удалить аккаунт</Text>
        </TouchableOpacity>
      </View>
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
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  planCredits: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: '600',
  },
  balanceCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  balanceTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
  },
  topUpButton: {
    marginTop: 4,
  },
  topUpText: {
    fontSize: 14,
    color: Colors.primaryLight,
    fontWeight: '600',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
  },
  email: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  planCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  upgradeButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  upgradeText: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  planLimit: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  planResolution: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  buttons: {
    marginHorizontal: 20,
    marginTop: 32,
    gap: 12,
  },
  logoutButton: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  logoutText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.error,
  },
  deleteText: {
    color: Colors.error,
    fontSize: 16,
    fontWeight: '600',
  },
});
