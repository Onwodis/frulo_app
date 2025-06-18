import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Button,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useBookingStore } from '@/store/bookingStore';
import { serviceStore } from '@/store/serviceStore';
import type { Service } from '@/store/serviceStore';
// import PaystackWebView from 'react-native-paystack-webview';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRoleStore } from '@/store/roleStore';
import Paystack from 'react-native-paystack-webview';
const PaystackWebView = Paystack as unknown as React.ComponentType<any>;

// Available service list
const SERVICES = ['Haircut', 'Massage', 'Facial', 'Manicure', 'Beard Trim'];

type Booking = {
  id: string; // ← Fix here
  service: string;
  cust_id: string;
  date: Date;
  time: string;
  status: 'pending' | 'approved' | 'rejected';
  userId: string;
};

export default function Book() {
  const router = useRouter();
  const addBooking = useBookingStore((s) => s.addBooking);
  const services = serviceStore((s) => s.services);
  const { bookings } = useBookingStore();
  const user = useRoleStore((s) => s.user);
  const [paying, setPaying] = useState(false);

  const amount = 5000; // in naira

  const handleSuccess = async (response: any) => {
    setPaying(false);
    // Save transaction to Firestore
    try {
      await addDoc(collection(db, 'transactions'), {
        userid: user.userid,
        email: user.email,
        amount: amount,
        reference: response.data.reference,
        status: 'success',
        createdAt: new Date(),
      });
      alert('Payment successful!');
    } catch (err) {
      console.error(err);
      alert('Payment succeeded but failed to log transaction.');
    }
  };

  const getStatusStyle = (status: any) => ({
    color:
      status === 'approved'
        ? 'green'
        : status === 'rejected'
        ? 'red'
        : 'orange',
    fontWeight: 'bold',
    textTransform: 'capitalize',
    textAlign: 'center',
  });

  const [selectedService, setSelectedService] = useState<Service>(null);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleSubmit = () => {
    if (!selectedService) {
      return Alert.alert('Missing Info', 'Please select a service');
    }

    // Check if time is already taken
    const isConflict = bookings.some(
      (b) =>
        b.date.toDateString() === date.toDateString() &&
        b.time === date.toLocaleTimeString()
    );

    if (isConflict) {
      return Alert.alert(
        'Oops! Time Unavailable',
        'Sorry, that time has already been booked. Please choose another time.'
      );
    }

    const newBooking: Booking = {
      id: Date.now().toString(),
      service: selectedService.name,
      date,
      time: date.toLocaleTimeString(),
      status: 'pending',
      userId: 'customer1',
      cust_id: 'customer1',
    };

    addBooking(newBooking);
    router.push('/cus_success');
  };
  const handleCancel = (id: string) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            useBookingStore.getState().removeBooking(id);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💅 My Bookings </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('./book')}
      >
        <Text style={styles.buttonText}>Book a Service</Text>
      </TouchableOpacity>
      {/* <Text style={styles.label}>Bookings</Text> */}

      {bookings.length > 0 ? (
        <View>
          <ScrollView horizontal style={styles.scroll}>
            <View style={styles.table}>
              {/* Header Row */}
              <View style={[styles.row, styles.header]}>
                <Text style={[styles.cell, styles.headerText]}>Service</Text>
                <Text style={[styles.cell, styles.headerText]}>Date</Text>
                <Text style={[styles.cell, styles.headerText]}>Time</Text>
                <Text style={[styles.cell, styles.headerText]}>Status</Text>
                <Text style={[styles.cell, styles.headerText]}>Action</Text>
              </View>

              {/* Booking Rows */}
              <View>
                <Text>Bookings</Text>
              </View>

              {bookings && bookings.length > 0 ? (
                bookings.map((booking, index) => (
                  <View key={booking.id} style={styles.row}>
                    <Text style={styles.cell}>{booking.service}</Text>
                    {/* <Text style={styles.cell}>{booking.date.toDateString()}</Text> */}
                    <Text style={styles.cell}>{booking.time}</Text>
                    <Text
                      style={[
                        styles.cell,
                        {
                          color:
                            booking.status === 'approved'
                              ? 'green'
                              : booking.status === 'rejected'
                              ? 'red'
                              : 'orange',
                          fontWeight: 'bold',
                          textTransform: 'capitalize',
                          textAlign: 'center',
                        },
                      ]}
                    >
                      {booking.status}
                    </Text>
                    <View style={styles.cell}>
                      <TouchableOpacity
                        onPress={() => handleCancel(booking.id)}
                        style={styles.cancelBtn}
                      >
                        <Text style={styles.cancelText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <View>
                  <Text>No Bookings yet !</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      ) : (
        <Text
          style={[
            styles.label,
            { textAlign: 'center', justifyContent: 'center', display: 'flex' },
          ]}
        >
          No Bookings yet !
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff6f6',
    padding: 20,
    // justifyContent: 'center',
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 14,
    borderRadius: 8,
    width:150,
    marginLeft:"auto",
    marginBottom:50
  },
  buttonText: { color: '#fff', fontSize: 16,textAlign:"center" },
  small: { fontSize: 10 },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ff4081',
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
    color: '#333',
  },
  serviceList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    marginBottom: 24,
  },
  serviceCard: {
    backgroundColor: '#f1f1f1',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    margin: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedCard: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },
  serviceText: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
  selectedText: {
    color: '#fff',
  },
  pickButton: {
    backgroundColor: '#03a9f4',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  pickButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  selectedDate: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginBottom: 24,
  },
  submitBtn: {
    backgroundColor: '#4caf50',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scroll: {
    flexGrow: 0,
    marginTop: 10,
  },
  table: {
    minWidth: 700,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  header: {
    backgroundColor: '#f4f4f4',
  },
  headerText: {
    fontWeight: 'bold',
    color: '#444',
  },
  cell: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    textAlign: 'center',
  },
  cancelBtn: {
    backgroundColor: '#f44336',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    alignSelf: 'center',
  },
  cancelText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
