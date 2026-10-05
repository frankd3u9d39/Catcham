import React, { useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Banner, Button, Card, Screen } from '../../components/ui';
import { colors, radius, spacing, typography } from '../../theme';

/**
 * Shown once, immediately after submission. The tracking code exists only here
 * and in the device's keystore; the server holds a hash, so it cannot be
 * reissued. The screen is deliberately blunt about that.
 */
export default function ReceiptScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    referenceNumber: string;
    trackingCode: string;
    routedTo: string;
  }>();

  const [copied, setCopied] = useState(false);

  const referenceNumber = params.referenceNumber ?? '';
  const trackingCode = params.trackingCode ?? '';
  const routedTo = params.routedTo ?? '';

  async function copy() {
    const text = trackingCode
      ? `CATCHAM report\nReference: ${referenceNumber}\nTracking code: ${trackingCode}`
      : `CATCHAM report\nReference: ${referenceNumber}`;

    await Clipboard.setStringAsync(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <Screen>
      <Card>
        <Text style={typography.heading}>Report received</Text>
        <Text style={typography.body}>
          {routedTo
            ? `It has been routed to ${routedTo}.`
            : 'It is queued for manual assignment to an agency.'}
        </Text>

        <View style={styles.valueBlock}>
          <Text style={styles.valueLabel}>Reference number</Text>
          <Text style={styles.value}>{referenceNumber}</Text>
        </View>

        {trackingCode.length > 0 && (
          <View style={[styles.valueBlock, styles.valueBlockHighlight]}>
            <Text style={[styles.valueLabel, styles.valueLabelHighlight]}>Tracking code</Text>
            <Text style={styles.value}>{trackingCode}</Text>
          </View>
        )}
      </Card>

      {trackingCode.length > 0 && (
        <Banner
          tone="warning"
          title="Save both values now"
          message="Only a hash of the tracking code is stored, so it cannot be shown again or recovered. A copy is kept on this device under My reports — if you lose that, you cannot track this report."
        />
      )}

      <Button
        label={copied ? 'Copied' : 'Copy details'}
        onPress={() => void copy()}
        variant="outline"
      />
      <Button label="Track this report" onPress={() => router.replace('/track')} />
      <Button label="Back to home" onPress={() => router.replace('/')} variant="ghost" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  valueBlock: {
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.neutral[50],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    gap: spacing.xs,
  },
  valueBlockHighlight: {
    backgroundColor: colors.status.warningSurface,
    borderColor: '#FDE68A',
  },
  valueLabel: {
    ...typography.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  valueLabelHighlight: {
    color: '#92400E',
  },
  value: {
    ...typography.mono,
    fontSize: 20,
    color: colors.neutral[950],
  },
});
