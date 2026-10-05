import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

export function Screen({
  children,
  scroll = true,
}: {
  children: React.ReactNode;
  scroll?: boolean;
}) {
  if (!scroll) {
    return <View style={styles.screen}>{children}</View>;
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
}) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' && styles.buttonPrimary,
        variant === 'outline' && styles.buttonOutline,
        variant === 'ghost' && styles.buttonGhost,
        pressed && !isDisabled && styles.buttonPressed,
        isDisabled && styles.buttonDisabled,
      ]}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.neutral.white : colors.brand[600]}
        />
      )}
      <Text
        style={[
          styles.buttonLabel,
          variant === 'primary' ? styles.buttonLabelPrimary : styles.buttonLabelSecondary,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function Field({
  label,
  error,
  hint,
  required,
  ...inputProps
}: TextInputProps & {
  label: string;
  error?: string | null;
  hint?: string;
  required?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <TextInput
        {...inputProps}
        placeholderTextColor={colors.neutral[400]}
        style={[
          styles.input,
          inputProps.multiline ? styles.inputMultiline : null,
          error ? styles.inputError : null,
        ]}
      />
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hintText}>{hint}</Text>
      ) : null}
    </View>
  );
}

/**
 * A list of options rendered as tappable rows. A native picker behaves too
 * differently across platforms for a form this central, and the option sets here
 * are short enough to show in full.
 */
export function OptionList<T extends string>({
  label,
  options,
  value,
  onChange,
  emptyMessage,
  required,
}: {
  label: string;
  options: Array<{ value: T; label: string; description?: string }>;
  value: T | null;
  onChange: (value: T) => void;
  emptyMessage?: string;
  required?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      {options.length === 0 ? (
        <Text style={styles.hintText}>{emptyMessage ?? 'Nothing to choose from.'}</Text>
      ) : (
        <View style={styles.optionGroup}>
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <Pressable
                key={option.value}
                onPress={() => onChange(option.value)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                style={[styles.option, isSelected && styles.optionSelected]}
              >
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioDot} />}
                </View>
                <View style={styles.optionText}>
                  <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                    {option.label}
                  </Text>
                  {option.description && (
                    <Text style={styles.optionDescription}>{option.description}</Text>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

export function Pill({
  label,
  background,
  color,
}: {
  label: string;
  background: string;
  color: string;
}) {
  return (
    <View style={[styles.pill, { backgroundColor: background }]}>
      <Text style={[styles.pillLabel, { color }]}>{label}</Text>
    </View>
  );
}

export function Banner({
  tone,
  title,
  message,
}: {
  tone: 'info' | 'warning' | 'error' | 'success';
  title?: string;
  message: string;
}) {
  const palette = {
    info: { background: colors.status.infoSurface, border: colors.neutral[200], text: colors.neutral[700] },
    warning: { background: colors.status.warningSurface, border: '#FDE68A', text: '#92400E' },
    error: { background: colors.status.errorSurface, border: '#FECACA', text: '#991B1B' },
    success: { background: colors.status.successSurface, border: colors.brand[200], text: colors.brand[700] },
  }[tone];

  return (
    <View
      accessibilityRole="alert"
      style={[styles.banner, { backgroundColor: palette.background, borderColor: palette.border }]}
    >
      {title && <Text style={[styles.bannerTitle, { color: palette.text }]}>{title}</Text>}
      <Text style={[styles.bannerMessage, { color: palette.text }]}>{message}</Text>
    </View>
  );
}

export function Loading({ message }: { message?: string }) {
  return (
    <View style={styles.loading}>
      <ActivityIndicator color={colors.brand[600]} />
      {message && <Text style={styles.loadingText}>{message}</Text>}
    </View>
  );
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  screenContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.neutral.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    padding: spacing.lg,
    gap: spacing.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    // 48pt keeps the target comfortably above the 44pt minimum.
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  buttonPrimary: {
    backgroundColor: colors.brand[600],
  },
  buttonOutline: {
    backgroundColor: colors.neutral.white,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  buttonLabelPrimary: {
    color: colors.neutral.white,
  },
  buttonLabelSecondary: {
    color: colors.neutral[900],
  },
  field: {
    gap: spacing.sm,
  },
  fieldLabel: {
    ...typography.label,
  },
  required: {
    color: colors.status.error,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderRadius: radius.md,
    backgroundColor: colors.neutral.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.neutral[950],
  },
  inputMultiline: {
    minHeight: 140,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.status.error,
  },
  errorText: {
    ...typography.caption,
    color: colors.status.error,
  },
  hintText: {
    ...typography.caption,
  },
  optionGroup: {
    gap: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    minHeight: 48,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    backgroundColor: colors.neutral.white,
  },
  optionSelected: {
    borderColor: colors.brand[500],
    backgroundColor: colors.brand[50],
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.neutral[300],
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  radioSelected: {
    borderColor: colors.brand[600],
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.brand[600],
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  optionLabel: {
    fontSize: 15,
    color: colors.neutral[900],
  },
  optionLabelSelected: {
    fontWeight: '600',
  },
  optionDescription: {
    ...typography.caption,
  },
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  pillLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  banner: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 4,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  bannerMessage: {
    fontSize: 13,
    lineHeight: 19,
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    gap: spacing.md,
  },
  loadingText: {
    ...typography.caption,
  },
  empty: {
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  emptyTitle: {
    ...typography.subheading,
  },
  emptyMessage: {
    ...typography.caption,
    textAlign: 'center',
  },
});
