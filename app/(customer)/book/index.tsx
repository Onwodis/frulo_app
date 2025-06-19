import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useRouter } from 'expo-router';
import { useBookingStore } from '@/store/bookingStore';
import { serviceStore } from '@/store/serviceStore';
import { useRoleStore } from '@/store/roleStore';
import { collection, doc, query, where, getDocs, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Book() {
  const router = useRouter();
  const addBooking = useBookingStore((s) => s.addBooking);
  const services = serviceStore((s) => s.services);
  const user = useRoleStore((s) => s.user);
  const setUser = useRoleStore((s) => s.setUser);
  const [paying, setPaying] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleDateConfirm = (selected) => {
    setShowPicker(false);
    if (selected) setDate(selected);
  };

  const handleSubmit = async () => {
    if (!selectedService) {
      return Alert.alert('Missing Info', 'Please select a service');
    }

    setPaying(true);

    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hour = date.getHours();
    const uniqueid = `${hour}_${day}_${month}_${year}`;
    const transid = 'trn-' + Math.ceil((Math.random() + 1) * 100000)
    const newBooking = {
      idd: 'fru-' + Math.ceil((Math.random() + 1) * 10000),
      service: selectedService.name,
      date,
      transid,
      made: date.toDateString(),
      time: date.toLocaleTimeString(),
      uniqueid,
      price: selectedService.price,
      status: 'pending',
      userid: user.userid,
      name: user.name,
      email: user.email,
      serviceid: selectedService.id,
    };

    try {
      const q = query(
        collection(db, 'bookings'),
        where('serviceid', '==', newBooking.serviceid),
        where('uniqueid', '==', uniqueid)
      );

      const existing = await getDocs(q);
      if (!existing.empty) {
        Alert.alert('Already Booked', 'This time slot is already taken.');
        setPaying(false);
        return;
      }

      const newBookingRef = await addDoc(collection(db, 'bookings'), {
        ...newBooking,
        createdAt: serverTimestamp(),
      });

      await addDoc(collection(db, 'transactions'), {
        userid: user.userid,
        email: user.email,
        transid,
        service: newBooking.service,
        price: newBooking.price,
        bookid: newBooking.idd,
        status: 'initiated',
        datepaid: new Date().toLocaleDateString(),
        timepaid: new Date().toLocaleTimeString(),
        createdAt: serverTimestamp(),
      });

      const allBookings = await getDocs(collection(db, 'bookings'));
      const total = allBookings.docs.length;

      await updateDoc(doc(db, 'users', user.userid), {
        bookings: total,
        lastbookingid: newBooking.idd,
      });

      setUser({
        ...user,
        bookings: total,
        lastbookingid: newBooking.idd,
      });

      Alert.alert('Success', 'Booking confirmed!');
      router.push('./cus_bookings');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong.');
    }

    setPaying(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>💅 Book a Frulo Service</Text>

      <Text style={styles.label}>Choose a Service</Text>
      <View style={styles.serviceList}>
        {services.map((service) => {
          const isSelected = selectedService?.id === service.id;
          return (
            <TouchableOpacity
              key={service.id}
              style={[styles.serviceCard, isSelected && styles.selectedCard]}
              onPress={() => setSelectedService(service)}
            >
              <Text style={[styles.serviceText, isSelected && styles.selectedText]}>
                {service.name.toUpperCase()}{' '}
                <Text style={[styles.priceText, { color: isSelected ? '#ffccdd' : 'green' }]}>
                  ₦{service.price.toLocaleString()}
                </Text>
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedService && (
        <>
          <Text style={styles.label}>Select Date & Time</Text>

          <TouchableOpacity style={styles.pickButton} onPress={() => setShowPicker(true)}>
            <Text style={styles.pickButtonText}>📅 Pick Date & Time</Text>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={showPicker}
            mode="datetime"
            date={date}
            minimumDate={new Date()}
            display={Platform.OS?'inline':'calendar'}
            onConfirm={handleDateConfirm}
            onCancel={() => setShowPicker(false)}
          />

          <Text style={styles.selectedDate}>
            Selected: {date.toLocaleDateString()} at {date.toLocaleTimeString()}
          </Text>

          {!paying ? (
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Pay ₦{selectedService.price.toLocaleString()}</Text>
            </TouchableOpacity>
          ) : (
            <ActivityIndicator size="large" color="black" style={{ marginVertical: 20 }} />
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fffafc',
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#ff4081',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
    color: '#333',
  },
  serviceList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  serviceCard: {
    backgroundColor: '#f8f8f8',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    margin: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedCard: {
    backgroundColor: '#ff4081',
    borderColor: '#ff4081',
  },
  serviceText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
  },
  selectedText: {
    color: '#fff',
  },
  priceText: {
    fontSize: 10,
  },
  pickButton: {
    backgroundColor: '#03a9f4',
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  pickButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  selectedDate: {
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#6200ee',
    padding: 14,
    borderRadius: 10,
    marginVertical: 20,
    alignSelf: 'center',
    width: '70%',
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
