import { Slot } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import Navbar from '../../components/customer/Navbar'; 
import Anchor from '../../components/customer/Anchor'; 

export default function Layout() {

  return (
    // <SafeAreaView style={[styles.safeArea, { backgroundColor: !isDark ? '#121212' : '#fff' }]}>
    <View style={[styles.safeArea, { backgroundColor: '#fff' }]}>
     
      <View style={styles.navbarWrap}>
        <Navbar />
      </View>

      {/* Scrollable Page Content */}
      <View  style={{flex:1 }}>
        <Slot />
      </View>
      <View style={styles.navbarWrap}>
        <Anchor />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  navbarWrap: {
    
    zIndex: 100,
    backgroundColor: '#ff758c', 
    padding:0
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
    paddingHorizontal: 12,
  },
});
