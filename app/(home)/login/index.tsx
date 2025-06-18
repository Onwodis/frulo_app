import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import {signInWithEmailAndPassword, deleteUser } from 'firebase/auth';
import {
  doc,
  updateDoc,
  getDoc,
  collection,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../../../lib/firebase';
import { useRoleStore } from '../../../store/roleStore';
import type { User } from '../../../store/roleStore';
import { serviceStore } from '../../../store/serviceStore';
import type { Service } from '../../../store/serviceStore';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('samuelonwodi@gmail.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const setUser = useRoleStore((s) => s.setUser);
  const setServices = serviceStore((s) => s.setServices);
  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('❌ Error', 'Please enter both email and password');
    }

    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;

      await user.reload(); // Get latest emailVerified status

      if (!user.emailVerified) {
        const createdTime = new Date(user.metadata.creationTime!);
        const now = new Date();
        const diffInMinutes = Math.floor(
          (now.getTime() - createdTime.getTime()) / 60000
        );

        if (diffInMinutes >= 5) {
          await deleteUser(user);
          return Alert.alert(
            '⚠️ Account Deleted',
            'Email not verified within 5 minutes. Please register again.'
          );
        }

        return Alert.alert(
          '📨 Verify Email',
          'Please check your email to verify your account before logging in.'
        );
      }

      const userRef = doc(db, 'users', user.uid);
      const snapshot = await getDoc(userRef);

      if (snapshot.exists()) {
        const currentLoginCount = snapshot.data().loginCount || 0;

        await updateDoc(userRef, {
          lastSeen: serverTimestamp(),
          loginCount: currentLoginCount + 1,
        });
      }
      const firestoreUser = snapshot.data();
      const serviceSnapshot = await getDocs(collection(db, 'services'));
      const services = serviceSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Service[];

      setServices(services);

      const userData: User = {
        verified: firestoreUser.emailVerified,
        emailVerified: firestoreUser.emailVerified,
        userid: firestoreUser.userid,
        password: 'no password',
        lastseen: firestoreUser.lastseen,
        lastbookingid: firestoreUser.lastbookingid,
        logintimes: firestoreUser.logintimes,
        createdAt: firestoreUser.createdAt,
        totalpayment: firestoreUser.totalpayment,
        bookings: firestoreUser.bookings,
        role: firestoreUser.role,
        email: firestoreUser.email,
        name: firestoreUser.name,
        admin: firestoreUser.admin,
      };
      
      await updateDoc(userRef, {
        lastseen: new Date(),
        // emailVerified: user.emailVerified,
        logintimes: userData.logintimes + 1
      }).then(() => {
        console.log('Firestore user document updated');
      }).catch((error) => {
        console.error('Error updating user doc:', error);
      });

      setUser(userData);
      Alert.alert('✅ Success', `Welcome back ${user.email}`);
      return !userData.admin ? router.replace('/(customer)/db'):router.replace('/vendordb');
    } catch (error: any) {
      Alert.alert('❌ Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      backgroundColor: '#fff9f0',
      justifyContent: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: '900',
      color: '#6200ee',
      textAlign: 'center',
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: '#777',
      textAlign: 'center',
      marginBottom: 24,
    },
    input: {
      backgroundColor: '#fff',
      padding: 14,
      borderRadius: 10,
      marginBottom: 16,
      borderColor: '#eee',
      borderWidth: 1,
    },
    button: {
      backgroundColor: '#4CAF50',
      padding: 14,
      borderRadius: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Welcome to Frulo</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Email (e.g. user@frulo.com)"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#999"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#999"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>🚀 Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
