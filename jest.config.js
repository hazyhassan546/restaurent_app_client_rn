module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|@react-navigation|react-clone-referenced-element|@react-native-community|react-native-svg|react-native-gesture-handler|react-native-screens|react-native-safe-area-context))',
  ],
};
