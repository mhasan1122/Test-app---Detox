# Detox Installation Checklist

Follow these steps to complete the Detox setup for your Todo App.

## ✅ Completed (Already Done)

The following have been configured and are ready:

- ✅ Detox configuration file (`.detoxrc.js`)
- ✅ E2E test directory structure (`e2e/`)
- ✅ Jest configuration for E2E tests (`e2e/jest.config.js`)
- ✅ Comprehensive E2E test suite (`e2e/TodoApp.e2e.test.js`)
- ✅ TestIDs added to all components
- ✅ Package.json scripts for Detox
- ✅ App configuration (bundle IDs and package names)
- ✅ Documentation (setup guides and quick start)
- ✅ .gitignore entries for Detox artifacts

## 🔲 Next Steps (You Need To Do)

### Step 1: Fix npm Cache Permissions

Run this command in your terminal:

```bash
sudo chown -R $(whoami) ~/.npm
```

Enter your password when prompted.

### Step 2: Install Detox Dependencies

```bash
cd /Users/mirzahasan/Documents/Detox\ testing/todoapp
npm install
```

If the above command fails, manually install Detox packages:

```bash
npm install --save-dev detox detox-expo-helpers jest-circus
```

### Step 3: Install Detox CLI Globally

```bash
npm install -g detox-cli
```

### Step 4: Install iOS Testing Tools (macOS only)

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install applesimutils
brew tap wix/brew
brew install applesimutils
```

### Step 5: Prebuild Native Projects

```bash
npm run prebuild
```

This will generate the `ios/` and `android/` directories.

### Step 6: Install iOS Dependencies (macOS only)

```bash
cd ios
pod install
cd ..
```

### Step 7: Verify Installation

Check that Detox is properly installed:

```bash
detox --version
```

You should see the Detox version number.

### Step 8: Run Your First Test

#### For iOS:

```bash
# Build the app
npm run detox:build:ios

# Run the tests
npm run detox:test:ios
```

#### For Android:

```bash
# First, start an emulator
emulator -list-avds  # List available emulators
emulator -avd Pixel_4_API_30  # Start your emulator

# In another terminal:
npm run detox:build:android
npm run detox:test:android
```

## 📋 Verification Checklist

After installation, verify everything works:

- [ ] `detox --version` shows version number
- [ ] `npm run prebuild` completes without errors
- [ ] iOS: `xcrun simctl list devices` shows available simulators
- [ ] iOS: `applesimutils --version` shows version number
- [ ] Android: `emulator -list-avds` shows available emulators
- [ ] `npm run detox:build:ios` completes successfully (or android)
- [ ] `npm run detox:test:ios` runs all tests (or android)

## 🆘 If You Encounter Issues

### Issue: npm permission error
**Solution**: Run `sudo chown -R $(whoami) ~/.npm`

### Issue: Xcode Command Line Tools not found
**Solution**: Run `xcode-select --install`

### Issue: CocoaPods not installed
**Solution**: Run `sudo gem install cocoapods`

### Issue: Android SDK not found
**Solution**: Add to your `~/.zshrc` (or `~/.bash_profile`):
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Then run: `source ~/.zshrc`

### Issue: Build fails after prebuild
**Solution**: 
```bash
npm run prebuild -- --clean
cd ios && pod install && cd ..
npm run detox:build:ios
```

## 📚 Documentation Reference

After completing installation:

- **Quick Start**: See `DETOX_QUICK_START.md` for daily use commands
- **Full Guide**: See `DETOX_SETUP_GUIDE.md` for detailed documentation
- **Test Files**: Located in `e2e/TodoApp.e2e.test.js`
- **Configuration**: See `.detoxrc.js` for Detox settings

## 🎯 What Gets Tested

Your E2E test suite includes:

1. App launches with correct initial state
2. Adding single and multiple todo items
3. Deleting todo items
4. Input field clears after adding todo
5. Prevention of empty todos
6. Todo display order (newest first)
7. Long text handling
8. Specific todo deletion from a list
9. Rapid successive additions

## 🚀 Next Steps After Installation

Once installation is complete:

1. Review the E2E tests in `e2e/TodoApp.e2e.test.js`
2. Run the tests to ensure everything works
3. Write additional tests for new features
4. Integrate into your CI/CD pipeline (see `DETOX_SETUP_GUIDE.md`)

## 💡 Pro Tips

1. Keep simulators/emulators running to speed up test execution
2. Use `--loglevel trace` flag for debugging: `npm run detox:test:ios -- --loglevel trace`
3. Tests create artifacts (screenshots/videos) on failure in the `artifacts/` directory
4. Use `device.reloadReactNative()` in tests for clean state between tests
5. Always rebuild after changing native code or dependencies

## ✨ What's Different About Your Components Now?

All your React Native components now have `testID` props for E2E testing:

- `<TextInput testID="todo-input" />` - The main input field
- `<TouchableOpacity testID="add-todo-button" />` - The add button
- `<Text testID="task-count" />` - The task counter
- `<FlatList testID="todo-list" />` - The todo list
- `<TouchableOpacity testID="delete-todo-button" />` - Delete buttons

These testIDs allow Detox to reliably find and interact with your UI elements during tests.

---

**Ready to start?** Begin with Step 1 above! 🚀

Need help? Check `DETOX_SETUP_GUIDE.md` for detailed troubleshooting.

