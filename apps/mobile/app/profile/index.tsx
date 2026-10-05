import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Banner, Button, Card, Loading, Pill, Screen } from '../../components/ui';
import { useAuth } from '../../store/auth.store';
import { request } from '../../api/client';
import { colors, humanise, spacing, typography } from '../../theme';

interface Workload {
  assigned: number;
  supervising: number;
  dueWithin24h: number;
  openTasks: number;
}

/**
 * The officer view. Deliberately read-only: case work belongs on the web portal,
 * and this exists so someone away from a desk can see what is waiting.
 */
export default function ProfileScreen() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, signOut, getToken } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const canReadCases = user?.permissions.includes('investigation:read') ?? false;

  const workload = useQuery({
    queryKey: ['workload', user?.id],
    queryFn: async () => {
      const token = await getToken();
      return request<Workload>('/investigations/my-workload', { token });
    },
    enabled: isAuthenticated && canReadCases,
  });

  if (isLoading || !user) {
    return <Loading message="Loading your account" />;
  }

  return (
    <Screen>
      <Card>
        <Text style={typography.heading}>{user.fullName}</Text>
        <Text style={typography.caption}>{user.email}</Text>

        <View style={styles.pills}>
          {user.roleCodes.length === 0 ? (
            <Text style={typography.caption}>No agency role granted.</Text>
          ) : (
            user.roleCodes.map((code) => (
              <Pill
                key={code}
                label={humanise(code)}
                background={colors.brand[50]}
                color={colors.brand[700]}
              />
            ))
          )}
        </View>
      </Card>

      {canReadCases ? (
        <Card>
          <Text style={typography.subheading}>Your workload</Text>

          {workload.isLoading ? (
            <Loading />
          ) : workload.error ? (
            <Banner tone="error" message="Could not load your workload." />
          ) : (
            <View style={styles.stats}>
              <Stat label="Assigned" value={workload.data?.assigned ?? 0} />
              <Stat label="Supervising" value={workload.data?.supervising ?? 0} />
              <Stat label="Due in 24h" value={workload.data?.dueWithin24h ?? 0} />
              <Stat label="Open tasks" value={workload.data?.openTasks ?? 0} />
            </View>
          )}

          <Text style={typography.caption}>
            Case work is done in the web portal. This is a read-only summary.
          </Text>
        </Card>
      ) : (
        <Banner
          tone="info"
          message="Your account has no case access. Ask your agency administrator if you need it."
        />
      )}

      <Button
        label="Sign out"
        variant="outline"
        onPress={() => {
          void signOut().then(() => router.replace('/'));
        }}
      />
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  stat: {
    flexGrow: 1,
    flexBasis: '45%',
    padding: spacing.md,
    borderRadius: 10,
    backgroundColor: colors.neutral[50],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    gap: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.neutral[950],
  },
  statLabel: {
    ...typography.caption,
  },
});
