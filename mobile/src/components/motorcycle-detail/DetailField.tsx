import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

interface DetailFieldProps {
  label: string;
  value: string | number | undefined | null;
  icon: string | React.ReactNode;
}

export default function DetailField({ label, value, icon }: DetailFieldProps) {
  const displayValue = value?.toString();
  if (!displayValue || displayValue.trim() === '') return null;

  return (
    <View style={styles.fieldItem}>
      <View style={styles.iconContainer}>
        {typeof icon === 'string' ? (
          <Text style={styles.fieldIcon}>{icon}</Text>
        ) : (
          icon
        )}
      </View>
      <View style={styles.fieldContent}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.fieldValue}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  iconContainer: {
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldIcon: {
    fontSize: 20,
    textAlign: 'center',
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
    fontWeight: '500',
  },
  fieldValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
