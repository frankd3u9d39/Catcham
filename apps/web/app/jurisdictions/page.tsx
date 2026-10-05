'use client';

import React, { useState } from 'react';
import { Crosshair, MapPin } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { RequireAuth } from '@/components/layout/require-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState, InlineError } from '@/components/ui/error-state';
import { useJurisdictions } from '@/hooks/use-platform';
import { api } from '@/lib/api-client';

interface Resolution {
  state?: { code: string; name: string; distanceKm: number };
  lga?: { code: string; name: string; distanceKm: number };
}

export default function JurisdictionsPage() {
  return (
    <RequireAuth permissions={['organization:read']}>
      <AppShell breadcrumbs={[{ label: 'Jurisdictions' }]}>
        <Jurisdictions />
      </AppShell>
    </RequireAuth>
  );
}

function Jurisdictions() {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const states = useJurisdictions('STATE');
  const lgas = useJurisdictions('LGA', selectedState ?? undefined);

  if (states.isLoading) {
    return <LoadingState message="Loading jurisdictions" />;
  }

  if (states.error) {
    return <ErrorState error={states.error} onRetry={() => void states.refetch()} />;
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-950">Jurisdictions</h1>
        <p className="text-xs text-neutral-500 mt-1">
          {states.data?.length ?? 0} states and the Federal Capital Territory. Each carries
          a bounding box and centroid used to resolve a coordinate pair to a jurisdiction.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">States</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {states.data?.map((state) => {
                  const isSelected = state.code === selectedState;

                  return (
                    <li key={state.code}>
                      <button
                        type="button"
                        onClick={() => setSelectedState(isSelected ? null : state.code)}
                        aria-pressed={isSelected}
                        className={`w-full text-left p-2.5 rounded-lg border transition-colors ${
                          isSelected
                            ? 'border-brand-500 bg-brand-50'
                            : 'border-neutral-200 bg-neutral-white hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="text-xs font-semibold text-neutral-900 truncate">
                            {state.name}
                          </span>
                          <span className="font-mono text-[10px] text-neutral-400 shrink-0">
                            {state.code}
                          </span>
                        </div>
                        <p className="mt-0.5 font-mono text-[10px] text-neutral-400">
                          {state.centroidLat.toFixed(2)}, {state.centroidLng.toFixed(2)}
                        </p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>

          {selectedState && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">
                  Local government areas in{' '}
                  {states.data?.find((state) => state.code === selectedState)?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {lgas.isLoading ? (
                  <LoadingState message="Loading LGAs" />
                ) : lgas.data?.length === 0 ? (
                  <p className="text-sm text-neutral-500">
                    No LGAs are loaded for this state. The schema supports the full set;
                    the seed covers the states used in the sample data, and the rest is a
                    reference-data import.
                  </p>
                ) : (
                  <ul className="flex flex-wrap gap-2">
                    {lgas.data?.map((lga) => (
                      <li
                        key={lga.code}
                        className="px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50"
                      >
                        <span className="text-xs font-medium text-neutral-800">{lga.name}</span>
                        <span className="ml-2 font-mono text-[10px] text-neutral-400">
                          {lga.code}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <ResolverCard />
        </div>
      </div>
    </>
  );
}

/** Exercises the same resolution the submission path uses, for spot-checking. */
function ResolverCard() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [result, setResult] = useState<Resolution | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [isResolving, setIsResolving] = useState(false);

  async function resolve(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsResolving(true);

    try {
      const resolution = await api.public<Resolution>(
        `/geo/resolve?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`,
      );
      setResult(resolution);
    } catch (caught) {
      setError(caught);
      setResult(null);
    } finally {
      setIsResolving(false);
    }
  }

  function useMyLocation() {
    if (!('geolocation' in navigator)) {
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude.toFixed(5));
      setLongitude(position.coords.longitude.toFixed(5));
    });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Resolve a coordinate</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(event) => void resolve(event)} className="space-y-3">
          <Input
            label="Latitude"
            value={latitude}
            onChange={(event) => setLatitude(event.target.value)}
            placeholder="4.79"
            inputMode="decimal"
          />
          <Input
            label="Longitude"
            value={longitude}
            onChange={(event) => setLongitude(event.target.value)}
            placeholder="7.12"
            inputMode="decimal"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isResolving}
              disabled={latitude.length === 0 || longitude.length === 0}
            >
              Resolve
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={useMyLocation}>
              <Crosshair className="w-3.5 h-3.5" />
              Use my location
            </Button>
          </div>
          <InlineError error={error} />
        </form>

        {result && (
          <div className="mt-4 pt-4 border-t border-neutral-100 space-y-3">
            <Match label="State" match={result.state} />
            <Match label="Local government area" match={result.lga} />
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Matching filters by bounding box, then picks the nearest centroid. Boxes
              overlap at borders, so this is approximate by design and a triage officer can
              override it.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Match({
  label,
  match,
}: {
  label: string;
  match?: { code: string; name: string; distanceKm: number };
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
        {label}
      </p>
      {match ? (
        <div className="mt-1 flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
          <span className="text-sm font-medium text-neutral-900">{match.name}</span>
          <Badge status="neutral" showIcon={false}>
            {match.code}
          </Badge>
          <span className="text-[11px] text-neutral-400">
            {match.distanceKm.toFixed(1)} km from centroid
          </span>
        </div>
      ) : (
        <p className="mt-1 text-sm text-neutral-500">No match</p>
      )}
    </div>
  );
}
