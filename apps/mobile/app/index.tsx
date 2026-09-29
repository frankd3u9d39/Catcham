import { Text, View, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CATCHAM NIGERIA</Text>
      <Text style={styles.subtitle}>Sovereign Whistleblowing & Incident Reporting</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#10b981', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#94a3b8', marginTop: 8 },
});
