import React, { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { Banner, Button, Card, EmptyState, Loading, Screen } from '../../components/ui';
import { receiptStorage } from '../../utils/storage';
import { colors, formatDate, radius, spacing, typography } from '../../theme';
import type { SavedReceipt } from '../../types';

/**
 * Receipts for reports submitted from this device.
 *
 * This is the only place a tracking code can be recovered: the server stores a
 * hash. Removing an entry is irreversible, so it asks first.
 */
export default function MyReportsScreen() {
  const router = useRouter();
  const [receipts, setReceipts] = useState<SavedReceipt[] | null>(null);

  const load = useCallback(() => {
    void receiptStorage.list().then(setReceipts);
  }, []);

  // Reload on focus so a report submitted since the last visit appears.
  useFocusEffect(load);

  function confirmRemove(receipt: SavedReceipt) {
    Alert.alert(
      'Remove this receipt?',
      `The tracking code for ${receipt.referenceNumber} is stored only on this device. Removing it means you will no longer be able to track that report.`,
      [
        { text: 'Keep', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            void receiptStorage.remove(receipt.referenceNumber).then(load);
          },
        },
      ],
    );
  }

  if (receipts === null) {
    return <Loading message="Loading your reports" />;
  }

  if (receipts.length === 0) {
    return (
      <Screen>
        <EmptyState
          title="No reports from this device"
          message="Reports you submit here are listed with the codes needed to track them."
        />
        <Button label="Submit a report" onPress={() => router.push('/report/new')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Banner
        tone="info"
        message="These codes are stored only on this device, in the system keystore. They are not recoverable from the server."
      />

      {receipts.map((receipt) => (
        <Card key={receipt.referenceNumber}>
          <Text style={typography.subheading}>{receipt.title}</Text>
          <Text style={typography.caption}>Submitted {formatDate(receipt.submittedAt)}</Text>

          <View style={styles.values}>
            <ValueRow label="Reference" value={receipt.referenceNumber} />
            {receipt.trackingCode ? (
              <ValueRow label="Tracking code" value={receipt.trackingCode} />
            ) : (
              <Text style={typography.caption}>
                Submitted with contact details, so there is no tracking code.
              </Text>
            )}
          </View>

          {receipt.trackingCode && (
            <Button
              label="Track this report"
              onPress={() =>
                router.push({
                  pathname: '/track',
                  params: { reference: receipt.referenceNumber, code: receipt.trackingCode },
                })
              }
            />
          )}

          <Pressable
            onPress={() => confirmRemove(receipt)}
            accessibilityRole="button"
            style={styles.remove}
          >
            <Text style={styles.removeLabel}>Remove from this device</Text>
          </Pressable>
        </Card>
      ))}
    </Screen>
  );
}

function ValueRow({ label, value }: { label: string; value: string }) {
  return (
    <Pressable
      onPress={() => void Clipboard.setStringAsync(value)}
      accessibilityRole="button"
      accessibilityLabel={`Copy ${label}`}
      style={styles.valueRow}
    >
      <Text style={styles.valueLabel}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  values: {
    gap: spacing.sm,
  },
  valueRow: {
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.neutral[50],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    gap: 2,
    minHeight: 48,
    justifyContent: 'center',
  },
  valueLabel: {
    ...typography.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    ...typography.mono,
    fontSize: 16,
    color: colors.neutral[950],
  },
  remove: {
    minHeight: 44,
    justifyContent: 'center',
  },
  removeLabel: {
    ...typography.caption,
    color: colors.status.error,
    fontWeight: '600',
  },
});
