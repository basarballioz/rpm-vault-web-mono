import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import DetailField from './DetailField';

interface QuickInfoProps {
  category?: string;
  displacement?: string;
  power?: string;
  year?: string;
  CategoryIcon?: React.FC<any>;
}

export default function QuickInfo({ category, displacement, power, year, CategoryIcon }: QuickInfoProps) {
  return (
    <View style={styles.quickInfo}>
      <View style={styles.quickInfoHeader}>
        <Text style={styles.quickInfoTitle}>Basic Info</Text>
      </View>
      <DetailField
        label="Category"
        value={category}
        icon={CategoryIcon ? <CategoryIcon width={20} height={20} /> : "📂"}
      />
      <DetailField label="Engine Displacement" value={displacement} icon="🔧" />
      <DetailField label="Power (HP/KW)" value={power} icon="⚡" />
      <DetailField label="Model Year" value={year} icon="📅" />
    </View>
  );
}

const styles = StyleSheet.create({
  quickInfo: {
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    padding: 20,
    gap: 12,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  quickInfoEmoji: {
    fontSize: 24,
    backgroundColor: Colors.background,
    padding: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  quickInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
});
