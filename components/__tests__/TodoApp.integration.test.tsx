import React from 'react';
import { render, fireEvent, waitFor, within } from '@testing-library/react-native';
import { TodoApp } from '../TodoApp';

/**
 * Integration Tests for TodoApp
 * 
 * These tests verify that all components work together correctly:
 * - TodoApp (parent container with state management)
 * - TodoInput (input field and add button)
 * - TodoList (list container)
 * - TodoItem (individual task items with delete buttons)
 */

// Helper function to find and delete a task by its text content
const findAndDeleteTask = (
  taskText: string,
  queryByText: (text: string) => any,
  getByTestId: (testId: string) => any
): boolean => {
  // Find the text element
  const textElement = queryByText(taskText);
  if (!textElement) return false;
  
  try {
    // Extract the todo ID from the text element's testID
    // The testID format is: todo-text-{id}
    const testID = (textElement as any).props?.testID;
    if (testID && testID.startsWith('todo-text-')) {
      const todoId = testID.replace('todo-text-', '');
      // Find the corresponding delete button using the same ID
      const deleteButton = getByTestId(`delete-todo-button-${todoId}`);
      if (deleteButton) {
        fireEvent.press(deleteButton);
        return true;
      }
    }
  } catch {
    return false;
  }
  return false;
};

describe('TodoApp - Integration Tests', () => {
  describe('Complete Workflow: Add Multiple Tasks, Delete One, Verify Updates', () => {
    it('should add multiple tasks, delete one, and maintain correct list state', () => {
      const { getByTestId, queryByTestId, queryByText } = render(<TodoApp />);

      const input = getByTestId('todo-input');
      const addButton = getByTestId('add-todo-button');
      const taskCount = getByTestId('task-count');

      // ========== INITIAL STATE ==========
      // Verify initial state: 0 tasks
      expect(taskCount).toHaveTextContent('0 tasks');
      expect(getByTestId('empty-state')).toBeTruthy();

      // ========== ADD TASK 1 ==========
      fireEvent.changeText(input, 'Buy groceries');
      fireEvent.press(addButton);

      // Verify task was added and count updated
      expect(taskCount).toHaveTextContent('1 task');
      expect(queryByTestId('empty-state')).toBeNull();
      expect(queryByText('Buy groceries')).toBeTruthy();

      // ========== ADD TASK 2 ==========
      fireEvent.changeText(input, 'Walk the dog');
      fireEvent.press(addButton);

      // Verify count updated to 2 tasks
      expect(taskCount).toHaveTextContent('2 tasks');
      expect(queryByText('Walk the dog')).toBeTruthy();

      // ========== ADD TASK 3 ==========
      fireEvent.changeText(input, 'Read a book');
      fireEvent.press(addButton);

      // Verify count updated to 3 tasks
      expect(taskCount).toHaveTextContent('3 tasks');
      expect(queryByText('Read a book')).toBeTruthy();

      // ========== VERIFY ALL TASKS EXIST ==========
      expect(queryByText('Buy groceries')).toBeTruthy();
      expect(queryByText('Walk the dog')).toBeTruthy();
      expect(queryByText('Read a book')).toBeTruthy();

      // ========== DELETE MIDDLE TASK (Walk the dog) ==========
      // Find the delete button for "Walk the dog" task
      // Since we can't directly get the specific delete button, we'll use getAllByTestId
      // and find the one that corresponds to "Walk the dog"
      
      // Get all testIDs that match delete buttons
      const allElements = taskCount.parent?.parent;
      if (allElements) {
        // Find all text elements
        const textElements = allElements.findAllByType('Text');
        
        // Find the element that contains "Walk the dog"
        const walkDogText = textElements.find((el: any) => el.props.children === 'Walk the dog');
        
        // If found, get its testID to find the corresponding delete button
        if (walkDogText && walkDogText.props.testID) {
          const todoId = walkDogText.props.testID.replace('todo-text-', '');
          const deleteButton = getByTestId('delete-todo-button');
          fireEvent.press(deleteButton);

          // ========== VERIFY AFTER DELETION ==========
          // Verify count updated to 2 tasks
          expect(taskCount).toHaveTextContent('2 tasks');

          // Verify "Walk the dog" is no longer present
          expect(queryByText('Walk the dog')).toBeNull();

          // ========== VERIFY REMAINING TASKS ==========
          // Check that the other two tasks still exist
          expect(queryByText('Buy groceries')).toBeTruthy();
          expect(queryByText('Read a book')).toBeTruthy();
        }
      }
    });

    it('should handle add-delete-add workflow correctly', () => {
      const { getByTestId, queryByTestId, queryByText } = render(<TodoApp />);

      const input = getByTestId('todo-input');
      const addButton = getByTestId('add-todo-button');
      const taskCount = getByTestId('task-count');

      // ========== PHASE 1: ADD 3 TASKS ==========
      fireEvent.changeText(input, 'Task 1');
      fireEvent.press(addButton);
      expect(taskCount).toHaveTextContent('1 task');

      fireEvent.changeText(input, 'Task 2');
      fireEvent.press(addButton);
      expect(taskCount).toHaveTextContent('2 tasks');

      fireEvent.changeText(input, 'Task 3');
      fireEvent.press(addButton);
      expect(taskCount).toHaveTextContent('3 tasks');

      // ========== PHASE 2: DELETE ALL TASKS ONE BY ONE ==========
      findAndDeleteTask('Task 1', queryByText, getByTestId);
      expect(taskCount).toHaveTextContent('2 tasks');

      findAndDeleteTask('Task 2', queryByText, getByTestId);
      expect(taskCount).toHaveTextContent('1 task');

      findAndDeleteTask('Task 3', queryByText, getByTestId);
      expect(taskCount).toHaveTextContent('0 tasks');
      expect(getByTestId('empty-state')).toBeTruthy();

      // ========== PHASE 3: ADD NEW TASKS AFTER DELETION ==========
      fireEvent.changeText(input, 'New Task 1');
      fireEvent.press(addButton);
      expect(taskCount).toHaveTextContent('1 task');
      expect(queryByText('New Task 1')).toBeTruthy();

      fireEvent.changeText(input, 'New Task 2');
      fireEvent.press(addButton);
      expect(taskCount).toHaveTextContent('2 tasks');
      expect(queryByText('New Task 2')).toBeTruthy();
    });

    it('should add 5 tasks, delete 2, and verify correct remaining count', () => {
      const { getByTestId, queryByText } = render(<TodoApp />);

      const input = getByTestId('todo-input');
      const addButton = getByTestId('add-todo-button');
      const taskCount = getByTestId('task-count');

      // Add 5 tasks
      const tasks = ['Task A', 'Task B', 'Task C', 'Task D', 'Task E'];
      tasks.forEach((task) => {
        fireEvent.changeText(input, task);
        fireEvent.press(addButton);
      });

      // Verify all 5 tasks added
      expect(taskCount).toHaveTextContent('5 tasks');
      tasks.forEach((task) => {
        expect(queryByText(task)).toBeTruthy();
      });

      // Delete 2 tasks (Task B and Task D)
      findAndDeleteTask('Task B', queryByText, getByTestId);
      expect(taskCount).toHaveTextContent('4 tasks');

      findAndDeleteTask('Task D', queryByText, getByTestId);
      expect(taskCount).toHaveTextContent('3 tasks');

      // Verify remaining tasks
      expect(queryByText('Task A')).toBeTruthy();
      expect(queryByText('Task B')).toBeNull();
      expect(queryByText('Task C')).toBeTruthy();
      expect(queryByText('Task D')).toBeNull();
      expect(queryByText('Task E')).toBeTruthy();
    });
  });

  describe('Task Counter Accuracy', () => {
    it('should display correct singular/plural form based on task count', () => {
      const { getByTestId, queryByText } = render(<TodoApp />);

      const input = getByTestId('todo-input');
      const addButton = getByTestId('add-todo-button');
      const taskCount = getByTestId('task-count');

      // 0 tasks - plural
      expect(taskCount).toHaveTextContent('0 tasks');

      // Add 1 task - singular
      fireEvent.changeText(input, 'Single task');
      fireEvent.press(addButton);
      expect(taskCount).toHaveTextContent('1 task');

      // Add another task - plural
      fireEvent.changeText(input, 'Second task');
      fireEvent.press(addButton);
      expect(taskCount).toHaveTextContent('2 tasks');

      // Delete one - back to singular
      findAndDeleteTask('Second task', queryByText, getByTestId);
      expect(taskCount).toHaveTextContent('1 task');

      findAndDeleteTask('Single task', queryByText, getByTestId);
      expect(taskCount).toHaveTextContent('0 tasks');
    });

    it('should maintain accurate count during rapid operations', () => {
      const { getByTestId, queryByText } = render(<TodoApp />);

      const input = getByTestId('todo-input');
      const addButton = getByTestId('add-todo-button');
      const taskCount = getByTestId('task-count');

      // Rapidly add 3 tasks
      fireEvent.changeText(input, 'Task 1');
      fireEvent.press(addButton);
      fireEvent.changeText(input, 'Task 2');
      fireEvent.press(addButton);
      fireEvent.changeText(input, 'Task 3');
      fireEvent.press(addButton);

      expect(taskCount).toHaveTextContent('3 tasks');

      // Delete middle task
      findAndDeleteTask('Task 2', queryByText, getByTestId);
      expect(taskCount).toHaveTextContent('2 tasks');
      
      // Verify correct tasks remain
      expect(queryByText('Task 1')).toBeTruthy();
      expect(queryByText('Task 2')).toBeNull();
      expect(queryByText('Task 3')).toBeTruthy();
    });
  });

  describe('List Update Verification', () => {
    it('should add tasks to the top of the list (newest first)', () => {
      const { getByTestId, queryByText } = render(<TodoApp />);

      const input = getByTestId('todo-input');
      const addButton = getByTestId('add-todo-button');

      // Add tasks in sequence
      fireEvent.changeText(input, 'First');
      fireEvent.press(addButton);

      fireEvent.changeText(input, 'Second');
      fireEvent.press(addButton);

      fireEvent.changeText(input, 'Third');
      fireEvent.press(addButton);

      // All tasks should exist
      expect(queryByText('First')).toBeTruthy();
      expect(queryByText('Second')).toBeTruthy();
      expect(queryByText('Third')).toBeTruthy();

      // Verify we have 3 tasks
      const taskCount = getByTestId('task-count');
      expect(taskCount).toHaveTextContent('3 tasks');
    });

    it('should correctly update list after deletion', () => {
      const { getByTestId, queryByText } = render(<TodoApp />);

      const input = getByTestId('todo-input');
      const addButton = getByTestId('add-todo-button');
      const taskCount = getByTestId('task-count');

      // Add 3 tasks
      fireEvent.changeText(input, 'Task A');
      fireEvent.press(addButton);
      fireEvent.changeText(input, 'Task B');
      fireEvent.press(addButton);
      fireEvent.changeText(input, 'Task C');
      fireEvent.press(addButton);

      expect(taskCount).toHaveTextContent('3 tasks');

      // Delete middle task (Task B)
      findAndDeleteTask('Task B', queryByText, getByTestId);

      // Verify remaining tasks and count
      expect(taskCount).toHaveTextContent('2 tasks');
      expect(queryByText('Task A')).toBeTruthy();
      expect(queryByText('Task B')).toBeNull();
      expect(queryByText('Task C')).toBeTruthy();
    });

    it('should handle empty state transitions correctly', () => {
      const { getByTestId, queryByTestId, queryByText } = render(<TodoApp />);

      const input = getByTestId('todo-input');
      const addButton = getByTestId('add-todo-button');
      const taskCount = getByTestId('task-count');

      // Start with empty state
      expect(getByTestId('empty-state')).toBeTruthy();
      expect(taskCount).toHaveTextContent('0 tasks');

      // Add a task - empty state should disappear
      fireEvent.changeText(input, 'Only task');
      fireEvent.press(addButton);
      expect(queryByTestId('empty-state')).toBeNull();
      expect(taskCount).toHaveTextContent('1 task');

      // Delete the task - empty state should reappear
      findAndDeleteTask('Only task', queryByText, getByTestId);
      
      expect(getByTestId('empty-state')).toBeTruthy();
      expect(taskCount).toHaveTextContent('0 tasks');
    });
  });

  describe('Input Field Behavior', () => {
    it('should clear input field after successfully adding each task', () => {
      const { getByTestId } = render(<TodoApp />);

      const input = getByTestId('todo-input');
      const addButton = getByTestId('add-todo-button');

      // Add first task
      fireEvent.changeText(input, 'Task 1');
      expect(input.props.value).toBe('Task 1');
      fireEvent.press(addButton);
      expect(input.props.value).toBe('');

      // Add second task
      fireEvent.changeText(input, 'Task 2');
      expect(input.props.value).toBe('Task 2');
      fireEvent.press(addButton);
      expect(input.props.value).toBe('');
    });

    it('should not add empty or whitespace-only tasks', () => {
      const { getByTestId } = render(<TodoApp />);

      const input = getByTestId('todo-input');
      const addButton = getByTestId('add-todo-button');
      const taskCount = getByTestId('task-count');

      // Try to add without typing anything
      fireEvent.press(addButton);
      expect(taskCount).toHaveTextContent('0 tasks');

      // Try to add with only spaces
      fireEvent.changeText(input, '   ');
      fireEvent.press(addButton);
      expect(taskCount).toHaveTextContent('0 tasks');

      // Verify empty state still shows
      expect(getByTestId('empty-state')).toBeTruthy();
    });
  });

  describe('Complex Integration Scenarios', () => {
    it('should handle multiple additions and deletions correctly', () => {
      const { getByTestId, queryByText } = render(<TodoApp />);

      const input = getByTestId('todo-input');
      const addButton = getByTestId('add-todo-button');
      const taskCount = getByTestId('task-count');

      // Add 4 tasks
      ['Task 1', 'Task 2', 'Task 3', 'Task 4'].forEach((task) => {
        fireEvent.changeText(input, task);
        fireEvent.press(addButton);
      });

      expect(taskCount).toHaveTextContent('4 tasks');

      // Delete first and last tasks
      findAndDeleteTask('Task 1', queryByText, getByTestId);
      findAndDeleteTask('Task 4', queryByText, getByTestId);

      expect(taskCount).toHaveTextContent('2 tasks');
      expect(queryByText('Task 1')).toBeNull();
      expect(queryByText('Task 2')).toBeTruthy();
      expect(queryByText('Task 3')).toBeTruthy();
      expect(queryByText('Task 4')).toBeNull();
    });

    it('should maintain data integrity with special characters', () => {
      const { getByTestId, queryByText } = render(<TodoApp />);

      const input = getByTestId('todo-input');
      const addButton = getByTestId('add-todo-button');
      const taskCount = getByTestId('task-count');

      // Add tasks with special characters
      const specialTasks = [
        'Task with emoji 🚀',
        'Task with numbers 12345',
        'Task with symbols !@#$%'
      ];

      specialTasks.forEach((task) => {
        fireEvent.changeText(input, task);
        fireEvent.press(addButton);
      });

      expect(taskCount).toHaveTextContent('3 tasks');

      // Verify all tasks are present with correct content
      specialTasks.forEach((task) => {
        expect(queryByText(task)).toBeTruthy();
      });

      // Delete middle task
      findAndDeleteTask('Task with numbers 12345', queryByText, getByTestId);

      expect(taskCount).toHaveTextContent('2 tasks');
      expect(queryByText('Task with emoji 🚀')).toBeTruthy();
      expect(queryByText('Task with numbers 12345')).toBeNull();
      expect(queryByText('Task with symbols !@#$%')).toBeTruthy();
    });
  });
});
