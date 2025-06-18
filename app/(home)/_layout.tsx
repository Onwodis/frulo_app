import { Slot } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import Navbar from '../../components/home/Navbar'; 
import Anchor from '../../components/home/Anchor'; 
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';


export default function Layout() {
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();

  return (
    <View style={[
        styles.container
      ]}>

     
        <Navbar />
  

      {/* Scrollable Page Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Slot />
      </ScrollView>
  
        <View >
        <Anchor />
        </View>
     
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1, // takes full height
    backgroundColor: '#fff',
  },
  navbarWrap: {
    
    zIndex: 100,
    backgroundColor: '#ff758c', // or darken based on theme
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 0,
    // height:600,
    paddingHorizontal: 16,
  },
});
