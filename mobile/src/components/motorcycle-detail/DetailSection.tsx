import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

interface DetailSectionProps {
  title: string;
  emoji?: string;
  children: React.ReactNode;
  hasData?: boolean;
}

export default function DetailSection({ title, emoji, children, hasData = true }: DetailSectionProps) {
  if (!hasData) return null;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        {emoji && <Text style={styles.sectionEmoji}>{emoji}</Text>}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionEmoji: {
    fontSize: 24,
    backgroundColor: Colors.background,
    padding: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  sectionContent: {
    gap: 12,
  },
});
