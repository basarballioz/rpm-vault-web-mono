import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  Platform,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, TabParamList } from '../navigation/RootNavigator';
import Header from '../components/Header';
import DrawerMenu from '../components/DrawerMenu';
import { Colors } from '../constants/Colors';
import { transformMotorcycleData } from '@shared/utils';
import { API_CONFIG } from '@shared/constants';

// Temporary types until shared library is working
interface Bike {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  engine_size: number;
  power_hp: number;
  weight_kg: number;
  fuel_capacity: number;
  engine_type: string;
  price_usd?: number;
  image_url?: string;
  description?: string;
}

interface ApiResponse {
  page: number;
  limit: number;
  total: number;
  bikes: any[];
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type CatalogRouteProp = RouteProp<TabParamList, 'Catalog'>;

type SortOption =
  | 'year-asc'   // Oldest First
  | 'year-desc'   // Newest First
  | 'cc-asc'      // CC Ascending
  | 'cc-desc'     // CC Descending
  | 'hp-asc'      // HP Ascending
  | 'hp-desc'     // HP Descending
  | 'name-asc'    // Name A-Z
  | 'name-desc';  // Name Z-A

export default function CatalogScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CatalogRouteProp>();
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedYearRange, setSelectedYearRange] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('year-desc');
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showYearPickerModal, setShowYearPickerModal] = useState(false);
  const [yearPickerType, setYearPickerType] = useState<'min' | 'max'>('min');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [brandSearchQuery, setBrandSearchQuery] = useState<string>('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const itemsPerPage = 24;

  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  // Popular brands to show first
  const popularBrands = ['Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'BMW', 'Ducati', 'KTM', 'Harley-Davidson', 'Triumph', 'Aprilia'];

  // Generate year range (from 1970 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1969 }, (_, i) => currentYear - i);

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('[CatalogScreen] Error fetching categories:', error);
      setCategories(['Sport', 'Cruiser', 'Adventure', 'Naked', 'Touring', 'Enduro', 'Scooter', 'Electric']);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/brands`);
      if (!response.ok) throw new Error('Failed to fetch brands');
      const data = await response.json();

      const brandNames = data.map((item: any) => {
        if (item.name) return item.name;
        if (item.brand) return item.brand;
        if (item.Brand) return item.Brand;
        const keys = Object.keys(item).filter(k => k !== '_id');
        if (keys.length > 0) return item[keys[0]];
        return null;
      }).filter((b: any) => typeof b === 'string' && b.length > 0);

      const uniqueBrands = [...new Set(brandNames)].sort() as string[];
      setBrands(uniqueBrands);
    } catch (error) {
      console.error('[CatalogScreen] Error fetching brands:', error);
      setBrands([
        'Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'BMW', 'Ducati', 'KTM',
        'Harley-Davidson', 'Triumph', 'Aprilia', 'Moto Guzzi', 'Indian',
        'Royal Enfield', 'Benelli', 'CFMoto'
      ].sort());
    }
  };

  useEffect(() => {
    loadBikes();
  }, [currentPage, selectedCategories, selectedBrands, selectedYearRange, sortBy, searchQuery]);

  useEffect(() => {
    // Route'dan category parametresi gelirse onu seç
    if (route.params?.category) {
      setSelectedCategories([route.params.category]);
    }
    // Route'dan brand parametresi gelirse onu seç
    if (route.params?.brand) {
      setSelectedBrands([route.params.brand]);
    }
  }, [route.params?.category, route.params?.brand]);

  const loadBikes = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());

      // Add category filter (comma-separated for multiple values)
      if (selectedCategories.length > 0) {
        params.append('category', selectedCategories.join(','));
      }

      // Add brand filter (comma-separated for multiple values)
      if (selectedBrands.length > 0) {
        params.append('brand', selectedBrands.join(','));
      }

      if (searchQuery.trim().length > 0) {
        params.append('search', searchQuery.trim());
      }

      const baseUrl = `${API_CONFIG.BASE_URL}/bikes`;
      const url = `${baseUrl}?${params.toString()}`;
      console.log('[CatalogScreen] Platform:', Platform.OS);
      console.log('[CatalogScreen] Fetching:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      console.log('[CatalogScreen] API Response:', {
        page: data.page,
        limit: data.limit,
        total: data.total,
        bikesCount: data.bikes?.length
      });

      if (!data.bikes || !Array.isArray(data.bikes)) {
        console.error('[CatalogScreen] Invalid bikes data:', data);
        setBikes([]);
        setTotalResults(0);
        setTotalPages(1);
        return;
      }

      let filteredBikes = data.bikes;

      // Client-side filtering for year range (API doesn't support year range)
      if (selectedYearRange.min !== null || selectedYearRange.max !== null) {
        filteredBikes = filteredBikes.filter((bike: any) => {
          const bikeYear = parseInt(bike.Year) || 0;
          const minYear = selectedYearRange.min || 0;
          const maxYear = selectedYearRange.max || currentYear;
          return bikeYear >= minYear && bikeYear <= maxYear;
        });
      }

      const formattedBikes: Bike[] = filteredBikes.map(transformMotorcycleData).map((bike) => {
        // Parse displacement: "49.9 ccm (3.04 cubic inches)" -> 49.9 or "499 ccm" -> 499
        const displacement = bike.Displacement ? parseFloat(bike.Displacement.match(/[\d.]+/)?.[0] || '0') : 0;

        // Parse power: "9.5 HP (6.9 kW))" -> 9.5
        const power = bike.Power ? parseFloat(bike.Power.match(/[\d.]+/)?.[0] || '0') : 0;

        // Parse weight: "78.0 kg (172.0 pounds)" -> 78
        const weight = bike.DryWeight ? parseFloat(bike.DryWeight.match(/[\d.]+/)?.[0] || '0') : 0;

        // Parse fuel capacity: "7.50 litres (1.98 US gallons)" -> 7.5
        const fuelCapacity = bike.FuelCapacity ? parseFloat(bike.FuelCapacity.match(/[\d.]+/)?.[0] || '0') : 0;

        return {
          id: bike._id,
          brand: bike.Brand || 'Unknown',
          model: bike.Model || 'Unknown Model',
          year: parseInt(bike.Year) || new Date().getFullYear(),
          category: bike.Category || 'Other',
          engine_size: Math.round(displacement),
          power_hp: Math.round(power * 10) / 10, // 1 decimal place
          weight_kg: Math.round(weight),
          fuel_capacity: Math.round(fuelCapacity * 10) / 10, // 1 decimal place
          engine_type: bike.EngineType || '',
          image_url: bike.image_url || 'https://via.placeholder.com/300x200',
        };
      });

      // Sort bikes based on sortBy
      const sortedBikes = [...formattedBikes].sort((a, b) => {
        switch (sortBy) {
          case 'year-asc':
            return a.year - b.year;
          case 'year-desc':
            return b.year - a.year;
          case 'cc-asc':
            return a.engine_size - b.engine_size;
          case 'cc-desc':
            return b.engine_size - a.engine_size;
          case 'hp-asc':
            return a.power_hp - b.power_hp;
          case 'hp-desc':
            return b.power_hp - a.power_hp;
          case 'name-asc':
            return `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`);
          case 'name-desc':
            return `${b.brand} ${b.model}`.localeCompare(`${a.brand} ${a.model}`);
          default:
            return b.year - a.year;
        }
      });

      setBikes(sortedBikes);

      // Update pagination based on whether we're doing client-side filtering (year range)
      if (selectedYearRange.min === null && selectedYearRange.max === null) {
        setTotalResults(data.total || 0);
        setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
      } else {
        setTotalResults(sortedBikes.length);
        setTotalPages(Math.ceil(sortedBikes.length / itemsPerPage));
      }
    } catch (error) {
      console.error('[CatalogScreen] Error loading bikes:', error);
      setBikes([]);
      setTotalResults(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleDrawerNavigate = (screen: string, params?: any) => {
    setIsDrawerOpen(false);
    if (screen === 'Catalog') {
      if (params?.category) {
        setSelectedCategories([params.category]);
      }
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const MAX_SELECTIONS = 7;

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else if (selectedCategories.length < MAX_SELECTIONS) {
      setSelectedCategories([...selectedCategories, category]);
    }
    setCurrentPage(1);
  };

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else if (selectedBrands.length < MAX_SELECTIONS) {
      setSelectedBrands([...selectedBrands, brand]);
    }
    setCurrentPage(1);
  };

  // Filter and organize brands
  const getFilteredAndOrganizedBrands = () => {
    // 1. If searching, just return matching brands
    if (brandSearchQuery.trim()) {
      return brands.filter(brand =>
        brand.toLowerCase().includes(brandSearchQuery.toLowerCase())
      );
    }

    // 2. If not searching, we want to show:
    //    a. All selected brands (sorted alphabetically)
    //    b. Popular brands (that aren't already selected)
    //    c. Other brands to fill up the list (if needed)

    // Get all selected brands first
    const selected = brands.filter(brand => selectedBrands.includes(brand)).sort();

    // Get popular brands that are NOT selected
    const popularUnselected = popularBrands.filter(brand =>
      !selectedBrands.includes(brand) && brands.includes(brand)
    ).sort((a, b) => popularBrands.indexOf(a) - popularBrands.indexOf(b));

    // Combine them
    let result = [...selected, ...popularUnselected];

    // If we still have room (less than 15 items), add some other brands
    if (result.length < 15) {
      const others = brands.filter(brand =>
        !selectedBrands.includes(brand) &&
        !popularBrands.includes(brand)
      ).slice(0, 15 - result.length);

      result = [...result, ...others];
    }

    return result;
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedYearRange({ min: null, max: null });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const activeFiltersCount = selectedCategories.length + selectedBrands.length +
    (selectedYearRange.min !== null || selectedYearRange.max !== null ? 1 : 0);

  const renderBikeCard = ({ item }: { item: Bike }) => (
    <TouchableOpacity
      style={styles.bikeCard}
      onPress={() => navigation.navigate('MotorcycleDetail', { id: item.id })}
    >
      <View style={styles.bikeCardHeader}>
        <View style={styles.bikeMainInfo}>
          <Text style={styles.bikeTitle}>{item.model}</Text>
          <Text style={styles.bikeBrand}>{item.brand}</Text>
        </View>
        <View style={styles.bikeYearBadge}>
          <Text style={styles.bikeYearText}>{item.year}</Text>
        </View>
      </View>

      <View style={styles.bikeCategoryBadge}>
        <Text style={styles.bikeCategoryText}>{item.category}</Text>
      </View>

      <View style={styles.bikeSpecs}>
        <View style={styles.specItem}>
          <Ionicons name="speedometer-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.specText}>{item.engine_size} ccm</Text>
        </View>
        <View style={styles.specItem}>
          <Ionicons name="flash-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.specText}>{item.power_hp} HP</Text>
        </View>
        <View style={styles.specItem}>
          <Ionicons name="layers-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.specText}>{item.engine_type}</Text>
        </View>
      </View>

      <View style={styles.bikeCardFooter}>
        <Text style={styles.viewDetailsText}>View Details</Text>
        <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
      </View>
    </TouchableOpacity>
  );

  const getSortLabel = () => {
    switch (sortBy) {
      case 'year-asc':
        return 'Year (Oldest)';
      case 'year-desc':
        return 'Year (Newest)';
      case 'cc-asc':
        return 'CC (Low to High)';
      case 'cc-desc':
        return 'CC (High to Low)';
      case 'hp-asc':
        return 'HP (Low to High)';
      case 'hp-desc':
        return 'HP (High to Low)';
      case 'name-asc':
        return 'Name (A-Z)';
      case 'name-desc':
        return 'Name (Z-A)';
      default:
        return 'Year (Newest)';
    }
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

      {/* Search and Filters Bar */}
      <View style={styles.filtersBar}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={Colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search motorcycles..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={handleSearchChange}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => handleSearchChange('')}
              style={styles.clearSearchButton}
            >
              <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <View style={styles.activeFiltersContainer}>
            {selectedCategories.slice(0, 2).map((category) => (
              <View key={category} style={styles.activeFilterBadge}>
                <Text style={styles.activeFilterBadgeText}>{category}</Text>
                <TouchableOpacity onPress={() => toggleCategory(category)}>
                  <Ionicons name="close-circle" size={16} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            ))}
            {selectedBrands.slice(0, 2).map((brand) => (
              <View key={brand} style={styles.activeFilterBadge}>
                <Text style={styles.activeFilterBadgeText}>{brand}</Text>
                <TouchableOpacity onPress={() => toggleBrand(brand)}>
                  <Ionicons name="close-circle" size={16} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            ))}
            {(selectedYearRange.min !== null || selectedYearRange.max !== null) && (
              <View style={styles.activeFilterBadge}>
                <Text style={styles.activeFilterBadgeText}>
                  {selectedYearRange.min || '—'} - {selectedYearRange.max || '—'}
                </Text>
                <TouchableOpacity onPress={() => setSelectedYearRange({ min: null, max: null })}>
                  <Ionicons name="close-circle" size={16} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            )}
            {activeFiltersCount > 4 && (
              <TouchableOpacity onPress={() => setShowFiltersModal(true)}>
                <Text style={styles.moreFiltersText}>+{activeFiltersCount - 4} more</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Filters and Sort Row */}
        <View style={styles.filtersRow}>
          <View style={styles.resultsInfo}>
            <Text style={styles.resultsText}>
              {totalResults.toLocaleString()} motorcycles
            </Text>
            {totalPages > 1 && (
              <Text style={styles.pageInfoText}>
                Page {currentPage} of {totalPages}
              </Text>
            )}
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.sortButton}
              onPress={() => setShowSortModal(true)}
            >
              <Ionicons name="swap-vertical" size={18} color={Colors.textSecondary} />
              <Text style={styles.sortButtonText}>{getSortLabel()}</Text>
              <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filtersIconButton}
              onPress={() => setShowFiltersModal(true)}
            >
              <Ionicons name="options" size={20} color={Colors.textPrimary} />
              {activeFiltersCount > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Bikes List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>
            {[
              "Revving up motorcycles...",
              "Fueling the engines of destiny...",
              "Hold tight, motorbikes incoming!"
            ][Math.floor(Math.random() * 3)]}
          </Text>

        </View>

      ) : (
        <>
          <FlatList
            data={bikes}
            renderItem={renderBikeCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.bikesList}
            showsVerticalScrollIndicator={false}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
                onPress={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <Ionicons name="chevron-back" size={20} color={currentPage === 1 ? Colors.textMuted : Colors.primary} />
              </TouchableOpacity>

              <View style={styles.pageNumbers}>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  if (pageNum > totalPages) return null;
                  return (
                    <TouchableOpacity
                      key={pageNum}
                      style={[
                        styles.pageNumberButton,
                        currentPage === pageNum && styles.pageNumberButtonActive,
                      ]}
                      onPress={() => handlePageChange(pageNum)}
                    >
                      <Text
                        style={[
                          styles.pageNumberText,
                          currentPage === pageNum && styles.pageNumberTextActive,
                        ]}
                      >
                        {pageNum}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity
                style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
                onPress={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <Ionicons name="chevron-forward" size={20} color={currentPage === totalPages ? Colors.textMuted : Colors.primary} />
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort By</Text>
            {[
              // Year sorting
              { value: 'year-desc' as SortOption, label: 'Year (Newest First)', icon: 'calendar' },
              { value: 'year-asc' as SortOption, label: 'Year (Oldest First)', icon: 'calendar' },
              // CC sorting
              { value: 'cc-desc' as SortOption, label: 'CC (High to Low)', icon: 'speedometer' },
              { value: 'cc-asc' as SortOption, label: 'CC (Low to High)', icon: 'speedometer' },
              // HP sorting
              { value: 'hp-desc' as SortOption, label: 'HP (High to Low)', icon: 'flash' },
              { value: 'hp-asc' as SortOption, label: 'HP (Low to High)', icon: 'flash' },
              // Name sorting
              { value: 'name-asc' as SortOption, label: 'Name (A-Z)', icon: 'text-outline' },
              { value: 'name-desc' as SortOption, label: 'Name (Z-A)', icon: 'text-outline' },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.modalOption,
                  sortBy === option.value && styles.modalOptionActive,
                ]}
                onPress={() => {
                  setSortBy(option.value);
                  setShowSortModal(false);
                }}
              >
                <View style={styles.modalOptionLeft}>
                  <Ionicons
                    name={option.icon as any}
                    size={18}
                    color={sortBy === option.value ? Colors.primary : Colors.textSecondary}
                    style={styles.modalOptionIcon}
                  />
                  <Text style={[
                    styles.modalOptionText,
                    sortBy === option.value && styles.modalOptionTextActive,
                  ]}>
                    {option.label}
                  </Text>
                </View>
                {sortBy === option.value && (
                  <Ionicons name="checkmark" size={20} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Filters Modal */}
      <Modal
        visible={showFiltersModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFiltersModal(false)}
      >
        <View style={styles.filtersModalContainer}>
          <View style={styles.filtersModalHeader}>
            <Text style={styles.filtersModalTitle}>Filters</Text>
            <View style={styles.filtersModalHeaderActions}>
              {activeFiltersCount > 0 && (
                <TouchableOpacity onPress={clearFilters} style={styles.clearFiltersButton}>
                  <Text style={styles.clearFiltersText}>Clear All</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => setShowFiltersModal(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={[{ type: 'categories' }, { type: 'brands' }, { type: 'years' }]}
            keyExtractor={(item) => item.type}
            renderItem={({ item }) => {
              if (item.type === 'categories') {
                return (
                  <View style={styles.filterSection}>
                    <Text style={styles.filterSectionTitle}>Categories</Text>
                    <View style={styles.filterOptionsGrid}>
                      {categories.map((category) => {
                        const isSelected = selectedCategories.includes(category);
                        const isDisabled = !isSelected && selectedCategories.length >= MAX_SELECTIONS;
                        return (
                          <TouchableOpacity
                            key={category}
                            style={[
                              styles.filterChip,
                              isSelected && styles.filterChipActive,
                              isDisabled && styles.filterChipDisabled,
                            ]}
                            onPress={() => toggleCategory(category)}
                            disabled={isDisabled}
                          >
                            <Text
                              style={[
                                styles.filterChipText,
                                isSelected && styles.filterChipTextActive,
                                isDisabled && styles.filterChipTextDisabled,
                              ]}
                            >
                              {category}
                            </Text>
                            {isSelected && (
                              <Ionicons name="checkmark-circle" size={16} color={Colors.primary} style={styles.filterChipIcon} />
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                );
              }

              if (item.type === 'brands') {
                const filteredBrands = getFilteredAndOrganizedBrands();

                return (
                  <View style={styles.filterSection}>
                    <Text style={styles.filterSectionTitle}>Brands</Text>

                    {/* Brand Search Input */}
                    <View style={styles.brandSearchContainer}>
                      <Ionicons name="search" size={16} color={Colors.textSecondary} style={styles.brandSearchIcon} />
                      <TextInput
                        style={[styles.brandSearchInput, { outline: 'none' } as any]}
                        placeholder="Search brands..."
                        placeholderTextColor={Colors.textMuted}
                        value={brandSearchQuery}
                        onChangeText={setBrandSearchQuery}
                        returnKeyType="search"
                      />
                      {brandSearchQuery.length > 0 && (
                        <TouchableOpacity
                          onPress={() => setBrandSearchQuery('')}
                          style={styles.clearBrandSearchButton}
                        >
                          <Ionicons name="close-circle" size={16} color={Colors.textSecondary} />
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* Brands List - Using flexWrap instead of FlatList columns for better spacing */}
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                      {filteredBrands.map((brand) => {
                        const isSelected = selectedBrands.includes(brand);
                        const isDisabled = !isSelected && selectedBrands.length >= MAX_SELECTIONS;

                        return (
                          <TouchableOpacity
                            key={brand}
                            style={[
                              styles.filterChip,
                              isSelected && styles.filterChipActive,
                              isDisabled && styles.filterChipDisabled,
                            ]}
                            onPress={() => toggleBrand(brand)}
                            disabled={isDisabled}
                          >
                            <Text
                              style={[
                                styles.filterChipText,
                                isSelected && styles.filterChipTextActive,
                                isDisabled && styles.filterChipTextDisabled,
                              ]}
                            >
                              {brand}
                            </Text>
                            {isSelected && (
                              <Ionicons name="checkmark-circle" size={16} color={Colors.primary} style={styles.filterChipIcon} />
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>


                    {filteredBrands.length === 0 && (
                      <Text style={styles.noBrandsText}>No brands found</Text>
                    )}
                    {!brandSearchQuery.trim() && brands.length > 15 && (
                      <Text style={styles.searchHintText}>Search to see more brands...</Text>
                    )}
                  </View>
                );
              }

              if (item.type === 'years') {
                return (
                  <View style={styles.filterSection}>
                    <Text style={styles.filterSectionTitle}>Model Year</Text>
                    <View style={styles.yearRangeContainer}>
                      <View style={styles.yearInputContainer}>
                        <Text style={styles.yearInputLabel}>From</Text>
                        <TouchableOpacity
                          style={styles.yearSelect}
                          onPress={() => {
                            setYearPickerType('min');
                            setShowYearPickerModal(true);
                          }}
                        >
                          <Text style={styles.yearSelectText}>
                            {selectedYearRange.min || 'Min'}
                          </Text>
                          <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} />
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.yearRangeSeparator}>—</Text>

                      <View style={styles.yearInputContainer}>
                        <Text style={styles.yearInputLabel}>To</Text>
                        <TouchableOpacity
                          style={styles.yearSelect}
                          onPress={() => {
                            setYearPickerType('max');
                            setShowYearPickerModal(true);
                          }}
                        >
                          <Text style={styles.yearSelectText}>
                            {selectedYearRange.max || 'Max'}
                          </Text>
                          <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {(selectedYearRange.min !== null || selectedYearRange.max !== null) && (
                      <TouchableOpacity
                        style={styles.clearYearButton}
                        onPress={() => setSelectedYearRange({ min: null, max: null })}
                      >
                        <Text style={styles.clearYearButtonText}>Clear Year Filter</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              }

              return null;
            }}
          />

          <View style={styles.filtersModalFooter}>
            <TouchableOpacity
              style={styles.applyFiltersButton}
              onPress={() => setShowFiltersModal(false)}
            >
              <Text style={styles.applyFiltersButtonText}>
                Apply Filters {totalResults > 0 && `(${totalResults.toLocaleString()} motorcycles)`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Year Picker Modal */}
      <Modal
        visible={showYearPickerModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowYearPickerModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowYearPickerModal(false)}
        >
          <View style={styles.yearPickerModalContent}>
            <Text style={styles.modalTitle}>
              Select {yearPickerType === 'min' ? 'Minimum' : 'Maximum'} Year
            </Text>
            <FlatList
              data={years}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.yearOption,
                    (yearPickerType === 'min' && selectedYearRange.min === item) ||
                      (yearPickerType === 'max' && selectedYearRange.max === item)
                      ? styles.yearOptionActive
                      : null,
                  ]}
                  onPress={() => {
                    if (yearPickerType === 'min') {
                      setSelectedYearRange({ ...selectedYearRange, min: item });
                    } else {
                      setSelectedYearRange({ ...selectedYearRange, max: item });
                    }
                    setShowYearPickerModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.yearOptionText,
                      (yearPickerType === 'min' && selectedYearRange.min === item) ||
                        (yearPickerType === 'max' && selectedYearRange.max === item)
                        ? styles.yearOptionTextActive
                        : null,
                    ]}
                  >
                    {item}
                  </Text>
                  {((yearPickerType === 'min' && selectedYearRange.min === item) ||
                    (yearPickerType === 'max' && selectedYearRange.max === item)) && (
                      <Ionicons name="checkmark" size={20} color={Colors.primary} />
                    )}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={true}
              style={styles.yearPickerList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  filtersBar: {
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.textPrimary,
    outlineStyle: 'none',
  } as any,
  clearSearchButton: {
    padding: 4,
    marginLeft: 4,
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
    marginBottom: 6,
  },
  activeFilterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  activeFilterBadgeText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  moreFiltersText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    paddingVertical: 6,
  },
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultsInfo: {
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filtersIconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    fontSize: 12,
    color: Colors.background,
    fontWeight: '600',
  },
  resultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sortButtonText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  bikesList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  bikeCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bikeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bikeMainInfo: {
    flex: 1,
  },
  bikeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  bikeBrand: {
    fontSize: 12,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  bikeYearBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  bikeYearText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.background,
  },
  bikeCategoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: Colors.backgroundLight,
    marginBottom: 12,
  },
  bikeCategoryText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  bikeSpecs: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  specText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  bikeCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  viewDetailsText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalOptionIcon: {
    marginRight: 12,
  },
  modalOptionActive: {
    backgroundColor: Colors.backgroundLight,
  },
  modalOptionText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  modalOptionTextActive: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  filtersModalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 50,
  },
  filtersModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filtersModalHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filtersModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  clearFiltersButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: Colors.backgroundLight,
  },
  clearFiltersText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  filterOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundCard,
  },
  filterChipActive: {
    backgroundColor: Colors.backgroundLight,
    borderColor: Colors.primary,
  },
  filterChipDisabled: {
    opacity: 0.4,
    backgroundColor: Colors.backgroundCard,
  },
  filterChipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  filterChipTextDisabled: {
    color: Colors.textSecondary,
  },
  filterChipIcon: {
    marginLeft: 4,
  },
  yearRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  yearInputContainer: {
    flex: 1,
  },
  yearInputLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 6,
    fontWeight: '500',
  },
  yearSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundCard,
  },
  yearSelectText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  yearRangeSeparator: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginTop: 20,
  },
  clearYearButton: {
    marginTop: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  clearYearButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  filtersModalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.backgroundLight,
  },
  applyFiltersButton: {
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  applyFiltersButtonText: {
    fontSize: 16,
    color: Colors.background,
    fontWeight: '600',
  },
  yearPickerModalContent: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  yearPickerList: {
    marginTop: 12,
  },
  yearOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 4,
    borderRadius: 8,
  },
  yearOptionActive: {
    backgroundColor: Colors.backgroundLight,
  },
  yearOptionText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  yearOptionTextActive: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  pageInfoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.backgroundLight,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  paginationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  paginationButtonDisabled: {
    borderColor: Colors.border,
    opacity: 0.5,
  },
  paginationButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  paginationButtonTextDisabled: {
    color: Colors.textMuted,
  },
  pageNumbers: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  pageNumberButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pageNumberButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pageNumberText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  pageNumberTextActive: {
    color: Colors.background,
    fontWeight: '700',
  },
  brandSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
  },
  brandSearchIcon: {
    marginRight: 8,
  },
  brandSearchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    padding: 0,
  },
  clearBrandSearchButton: {
    padding: 4,
  },
  noBrandsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
  searchHintText: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: 12,
    fontStyle: 'italic',
  },
});