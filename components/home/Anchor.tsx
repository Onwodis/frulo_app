import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
type Tab = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap; 
  route: any;
};
const FooterNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  const tabs : Tab[] = [
    { label: 'Home', icon: 'home', route: '/' },
    { label: 'About', icon: 'information-circle', route: '/about' },
    { label: 'Register', icon: 'settings', route: '/register' },
    { label: 'Login', icon: 'log-in', route: '/login' },
  ] 

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

export default FooterNav;
