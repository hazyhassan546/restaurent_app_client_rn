import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AppNavigator';
import {
  clearOtpDetails,
  getOtpDetails,
  saveAuthTokens,
  saveOtpDetails,
} from '../../auth/storage';
import { initLogin, verifyOtp } from '../../api/auth/auth';
import { useAuth } from '../../providers/authContextProvider';

type Props = NativeStackScreenProps<AuthStackParamList, 'Otp'> & {};

const generateOtp = () =>
  Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');

export default function OtpScreen({ route, navigation }: Props) {
  const { loginSuccess } = useAuth();

  const { phone, name } = route.params;

  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const resendOtp = async () => {
    setIsResending(true);

    try {
      const response = await initLogin({
        name: name,
        phone: phone,
      });

      if (response.success === true) {
        Alert.alert(
          'OTP sent',
          response?.message || 'A one-time code has been sent to your phone.',
        );
      } else {
        Alert.alert(
          'Error',
          response?.message || 'Failed to send OTP. Please try again later.',
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.response?.data?.errors[0]?.message ||
          'An error occurred. Please try again.',
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleVerification = async () => {
    const trimmedOtp = otp.trim();

    if (trimmedOtp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit code sent to you.');
      return;
    }

    setIsVerifying(true);

    try {
      const response = await verifyOtp({
        phone: phone,
        otp: trimmedOtp,
      });

      const authToken = response?.access_token;
      const refreshToken = response?.refresh_token;
      await saveAuthTokens(authToken, refreshToken);
      await clearOtpDetails();
      loginSuccess();
    } catch (error: any) {
      console.log(error);
      Alert.alert(
        'Authentication failed',
        error?.response?.data?.message || 'Something went wrong.',
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>
        Hi {name}, we sent a 6-digit code to {phone}.
      </Text>

      <TextInput
        value={otp}
        onChangeText={setOtp}
        placeholder="Enter 6-digit OTP"
        keyboardType="number-pad"
        maxLength={6}
        style={styles.input}
      />

      <Button
        title={isVerifying ? 'Verifying...' : 'Verify OTP'}
        onPress={handleVerification}
        disabled={isVerifying}
      />

      <View style={styles.resendContainer}>
        <Button
          title={isResending ? 'Resending...' : 'Resend OTP'}
          onPress={resendOtp}
          disabled={isResending}
        />
      </View>

      <Button title="Back" onPress={() => navigation.goBack()} />
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
    marginBottom: 20,
    fontSize: 18,
    letterSpacing: 4,
    textAlign: 'center',
  },
  resendContainer: {
    marginVertical: 12,
  },
});
