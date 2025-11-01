# React Native Testing Library - Test Guide

## Overview
This project includes comprehensive unit and integration tests for the Todo App using React Native Testing Library.

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (auto-rerun on file changes)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Test Structure

### Unit Tests

#### 1. TodoInput Component Tests (`TodoInput.test.tsx`)
Tests the input field and add button functionality:

- ✅ **Renders properly**: Verifies input field and "Add" button are displayed
- ✅ **Input updates**: Checks if typed text updates the input value
- ✅ **Add task**: Verifies task is added when "Add" button is pressed
- ✅ **Trims whitespace**: Ensures tasks are trimmed before adding
- ✅ **Clears input**: Confirms input field is cleared after adding a task
- ✅ **Empty validation**: Prevents adding empty tasks
- ✅ **Whitespace validation**: Prevents adding tasks with only spaces
- ✅ **Keyboard submit**: Tests adding task via keyboard "done" button

**Key Test:**
```typescript
it('should call onAddTodo with trimmed task when Add button is pressed', () => {
  // Verifies the Add button works correctly
});
```

#### 2. TodoItem Component Tests (`TodoItem.test.tsx`)
Tests individual todo item rendering and deletion:

- ✅ **Renders task**: Verifies task text and index number display
- ✅ **Delete button**: Confirms delete button is rendered
- ✅ **Delete action**: Tests that pressing delete calls the correct callback
- ✅ **Multiple items**: Ensures different tasks render correctly

**Key Test:**
```typescript
it('should call onDelete with correct id when delete button is pressed', () => {
  // Verifies the Delete button works correctly
});
```

#### 3. TodoList Component Tests (`TodoList.test.tsx`)
Tests the list of todos:

- ✅ **Empty state**: Verifies "No tasks yet" message when list is empty
- ✅ **Renders list**: Confirms all tasks are displayed correctly
- ✅ **Delete from list**: Tests deleting tasks from the list
- ✅ **Correct count**: Ensures the right number of tasks are shown

**Key Test:**
```typescript
it('should render empty state when no todos', () => {
  // Verifies empty state message appears
});
```

### Integration Tests

#### 4. TodoApp Component Tests (`TodoApp.test.tsx`)
Tests the complete app workflow with multiple operations:

- ✅ **Initial render**: Verifies app loads with header, input, and empty state
- ✅ **Add single task**: Tests adding one task updates the UI
- ✅ **Add multiple tasks**: Verifies adding 3 tasks sequentially
- ✅ **Delete task**: Confirms deleting a task removes it from the list
- ✅ **Add and delete flow**: Tests complete workflow of adding 3 tasks and deleting 1
- ✅ **Task count accuracy**: Ensures task counter updates correctly
- ✅ **List updates**: Verifies list updates correctly after operations
- ✅ **Task order**: Confirms new tasks appear at the top
- ✅ **Input clearing**: Tests input clears after successful add
- ✅ **Empty task prevention**: Ensures empty tasks cannot be added

**Key Integration Test:**
```typescript
it('should handle adding multiple tasks and deleting one - complete integration flow', () => {
  // 1. Add "Buy milk" -> verify 1 task
  // 2. Add "Walk dog" -> verify 2 tasks
  // 3. Add "Read book" -> verify 3 tasks
  // 4. Delete "Walk dog" -> verify 2 tasks remain
  // 5. Confirm other tasks still exist
});
```

## Test Coverage

The test suite covers:

- **Component Rendering**: All components render correctly
- **User Interactions**: Button presses, text input, keyboard actions
- **State Management**: Adding/deleting tasks updates state
- **UI Updates**: Task count, empty states, list updates
- **Edge Cases**: Empty input, whitespace-only input, multiple operations
- **Integration**: Complete user workflows from start to finish

## What Each Test Verifies

### Unit Tests Focus
- Individual component behavior
- Props handling
- Event callbacks
- Isolated functionality

### Integration Tests Focus
- Multi-step user workflows
- State changes across components
- Real-world usage scenarios
- Task list accuracy after operations

## Expected Test Results

All tests should pass with output similar to:
```
PASS  components/__tests__/TodoInput.test.tsx
PASS  components/__tests__/TodoItem.test.tsx
PASS  components/__tests__/TodoList.test.tsx
PASS  components/__tests__/TodoApp.test.tsx

Test Suites: 4 passed, 4 total
Tests:       25+ passed, 25+ total
```

## Troubleshooting

If tests fail:
1. Check that all dependencies are installed: `npm install`
2. Verify Jest configuration in `jest.config.js`
3. Ensure mocks are properly set up in `jest-setup.js`
4. Check that component code matches test expectations

## Dependencies

The testing setup uses:
- `@testing-library/react-native` - React Native testing utilities
- `jest` - Test runner
- `jest-expo` - Expo-specific Jest preset
- `@types/jest` - TypeScript definitions for Jest

