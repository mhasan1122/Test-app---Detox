import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TodoInput } from '../TodoInput';

describe('TodoInput Component - Unit Tests', () => {
  it('should render input field and add button properly', () => {
    const mockAddTodo = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <TodoInput onAddTodo={mockAddTodo} />
    );

    // Verify input field renders
    const input = getByPlaceholderText('Enter a task...');
    expect(input).toBeTruthy();

    // Verify add button renders
    const addButton = getByText('Add');
    expect(addButton).toBeTruthy();
  });

  it('should update input value when user types', () => {
    const mockAddTodo = jest.fn();
    const { getByPlaceholderText } = render(
      <TodoInput onAddTodo={mockAddTodo} />
    );

    const input = getByPlaceholderText('Enter a task...');
    
    // Type into input
    fireEvent.changeText(input, 'New Task');
    
    expect(input.props.value).toBe('New Task');
  });

  it('should call onAddTodo with trimmed task when Add button is pressed', () => {
    const mockAddTodo = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <TodoInput onAddTodo={mockAddTodo} />
    );

    const input = getByPlaceholderText('Enter a task...');
    const addButton = getByText('Add');

    // Type a task with extra spaces
    fireEvent.changeText(input, '  Buy groceries  ');
    
    // Press Add button
    fireEvent.press(addButton);

    // Verify onAddTodo was called with trimmed value
    expect(mockAddTodo).toHaveBeenCalledWith('Buy groceries');
    expect(mockAddTodo).toHaveBeenCalledTimes(1);
  });

  it('should clear input field after adding a task', () => {
    const mockAddTodo = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <TodoInput onAddTodo={mockAddTodo} />
    );

    const input = getByPlaceholderText('Enter a task...');
    const addButton = getByText('Add');

    // Type and add task
    fireEvent.changeText(input, 'Test Task');
    fireEvent.press(addButton);

    // Input should be cleared
    expect(input.props.value).toBe('');
  });

  it('should not call onAddTodo when input is empty', () => {
    const mockAddTodo = jest.fn();
    const { getByText } = render(<TodoInput onAddTodo={mockAddTodo} />);

    const addButton = getByText('Add');

    // Press Add button without typing anything
    fireEvent.press(addButton);

    // onAddTodo should not be called
    expect(mockAddTodo).not.toHaveBeenCalled();
  });

  it('should not call onAddTodo when input contains only whitespace', () => {
    const mockAddTodo = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <TodoInput onAddTodo={mockAddTodo} />
    );

    const input = getByPlaceholderText('Enter a task...');
    const addButton = getByText('Add');

    // Type only whitespace
    fireEvent.changeText(input, '   ');
    fireEvent.press(addButton);

    // onAddTodo should not be called
    expect(mockAddTodo).not.toHaveBeenCalled();
  });

  it('should call onAddTodo when pressing submit on keyboard', () => {
    const mockAddTodo = jest.fn();
    const { getByPlaceholderText } = render(
      <TodoInput onAddTodo={mockAddTodo} />
    );

    const input = getByPlaceholderText('Enter a task...');

    // Type and submit
    fireEvent.changeText(input, 'Task from keyboard');
    fireEvent(input, 'submitEditing');

    // Verify onAddTodo was called
    expect(mockAddTodo).toHaveBeenCalledWith('Task from keyboard');
    expect(mockAddTodo).toHaveBeenCalledTimes(1);
  });
});

