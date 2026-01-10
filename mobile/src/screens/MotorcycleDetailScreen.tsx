import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import Header from '../components/Header';
import DrawerMenu from '../components/DrawerMenu';
import { Colors } from '../constants/Colors';
import {
  DetailField,
  DetailSection,
  HeroSection,
  QuickInfo,
  Motorcycle,
  getCategoryEmoji,
  hasDataInSection,
} from '../components/motorcycle-detail';
import { transformMotorcycleData } from '@shared/utils';
import { API_CONFIG } from '@shared/constants';
import { BrandLogos } from '../constants/brandLogos';

// Import category icons
import SportIcon from '../../assets/categories/sport.svg';
import CruiserIcon from '../../assets/categories/cruiser.svg';
import AdventureIcon from '../../assets/categories/adventure.svg';
import NakedIcon from '../../assets/categories/naked.svg';
import TouringIcon from '../../assets/categories/touring.svg';
import EnduroIcon from '../../assets/categories/enduro.svg';
import ScooterIcon from '../../assets/categories/scooter.svg';
import ElectricIcon from '../../assets/categories/electric.svg';

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

type MotorcycleDetailRouteProp = RouteProp<RootStackParamList, 'MotorcycleDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function MotorcycleDetailScreen() {
  const route = useRoute<MotorcycleDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { id } = route.params;

  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    loadBikeDetails();
  }, [id]);

  useEffect(() => {
    if (!loading && motorcycle) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading, motorcycle]);

  const loadBikeDetails = async () => {
    setLoading(true);
    setError(null);
    // Reset animations
    fadeAnim.setValue(0);
    translateY.setValue(20);

    try {
      // If we have the data passed from the previous screen, use it
      if (route.params.bikeData) {
        setMotorcycle(transformMotorcycleData(route.params.bikeData));
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/bikes/${encodeURIComponent(id)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch bike details');
      }
      const data = await response.json();
      setMotorcycle(transformMotorcycleData(data));
    } catch (err) {
      console.error('Error loading bike details:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDrawerNavigate = (screen: string, params?: any) => {
    setIsDrawerOpen(false);
    if (screen === 'Catalog') {
      navigation.navigate('Main', { screen: 'Catalog', params });
    } else if (screen === 'Compare') {
      navigation.navigate('Main', { screen: 'Compare' });
    } else if (screen === 'Home') {
      navigation.navigate('Main', { screen: 'Home' });
    } else if (screen === 'About') {
      navigation.navigate('About');
    } else if (screen === 'Contact') {
      navigation.navigate('Contact');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header
          onMenuPress={() => setIsDrawerOpen(true)}
          showSearch={true}
          showBackButton={true}
          onLogoPress={() => navigation.navigate('Main', { screen: 'Home' })}
        />
        <DrawerMenu
          visible={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onNavigate={handleDrawerNavigate}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !motorcycle) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header
          onMenuPress={() => setIsDrawerOpen(true)}
          showSearch={true}
          showBackButton={true}
          onLogoPress={() => navigation.navigate('Main', { screen: 'Home' })}
        />
        <DrawerMenu
          visible={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onNavigate={handleDrawerNavigate}
        />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={Colors.error} />
          <Text style={styles.errorText}>{error || 'Motorcycle not found'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        onMenuPress={() => setIsDrawerOpen(true)}
        showSearch={true}
        showBackButton={true}
        onLogoPress={() => navigation.navigate('Main', { screen: 'Home' })}
      />
      <DrawerMenu
        visible={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNavigate={handleDrawerNavigate}
      />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY }] }}>
          {/* Hero Section */}
          <HeroSection
            brand={motorcycle.Brand}
            model={motorcycle.Model}
            year={motorcycle.Year}
            category={motorcycle.Category}
            getCategoryEmoji={getCategoryEmoji}
            BrandIcon={BrandLogos[motorcycle.Brand]}
            CategoryIcon={categoryIcons[motorcycle.Category]}
          />

          {/* Quick Info */}
          <QuickInfo
            category={motorcycle.Category}
            displacement={motorcycle.Displacement}
            power={motorcycle.Power}
            year={motorcycle.Year}
            CategoryIcon={categoryIcons[motorcycle.Category]}
          />

          {/* Engine & Performance */}
          <DetailSection
            title="Engine & Performance"
            hasData={hasDataInSection(motorcycle, ['Displacement', 'Power', 'Engine type', 'Top speed', 'Torque', 'Valves per cylinder'])}
          >
            <DetailField label="Engine Displacement" value={motorcycle.Displacement} icon="🔧" />
            <DetailField label="Power" value={motorcycle.Power} icon="⚡" />
            <DetailField label="Engine Type" value={motorcycle['Engine type']} icon="🔩" />
            <DetailField label="Top Speed" value={motorcycle['Top speed']} icon="🏁" />
            <DetailField label="Torque" value={motorcycle.Torque} icon="💪" />
            <DetailField label="Valves/Cyl" value={motorcycle['Valves per cylinder']} icon="⚙️" />
          </DetailSection>

          {/* Fuel & Injection System */}
          <DetailSection
            title="Fuel & Injection System"
            hasData={hasDataInSection(motorcycle, ['Fuel system', 'Fuel capacity', 'Fuel control'])}
          >
            <DetailField label="Fuel System" value={motorcycle['Fuel system']} icon="💉" />
            <DetailField label="Fuel Capacity" value={motorcycle['Fuel capacity']} icon="⛽" />
            <DetailField label="Fuel Control" value={motorcycle['Fuel control']} icon="🎛️" />
          </DetailSection>

          {/* Cooling & Starter */}
          <DetailSection
            title="Cooling & Starter"
            hasData={hasDataInSection(motorcycle, ['Cooling system', 'Starter', 'Electrical'])}
          >
            <DetailField label="Cooling System" value={motorcycle['Cooling system']} icon="❄️" />
            <DetailField label="Starter" value={motorcycle.Starter} icon="🔑" />
            <DetailField label="Electrical" value={motorcycle.Electrical} icon="⚡" />
          </DetailSection>

          {/* Transmission & Drive */}
          <DetailSection
            title="Transmission & Drive"
            hasData={hasDataInSection(motorcycle, ['Gearbox', 'Transmission type', 'Clutch'])}
          >
            <DetailField label="Gearbox" value={motorcycle.Gearbox} icon="⚙️" />
            <DetailField label="Transmission" value={motorcycle['Transmission type']} icon="🔄" />
            <DetailField label="Clutch" value={motorcycle.Clutch} icon="🔘" />
          </DetailSection>

          {/* Brake System */}
          <DetailSection
            title="Brake System"
            hasData={hasDataInSection(motorcycle, ['Front brakes', 'Rear brakes', 'Diameter'])}
          >
            <DetailField label="Front Brakes" value={motorcycle['Front brakes']} icon="🔴" />
            <DetailField label="Rear Brakes" value={motorcycle['Rear brakes']} icon="🔴" />
            <DetailField label="Diameter" value={motorcycle.Diameter} icon="⭕" />
          </DetailSection>

          {/* Suspension */}
          <DetailSection
            title="Suspension"
            hasData={hasDataInSection(motorcycle, ['Front suspension', 'Rear suspension', 'Front wheel travel', 'Rear wheel travel'])}
          >
            <DetailField label="Front Suspension" value={motorcycle['Front suspension']} icon="🔧" />
            <DetailField label="Rear Suspension" value={motorcycle['Rear suspension']} icon="🔧" />
            <DetailField label="Front Travel" value={motorcycle['Front wheel travel']} icon="↕️" />
            <DetailField label="Rear Travel" value={motorcycle['Rear wheel travel']} icon="↕️" />
          </DetailSection>

          {/* Tires & Wheels */}
          <DetailSection
            title="Tires & Wheels"
            hasData={hasDataInSection(motorcycle, ['Front tire', 'Rear tire'])}
          >
            <DetailField label="Front Tire" value={motorcycle['Front tire']} icon="🛞" />
            <DetailField label="Rear Tire" value={motorcycle['Rear tire']} icon="🛞" />
          </DetailSection>

          {/* Dimensions & Weight */}
          <DetailSection
            title="Dimensions & Weight"
            hasData={hasDataInSection(motorcycle, ['Overall length', 'Overall width', 'Overall height', 'Wheelbase', 'Seat height', 'Ground clearance', 'Dry weight', 'Weight incl. oil, gas, etc'])}
          >
            <DetailField label="Length" value={motorcycle['Overall length']} icon="↔️" />
            <DetailField label="Width" value={motorcycle['Overall width']} icon="↔️" />
            <DetailField label="Height" value={motorcycle['Overall height']} icon="↕️" />
            <DetailField label="Wheelbase" value={motorcycle.Wheelbase} icon="📏" />
            <DetailField label="Seat Height" value={motorcycle['Seat height']} icon="🪑" />
            <DetailField label="Ground Clearance" value={motorcycle['Ground clearance']} icon="⬆️" />
            <DetailField label="Dry Weight" value={motorcycle['Dry weight']} icon="⚖️" />
            <DetailField label="Wet Weight" value={motorcycle['Weight incl. oil, gas, etc']} icon="⚖️" />
          </DetailSection>

          {/* Other Features */}
          <DetailSection
            title="Other Features"
            hasData={hasDataInSection(motorcycle, ['Frame type', 'Color options'])}
          >
            <DetailField label="Frame Type" value={motorcycle['Frame type']} icon="🔲" />
            <DetailField label="Colors" value={motorcycle['Color options']} icon="🎨" />
          </DetailSection>

          <View style={{ height: 20 }} />
        </Animated.View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: Colors.error,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
});