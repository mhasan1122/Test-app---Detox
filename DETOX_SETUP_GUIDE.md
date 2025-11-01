# Detox E2E Testing Setup Guide

This guide will help you set up and run Detox end-to-end tests for the Todo App.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Initial Setup](#initial-setup)
4. [Running Tests](#running-tests)
5. [Troubleshooting](#troubleshooting)
6. [Writing New Tests](#writing-new-tests)

## Prerequisites

### For iOS Testing

- macOS with Xcode installed (version 14.0 or higher)
- Xcode Command Line Tools: `xcode-select --install`
- CocoaPods: `sudo gem install cocoapods`
- iOS Simulator
- Node.js (version 16 or higher)
- Homebrew (for installing additional tools)

### For Android Testing

- Android Studio installed
- Android SDK and Platform Tools
- Android Emulator configured
- Node.js (version 16 or higher)
- Java Development Kit (JDK 11 or higher)

## Installation

### Step 1: Fix npm Cache Permissions (if needed)

If you encounter permission issues with npm, run:

```bash
sudo chown -R $(whoami) ~/.npm
```

### Step 2: Install Detox CLI Globally

```bash
npm install -g detox-cli
```

### Step 3: Install Project Dependencies

```bash
cd /Users/mirzahasan/Documents/Detox\ testing/todoapp
npm install --save-dev detox detox-expo-helpers jest-circus
```

### Step 4: Install iOS Dependencies (macOS only)

```bash
# Install applesimutils (required for Detox on iOS)
brew tap wix/brew
brew install applesimutils
```

## Initial Setup

### Step 1: Prebuild Native Projects

Since this is an Expo project, you need to generate the native iOS and Android projects:

```bash
npm run prebuild
```

This will create `ios/` and `android/` directories with native code.

### Step 2: Install iOS Dependencies

```bash
cd ios
pod install
cd ..
```

### Step 3: Verify Detox Configuration

Check that `.detoxrc.js` exists in the project root. It should contain configurations for both iOS and Android.

### Step 4: Update Device Configuration (Optional)

In `.detoxrc.js`, you can update the device settings:

For iOS:
```javascript
simulator: {
  type: 'ios.simulator',
  device: {
    type: 'iPhone 15', // Change to your preferred simulator
  },
}
```

For Android:
```javascript
emulator: {
  type: 'android.emulator',
  device: {
    avdName: 'Pixel_4_API_30', // Change to your AVD name
  },
}
```

To list available iOS simulators:
```bash
xcrun simctl list devices available
```

To list available Android emulators:
```bash
emulator -list-avds
```

## Running Tests

### iOS Testing

#### 1. Build the App for Testing

```bash
npm run detox:build:ios
```

This will compile the iOS app in debug mode.

#### 2. Run the Tests

```bash
npm run detox:test:ios
```

This will:
- Launch the iOS simulator
- Install the app
- Run all E2E tests
- Generate a test report

#### 3. Run Tests in Release Mode (Optional)

```bash
npm run detox:build:ios:release
npm run detox:test:ios:release
```

### Android Testing

#### 1. Start Android Emulator

Make sure an Android emulator is running before building:

```bash
# List available emulators
emulator -list-avds

# Start an emulator (replace with your AVD name)
emulator -avd Pixel_4_API_30
```

Or start it from Android Studio.

#### 2. Build the App for Testing

```bash
npm run detox:build:android
```

#### 3. Run the Tests

```bash
npm run detox:test:android
```

### Running Specific Tests

To run a specific test file:

```bash
detox test --configuration ios.sim.debug e2e/TodoApp.e2e.test.js
```

To run tests matching a specific pattern:

```bash
detox test --configuration ios.sim.debug --grep "should add a new todo"
```

## Test Structure

The E2E tests are located in the `e2e/` directory:

```
e2e/
├── jest.config.js      # Jest configuration for E2E tests
├── setup.js            # Test setup and hooks
└── TodoApp.e2e.test.js # Main E2E test suite
```

### Current Test Coverage

The test suite includes the following scenarios:

1. **Initial State**: Verifies app loads with correct initial state
2. **Add Todo**: Tests adding a single todo item
3. **Add Multiple Todos**: Tests adding several todo items
4. **Delete Todo**: Tests deleting a specific todo
5. **Clear Input**: Verifies input field clears after adding todo
6. **Empty Todo Prevention**: Tests that empty todos are not added
7. **Todo Order**: Verifies todos are displayed in reverse chronological order
8. **Long Text Handling**: Tests handling of long todo text
9. **Specific Deletion**: Tests deleting a specific todo from multiple items
10. **Rapid Additions**: Tests adding multiple todos quickly

## Troubleshooting

### iOS Issues

#### Issue: "xcrun: error: unable to find utility"

**Solution**: Install Xcode Command Line Tools:
```bash
xcode-select --install
```

#### Issue: "applesimutils: command not found"

**Solution**: Install applesimutils:
```bash
brew tap wix/brew
brew install applesimutils
```

#### Issue: "No bundle URL present"

**Solution**: Rebuild the app:
```bash
npm run detox:build:ios
```

#### Issue: Simulator not booting

**Solution**: Reset the simulator:
```bash
xcrun simctl shutdown all
xcrun simctl erase all
```

### Android Issues

#### Issue: "SDK location not found"

**Solution**: Set ANDROID_HOME environment variable in `~/.zshrc` or `~/.bash_profile`:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

#### Issue: Emulator fails to start

**Solution**: Start emulator manually first:
```bash
emulator -avd Pixel_4_API_30 -no-snapshot-load
```

#### Issue: "INSTALL_FAILED_INSUFFICIENT_STORAGE"

**Solution**: Clear emulator storage or create a new AVD with more space.

### General Issues

#### Issue: Tests timeout

**Solution**: Increase timeout in `e2e/jest.config.js`:
```javascript
testTimeout: 180000, // Increase from 120000 to 180000
```

#### Issue: "Cannot find testID"

**Solution**: Make sure the component has the correct `testID` prop. Check that the testID in your test matches the testID in the component.

#### Issue: Tests are flaky

**Solution**: 
- Add explicit waits: `await waitFor(element(by.id('...'))).toBeVisible();`
- Ensure device is in a clean state before each test
- Reduce test concurrency: `maxWorkers: 1` in jest.config.js

## Writing New Tests

### Test Structure

```javascript
describe('Feature Name', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should do something', async () => {
    // Your test code here
  });
});
```

### Common Matchers

```javascript
// Visibility
await expect(element(by.id('element-id'))).toBeVisible();
await expect(element(by.id('element-id'))).not.toBeVisible();

// Text matching
await expect(element(by.id('element-id'))).toHaveText('expected text');

// Existence
await expect(element(by.id('element-id'))).toExist();

// Multiple elements
await expect(element(by.id('element-id'))).atIndex(0).toBeVisible();
```

### Common Actions

```javascript
// Tap
await element(by.id('button-id')).tap();

// Type text
await element(by.id('input-id')).typeText('text to type');

// Clear text
await element(by.id('input-id')).clearText();

// Scroll
await element(by.id('scroll-view')).scrollTo('bottom');

// Swipe
await element(by.id('element-id')).swipe('up');

// Wait for element
await waitFor(element(by.id('element-id')))
  .toBeVisible()
  .withTimeout(5000);
```

### Best Practices

1. **Use testID Props**: Always add `testID` props to elements you want to test
2. **Keep Tests Independent**: Each test should be able to run independently
3. **Use Meaningful Test Names**: Describe what the test is verifying
4. **Clean State**: Reset app state between tests using `device.reloadReactNative()`
5. **Explicit Waits**: Use `waitFor` when elements might take time to appear
6. **Avoid Hardcoded Delays**: Use `waitFor` instead of `sleep`
7. **Test User Flows**: Test complete user journeys, not just individual features

## Continuous Integration

To run Detox tests in CI/CD:

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test-ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run prebuild
      - run: cd ios && pod install && cd ..
      - run: brew tap wix/brew && brew install applesimutils
      - run: npm run detox:build:ios
      - run: npm run detox:test:ios
```

## Additional Resources

- [Detox Documentation](https://wix.github.io/Detox/)
- [Detox API Reference](https://wix.github.io/Detox/docs/api/actions)
- [Expo + Detox Guide](https://docs.expo.dev/build-reference/e2e-tests/)
- [Jest Matchers](https://jestjs.io/docs/expect)

## Support

If you encounter issues not covered in this guide:

1. Check the [Detox GitHub Issues](https://github.com/wix/Detox/issues)
2. Review the [Detox Troubleshooting Guide](https://wix.github.io/Detox/docs/introduction/troubleshooting)
3. Ask in the [Expo Discord](https://discord.gg/expo) #help channel

