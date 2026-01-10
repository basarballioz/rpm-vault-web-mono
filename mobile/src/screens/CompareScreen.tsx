import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import Header from '../components/Header';
import DrawerMenu from '../components/DrawerMenu';
import { Colors } from '../constants/Colors';

import { Motorcycle } from '@shared/types';
import { transformMotorcycleData } from '@shared/utils';
import { API_CONFIG } from '@shared/constants';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;


export default function CompareScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [searchQuery1, setSearchQuery1] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');
  const [suggestions1, setSuggestions1] = useState<Motorcycle[]>([]);
  const [suggestions2, setSuggestions2] = useState<Motorcycle[]>([]);
  const [showSuggestions1, setShowSuggestions1] = useState(false);
  const [showSuggestions2, setShowSuggestions2] = useState(false);
  const [selectedBike1, setSelectedBike1] = useState<Motorcycle | null>(null);
  const [selectedBike2, setSelectedBike2] = useState<Motorcycle | null>(null);
  const [isSearching1, setIsSearching1] = useState(false);
  const [isSearching2, setIsSearching2] = useState(false);

  const vsAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (selectedBike1 && selectedBike2) {
      Animated.spring(vsAnimation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 40,
        friction: 7,
      }).start();
    } else {
      vsAnimation.setValue(0);
    }
  }, [selectedBike1, selectedBike2]);

  // Search for motorcycles - Input 1
  useEffect(() => {
    const searchMotorcycles = async () => {
      if (searchQuery1.length < 2) {
        setSuggestions1([]);
        setShowSuggestions1(false);
        return;
      }

      setIsSearching1(true);
      setShowSuggestions1(true);
      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/bikes?search=${encodeURIComponent(searchQuery1)}&limit=8`
        );
        if (response.ok) {
          const data = await response.json();
          setSuggestions1((data.bikes || []).map(transformMotorcycleData));
        }
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions1([]);
      } finally {
        setIsSearching1(false);
      }
    };

    const timeoutId = setTimeout(searchMotorcycles, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery1]);

  // Search for motorcycles - Input 2
  useEffect(() => {
    const searchMotorcycles = async () => {
      if (searchQuery2.length < 2) {
        setSuggestions2([]);
        setShowSuggestions2(false);
        return;
      }

      setIsSearching2(true);
      setShowSuggestions2(true);
      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/bikes?search=${encodeURIComponent(searchQuery2)}&limit=8`
        );
        if (response.ok) {
          const data = await response.json();
          setSuggestions2((data.bikes || []).map(transformMotorcycleData));
        }
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions2([]);
      } finally {
        setIsSearching2(false);
      }
    };

    const timeoutId = setTimeout(searchMotorcycles, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery2]);

  const handleSelectBike1 = (bike: Motorcycle) => {
    setSelectedBike1(bike);
    setSearchQuery1('');
    setShowSuggestions1(false);
    setSuggestions1([]);
  };

  const handleSelectBike2 = (bike: Motorcycle) => {
    setSelectedBike2(bike);
    setSearchQuery2('');
    setShowSuggestions2(false);
    setSuggestions2([]);
  };

  const handleDrawerNavigate = (screen: string, params?: any) => {
    setIsDrawerOpen(false);
    if (screen === 'Catalog') {
      navigation.navigate('Main', { screen: 'Catalog', params });
    } else if (screen === 'Home') {
      navigation.navigate('Main', { screen: 'Home' });
    } else if (screen === 'About') {
      navigation.navigate('About');
    } else if (screen === 'Contact') {
      navigation.navigate('Contact');
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'sport':
        return '🏁';
      case 'cruiser':
        return '🛣️';
      case 'adventure':
        return '🏔️';
      case 'enduro':
        return '🏞️';
      case 'scooter':
        return '🛴';
      case 'touring':
        return '🗺️';
      case 'naked':
        return '⚡';
      default:
        return '🏍️';
    }
  };

  // Extract numeric value from string
  const extractNumber = (value?: string): number | null => {
    if (!value) return null;
    const match = value.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : null;
  };

  // Determine if higher is better for the spec
  const isHigherBetter = (label: string): boolean => {
    const lowerIsBetter = ['Weight', 'Ağırlık'];
    return !lowerIsBetter.some(term => label.includes(term));
  };

  const renderSpecRow = (label: string, value1?: string, value2?: string) => {
    if (!value1 && !value2) return null;

    const isDifferent = value1 !== value2 && value1 && value2;
    let isBetter1 = false;
    let isBetter2 = false;
    let showWinner1 = false;
    let showWinner2 = false;
    let showTie = false;

    if (isDifferent) {
      const num1 = extractNumber(value1);
      const num2 = extractNumber(value2);

      if (num1 !== null && num2 !== null) {
        const higherBetter = isHigherBetter(label);

        if (higherBetter) {
          if (num1 > num2) {
            isBetter1 = true;
            showWinner1 = true;
          } else if (num2 > num1) {
            isBetter2 = true;
            showWinner2 = true;
          }
        } else {
          if (num1 < num2) {
            isBetter1 = true;
            showWinner1 = true;
          } else if (num2 < num1) {
            isBetter2 = true;
            showWinner2 = true;
          }
        }
      }
    } else if (value1 === value2 && value1 && value2) {
      showTie = true;
    }

    return (
      <View key={label} style={styles.specRow}>
        <View style={styles.specRowContent}>
          <View style={[styles.valueCard, showWinner1 && styles.winnerCard]}>
            {showWinner1 && <Text style={styles.trophy}>🏆</Text>}
            {showTie && <Text style={styles.trophy}>🤝</Text>}
            <Text style={isBetter1 ? styles.betterValue : isBetter2 ? styles.worseValue : styles.specValue}>
              {value1 || '-'}
            </Text>
          </View>
          <Text style={styles.specLabel}>{label}</Text>
          <View style={[styles.valueCard, showWinner2 && styles.winnerCard]}>
            {showWinner2 && <Text style={styles.trophy}>🏆</Text>}
            {showTie && <Text style={styles.trophy}>🤝</Text>}
            <Text style={isBetter2 ? styles.betterValue : isBetter1 ? styles.worseValue : styles.specValue}>
              {value2 || '-'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderSection = (title: string, specs: Array<{ label: string; key1?: keyof Motorcycle; key2?: keyof Motorcycle }>) => {
    const hasAnySpecs = specs.some(spec =>
      (spec.key1 && (selectedBike1?.[spec.key1] || selectedBike2?.[spec.key1])) ||
      (spec.key2 && (selectedBike1?.[spec.key2] || selectedBike2?.[spec.key2]))
    );

    if (!hasAnySpecs) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionContent}>
          {specs.map(spec => {
            const value1 = spec.key1 ? selectedBike1?.[spec.key1] : undefined;
            const value2 = spec.key2 ? selectedBike2?.[spec.key2] : undefined;
            return renderSpecRow(spec.label, value1 as string, value2 as string);
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        onMenuPress={() => setIsDrawerOpen(true)}
        showSearch={true}
        onLogoPress={() => navigation.navigate('Main', { screen: 'Home' })}
      />

      <DrawerMenu
        visible={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNavigate={handleDrawerNavigate}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.header}>
          <Text style={styles.title}>Compare Motorcycles</Text>
          <Text style={styles.subtitle}>
            Select two motorcycles to compare their specifications side by side
          </Text>
        </View>

        {/* VS Badge */}
        {selectedBike1 && selectedBike2 && (
          <Animated.View
            style={[
              styles.vsBadge,
              {
                opacity: vsAnimation,
                transform: [{
                  scale: vsAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 1],
                  })
                }]
              }
            ]}
          >
            <Text style={styles.vsText}>VS</Text>
          </Animated.View>
        )}

        {/* Search Inputs */}
        <View style={styles.searchContainer}>
          {/* Search Input 1 */}
          <View style={styles.searchWrapper}>
            {selectedBike1 ? (
              <View style={styles.selectedBikeCard}>
                <View style={styles.motorBadge}>
                  <Text style={styles.motorBadgeText}>Selected</Text>
                </View>
                <View style={styles.bikeHeader}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryEmoji}>
                      {getCategoryEmoji(selectedBike1.Category)}
                    </Text>
                  </View>
                  <View style={styles.bikeInfo}>
                    <Text style={styles.bikeName}>
                      {selectedBike1.Model}
                    </Text>
                    <Text style={styles.bikeDetails}>
                      {selectedBike1.Year} • {selectedBike1.Category}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setSelectedBike1(null)}
                    style={styles.removeButton}
                  >
                    <Ionicons name="close" size={20} color={Colors.error} />
                  </TouchableOpacity>
                </View>
                {(selectedBike1.Displacement || selectedBike1.Power) && (
                  <View style={styles.quickSpecs}>
                    {selectedBike1.Displacement && (
                      <View style={styles.quickSpecItem}>
                        <Text style={styles.quickSpecLabel}>Displacement</Text>
                        <Text style={styles.quickSpecValue}>{selectedBike1.Displacement}</Text>
                      </View>
                    )}
                    {selectedBike1.Power && (
                      <View style={styles.quickSpecItem}>
                        <Text style={styles.quickSpecLabel}>Power</Text>
                        <Text style={styles.quickSpecValue}>{selectedBike1.Power}</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            ) : (
              <View>
                <View style={styles.searchInputContainer}>
                  <Ionicons name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
                  <TextInput
                    style={[styles.searchInput, { outlineStyle: 'none' } as any]}
                    placeholder="Search for first motorcycle..."
                    placeholderTextColor={Colors.textSecondary}
                    value={searchQuery1}
                    onChangeText={setSearchQuery1}
                    onFocus={() => {
                      if (searchQuery1.length >= 2 && suggestions1.length > 0) {
                        setShowSuggestions1(true);
                      }
                    }}
                    underlineColorAndroid="transparent"
                  />
                </View>
                {showSuggestions1 && suggestions1.length > 0 && (
                  <View style={styles.suggestionsContainer}>
                    {isSearching1 ? (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color={Colors.primary} />
                        <Text style={styles.loadingText}>Searching...</Text>
                      </View>
                    ) : (
                      <ScrollView style={styles.suggestionsList} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                        {suggestions1.map((bike) => (
                          <TouchableOpacity
                            key={bike._id}
                            style={styles.suggestionItem}
                            onPress={() => handleSelectBike1(bike)}
                            activeOpacity={0.7}
                          >
                            <View style={styles.suggestionIcon}>
                              <Text style={styles.suggestionEmoji}>
                                {getCategoryEmoji(bike.Category)}
                              </Text>
                            </View>
                            <View style={styles.suggestionInfo}>
                              <Text style={styles.suggestionName}>
                                {bike.Model}
                              </Text>
                              <Text style={styles.suggestionDetails}>
                                {bike.Year} • {bike.Category}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    )}
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Search Input 2 */}
          <View style={styles.searchWrapper}>
            {selectedBike2 ? (
              <View style={[styles.selectedBikeCard, styles.selectedBikeCard2]}>
                <View style={[styles.motorBadge, styles.motorBadge2]}>
                  <Text style={styles.motorBadgeText}>Selected</Text>
                </View>
                <View style={styles.bikeHeader}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryEmoji}>
                      {getCategoryEmoji(selectedBike2.Category)}
                    </Text>
                  </View>
                  <View style={styles.bikeInfo}>
                    <Text style={styles.bikeName}>
                      {selectedBike2.Model}
                    </Text>
                    <Text style={styles.bikeDetails}>
                      {selectedBike2.Year} • {selectedBike2.Category}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setSelectedBike2(null)}
                    style={styles.removeButton}
                  >
                    <Ionicons name="close" size={20} color={Colors.error} />
                  </TouchableOpacity>
                </View>
                {(selectedBike2.Displacement || selectedBike2.Power) && (
                  <View style={styles.quickSpecs}>
                    {selectedBike2.Displacement && (
                      <View style={styles.quickSpecItem}>
                        <Text style={styles.quickSpecLabel}>Displacement</Text>
                        <Text style={styles.quickSpecValue}>{selectedBike2.Displacement}</Text>
                      </View>
                    )}
                    {selectedBike2.Power && (
                      <View style={styles.quickSpecItem}>
                        <Text style={styles.quickSpecLabel}>Power</Text>
                        <Text style={styles.quickSpecValue}>{selectedBike2.Power}</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            ) : (
              <View>
                <View style={styles.searchInputContainer}>
                  <Ionicons name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
                  <TextInput
                    style={[styles.searchInput, { outlineStyle: 'none' } as any]}
                    placeholder="Search for second motorcycle..."
                    placeholderTextColor={Colors.textSecondary}
                    value={searchQuery2}
                    onChangeText={setSearchQuery2}
                    onFocus={() => {
                      if (searchQuery2.length >= 2 && suggestions2.length > 0) {
                        setShowSuggestions2(true);
                      }
                    }}
                    underlineColorAndroid="transparent"
                  />
                </View>
                {showSuggestions2 && suggestions2.length > 0 && (
                  <View style={styles.suggestionsContainer}>
                    {isSearching2 ? (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color={Colors.primary} />
                        <Text style={styles.loadingText}>Searching...</Text>
                      </View>
                    ) : (
                      <ScrollView style={styles.suggestionsList} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                        {suggestions2.map((bike) => (
                          <TouchableOpacity
                            key={bike._id}
                            style={styles.suggestionItem}
                            onPress={() => handleSelectBike2(bike)}
                            activeOpacity={0.7}
                          >
                            <View style={styles.suggestionIcon}>
                              <Text style={styles.suggestionEmoji}>
                                {getCategoryEmoji(bike.Category)}
                              </Text>
                            </View>
                            <View style={styles.suggestionInfo}>
                              <Text style={styles.suggestionName}>
                                {bike.Model}
                              </Text>
                              <Text style={styles.suggestionDetails}>
                                {bike.Year} • {bike.Category}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    )}
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Comparison Results */}
        {selectedBike1 && selectedBike2 ? (
          <View style={styles.comparisonContainer}>
            {/* Legend */}
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#22c55e' }]} />
                <Text style={styles.legendText}>Better</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#f87171' }]} />
                <Text style={styles.legendText}>Worse</Text>
              </View>
            </View>

            {/* Specifications Sections */}
            {renderSection('Engine & Performance', [
              { label: 'Displacement', key1: 'Displacement', key2: 'Displacement' },
              { label: 'Power', key1: 'Power', key2: 'Power' },
              { label: 'Torque', key1: 'Torque', key2: 'Torque' },
              { label: 'Engine Type', key1: 'EngineType', key2: 'EngineType' },
              { label: 'Bore x Stroke', key1: 'Bore', key2: 'Bore' },
              { label: 'Compression', key1: 'Compression', key2: 'Compression' },
            ])}

            {renderSection('Fuel & Ignition', [
              { label: 'Fuel System', key1: 'FuelSystem', key2: 'FuelSystem' },
              { label: 'Fuel Control', key1: 'FuelControl', key2: 'FuelControl' },
              { label: 'Ignition', key1: 'Ignition', key2: 'Ignition' },
              { label: 'Cooling', key1: 'CoolingSystem', key2: 'CoolingSystem' },
              { label: 'Starter', key1: 'Starter', key2: 'Starter' },
              { label: 'Fuel Capacity', key1: 'FuelCapacity', key2: 'FuelCapacity' },
            ])}

            {renderSection('Transmission', [
              { label: 'Gearbox', key1: 'Gearbox', key2: 'Gearbox' },
              { label: 'Transmission', key1: 'TransmissionType', key2: 'TransmissionType' },
              { label: 'Clutch', key1: 'Clutch', key2: 'Clutch' },
            ])}

            {renderSection('Chassis & Suspension', [
              { label: 'Frame', key1: 'FrameType', key2: 'FrameType' },
              { label: 'Front Suspension', key1: 'FrontSuspension', key2: 'FrontSuspension' },
              { label: 'Rear Suspension', key1: 'RearSuspension', key2: 'RearSuspension' },
              { label: 'Front Travel', key1: 'FrontWheelTravel', key2: 'FrontWheelTravel' },
              { label: 'Rear Travel', key1: 'RearWheelTravel', key2: 'RearWheelTravel' },
            ])}

            {renderSection('Brakes', [
              { label: 'Front Brakes', key1: 'FrontBrakes', key2: 'FrontBrakes' },
              { label: 'Rear Brakes', key1: 'RearBrakes', key2: 'RearBrakes' },
            ])}

            {renderSection('Wheels & Tires', [
              { label: 'Front Tire', key1: 'FrontTire', key2: 'FrontTire' },
              { label: 'Rear Tire', key1: 'RearTire', key2: 'RearTire' },
              { label: 'Front Wheel', key1: 'FrontWheel', key2: 'FrontWheel' },
              { label: 'Rear Wheel', key1: 'RearWheel', key2: 'RearWheel' },
            ])}

            {renderSection('Dimensions & Weight', [
              { label: 'Length', key1: 'OverallLength', key2: 'OverallLength' },
              { label: 'Width', key1: 'OverallWidth', key2: 'OverallWidth' },
              { label: 'Height', key1: 'OverallHeight', key2: 'OverallHeight' },
              { label: 'Seat Height', key1: 'SeatHeight', key2: 'SeatHeight' },
              { label: 'Wheelbase', key1: 'Wheelbase', key2: 'Wheelbase' },
              { label: 'Ground Clearance', key1: 'GroundClearance', key2: 'GroundClearance' },
              { label: 'Dry Weight', key1: 'DryWeight', key2: 'DryWeight' },
              { label: 'Wet Weight', key1: 'WetWeight', key2: 'WetWeight' },
            ])}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="search" size={60} color={Colors.primary + '40'} />
            </View>
            <Text style={styles.emptyTitle}>Start Comparing</Text>
            <Text style={styles.emptySubtitle}>
              Search and select two motorcycles to see their detailed comparison
            </Text>
          </View>
        )}
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
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  vsBadge: {
    alignSelf: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 20,
    marginVertical: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  vsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
  },
  searchContainer: {
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 16,
  },
  searchWrapper: {
    zIndex: 2,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    height: 56,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  suggestionsContainer: {
    marginTop: 8,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  suggestionsList: {
    maxHeight: 300,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  noResults: {
    padding: 24,
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: 14,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  suggestionIcon: {
    width: 48,
    height: 48,
    backgroundColor: Colors.primary + '20',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  suggestionEmoji: {
    fontSize: 24,
  },
  suggestionInfo: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  suggestionDetails: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  selectedBikeCard: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.primary + '40',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
  },
  selectedBikeCard2: {
    borderColor: '#ff6b35' + '40',
  },
  motorBadge: {
    position: 'absolute',
    top: -8,
    left: 12,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  motorBadge2: {
    backgroundColor: '#ff6b35',
  },
  motorBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  bikeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  categoryBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  bikeInfo: {
    flex: 1,
  },
  bikeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  bikeDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  removeButton: {
    padding: 8,
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  quickSpecs: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  quickSpecItem: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickSpecLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  quickSpecValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  comparisonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 24,
    backgroundColor: Colors.backgroundLight,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    padding: 16,
    backgroundColor: Colors.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionContent: {
    padding: 8,
  },
  specRow: {
    marginBottom: 8,
  },
  specRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  specLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    width: 80,
    fontWeight: '500',
  },
  valueCard: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  winnerCard: {
    backgroundColor: '#22c55e' + '10',
    borderColor: '#22c55e' + '30',
  },
  trophy: {
    position: 'absolute',
    top: -6,
    right: -6,
    fontSize: 12,
  },
  specValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
    textAlign: 'center',
  },
  betterValue: {
    fontSize: 14,
    color: '#22c55e',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  worseValue: {
    fontSize: 14,
    color: '#f87171',
    fontWeight: '500',
    textAlign: 'center',
    opacity: 0.7,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
});