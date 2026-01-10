import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface Category {
  name: string;
  emoji: string;
  icon: string;
}

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (screen: string, params?: any) => void;
  navigation?: any;
}

const categories: Category[] = [
  { name: 'Sport', emoji: '🏁', icon: 'flash' },
  { name: 'Cruiser', emoji: '🛣️', icon: 'car' },
  { name: 'Adventure', emoji: '🏔️', icon: 'mountain' },
  { name: 'Enduro', emoji: '🏞️', icon: 'trail-sign' },
  { name: 'Scooter', emoji: '🛴', icon: 'bicycle' },
  { name: 'Touring', emoji: '🗺️', icon: 'map' },
  { name: 'Naked', emoji: '⚡', icon: 'thunderstorm' },
];

export default function DrawerMenu({ visible, onClose, onNavigate }: DrawerMenuProps) {
  const [isCategoriesOpen, setIsCategoriesOpen] = React.useState(false);
  const [shouldRender, setShouldRender] = React.useState(false);
  const slideAnim = useRef(new Animated.Value(-320)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      // Drawer açılırken animasyon - daha smooth kayma efekti
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Drawer kapanırken animasyon - smooth kayma efekti
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -320,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Animasyon tamamlandıktan sonra render'ı durdur
        setShouldRender(false);
      });
    }
  }, [visible]);

  const handleNavigate = (screen: string, params?: any) => {
    onNavigate(screen, params);
    onClose();
  };

  if (!shouldRender) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>
      <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
        <SafeAreaView style={styles.drawerSafeArea} edges={['top']}>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>Menu</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#1a1a1a" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.drawerContent} showsVerticalScrollIndicator={false}>
            {/* Home */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate('Home')}
            >
              <Ionicons name="home" size={20} color="#0066cc" />
              <Text style={styles.menuItemText}>Home</Text>
            </TouchableOpacity>

            {/* Catalog */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate('Catalog')}
            >
              <Ionicons name="list" size={20} color="#0066cc" />
              <Text style={styles.menuItemText}>Catalog</Text>
            </TouchableOpacity>

            {/* Compare */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate('Compare')}
            >
              <Ionicons name="git-compare" size={20} color="#0066cc" />
              <Text style={styles.menuItemText}>Compare</Text>
            </TouchableOpacity>

            {/* Categories */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setIsCategoriesOpen(!isCategoriesOpen)}
            >
              <Ionicons name="grid" size={20} color="#0066cc" />
              <Text style={styles.menuItemText}>Categories</Text>
              <Ionicons
                name={isCategoriesOpen ? "chevron-up" : "chevron-down"}
                size={20}
                color="#666"
                style={styles.chevron}
              />
            </TouchableOpacity>

            {/* Categories List */}
            {isCategoriesOpen && (
              <View style={styles.categoriesList}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.name}
                    style={styles.categoryItem}
                    onPress={() => handleNavigate('Catalog', { category: category.name })}
                  >
                    <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Divider */}
            <View style={styles.divider} />

            {/* About */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate('About')}
            >
              <Ionicons name="information-circle" size={20} color="#666" />
              <Text style={[styles.menuItemText, { color: '#666' }]}>About</Text>
            </TouchableOpacity>

            {/* Contact */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate('Contact')}
            >
              <Ionicons name="mail" size={20} color="#666" />
              <Text style={[styles.menuItemText, { color: '#666' }]}>Contact</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Footer */}
          <View style={styles.drawerFooter}>
            <Text style={styles.footerText}>RPMVault Mobile</Text>
            <Text style={styles.footerVersion}>Version 1.0.0</Text>
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '80%',
    maxWidth: 320,
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  drawerSafeArea: {
    flex: 1,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fafafa',
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  closeButton: {
    padding: 4,
  },
  drawerContent: {
    flex: 1,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    flex: 1,
  },
  chevron: {
    marginLeft: 'auto',
  },
  categoriesList: {
    backgroundColor: '#eeeeee',
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 8,
    paddingVertical: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  categoryName: {
    fontSize: 15,
    color: '#1a1a1a',
  },
  divider: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 8,
    marginHorizontal: 20,
  },
  drawerFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fafafa',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: 12,
    color: '#666',
  },
});
