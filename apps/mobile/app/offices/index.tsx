import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Banner, Button, Card, EmptyState, Loading, Screen } from '../../components/ui';
import { reportingService } from '../../services/reporting.service';
import { useLocation } from '../../hooks/use-location';
import { ApiError } from '../../api/client';
import { colors, spacing, typography } from '../../theme';

/**
 * Agency offices near the device, for when something needs reporting in person.
 * Location is requested on mount here because the screen has no other purpose,
 * unlike the report form where it is optional.
 */
export default function NearbyOfficesScreen() {
  const location = useLocation();

  useEffect(() => {
    void location.capture();
    // Intentionally runs once: `capture` is stable and re-running would prompt
    // repeatedly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const offices = useQuery({
    queryKey: ['offices', location.coordinates],
    queryFn: () =>
      reportingService.nearbyOffices(
        location.coordinates!.latitude,
        location.coordinates!.longitude,
        100,
      ),
    enabled: location.coordinates !== null,
  });

  if (location.isLocating) {
    return <Loading message="Finding your location" />;
  }

  if (location.error) {
    return (
      <Screen>
        <Banner tone="warning" title="Location unavailable" message={location.error} />
        <Button label="Try again" onPress={() => void location.capture()} variant="outline" />
      </Screen>
    );
  }

  if (!location.coordinates) {
    return (
      <Screen>
        <Text style={typography.body}>
          This screen needs your location to find offices near you.
        </Text>
        <Button label="Share my location" onPress={() => void location.capture()} />
      </Screen>
    );
  }

  if (offices.isLoading) {
    return <Loading message="Looking for nearby offices" />;
  }

  if (offices.error) {
    return (
      <Screen>
        <Banner
          tone="error"
          message={
            offices.error instanceof ApiError
              ? offices.error.message
              : 'Could not load offices. Try again.'
          }
        />
        <Button label="Try again" onPress={() => void offices.refetch()} variant="outline" />
      </Screen>
    );
  }

  const results = offices.data ?? [];

  return (
    <Screen>
      <Text style={typography.caption}>
        Within 100 km of {location.coordinates.latitude}, {location.coordinates.longitude}
      </Text>

      {results.length === 0 ? (
        <EmptyState
          title="No offices within 100 km"
          message="Only offices with recorded coordinates appear here. You can still submit a report from the app, and it will be routed by category and jurisdiction."
        />
      ) : (
        results.map((office) => (
          <Card key={office.id}>
            <View style={styles.header}>
              <Text style={typography.subheading}>{office.name}</Text>
              <Text style={styles.distance}>{office.distanceKm} km</Text>
            </View>
            <Text style={typography.caption}>
              {office.agencyAcronym} — {office.agencyName}
            </Text>
            {office.address && <Text style={typography.body}>{office.address}</Text>}
          </Card>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  distance: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.brand[600],
  },
});
