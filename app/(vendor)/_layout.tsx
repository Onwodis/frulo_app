import { Slot } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Navbar from '../../components/vendor/Navbar'; 
import Anchor from '../../components/vendor/Anchor'; 

export default function Layout() {
 

  return (
    <View style={[styles.safeArea, { backgroundColor: '#fff' }]}>
     
      <View style={styles.navbarWrap}>
        <Navbar />
      </View>

      <View style={{flex:1}}>
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
    position: 'sticky', // works on web
    top: 0,
    zIndex: 100,
    backgroundColor: '#ff758c', // or darken based on theme
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
});
