import './global.css';
import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TodoApp } from 'components/TodoApp';

// Suppress SafeAreaView deprecation warning from React Native/Expo dependencies
// Our app uses the correct SafeAreaView from react-native-safe-area-context
LogBox.ignoreLogs(['SafeAreaView has been deprecated']);

export default function App() {
  return (
    <SafeAreaProvider>
      <TodoApp />
    </SafeAreaProvider>
  );
}


