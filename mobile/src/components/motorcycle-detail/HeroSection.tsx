import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

interface HeroSectionProps {
  brand: string;
  model: string;
  year: string;
  category?: string;
  getCategoryEmoji: (category: string) => string;
  BrandIcon?: React.FC<any>;
  CategoryIcon?: React.FC<any>;
}

export default function HeroSection({ brand, model, year, category, getCategoryEmoji, BrandIcon }: HeroSectionProps) {
  const getBrandInitials = (name: string) => {
    if (!name) return '';
    // Clean the name first (remove special chars if needed, but usually splitting is enough)
    const parts = name.split(/[\s-]+/); // Split by space or hyphen
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <View style={styles.heroSection}>
      {BrandIcon ? (
        <View style={styles.brandIconContainer}>
          <BrandIcon width={90} height={90} />
        </View>
      ) : (
        <View style={styles.brandPlaceholder}>
          <Text
            style={styles.brandPlaceholderText}
            adjustsFontSizeToFit
            numberOfLines={1}
          >
            {getBrandInitials(brand)}
          </Text>
        </View>
      )}
      <Text style={styles.heroModel}>{model}</Text>
      <Text style={styles.heroBrand}>{brand} • {year}</Text>
      {category && (
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    backgroundColor: Colors.backgroundLight,
    padding: 24,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'center',
  },
  brandPlaceholder: {
    width: 90,
    height: 90,
    backgroundColor: Colors.background,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  brandPlaceholderText: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.textPrimary,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  brandIconContainer: {
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
  },
  heroModel: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroBrand: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
});
