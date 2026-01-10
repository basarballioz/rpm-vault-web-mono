import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from '../screens/HomeScreen';
import CatalogScreen from '../screens/CatalogScreen';
import MotorcycleDetailScreen from '../screens/MotorcycleDetailScreen';
import CompareScreen from '../screens/CompareScreen';
import AboutScreen from '../screens/AboutScreen';
import ContactScreen from '../screens/ContactScreen';

export type TabParamList = {
  Home: undefined;
  Catalog: { category?: string; brand?: string } | undefined;
  Compare: undefined;
};

export type RootStackParamList = {
  Main: { screen: keyof TabParamList; params?: any } | undefined;
  MotorcycleDetail: { id: string; bikeData?: any };
  About: undefined;
  Contact: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Catalog') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Compare') {
            iconName = focused ? 'git-compare' : 'git-compare-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ff6b35',
        tabBarInactiveTintColor: '#808080',
        tabBarStyle: {
          backgroundColor: '#2d2d2d',
          borderTopColor: '#3a3a3a',
          borderTopWidth: 1,
          paddingTop: 4,
          height: 82,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginTop: 3,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'RPMVault' }} />
      <Tab.Screen name="Catalog" component={CatalogScreen} options={{ title: 'Catalog' }} />
      <Tab.Screen name="Compare" component={CompareScreen} options={{ title: 'Compare' }} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MotorcycleDetail"
        component={MotorcycleDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: 'About',
          headerStyle: {
            backgroundColor: '#2d2d2d',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          } as any,
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          title: 'Contact',
          headerStyle: {
            backgroundColor: '#2d2d2d',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          } as any,
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
}