import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TodoItem } from '../TodoItem';
import type { Todo } from '../TodoItem';

describe('TodoItem Component - Unit Tests', () => {
  const mockTodo: Todo = {
    id: '1',
    task: 'Test Task',
  };

  it('should render todo item with task text and index', () => {
    const mockOnDelete = jest.fn();
    const { getByText } = render(
      <TodoItem todo={mockTodo} index={1} onDelete={mockOnDelete} />
    );

    // Verify task text renders
    expect(getByText('Test Task')).toBeTruthy();
    
    // Verify index renders
    expect(getByText('1.')).toBeTruthy();
  });

  it('should render delete button', () => {
    const mockOnDelete = jest.fn();
    const { UNSAFE_getByType } = render(
      <TodoItem todo={mockTodo} index={1} onDelete={mockOnDelete} />
    );

    // Verify MaterialIcons (delete button) is rendered
    const deleteIcon = UNSAFE_getByType('MaterialIcons');
    expect(deleteIcon).toBeTruthy();
  });

  it('should call onDelete with correct id when delete button is pressed', () => {
    const mockOnDelete = jest.fn();
    const { getByText } = render(
      <TodoItem todo={mockTodo} index={1} onDelete={mockOnDelete} />
    );

    // Find the parent of the icon (TouchableOpacity) by finding task and navigating
    const taskElement = getByText('Test Task');
    const container = taskElement.parent?.parent;
    
    if (container) {
      // Get the last child which should be the delete button
      const deleteButton = container.children[container.children.length - 1];
      fireEvent.press(deleteButton);

      // Verify onDelete was called with correct id
      expect(mockOnDelete).toHaveBeenCalledWith('1');
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    }
  });

  it('should render different tasks correctly', () => {
    const mockOnDelete = jest.fn();
    const todo1: Todo = { id: '1', task: 'First Task' };
    const todo2: Todo = { id: '2', task: 'Second Task' };

    const { getByText, rerender } = render(
      <TodoItem todo={todo1} index={1} onDelete={mockOnDelete} />
    );

    // Verify first task
    expect(getByText('First Task')).toBeTruthy();

    // Rerender with second task
    rerender(<TodoItem todo={todo2} index={2} onDelete={mockOnDelete} />);

    // Verify second task
    expect(getByText('Second Task')).toBeTruthy();
    expect(getByText('2.')).toBeTruthy();
  });
});

