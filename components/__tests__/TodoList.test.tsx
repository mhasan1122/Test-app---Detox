import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TodoList } from '../TodoList';
import type { Todo } from '../TodoItem';

describe('TodoList Component - Unit Tests', () => {
  it('should render empty state when no todos', () => {
    const mockOnDeleteTodo = jest.fn();
    const { getByText } = render(
      <TodoList todos={[]} onDeleteTodo={mockOnDeleteTodo} />
    );

    // Verify empty state message
    expect(getByText('No tasks yet. Add one above!')).toBeTruthy();
  });

  it('should render list of todos', () => {
    const mockOnDeleteTodo = jest.fn();
    const todos: Todo[] = [
      { id: '1', task: 'First Task' },
      { id: '2', task: 'Second Task' },
      { id: '3', task: 'Third Task' },
    ];

    const { getByText } = render(
      <TodoList todos={todos} onDeleteTodo={mockOnDeleteTodo} />
    );

    // Verify all tasks are rendered
    expect(getByText('First Task')).toBeTruthy();
    expect(getByText('Second Task')).toBeTruthy();
    expect(getByText('Third Task')).toBeTruthy();

    // Verify indices
    expect(getByText('1.')).toBeTruthy();
    expect(getByText('2.')).toBeTruthy();
    expect(getByText('3.')).toBeTruthy();
  });

  it('should call onDeleteTodo when delete button is pressed', () => {
    const mockOnDeleteTodo = jest.fn();
    const todos: Todo[] = [
      { id: '1', task: 'Task to delete' },
    ];

    const { getByText } = render(
      <TodoList todos={todos} onDeleteTodo={mockOnDeleteTodo} />
    );

    const taskElement = getByText('Task to delete');
    const container = taskElement.parent?.parent;
    
    if (container) {
      const deleteButton = container.children[container.children.length - 1];
      fireEvent.press(deleteButton);

      expect(mockOnDeleteTodo).toHaveBeenCalledWith('1');
      expect(mockOnDeleteTodo).toHaveBeenCalledTimes(1);
    }
  });

  it('should render correct number of todos', () => {
    const mockOnDeleteTodo = jest.fn();
    const todos: Todo[] = [
      { id: '1', task: 'Task 1' },
      { id: '2', task: 'Task 2' },
    ];

    const { getByText, rerender } = render(
      <TodoList todos={todos} onDeleteTodo={mockOnDeleteTodo} />
    );

    // Initially 2 tasks
    expect(getByText('Task 1')).toBeTruthy();
    expect(getByText('Task 2')).toBeTruthy();

    // Update to 3 tasks
    const updatedTodos: Todo[] = [
      ...todos,
      { id: '3', task: 'Task 3' },
    ];

    rerender(<TodoList todos={updatedTodos} onDeleteTodo={mockOnDeleteTodo} />);
    
    expect(getByText('Task 3')).toBeTruthy();
  });
});

