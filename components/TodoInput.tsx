import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Keyboard } from 'react-native';

interface TodoInputProps {
  onAddTodo: (task: string) => void;
}

export function TodoInput({ onAddTodo }: TodoInputProps) {
  const [task, setTask] = useState('');

  const handleAddTodo = () => {
    if (task.trim()) {
      onAddTodo(task.trim());
      setTask('');
      Keyboard.dismiss();
    }
  };

  return (
    <View className="flex-row gap-2 mb-4">
      <TextInput
        testID="todo-input"
        className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-base min-h-[48px]"
        placeholder="Enter a task..."
        placeholderTextColor="#9CA3AF"
        value={task}
        onChangeText={setTask}
        onSubmitEditing={handleAddTodo}
        returnKeyType="done"
        blurOnSubmit={false}
      />
      <TouchableOpacity
        testID="add-todo-button"
        className="bg-blue-500 rounded-lg px-6 py-3 justify-center items-center active:bg-blue-600 min-h-[48px]"
        onPress={handleAddTodo}
        activeOpacity={0.7}
      >
        <Text className="text-white font-semibold text-base">Add</Text>
      </TouchableOpacity>
    </View>
  );
}

