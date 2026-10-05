import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../theme';

const ACTIONS = [
  {
    href: '/report/new',
    title: 'Report an incident',
    body: 'Corruption, financial crime, pipeline and power offences, environmental harm, unsafe products or a public safety threat.',
    primary: true,
  },
  {
    href: '/track',
    title: 'Track a report',
    body: 'Enter your reference number and tracking code to see what has happened since you submitted.',
    primary: false,
  },
  {
    href: '/reports',
    title: 'My reports',
    body: 'Reports submitted from this device, with the codes needed to track them.',
    primary: false,
  },
  {
    href: '/offices',
    title: 'Nearby offices',
    body: 'Agency offices close to you, for when something needs reporting in person.',
    primary: false,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xxl },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.brand}>CATCHAM</Text>
        <Text style={styles.tagline}>
          Report an incident to the agency responsible for it. No account needed.
        </Text>
      </View>

      <View style={styles.actions}>
        {ACTIONS.map((action) => (
          <Pressable
            key={action.href}
            onPress={() => router.push(action.href as never)}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.action,
              action.primary && styles.actionPrimary,
              pressed && styles.actionPressed,
            ]}
          >
            <Text style={[styles.actionTitle, action.primary && styles.actionTitlePrimary]}>
              {action.title}
            </Text>
            <Text style={[styles.actionBody, action.primary && styles.actionBodyPrimary]}>
              {action.body}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.note}>
        <Text style={styles.noteTitle}>Anonymous means anonymous</Text>
        <Text style={styles.noteBody}>
          An anonymous report stores no name, email or phone number. You receive a tracking
          code once, and only its hash is kept — not even an administrator can read it
          back. The app saves your copy on this device.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          In immediate danger? Contact the emergency services directly rather than filing a
          report here.
        </Text>
        <Link href="/(auth)/login" style={styles.footerLink}>
          Officer sign in
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xl,
  },
  header: {
    gap: spacing.sm,
  },
  brand: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.brand[600],
    letterSpacing: 0.5,
  },
  tagline: {
    ...typography.body,
  },
  actions: {
    gap: spacing.md,
  },
  action: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    backgroundColor: colors.neutral.white,
    gap: spacing.xs,
    minHeight: 48,
  },
  actionPrimary: {
    backgroundColor: colors.brand[600],
    borderColor: colors.brand[600],
  },
  actionPressed: {
    opacity: 0.85,
  },
  actionTitle: {
    ...typography.subheading,
  },
  actionTitlePrimary: {
    color: colors.neutral.white,
  },
  actionBody: {
    ...typography.caption,
    lineHeight: 18,
  },
  actionBodyPrimary: {
    color: colors.brand[100],
  },
  note: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.neutral.white,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    gap: spacing.sm,
  },
  noteTitle: {
    ...typography.subheading,
  },
  noteBody: {
    ...typography.caption,
    lineHeight: 19,
  },
  footer: {
    gap: spacing.md,
    alignItems: 'center',
  },
  footerText: {
    ...typography.caption,
    textAlign: 'center',
  },
  footerLink: {
    ...typography.caption,
    color: colors.brand[600],
    fontWeight: '600',
    paddingVertical: spacing.md,
  },
});
