import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getStoredAuthTokens } from '../auth/storage';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import SignUpScreen from '../screens/Auth/SignupScreen';
import OtpScreen from '../screens/Auth/OtpScreen';
import { useAuth } from '../providers/authContextProvider';

export type AuthStackParamList = {
  SignUp: undefined;
  Otp: { name: string; phone: string };
};

export type AppStackParamList = {
  Home: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

function AuthStackNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="Otp" component={OtpScreen} />
    </AuthStack.Navigator>
  );
}

function AppStackNavigator() {
  return (
    <AppStack.Navigator>
      <AppStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Products' }}
      />
    </AppStack.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <RootStack.Navigator
        key={isAuthenticated ? 'app-stack' : 'auth-stack'}
        initialRouteName={isAuthenticated ? 'App' : 'Auth'}
        screenOptions={{ headerShown: false }}
      >
        {!isAuthenticated ? (
          <RootStack.Screen name="Auth">
            {() => <AuthStackNavigator />}
          </RootStack.Screen>
        ) : null}

        {isAuthenticated ? (
          <RootStack.Screen name="App" component={AppStackNavigator} />
        ) : null}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
