import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Banner, Button, Card, Field, Screen } from '../../components/ui';
import { useAuth } from '../../store/auth.store';
import { ApiError } from '../../api/client';
import { typography } from '../../theme';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/profile');
    }
  }, [isAuthenticated, router]);

  async function onSubmit() {
    setError(null);
    setIsSubmitting(true);

    try {
      await signIn(email, password);
      router.replace('/profile');
    } catch (caught) {
      setError(
        caught instanceof ApiError ? caught.message : 'Could not sign in. Try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Screen>
      <Text style={typography.body}>
        For agency personnel. Reporting and tracking do not need an account, and signing in
        is never required to submit a report.
      </Text>

      <Card>
        <Field
          label="Work email"
          required
          value={email}
          onChangeText={setEmail}
          placeholder="officer@agency.gov.ng"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="username"
        />
        <Field
          label="Password"
          required
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
          textContentType="password"
        />

        {error && <Banner tone="error" message={error} />}

        <Button
          label="Sign in"
          onPress={() => void onSubmit()}
          disabled={email.length === 0 || password.length === 0}
          loading={isSubmitting}
        />
      </Card>

      <Text style={typography.caption}>
        Signing in creates an audit record that includes your address and device.
      </Text>
    </Screen>
  );
}
