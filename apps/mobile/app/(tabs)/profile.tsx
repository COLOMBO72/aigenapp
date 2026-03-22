import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/color';
import { useAuthStore } from '@/store/auth.store';
import { PLAN_LIMITS } from '@ai-image-app/shared';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

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
            <TouchableOpacity style={styles.upgradeButton}>
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
      </View>

      {/* Кнопка выхода */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Выйти из аккаунта</Text>
      </TouchableOpacity>
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
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 32,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.error,
  },
  logoutText: {
    color: Colors.error,
    fontSize: 16,
    fontWeight: '600',
  },
});
