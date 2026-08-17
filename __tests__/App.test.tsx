/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

import App from '../App';

test('renders signup screen for unauthenticated users', async () => {
  let component: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    component = ReactTestRenderer.create(<App />);
  });

  expect(component!.root.findByProps({ testID: 'signup-screen' })).toBeTruthy();
});
