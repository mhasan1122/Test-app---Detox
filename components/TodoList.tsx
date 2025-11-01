import { FlatList, Text, View } from 'react-native';
import { TodoItem, type Todo } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onDeleteTodo: (id: string) => void;
}

export function TodoList({ todos, onDeleteTodo }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <View className="flex-1 justify-center items-center py-10">
        <Text testID="empty-state" className="text-gray-400 text-lg text-center px-6">
          No tasks yet. Add one above!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      testID="todo-list"
      data={todos}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <TodoItem todo={item} index={index + 1} onDelete={onDeleteTodo} />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 16 }}
      keyboardShouldPersistTaps="handled"
    />
  );
}

