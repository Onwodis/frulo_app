import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Alert,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRoleStore } from '../../store/roleStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Tab = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap; 
  route: any;
};

const FooterNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const setRole = useRoleStore((s) => s.setRole);

  const tabs: Tab[] = [
    { label: 'Dashboard', icon: 'home', route: '/db' },
    { label: 'Bookings', icon: 'calendar', route: '/cus_bookings' },
    { label: 'Support', icon: 'chatbubbles', route: '/cus_support' },
    { label: 'Settings', icon: 'settings', route: '/cus_settings' },
  ];

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          setRole(null);
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.route;

        return (
          <TouchableOpacity
            key={tab.label}
            style={styles.button}
            onPress={() => router.push(tab.route)}
          >
            <Ionicons
              name={tab.icon}
              size={24}
              color={isActive ? '#6200EE' : '#999'}
            />
            <Text
              style={[
                styles.label,
                { color: isActive ? '#6200EE' : '#999' },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#f44336" />
        <Text style={[styles.label, { color: '#f44336' }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#fefefe',
    borderTopWidth: 1,
    borderColor: '#ddd',
    elevation: 5,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default FooterNav;
