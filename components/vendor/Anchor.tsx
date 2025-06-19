import React from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, Text } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoleStore } from '@/store/roleStore';

type Tab = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
};

const VendorAnchor = () => {
  const router = useRouter();
  const pathname = usePathname();
  const setRole = useRoleStore((s) => s.setRole);

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

  const tabs: Tab[] = [
    { label: 'Home', icon: 'home-outline', route: '/vendordb' },
    { label: 'Bookings', icon: 'calendar-outline', route: '/allbookings' },
    { label: 'Clients', icon: 'chatbubbles-outline', route: '/vend_clients' },
    { label: 'Transactions', icon: 'card-outline', route: '/vend_transactions' }, // ✅ New tab
  ];

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
            <Text style={[styles.label, { color: isActive ? '#6200EE' : '#999' }]}>
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
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default VendorAnchor;
