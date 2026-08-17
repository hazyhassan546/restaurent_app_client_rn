import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AppNavigator';
import { saveOtpDetails } from '../../auth/storage';
import { initLogin } from '../../api/auth/auth';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

const generateOtp = () =>
  Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');

export default function SignUpScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const trimmedPhone = phoneNumber.trim();

    if (!trimmedName || !trimmedPhone) {
      Alert.alert(
        'Missing details',
        'Please enter your name and phone number.',
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await initLogin({
        name: trimmedName,
        phone: trimmedPhone,
      });

      console.log('response', response);
      if (response.success === true) {
        Alert.alert(
          'OTP sent',
          response?.message || 'A one-time code has been sent to your phone.',
        );
        navigation.navigate('Otp', { name: trimmedName, phone: trimmedPhone });
      } else {
        Alert.alert(
          'Error',
          response?.message || 'Failed to send OTP. Please try again later.',
        );
      }
    } catch (error: any) {
      console.log('error', error);
      Alert.alert(
        'Error',
        error?.response?.data?.errors[0]?.message ||
          'An error occurred. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container} testID="signup-screen">
      <Text style={styles.title}>Create account</Text>
      <Text style={styles.subtitle}>
        Enter your details to receive a one-time code.
      </Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Full name"
        autoCapitalize="words"
        style={styles.input}
      />

      <TextInput
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Phone number"
        keyboardType="phone-pad"
        style={styles.input}
      />

      <Button
        title={isSubmitting ? 'Sending OTP...' : 'Send OTP'}
        onPress={handleSubmit}
        disabled={isSubmitting}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f5f7fb',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
  },
});
