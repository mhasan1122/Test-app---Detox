import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TodoInput } from './TodoInput';
import { TodoList } from './TodoList';
import type { Todo } from './TodoItem';

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [idCounter, setIdCounter] = useState(0);

  const handleAddTodo = (task: string) => {
    const newTodo: Todo = {
      id: `${Date.now()}-${idCounter}`,
      task,
    };
    setTodos([newTodo, ...todos]);
    setIdCounter(idCounter + 1);
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView 
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View className="flex-1 px-5 pt-6 pb-2">
          {/* Header */}
          <View className="mb-5">
            <Text className="text-3xl font-bold text-gray-800 mb-1">
              Todo App
            </Text>
            <Text testID="task-count" className="text-base text-gray-500">
              {todos.length} {todos.length === 1 ? 'task' : 'tasks'}
            </Text>
          </View>

          {/* Input Section */}
          <TodoInput onAddTodo={handleAddTodo} />

          {/* Todo List */}
          <TodoList todos={todos} onDeleteTodo={handleDeleteTodo} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

