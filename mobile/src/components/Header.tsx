import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Animated,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { Colors } from '../constants/Colors';
import { API_CONFIG } from '@shared/constants';
import { BrandLogos } from '../constants/brandLogos';

interface BreadcrumbItem {
  label: string;
  onPress?: () => void;
}

interface HeaderProps {
  onMenuPress: () => void;
  onSearch?: (query: string) => void;
  searchQuery?: string;
  showSearch?: boolean;
  onLogoPress?: () => void;
  breadcrumb?: BreadcrumbItem[];
  showBackButton?: boolean;
  onBackPress?: () => void;
}

interface SearchResult {
  _id: string;
  Model: string;
  Brand: string;
  Year: string;
  Category: string;
  Displacement?: string;
  Power?: string;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Header({
  onMenuPress,
  onSearch,
  searchQuery = '',
  showSearch = true,
  onLogoPress,
  breadcrumb,
  showBackButton = false,
  onBackPress
}: HeaderProps) {
  const navigation = useNavigation<NavigationProp>();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [searchSuggestions, setSearchSuggestions] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const handleSearchChange = (text: string) => {
    setLocalSearchQuery(text);
    if (onSearch) {
      onSearch(text);
    }

    // API'den arama önerileri al
    if (text.length >= 2) {
      searchMotorcycles(text);
    } else {
      setSearchSuggestions([]);
    }
  };

  const searchMotorcycles = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/bikes?search=${encodeURIComponent(query)}&limit=5`
      );
      if (response.ok) {
        const data = await response.json();
        setSearchSuggestions(data.bikes || []);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };



  const renderSearchSuggestion = ({ item }: { item: SearchResult }) => {
    const BrandIcon = BrandLogos[item.Brand];

    return (
      <TouchableOpacity
        style={styles.suggestionItem}
        onPress={() => {
          setIsSearchOpen(false);
          navigation.navigate('MotorcycleDetail', { id: item._id, bikeData: item });
        }}
      >
        <View style={styles.suggestionIconContainer}>
          {BrandIcon ? (
            <BrandIcon width={32} height={32} />
          ) : (
            <Text style={styles.suggestionBrandText}>{item.Brand.substring(0, 2).toUpperCase()}</Text>
          )}
        </View>
        <View style={styles.suggestionInfo}>
          <Text style={styles.suggestionTitle}>
            {item.Model}
          </Text>
          <Text style={styles.suggestionDetails}>
            {item.Year}
            {item.Category && ` • ${item.Category}`}
            {item.Displacement && ` • ${item.Displacement}`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={styles.header}>
        {showBackButton ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.menuButton}
            onPress={onMenuPress}
          >
            <Ionicons name="menu" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        )}

        {breadcrumb && breadcrumb.length > 0 ? (
          <View style={styles.breadcrumbContainer}>
            {breadcrumb.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} style={styles.breadcrumbSeparator} />
                )}
                <TouchableOpacity
                  onPress={item.onPress}
                  disabled={!item.onPress || index === breadcrumb.length - 1}
                  style={styles.breadcrumbItem}
                >
                  <Text
                    style={[
                      styles.breadcrumbText,
                      index === breadcrumb.length - 1 && styles.breadcrumbTextActive
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        ) : (
          <TouchableOpacity
            style={styles.logoContainer}
            onPress={onLogoPress}
            activeOpacity={0.7}
          >
            <View style={styles.logoIcon}>
              <Image
                source={require('../../assets/logos/rpm-vault-logo.png')}
                style={styles.logoIconImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.logoText}>RPMVault</Text>
          </TouchableOpacity>
        )}

        {showSearch && (
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => setIsSearchOpen(true)}
          >
            <Ionicons name="search" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Overlay - slides from top */}
      {isSearchOpen && (
        <View style={styles.searchOverlay}>
          <SafeAreaView style={styles.searchSafeArea} edges={['top']}>
            <View style={styles.searchHeader}>
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                  style={[styles.searchInput, { outlineStyle: 'none' } as any]}
                  placeholder="Search for motorcycles..."
                  value={localSearchQuery}
                  onChangeText={handleSearchChange}
                  autoFocus
                  placeholderTextColor="#999"
                />
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsSearchOpen(false)}
              >
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          {isSearching && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#0066cc" />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          )}

          {!isSearching && localSearchQuery.length >= 2 && searchSuggestions.length === 0 && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No results found</Text>
            </View>
          )}

          {!isSearching && searchSuggestions.length > 0 && (
            <FlatList
              data={searchSuggestions}
              renderItem={renderSearchSuggestion}
              keyExtractor={(item) => item._id}
              style={styles.suggestionsList}
            />
          )}

          {localSearchQuery.length < 2 && (
            <View style={styles.searchHintContainer}>
              <Ionicons name="search-outline" size={64} color="#ccc" />
              <Text style={styles.searchHintText}>
                Type at least 2 characters to search
              </Text>
            </View>
          )}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    zIndex: 10,
    elevation: 5,
  },
  menuButton: {
    padding: 4,
  },
  backButton: {
    padding: 4,
  },
  breadcrumbContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    flexWrap: 'wrap',
  },
  breadcrumbItem: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    maxWidth: 120,
  },
  breadcrumbText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  breadcrumbTextActive: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  breadcrumbSeparator: {
    marginHorizontal: 4,
  },
  logoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIconImage: {
    width: '100%',
    height: '100%',
  },
  logoText: {
    fontSize: 19,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  searchButton: {
    padding: 4,
  },
  searchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background,
    zIndex: 1000,
  },
  searchSafeArea: {
    backgroundColor: Colors.backgroundLight,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
    backgroundColor: Colors.backgroundLight,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  noResultsContainer: {
    padding: 24,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  searchHintContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  searchHintText: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 16,
  },
  suggestionsList: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  suggestionItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.backgroundCard,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
  },
  suggestionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionBrandText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  suggestionInfo: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  suggestionDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
