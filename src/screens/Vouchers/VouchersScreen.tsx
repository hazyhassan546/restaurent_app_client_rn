import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function VouchersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vouchers</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fb',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
});
