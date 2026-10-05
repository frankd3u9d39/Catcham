import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { Banner, Button, Card, Field, Pill, Screen } from '../../components/ui';
import { reportingService } from '../../services/reporting.service';
import { ApiError } from '../../api/client';
import { colors, formatDateTime, humanise, spacing, statusColors, typography } from '../../theme';
import type { PublicReportStatus } from '../../types';

export default function TrackScreen() {
  // Deep-linked from My reports, which already holds both values.
  const params = useLocalSearchParams<{ reference?: string; code?: string }>();

  const [referenceNumber, setReferenceNumber] = useState(params.reference ?? '');
  const [trackingCode, setTrackingCode] = useState(params.code ?? '');
  const [status, setStatus] = useState<PublicReportStatus | null>(null);

  const track = useMutation({
    mutationFn: () => reportingService.track(referenceNumber, trackingCode),
    onSuccess: setStatus,
  });

  const canSubmit = referenceNumber.trim().length > 0 && trackingCode.trim().length > 0;

  return (
    <Screen>
      <Text style={typography.body}>
        Both the reference number and the tracking code are required. A reference number
        alone returns nothing, which is what stops a guessed reference from disclosing a
        report.
      </Text>

      <Card>
        <Field
          label="Reference number"
          required
          value={referenceNumber}
          onChangeText={setReferenceNumber}
          placeholder="CTM-2026-7F3A91"
          autoCapitalize="characters"
          autoCorrect={false}
        />
        <Field
          label="Tracking code"
          required
          value={trackingCode}
          onChangeText={setTrackingCode}
          placeholder="The code shown once at submission"
          autoCapitalize="characters"
          autoCorrect={false}
        />
        <Button
          label="Check status"
          onPress={() => {
            setStatus(null);
            track.mutate();
          }}
          disabled={!canSubmit}
          loading={track.isPending}
        />
      </Card>

      {track.error && (
        <Banner
          tone="error"
          message={
            track.error instanceof ApiError
              ? track.error.message
              : 'Could not check the status. Try again.'
          }
        />
      )}

      {status && <StatusCard status={status} />}
    </Screen>
  );
}

function StatusCard({ status }: { status: PublicReportStatus }) {
  const palette = statusColors(status.status);

  return (
    <Card>
      <Text style={styles.reference}>{status.referenceNumber}</Text>
      <Text style={typography.subheading}>{status.title}</Text>
      <Text style={typography.caption}>{status.categoryName}</Text>

      <Pill label={humanise(status.status)} background={palette.background} color={palette.text} />

      <View style={styles.timeline}>
        <Text style={styles.timelineTitle}>Progress</Text>
        {status.timeline.map((entry, index) => (
          <View key={`${entry.action}-${entry.at}`} style={styles.entry}>
            <View style={styles.entryMarker}>
              <View style={styles.dot} />
              {index < status.timeline.length - 1 && <View style={styles.line} />}
            </View>
            <View style={styles.entryBody}>
              <Text style={styles.entryTitle}>{humanise(entry.action)}</Text>
              <Text style={styles.entryDescription}>{entry.description}</Text>
              <Text style={typography.caption}>{formatDateTime(entry.at)}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={typography.caption}>
        Investigation detail is not shown here. Only lifecycle milestones are visible on the
        public tracking view.
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  reference: {
    ...typography.caption,
    fontWeight: '700',
    letterSpacing: 1,
  },
  timeline: {
    gap: spacing.md,
    paddingTop: spacing.sm,
  },
  timelineTitle: {
    ...typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  entry: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  entryMarker: {
    alignItems: 'center',
    width: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.brand[600],
    marginTop: 4,
  },
  line: {
    flex: 1,
    width: 1,
    backgroundColor: colors.neutral[200],
    marginTop: 4,
  },
  entryBody: {
    flex: 1,
    gap: 2,
    paddingBottom: spacing.sm,
  },
  entryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral[900],
  },
  entryDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.neutral[700],
  },
});
