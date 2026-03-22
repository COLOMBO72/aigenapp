import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/auth.store';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/color';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return <Redirect href={isAuthenticated ? '/(tabs)/chat' : '/(auth)/login'} />;
}