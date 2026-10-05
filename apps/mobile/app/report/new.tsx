import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Banner,
  Button,
  Card,
  Field,
  Loading,
  OptionList,
  Screen,
} from '../../components/ui';
import { reportingService } from '../../services/reporting.service';
import { useLocation } from '../../hooks/use-location';
import { draftStorage } from '../../utils/storage';
import { ApiError } from '../../api/client';
import { colors, spacing, typography } from '../../theme';
import type { SubmitReportInput } from '../../types';

interface FormState {
  title: string;
  description: string;
  categoryId: string;
  stateCode: string;
  lgaCode: string;
  addressText: string;
  isAnonymous: boolean;
  contactEmail: string;
}

const EMPTY: FormState = {
  title: '',
  description: '',
  categoryId: '',
  stateCode: '',
  lgaCode: '',
  addressText: '',
  isAnonymous: true,
  contactEmail: '',
};

const MIN_TITLE = 8;
const MIN_DESCRIPTION = 30;

export default function NewReportScreen() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const location = useLocation();

  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: reportingService.categories,
    staleTime: 60 * 60 * 1000,
  });

  const states = useQuery({
    queryKey: ['states'],
    queryFn: reportingService.states,
    staleTime: 60 * 60 * 1000,
  });

  const lgas = useQuery({
    queryKey: ['lgas', form.stateCode],
    queryFn: () => reportingService.lgas(form.stateCode),
    enabled: form.stateCode.length > 0,
    staleTime: 60 * 60 * 1000,
  });

  // Restore an interrupted report. A long description is easy to lose to a
  // backgrounded app, and re-typing it is the main reason people give up.
  useEffect(() => {
    void draftStorage.read<FormState>().then((draft) => {
      if (draft) {
        setForm(draft);
      }
      setDraftLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!draftLoaded || form.description.length < 20) {
      return;
    }

    const timer = setTimeout(() => void draftStorage.write(form), 1200);
    return () => clearTimeout(timer);
  }, [form, draftLoaded]);

  const submit = useMutation({
    mutationFn: (input: SubmitReportInput) => reportingService.submit(input),
    onSuccess: async (receipt) => {
      await draftStorage.clear();
      router.replace({
        pathname: '/report/receipt',
        params: {
          referenceNumber: receipt.referenceNumber,
          trackingCode: receipt.trackingCode ?? '',
          routedTo: receipt.routedTo ?? '',
        },
      });
    },
  });

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  /** Fills the state and LGA from the device position, which the server resolves. */
  async function useMyLocation() {
    const coordinates = await location.capture();
    if (!coordinates) {
      return;
    }

    try {
      const resolved = await reportingService.resolveLocation(
        coordinates.latitude,
        coordinates.longitude,
      );

      setForm((current) => ({
        ...current,
        stateCode: resolved.state?.code ?? current.stateCode,
        lgaCode: resolved.lga?.code ?? '',
      }));
    } catch {
      // The coordinates are still attached to the submission, and the server
      // resolves them again there, so a failed lookup is not worth blocking on.
    }
  }

  const titleTooShort = form.title.trim().length < MIN_TITLE;
  const descriptionTooShort = form.description.trim().length < MIN_DESCRIPTION;
  const needsContact =
    !form.isAnonymous && !form.contactEmail.trim().includes('@');

  const canSubmit =
    !titleTooShort && !descriptionTooShort && form.categoryId.length > 0 && !needsContact;

  function onSubmit() {
    submit.mutate({
      title: form.title.trim(),
      description: form.description.trim(),
      categoryId: form.categoryId,
      isAnonymous: form.isAnonymous,
      contactEmail: form.isAnonymous ? undefined : form.contactEmail.trim(),
      stateCode: form.stateCode || undefined,
      lgaCode: form.lgaCode || undefined,
      addressText: form.addressText.trim() || undefined,
      latitude: location.coordinates?.latitude,
      longitude: location.coordinates?.longitude,
    });
  }

  if (categories.isLoading || !draftLoaded) {
    return <Loading message="Loading the report form" />;
  }

  if (categories.error) {
    return (
      <Screen>
        <Banner
          tone="error"
          title="Could not load the form"
          message={
            categories.error instanceof ApiError
              ? categories.error.message
              : 'Check your connection and try again.'
          }
        />
        <Button label="Try again" onPress={() => void categories.refetch()} variant="outline" />
      </Screen>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Screen>
        <Text style={typography.body}>
          Describe what you saw as specifically as you can: what happened, where, when, and
          who was involved. Specific reports can be acted on; vague ones usually cannot.
        </Text>

        <Card>
          <OptionList
            label="What kind of incident is this?"
            required
            value={form.categoryId || null}
            onChange={(value) => set('categoryId', value)}
            options={(categories.data ?? []).map((category) => ({
              value: category.id,
              label: category.name,
              description: category.description ?? undefined,
            }))}
          />
        </Card>

        <Card>
          <Field
            label="Summary"
            required
            value={form.title}
            onChangeText={(value) => set('title', value)}
            placeholder="Suspected diversion of petroleum products"
            maxLength={200}
            hint={
              titleTooShort
                ? `At least ${MIN_TITLE} characters. ${form.title.trim().length} so far.`
                : 'This is what the triage officer sees first.'
            }
          />

          <Field
            label="What happened?"
            required
            value={form.description}
            onChangeText={(value) => set('description', value)}
            placeholder="Include dates and times, the location, vehicles or equipment involved, and anything that could be verified."
            multiline
            maxLength={10000}
            hint={
              descriptionTooShort
                ? `At least ${MIN_DESCRIPTION} characters. ${form.description.trim().length} so far.`
                : `${form.description.trim().length} characters.`
            }
          />
        </Card>

        <Card>
          <Text style={typography.subheading}>Where did it happen?</Text>

          <Button
            label={
              location.coordinates
                ? `Location attached (${location.coordinates.latitude}, ${location.coordinates.longitude})`
                : 'Use my current location'
            }
            onPress={() => void useMyLocation()}
            variant="outline"
            loading={location.isLocating}
          />

          {location.error && <Banner tone="warning" message={location.error} />}

          <OptionList
            label="State"
            value={form.stateCode || null}
            onChange={(value) => {
              set('stateCode', value);
              set('lgaCode', '');
            }}
            options={(states.data ?? []).map((state) => ({
              value: state.code,
              label: state.name,
            }))}
            emptyMessage="States could not be loaded. You can still submit without one."
          />

          {form.stateCode.length > 0 && (
            <OptionList
              label="Local government area"
              value={form.lgaCode || null}
              onChange={(value) => set('lgaCode', value)}
              options={(lgas.data ?? []).map((lga) => ({ value: lga.code, label: lga.name }))}
              emptyMessage="No LGAs are listed for this state. The state alone is enough."
            />
          )}

          <Field
            label="Address or landmark"
            value={form.addressText}
            onChangeText={(value) => set('addressText', value)}
            placeholder="Near the Eleme junction flyover"
            maxLength={300}
          />
        </Card>

        <Card>
          <OptionList
            label="Your identity"
            required
            value={form.isAnonymous ? 'anonymous' : 'contact'}
            onChange={(value) => set('isAnonymous', value === 'anonymous')}
            options={[
              {
                value: 'anonymous',
                label: 'Submit anonymously',
                description: 'No contact details stored. You get a tracking code shown once.',
              },
              {
                value: 'contact',
                label: 'Leave an email address',
                description: 'Investigators can contact you for clarification.',
              },
            ]}
          />

          {!form.isAnonymous && (
            <Field
              label="Email address"
              required
              value={form.contactEmail}
              onChangeText={(value) => set('contactEmail', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={
                form.contactEmail.length > 0 && needsContact
                  ? 'Enter a valid email address'
                  : null
              }
            />
          )}
        </Card>

        {submit.error && (
          <Banner
            tone="error"
            title="Could not submit"
            message={
              submit.error instanceof ApiError
                ? submit.error.message
                : 'Something went wrong. Try again.'
            }
          />
        )}

        <View style={styles.submit}>
          <Button
            label="Submit report"
            onPress={onSubmit}
            disabled={!canSubmit}
            loading={submit.isPending}
          />
          <Text style={styles.submitNote}>
            Your draft is saved on this device until you submit.
          </Text>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  submit: {
    gap: spacing.sm,
  },
  submitNote: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.neutral[500],
  },
});
