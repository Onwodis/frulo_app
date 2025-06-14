import { useLocalSearchParams, router } from 'expo-router';
import React, { useState ,useEffect} from 'react';
import { Alert } from 'react-native';
import {
  View,
  Text,
  Button,
  StyleSheet,
  useColorScheme,
  Platform,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView } from 'react-native';
export default function Book() {
  const { service } = useLocalSearchParams();
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  useEffect(() => {
  if (service === undefined) {
    Alert.alert(
      "Booking Error",
      "Oops! Please select a service first.",
      [{ text: "OK", onPress: () => router.push("/") }]
    );
    // router.push("/");
  }
}, [service]);
  const handleBooking = async () => {
    const booking = {
      service,
      date: date.toDateString(),
      time: date.toLocaleTimeString(),
    };

    await AsyncStorage.setItem('booking', JSON.stringify(booking));
    router.push('/confirm');
  };

  return (
   
    <ScrollView contentContainerStyle={styles.container} style={[ { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>      
      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
        📅 Book Your {service}
      </Text>

      <Text style={[styles.label, { color: isDark ? '#bbb' : '#333' }]}>Date & Time</Text>

      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.pickButton}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Pick Date/Time</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(e, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <View style={{ marginTop: 24 }}>
        <Button title="Confirm Booking" onPress={handleBooking} color={isDark ? '#bb86fc' : '#6200ee'} />
      </View>
    </ScrollView>
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  pickButton: {
    backgroundColor: '#6200ee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
});
