import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../lib/firebase';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // default admin bypass
  const handleRegister = async () => {
    if (!name || !email || !password) {
      return Alert.alert('❌ Error', 'All fields are required');
    }

    // if (!email.endsWith('@frulo.com')) {
    //   return Alert.alert('🚫 Invalid Email', 'Use a @frulo.com email');
    // }
    setLoading(true);

    try {
      // 1. Register with Firebase Auth
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCred.user;
      // 2. Save user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        userid: user.uid,
        name,
        email,
        isClient:true,
        password,
        bookings: 0,
        logintimes: 1,
        totalpayment: 0,
        lastbookingid: 'nil',
        role: 'customer',
        verified: false,
        lastseen: new Date(),
        createdAt: new Date(),
      });
      // user.emailVerified //this auto checks if user is verified
      await sendEmailVerification(user);

      Alert.alert(
        '✅ Success',
        'Account created! Please verify your email before logging in.'
      );
      router.push('/')
      
    } catch (err: any) {
      Alert.alert('❌ Registration Error', err.message);
    }
    setLoading(false);
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff5f5',
      padding: 24,
      justifyContent: 'center',
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#6200ee',
      marginBottom: 24,
      textAlign: 'center',
    },
    input: {
      backgroundColor: '#fff',
      padding: 14,
      borderRadius: 10,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    registerBtn: {
      backgroundColor: '#4caf50',
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
    },
    registerText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Create a Frulo Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Email (you@frulo.com)"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#888"
      />

      <TouchableOpacity
        disabled={loading}
        style={styles.registerBtn}
        onPress={handleRegister}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.registerText}>🚀 Register</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
