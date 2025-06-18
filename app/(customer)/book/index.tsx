import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useBookingStore } from '@/store/bookingStore';
import { serviceStore } from '@/store/serviceStore';
import type { Service } from '@/store/serviceStore';
// import PaystackWebView from 'react-native-paystack-webview';
import {
  collection,
  doc,
  query,
  where,
  updateDoc,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRoleStore } from '@/store/roleStore';

type Booking = {
  id: string; // ← Fix here
  service: string;
  name: string;
  email: string;
  uniqueid: string;
  serviceid: string;
  made: string;
  date: Date;
  time: string;
  price: number;
  status: 'pending' | 'approved' | 'rejected';
  userid: string;
};

export default function Book() {
  const router = useRouter();
  const addBooking = useBookingStore((s) => s.addBooking);
  const services = serviceStore((s) => s.services);
  const user = useRoleStore((s) => s.user);
  const setUser = useRoleStore((s) => s.setUser);
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

  const [selectedService, setSelectedService] = useState<Service>(null);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleSubmit = async () => {
    setPaying(true);
    // this bypasses paystack payment and assumes payment has been made
    if (!selectedService) {
      return Alert.alert('Missing Info', 'Please select a service');
    }

    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hour = date.getHours();
    const uniqueid = hour + '_' + day + '_' + month + '_' + year;
    console.log(date.toDateString())
    // create a string for day and hr ,this will make bookings day and hour unique
    const newBooking: Booking = {
      id: 'fru-' + Math.ceil((Math.random() + 1) * 10000),
      service: selectedService.name,
      date,
      made:date.toDateString(),
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
      const { serviceid, name, date, userid, email } = newBooking;

      // 1. Check for existing booking with same service and timestamp
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('serviceid', '==', serviceid),
        where('uniquid', '==', uniqueid)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        Alert.alert('Time Unavailable', 'This booking time is already taken.');
        return;
      }

      // 2. Store the booking
      const newBookingRef = await addDoc(bookingsRef, {
        ...newBooking,
        createdAt: serverTimestamp(),
        status: 'pending', // or 'confirmed'
      });

      // 3. Create payment transaction (optional sample)
      await addDoc(collection(db, 'transactions'), {
        userid,
        bookingid: newBookingRef.id,
        service: newBooking.service,
        serviceid,
        email,
        name,
        price: newBooking.price || 0,
        date,
        uniqueid,
        datepaid:new Date().toLocaleDateString(),
        timepaid:new Date().toLocaleTimeString(),
        status: 'initiated',
        createdAt: serverTimestamp(),
      });
      const bookingsSnapshot = await getDocs(collection(db, 'bookings'));
      const bookings = bookingsSnapshot.docs.map((doc) => ({
        userid: user.userid,
        ...doc.data(),
      })) as Booking[];

      const userRef = doc(db, 'users', user.userid);

      await updateDoc(userRef, {
        bookings: bookings.length,
        lastbookingid:newBooking.id
      })
        .then(() => {
          console.log('Firestore user document updated');
        })
        .catch((error) => {
          console.error('Error updating user doc:', error);
        });
        setUser({...user,bookings: bookings.length,
        lastbookingid:newBooking.id})
      Alert.alert('Success', 'Your payment was successful');
      router.push("./cus_bookings")
    } catch (error) {
      console.error('Booking Error:', error);
      Alert.alert(
        'Error',
        'Something went wrong while processing your booking.'
      );
    }
    setPaying(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>💅 Book a Frulo Service </Text>
      <Text style={styles.label}>Select a Service</Text>
      <View style={styles.serviceList}>
        {services.map((service) => {
          const isSelected = selectedService === service;
          return (
            <TouchableOpacity
              key={service.id}
              onPress={() => setSelectedService(service)}
              style={[styles.serviceCard, isSelected && styles.selectedCard]}
            >
              <Text
                style={[styles.serviceText, isSelected && styles.selectedText]}
              >
                {service.name.toUpperCase()}{' '}
                <Text
                  style={[
                    styles.small,
                    {
                      color:
                        selectedService?.id === service.id ? 'pink' : 'green',
                    },
                  ]}
                >
                  {' '}
                  ₦{service.price.toLocaleString()}
                </Text>
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedService && (
        <View>
          <Text style={styles.label}>Select Date & Time</Text>
          <TouchableOpacity
            style={styles.pickButton}
            onPress={() => setShowPicker(true)}
          >
            <Text style={styles.pickButtonText}>📅 Pick Date & Time</Text>
          </TouchableOpacity>

          {showPicker && (
            <View
              style={{ backgroundColor: '#222', borderRadius: 10, padding: 8 }}
            >
              <Text
                onPress={() => setShowPicker(false)}
                style={[
                  {
                    textAlign: 'right',
                    color: 'red',
                    paddingRight: 4,
                    fontSize: 17,
                  },
                ]}
              >
                Close
              </Text>
              <DateTimePicker
                value={date}
                mode="datetime"
                minimumDate={new Date()}
                // display={Platform.OS === 'ios' ? 'inline' : 'default'}
                display={'inline'}
                onChange={(e, selected) => {
                  if (selected) setDate(selected);
                }}
                themeVariant={Platform.OS === 'android' ? 'dark' : undefined} // Android only
              />
            </View>
          )}

          <Text style={[styles.selectedDate, { marginTop: 25 }]}>
            {date.toLocaleDateString()} at {date.toLocaleTimeString()}
          </Text>

          {/* <Text style={{ fontSize: 18, marginBottom: 10 }}>
            Pay ₦{selectedService.price.toLocaleString()}
          </Text> */}

          {!paying ? (
            // <Button title="Pay with Paystack" onPress={() => setPaying(true)} />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>
                Pay ₦{selectedService.price.toLocaleString()}
              </Text>
            </TouchableOpacity>
          ) : (
            <ActivityIndicator size="large" color="black" />
          )}

          {/* {paying && (
            <PaystackWebView
              paystackKey="sk_test_a0881b404241ec3896741b139dea79cec53c58d2"
              billingEmail={user.email}
              amount={selectedService.price}
              onSuccess={(res) => console.log(res)}
              onCancel={() => alert('Payment cancelled')}
              autoStart={true}
            />
          )} */}

          {/* <TouchableOpacity
            style={[styles.submitBtn, { marginTop: 105 }]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitText}>✅ Submit Booking</Text>
          </TouchableOpacity> */}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff6f6',
    padding: 20,
  },
  small: { fontSize: 10 },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ff4081',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 14,
    borderRadius: 8,
    width: 150,
    margin: 'auto',
    marginBottom: 50,
  },
  buttonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
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
    fontSize: 12,
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
