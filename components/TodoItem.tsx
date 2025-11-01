import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export interface Todo {
  id: string;
  task: string;
}

interface TodoItemProps {
  todo: Todo;
  index: number;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, index, onDelete }: TodoItemProps) {
  return (
    <View testID={`todo-item-${todo.id}`} className="bg-white rounded-lg p-4 mb-3 flex-row items-center shadow-sm">
      <Text className="text-lg font-bold text-gray-600 mr-3 min-w-[30px]">
        {index}.
      </Text>
      <Text 
        testID={`todo-text-${todo.id}`}
        className="flex-1 text-base text-gray-800 mr-3"
        numberOfLines={0}
      >
        {todo.task}
      </Text>
      <TouchableOpacity
        testID={`delete-todo-button-${todo.id}`}
        accessibilityLabel="delete-todo-button"
        className="bg-red-500 rounded-full w-10 h-10 active:bg-red-600 items-center justify-center"
        onPress={() => onDelete(todo.id)}
        activeOpacity={0.7}
      >
        <MaterialIcons name="delete" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
}

