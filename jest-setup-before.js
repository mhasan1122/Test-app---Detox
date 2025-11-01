// Disable Expo Winter feature in tests
process.env.EXPO_USE_WINTER = 'false';
process.env.__EXPO_E2E_TEST = 'true';

// Mock Expo Winter runtime before anything else
jest.mock('expo/src/winter/runtime.native', () => ({}), { virtual: true });
jest.mock('expo/src/winter/installGlobal', () => ({}), { virtual: true });

// Mock Expo messageSocket that jest-expo tries to import
jest.mock('expo/src/async-require/messageSocket', () => ({}), { virtual: true });

// Mock Expo Winter import.meta registry
global.__ExpoImportMetaRegistry = {
  register: jest.fn(),
  get: jest.fn(() => ({ assets: [] })),
};

// Mock global CSS and NativeWind styles before anything else
// This prevents NativeWind's Babel plugin from injecting _ReactNativeCSSInterop
global.__NATIVE_WIND_STYLE_ID__ = 1;
global.__CSS_INTEROP__ = {};

jest.mock('./global.css', () => ({}), { virtual: true });
jest.mock('react-native-css-interop', () => ({}), { virtual: true });

// Mock expo modules that use Winter
jest.mock('expo', () => ({
  __esModule: true,
}));

