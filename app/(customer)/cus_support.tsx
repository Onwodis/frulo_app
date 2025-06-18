import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Linking,
  Alert,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Support() {
  const [message, setMessage] = useState('');
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const handleSend = () => {
    if (!message.trim()) {
      Alert.alert('Support', 'Please enter your message');
      return;
    }

    Alert.alert('Support Request Sent', 'Thanks! We’ll get back to you shortly.');
    setMessage('');
  };

  const openWhatsApp = () => {
    Linking.openURL('https://wa.me/2348123456789');
  };

  const openEmail = () => {
    Linking.openURL('mailto:support@frulo.com');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[
        styles.container,
        { backgroundColor: !isDark ? '#1a1a1a' : '#f9f9f9' },
      ]}
    >
      <Text style={[styles.title, { color:  '#fffh'  }]}>
        🛠️ Customer Support
      </Text>
      <Text style={[styles.subtitle, { color: '#555' }]}>
        How can we help you today?
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor:  '#fff',
            color: '#000',
          },
        ]}
        multiline
        numberOfLines={5}
        placeholder="Write your message here..."
        placeholderTextColor="#999"
        value={message}
        onChangeText={setMessage}
      />

      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Text style={styles.sendText}>📨 Submit Request</Text>
      </TouchableOpacity>

      <View style={styles.quickContact}>
        <Text style={{ color: '#888', marginBottom: 8 }}>Or contact us directly:</Text>

        <TouchableOpacity style={styles.contactRow} onPress={openWhatsApp}>
          <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
          <Text style={styles.contactText}>Chat on WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactRow} onPress={openEmail}>
          <Ionicons name="mail" size={22} color="#f44336" />
          <Text style={styles.contactText}>Email us: support@frulo.com</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  sendButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  quickContact: {
    marginTop: 32,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  contactText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#333',
  },
});
