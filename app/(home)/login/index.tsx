import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  signInWithEmailAndPassword,
  deleteUser,
} from 'firebase/auth';
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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useRoleStore((s) => s.setUser);
  const setServices = serviceStore((s) => s.setServices);

  // Animations
  const titleAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(formAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('❌ Error', 'Please enter both email and password');
    }

    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;

      await user.reload(); // update emailVerified

      if (!user.emailVerified) {
        const createdTime = new Date(user.metadata.creationTime!);
        const now = new Date();
        const diff = Math.floor((now.getTime() - createdTime.getTime()) / 60000);
        if (diff >= 5) {
          await deleteUser(user);
          return Alert.alert('⚠️ Account Deleted', 'Email not verified within 5 minutes. Please register again.');
        }
        return Alert.alert('📨 Verify Email', 'Please verify your email to continue.');
      }

      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      const firestoreUser = snap.data();

      const serviceSnap = await getDocs(collection(db, 'services'));
      const services = serviceSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Service[];
      setServices(services);

      const userData: User = {
        emailVerified: firestoreUser.emailVerified,
        verified: firestoreUser.emailVerified,
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
        logintimes: userData.logintimes + 1,
      });

      setUser(userData);
      Alert.alert('✅ Success', `Welcome back ${user.email}`);
      return userData.admin ? router.replace('/vendordb') : router.replace('/(customer)/db');
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
      <Animated.Text
        style={[
          styles.title,
          {
            opacity: titleAnim,
            transform: [
              {
                translateY: titleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        🔐 Welcome to Frulo
      </Animated.Text>
      <Animated.Text
        style={[
          styles.subtitle,
          {
            opacity: formAnim,
            transform: [
              {
                translateY: formAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
          },
        ]}
      >
        Login to continue
      </Animated.Text>

      <Animated.View style={{ opacity: formAnim }}>
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
      </Animated.View>
    </View>
  );
}
