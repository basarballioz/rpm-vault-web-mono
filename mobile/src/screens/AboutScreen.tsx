import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.mainTitle}>About RPMVault</Text>
        
        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            RPMVault is your comprehensive motorcycle database, designed for enthusiasts, buyers, and professionals 
            who want access to detailed technical specifications, performance data, and in-depth information about 
            motorcycles from around the world.
          </Text>
        </View>

        {/* Mission */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.paragraph}>
            We believe that every motorcycle enthusiast deserves access to accurate, comprehensive, and easy-to-understand 
            technical information. Our mission is to create the most complete and user-friendly motorcycle database, 
            helping riders make informed decisions and deepen their knowledge of the machines they love.
          </Text>
        </View>

        {/* What We Offer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What We Offer</Text>
          
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Ionicons name="flag" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.featureTitle}>Detailed Specifications</Text>
            <Text style={styles.featureText}>
              Access comprehensive technical data including engine specs, dimensions, weight, performance metrics, 
              and more for thousands of motorcycle models.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Ionicons name="flash" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.featureTitle}>Advanced Search</Text>
            <Text style={styles.featureText}>
              Find your perfect motorcycle with our powerful search and filtering system. Search by brand, category, 
              year, engine size, and more.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Ionicons name="people" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.featureTitle}>Community Driven</Text>
            <Text style={styles.featureText}>
              Built by motorcycle enthusiasts for motorcycle enthusiasts. We continuously update our database 
              with the latest models and accurate information.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Ionicons name="shield-checkmark" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.featureTitle}>Reliable Data</Text>
            <Text style={styles.featureText}>
              All specifications are carefully verified and sourced from official manufacturer data and trusted 
              industry sources to ensure accuracy.
            </Text>
          </View>
        </View>

        {/* Our Values */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Values</Text>
          
          <View style={styles.valueItem}>
            <Text style={styles.valueTitle}>Accuracy</Text>
            <Text style={styles.valueText}>
              We are committed to providing the most accurate and up-to-date information possible. Every specification 
              is verified and regularly updated.
            </Text>
          </View>

          <View style={styles.valueItem}>
            <Text style={styles.valueTitle}>Accessibility</Text>
            <Text style={styles.valueText}>
              Information should be free and accessible to everyone. We believe in making motorcycle knowledge 
              available to all enthusiasts, regardless of their background.
            </Text>
          </View>

          <View style={styles.valueItem}>
            <Text style={styles.valueTitle}>Community</Text>
            <Text style={styles.valueText}>
              We're part of the motorcycle community, and we're here to serve it. Your feedback and suggestions 
              help us improve and grow.
            </Text>
          </View>

          <View style={styles.valueItem}>
            <Text style={styles.valueTitle}>Innovation</Text>
            <Text style={styles.valueText}>
              We continuously innovate to provide better tools and features, making it easier for you to find 
              and compare motorcycle information.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 24,
    marginTop: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 16,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  featureCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  valueItem: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    paddingLeft: 16,
    marginBottom: 20,
  },
  valueTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  valueText: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
