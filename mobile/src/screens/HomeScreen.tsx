import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import Header from '../components/Header';
import DrawerMenu from '../components/DrawerMenu';
import { Colors, CategoryIcons } from '../constants/Colors';

// Temporary types until shared library is properly configured
interface Stats {
  totalBikes: number;
  totalBrands: number;
  totalCategories: number;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

// Import brand logos as SVGs
import HondaLogo from '../../assets/brands/honda.svg';
import YamahaLogo from '../../assets/brands/yamaha.svg';
import SymLogo from '../../assets/brands/sym.svg';
import KawasakiLogo from '../../assets/brands/kawasaki.svg';
import SuzukiLogo from '../../assets/brands/suzuki.svg';
import BMWLogo from '../../assets/brands/bmw.svg';

// Import category icons
import SportIcon from '../../assets/categories/sport.svg';
import CruiserIcon from '../../assets/categories/cruiser.svg';
import AdventureIcon from '../../assets/categories/adventure.svg';
import NakedIcon from '../../assets/categories/naked.svg';
import TouringIcon from '../../assets/categories/touring.svg';
import EnduroIcon from '../../assets/categories/enduro.svg';
import ScooterIcon from '../../assets/categories/scooter.svg';
import ElectricIcon from '../../assets/categories/electric.svg';

const brandLogos: { [key: string]: React.FC<any> } = {
  'Honda': HondaLogo,
  'Yamaha': YamahaLogo,
  'Sym': SymLogo,
  'Kawasaki': KawasakiLogo,
  'Suzuki': SuzukiLogo,
  'BMW': BMWLogo,
};

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [stats, setStats] = useState<Stats>({ totalBikes: 0, totalBrands: 0, totalCategories: 0 });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setStats({
      totalBikes: 30000,
      totalBrands: 50,
      totalCategories: 15,
    });
  };

  const categoryIcons: { [key: string]: React.FC<any> } = {
    'Sport': SportIcon,
    'Cruiser': CruiserIcon,
    'Adventure': AdventureIcon,
    'Naked': NakedIcon,
    'Touring': TouringIcon,
    'Enduro': EnduroIcon,
    'Scooter': ScooterIcon,
    'Electric': ElectricIcon,
  };

  const categories = [
    { name: 'Sport', icon: CategoryIcons.sport, description: 'High performance' },
    { name: 'Cruiser', icon: CategoryIcons.cruiser, description: 'Comfortable ride' },
    { name: 'Adventure', icon: CategoryIcons.adventure, description: 'All terrain' },
    { name: 'Naked', icon: CategoryIcons.naked, description: 'City friendly' },
    { name: 'Touring', icon: CategoryIcons.touring, description: 'Long distance' },
    { name: 'Enduro', icon: CategoryIcons.enduro, description: 'Off-road adventure' },
    { name: 'Scooter', icon: CategoryIcons.scooter, description: 'Practical transport' },
    { name: 'Electric', icon: CategoryIcons.electric, description: 'Future is here' },
  ];

  const features = [
    {
      icon: 'bicycle',
      title: 'Comprehensive Catalog',
      description: "Large motorcycle database. Find your next ride with ease. ",
    },
    {
      icon: 'search',
      title: 'Smart Search',
      description: 'Find the motorcycle you want in seconds with our advanced filtering system.',
    },
    {
      icon: 'people',
      title: 'Community',
      description: 'The platform trusted by thousands of motorcycle enthusiasts. Open sourced.',
    },
    {
      icon: 'shield-checkmark',
      title: 'Reliable',
      description: 'Verified data and reliable sources.',
    },
  ];

  const handleDrawerNavigate = (screen: string, params?: any) => {
    if (screen === 'Catalog') {
      navigation.navigate('Main', { screen: 'Catalog', params });
    } else if (screen === 'Compare') {
      navigation.navigate('Main', { screen: 'Compare' });
    } else if (screen === 'About') {
      navigation.navigate('About');
    } else if (screen === 'Contact') {
      navigation.navigate('Contact');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        onMenuPress={() => setIsDrawerOpen(true)}
        showSearch={true}
        onLogoPress={() => { }} // Already on home, no action needed
      />

      <DrawerMenu
        visible={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNavigate={handleDrawerNavigate}
      />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Hero Section */}
        <View>
          <LinearGradient
            colors={[Colors.background, '#b65b31ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroTextContainer}>
                <Text style={styles.heroTitle}>
                  Discover Your{'\n'}
                  <Text style={styles.heroTitleHighlight}>Perfect Ride</Text>
                </Text>
                <Text style={styles.heroSubtitle}>
                  Explore over {stats.totalBikes.toLocaleString()} motorcycles from top brands worldwide.
                </Text>

                <TouchableOpacity
                  style={styles.ctaButton}
                  onPress={() => navigation.navigate('Main', { screen: 'Catalog' })}
                  activeOpacity={0.8}
                >
                  <View
                    style={styles.ctaGradient}
                  >
                    <Text style={styles.ctaButtonText}>Browse Catalog</Text>
                    <Ionicons name="arrow-forward" size={20} color={Colors.textPrimary} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Stats Bar */}
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalBikes}+</Text>
            <Text style={styles.statLabel}>Modals</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalBrands}+</Text>
            <Text style={styles.statLabel}>Brands</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalCategories}+</Text>
            <Text style={styles.statLabel}>Types</Text>
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Browse by Category</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Catalog' })}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.name}
                style={styles.categoryCard}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Main', {
                  screen: 'Catalog',
                  params: { category: category.name }
                })}
              >
                <LinearGradient
                  colors={[Colors.backgroundCard, '#333']}
                  style={styles.categoryGradient}
                >
                  <View style={styles.categoryIconContainer}>
                    {categoryIcons[category.name] ? (
                      React.createElement(categoryIcons[category.name], { width: 60, height: 50 })
                    ) : (
                      <Text style={styles.categoryIcon}>{category.icon}</Text>
                    )}
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Brands Section */}
        <View style={[styles.section, { paddingHorizontal: 0 }]}>
          <View style={[styles.sectionHeader, { paddingHorizontal: 20 }]}>
            <Text style={styles.sectionTitle}>Popular Brands</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.brandsScrollContent}
          >
            {[
              'Honda', 'Yamaha', 'Suzuki', 'BMW', 'Kawasaki', 'Sym'
            ].map((brand) => {
              const LogoComponent = brandLogos[brand];
              return (
                <TouchableOpacity
                  key={brand}
                  style={styles.brandCard}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('Main', {
                    screen: 'Catalog',
                    params: { brand: brand }
                  })}
                >
                  <View style={styles.brandLogoContainer}>
                    <LogoComponent width="100%" height="100%" />
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Why RPMVault Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why RPMVault?</Text>
          <Text style={styles.sectionSubtitle}>
            The most comprehensive and reliable data source in the motorcycle world
          </Text>

          {features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <View style={styles.featureIconBox}>
                <Ionicons name={feature.icon as any} size={24} color={Colors.primary} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  heroGradient: {
    paddingTop: 20,
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroTextContainer: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 48,
    marginBottom: 12,
  },
  heroTitleHighlight: {
    color: Colors.primary,
  },
  heroSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 24,
    lineHeight: 24,
    maxWidth: '90%',
  },
  ctaButton: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    overflow: 'hidden',
  },
  ctaGradient: {
    backgroundColor: Colors.ctaButtonBG,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  ctaButtonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundCard,
    marginHorizontal: 20,
    marginTop: -25,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  seeAllText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    aspectRatio: 1.5,
    borderRadius: 16,
    overflow: 'hidden',
  },
  categoryGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryIconContainer: {
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 16,
    marginTop: 6,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  brandsScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 8,
  },
  brandCard: {
    width: 120,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff', // White background for logos
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandLogoContainer: {
    width: '100%',
    height: '100%',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandLogo: {
    width: '100%',
    height: '100%',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  featureIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 172, 120, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 40,
  },
});