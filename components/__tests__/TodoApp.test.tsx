import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { TodoApp } from '../TodoApp';

describe('TodoApp Component - Integration Tests', () => {
  it('should render the app with header and input', () => {
    const { getByText, getByPlaceholderText } = render(<TodoApp />);

    // Verify header
    expect(getByText('Todo App')).toBeTruthy();
    
    // Verify initial task count
    expect(getByText('0 tasks')).toBeTruthy();

    // Verify input
    expect(getByPlaceholderText('Enter a task...')).toBeTruthy();

    // Verify Add button
    expect(getByText('Add')).toBeTruthy();

    // Verify empty state
    expect(getByText('No tasks yet. Add one above!')).toBeTruthy();
  });

  it('should add a task when Add button is pressed', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<TodoApp />);

    const input = getByPlaceholderText('Enter a task...');
    const addButton = getByText('Add');

    // Type a task
    fireEvent.changeText(input, 'Buy groceries');

    // Press Add button
    fireEvent.press(addButton);

    // Verify task was added
    expect(getByText('Buy groceries')).toBeTruthy();

    // Verify task count updated
    expect(getByText('1 task')).toBeTruthy();

    // Verify empty state is gone
    expect(queryByText('No tasks yet. Add one above!')).toBeNull();
  });

  it('should add multiple tasks correctly', () => {
    const { getByPlaceholderText, getByText } = render(<TodoApp />);

    const input = getByPlaceholderText('Enter a task...');
    const addButton = getByText('Add');

    // Add first task
    fireEvent.changeText(input, 'Task 1');
    fireEvent.press(addButton);

    // Add second task
    fireEvent.changeText(input, 'Task 2');
    fireEvent.press(addButton);

    // Add third task
    fireEvent.changeText(input, 'Task 3');
    fireEvent.press(addButton);

    // Verify all tasks are present
    expect(getByText('Task 1')).toBeTruthy();
    expect(getByText('Task 2')).toBeTruthy();
    expect(getByText('Task 3')).toBeTruthy();

    // Verify task count
    expect(getByText('3 tasks')).toBeTruthy();
  });

  it('should delete a task when Delete button is pressed', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<TodoApp />);

    const input = getByPlaceholderText('Enter a task...');
    const addButton = getByText('Add');

    // Add a task
    fireEvent.changeText(input, 'Task to delete');
    fireEvent.press(addButton);

    // Verify task exists
    expect(getByText('Task to delete')).toBeTruthy();
    expect(getByText('1 task')).toBeTruthy();

    // Find and press delete button
    const taskElement = getByText('Task to delete');
    const container = taskElement.parent?.parent;
    
    if (container) {
      const deleteButton = container.children[container.children.length - 1];
      fireEvent.press(deleteButton);

      // Verify task was deleted
      expect(queryByText('Task to delete')).toBeNull();

      // Verify task count updated
      expect(getByText('0 tasks')).toBeTruthy();

      // Verify empty state is back
      expect(getByText('No tasks yet. Add one above!')).toBeTruthy();
    }
  });

  it('should maintain correct task count after adding and deleting tasks', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<TodoApp />);

    const input = getByPlaceholderText('Enter a task...');
    const addButton = getByText('Add');

    // Add three tasks
    fireEvent.changeText(input, 'Task 1');
    fireEvent.press(addButton);

    fireEvent.changeText(input, 'Task 2');
    fireEvent.press(addButton);

    fireEvent.changeText(input, 'Task 3');
    fireEvent.press(addButton);

    // Verify count
    expect(getByText('3 tasks')).toBeTruthy();

    // Delete middle task
    const task2Element = getByText('Task 2');
    const task2Container = task2Element.parent?.parent;
    
    if (task2Container) {
      const deleteButton = task2Container.children[task2Container.children.length - 1];
      fireEvent.press(deleteButton);

      // Verify Task 2 is deleted
      expect(queryByText('Task 2')).toBeNull();

      // Verify other tasks still exist
      expect(getByText('Task 1')).toBeTruthy();
      expect(getByText('Task 3')).toBeTruthy();

      // Verify count updated
      expect(getByText('2 tasks')).toBeTruthy();
    }
  });

  it('should handle adding multiple tasks and deleting one - complete integration flow', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<TodoApp />);

    const input = getByPlaceholderText('Enter a task...');
    const addButton = getByText('Add');

    // Initial state - 0 tasks
    expect(getByText('0 tasks')).toBeTruthy();

    // Add Task 1
    fireEvent.changeText(input, 'Buy milk');
    fireEvent.press(addButton);
    expect(getByText('1 task')).toBeTruthy();
    expect(getByText('Buy milk')).toBeTruthy();

    // Add Task 2
    fireEvent.changeText(input, 'Walk dog');
    fireEvent.press(addButton);
    expect(getByText('2 tasks')).toBeTruthy();
    expect(getByText('Walk dog')).toBeTruthy();

    // Add Task 3
    fireEvent.changeText(input, 'Read book');
    fireEvent.press(addButton);
    expect(getByText('3 tasks')).toBeTruthy();
    expect(getByText('Read book')).toBeTruthy();

    // Verify all tasks are present
    expect(getByText('Buy milk')).toBeTruthy();
    expect(getByText('Walk dog')).toBeTruthy();
    expect(getByText('Read book')).toBeTruthy();

    // Delete "Walk dog" task
    const walkDogElement = getByText('Walk dog');
    const walkDogContainer = walkDogElement.parent?.parent;
    
    if (walkDogContainer) {
      const deleteButton = walkDogContainer.children[walkDogContainer.children.length - 1];
      fireEvent.press(deleteButton);

      // Verify "Walk dog" is deleted
      expect(queryByText('Walk dog')).toBeNull();

      // Verify other tasks still exist
      expect(getByText('Buy milk')).toBeTruthy();
      expect(getByText('Read book')).toBeTruthy();

      // Verify final count
      expect(getByText('2 tasks')).toBeTruthy();
    }
  });

  it('should add new tasks at the top of the list', () => {
    const { getByPlaceholderText, getByText, getAllByText } = render(<TodoApp />);

    const input = getByPlaceholderText('Enter a task...');
    const addButton = getByText('Add');

    // Add first task
    fireEvent.changeText(input, 'Old Task');
    fireEvent.press(addButton);

    // Add second task
    fireEvent.changeText(input, 'New Task');
    fireEvent.press(addButton);

    // Verify both tasks are present
    expect(getByText('New Task')).toBeTruthy();
    expect(getByText('Old Task')).toBeTruthy();
    
    // Verify "New Task" has index 1 (first in list) and "Old Task" has index 2
    const indices = getAllByText(/^\d+\.$/);
    expect(indices[0]).toHaveTextContent('1.');
    expect(indices[1]).toHaveTextContent('2.');
  });

  it('should clear input after successfully adding a task', () => {
    const { getByPlaceholderText, getByText } = render(<TodoApp />);

    const input = getByPlaceholderText('Enter a task...');
    const addButton = getByText('Add');

    // Type and add task
    fireEvent.changeText(input, 'Test Task');
    fireEvent.press(addButton);

    // Verify input is cleared
    expect(input.props.value).toBe('');
  });

  it('should not add empty tasks', () => {
    const { getByText } = render(<TodoApp />);

    const addButton = getByText('Add');

    // Try to add without typing
    fireEvent.press(addButton);

    // Verify still shows 0 tasks
    expect(getByText('0 tasks')).toBeTruthy();
    expect(getByText('No tasks yet. Add one above!')).toBeTruthy();
  });
});

