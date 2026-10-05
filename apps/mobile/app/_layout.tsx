import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../store/auth.store';
import { ApiError } from '../api/client';
import { colors } from '../theme';

export default function RootLayout() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // A phone drops connectivity often, so one retry is worth it, but a
            // 4xx will not change on retry.
            retry: (failureCount, error) =>
              error instanceof ApiError && error.status >= 400 && error.status < 500
                ? false
                : failureCount < 2,
            staleTime: 60_000,
          },
          mutations: { retry: false },
        },
      }),
  );

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: colors.neutral.white },
              headerTitleStyle: { fontSize: 16, fontWeight: '600' },
              headerTintColor: colors.neutral[950],
              headerShadowVisible: false,
              contentStyle: { backgroundColor: colors.neutral[50] },
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="report/new" options={{ title: 'Submit a report' }} />
            <Stack.Screen name="report/receipt" options={{ title: 'Report received', headerBackVisible: false }} />
            <Stack.Screen name="track/index" options={{ title: 'Track a report' }} />
            <Stack.Screen name="reports/index" options={{ title: 'My reports' }} />
            <Stack.Screen name="offices/index" options={{ title: 'Nearby offices' }} />
            <Stack.Screen name="(auth)/login" options={{ title: 'Officer sign in' }} />
            <Stack.Screen name="profile/index" options={{ title: 'Account' }} />
          </Stack>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
