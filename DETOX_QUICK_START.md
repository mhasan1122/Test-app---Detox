# Detox Quick Start Guide

Quick reference for running Detox E2E tests in the Todo App.

## 🚀 Quick Setup (First Time Only)

### 1. Fix npm permissions (if needed)
```bash
sudo chown -R $(whoami) ~/.npm
```

### 2. Install Detox CLI globally
```bash
npm install -g detox-cli
```

### 3. Install project dependencies
```bash
npm install
```

### 4. Install iOS tools (macOS only)
```bash
brew tap wix/brew
brew install applesimutils
```

### 5. Prebuild native projects
```bash
npm run prebuild
cd ios && pod install && cd ..
```

## 🧪 Running Tests

### iOS Tests
```bash
# Build the app
npm run detox:build:ios

# Run tests
npm run detox:test:ios
```

### Android Tests
```bash
# Start emulator first
emulator -avd Pixel_4_API_30

# Build the app
npm run detox:build:android

# Run tests
npm run detox:test:android
```

## 📝 Available Scripts

- `npm run detox:build:ios` - Build iOS app for testing
- `npm run detox:test:ios` - Run iOS E2E tests
- `npm run detox:build:android` - Build Android app for testing
- `npm run detox:test:android` - Run Android E2E tests
- `npm run detox:test:ios:release` - Run iOS tests (release build)
- `npm run detox:test:android:release` - Run Android tests (release build)

## 🔍 Running Specific Tests

```bash
# Run specific test file
detox test --configuration ios.sim.debug e2e/TodoApp.e2e.test.js

# Run tests matching a pattern
detox test --configuration ios.sim.debug --grep "should add a new todo"

# Run with verbose output
detox test --configuration ios.sim.debug --loglevel trace
```

## 🛠️ Common Commands

### Check available simulators (iOS)
```bash
xcrun simctl list devices available
```

### Check available emulators (Android)
```bash
emulator -list-avds
```

### Reset iOS simulator
```bash
xcrun simctl shutdown all
xcrun simctl erase all
```

### Clear Android emulator data
```bash
adb shell pm clear com.myexpoapp
```

## 🐛 Quick Troubleshooting

### iOS: "applesimutils not found"
```bash
brew tap wix/brew
brew install applesimutils
```

### Android: SDK not found
Add to `~/.zshrc`:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Tests timeout
Increase timeout in `e2e/jest.config.js`:
```javascript
testTimeout: 180000
```

### Build fails
```bash
# Clean and rebuild
npm run prebuild -- --clean
cd ios && pod install && cd ..
npm run detox:build:ios
```

## 📚 Test Coverage

Current E2E tests cover:
- ✅ Initial app state
- ✅ Adding single/multiple todos
- ✅ Deleting todos
- ✅ Input field behavior
- ✅ Empty todo prevention
- ✅ Long text handling
- ✅ Rapid additions

## 📖 Full Documentation

For detailed documentation, see [DETOX_SETUP_GUIDE.md](./DETOX_SETUP_GUIDE.md)

## 🎯 Test IDs Reference

Components use these testIDs for E2E testing:

- `todo-input` - Text input field
- `add-todo-button` - Add button
- `task-count` - Task counter text
- `todo-list` - FlatList containing todos
- `delete-todo-button` - Delete button (use `.atIndex(n)` for specific item)
- `empty-state` - Empty state message
- `todo-item-{id}` - Individual todo item container
- `todo-text-{id}` - Todo item text

## 💡 Tips

1. Always rebuild after changing native code
2. Use `device.reloadReactNative()` between tests for clean state
3. Keep simulators/emulators running to speed up test execution
4. Use `--loglevel trace` for debugging failing tests
5. Check test output for screenshots on failures

---

**Need help?** See the full guide: [DETOX_SETUP_GUIDE.md](./DETOX_SETUP_GUIDE.md)

