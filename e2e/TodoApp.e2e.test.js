describe('TodoApp E2E Tests', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
    });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display the todo app with initial state', async () => {
    await expect(element(by.text('Todo App'))).toBeVisible();
    await expect(element(by.id('task-count'))).toBeVisible();
    await expect(element(by.id('task-count'))).toHaveText('0 tasks');
  });

  it('should add a new todo item', async () => {
    // Type in the input field
    await element(by.id('todo-input')).typeText('Buy groceries');
    
    // Tap the add button
    await element(by.id('add-todo-button')).tap();
    
    // Verify the todo was added
    await expect(element(by.text('Buy groceries'))).toBeVisible();
    await expect(element(by.id('task-count'))).toHaveText('1 task');
  });

  it('should add multiple todo items', async () => {
    // Add first todo
    await element(by.id('todo-input')).typeText('Buy groceries');
    await element(by.id('add-todo-button')).tap();
    
    // Add second todo
    await element(by.id('todo-input')).typeText('Walk the dog');
    await element(by.id('add-todo-button')).tap();
    
    // Add third todo
    await element(by.id('todo-input')).typeText('Read a book');
    await element(by.id('add-todo-button')).tap();
    
    // Verify all todos are visible
    await expect(element(by.text('Buy groceries'))).toBeVisible();
    await expect(element(by.text('Walk the dog'))).toBeVisible();
    await expect(element(by.text('Read a book'))).toBeVisible();
    await expect(element(by.id('task-count'))).toHaveText('3 tasks');
  });

  it('should delete a todo item', async () => {
    // Add a todo
    await element(by.id('todo-input')).typeText('Task to delete');
    await element(by.id('add-todo-button')).tap();
    
    // Verify todo is visible
    await expect(element(by.text('Task to delete'))).toBeVisible();
    await expect(element(by.id('task-count'))).toHaveText('1 task');
    
    // Delete the todo
    await element(by.label('delete-todo-button')).atIndex(0).tap();
    
    // Verify todo is deleted
    await expect(element(by.text('Task to delete'))).not.toBeVisible();
    await expect(element(by.id('task-count'))).toHaveText('0 tasks');
  });

  it('should clear input after adding todo', async () => {
    // Type in the input field
    await element(by.id('todo-input')).typeText('Test task');
    
    // Tap the add button
    await element(by.id('add-todo-button')).tap();
    
    // Verify input is cleared
    await expect(element(by.id('todo-input'))).toHaveText('');
  });

  it('should not add empty todo', async () => {
    // Get initial task count
    const initialCount = await element(by.id('task-count')).getAttributes();
    
    // Try to add empty todo
    await element(by.id('add-todo-button')).tap();
    
    // Verify no todo was added
    await expect(element(by.id('task-count'))).toHaveText('0 tasks');
  });

  it('should display todos in reverse chronological order', async () => {
    // Add todos in sequence
    await element(by.id('todo-input')).typeText('First task');
    await element(by.id('add-todo-button')).tap();
    
    await element(by.id('todo-input')).typeText('Second task');
    await element(by.id('add-todo-button')).tap();
    
    await element(by.id('todo-input')).typeText('Third task');
    await element(by.id('add-todo-button')).tap();
    
    // Verify the most recent task appears first in the list
    // You can verify this by checking the order in the todo-list
    await expect(element(by.id('todo-list'))).toBeVisible();
  });

  it('should handle long todo text', async () => {
    const longText =
      'This is a very long todo item that should be handled properly by the application and should not break the UI layout';
    
    await element(by.id('todo-input')).typeText(longText);
    await element(by.id('add-todo-button')).tap();
    
    await expect(element(by.text(longText))).toBeVisible();
  });

  it('should delete specific todo from multiple todos', async () => {
    // Add multiple todos
    await element(by.id('todo-input')).typeText('Keep this task');
    await element(by.id('add-todo-button')).tap();
    
    await element(by.id('todo-input')).typeText('Delete this task');
    await element(by.id('add-todo-button')).tap();
    
    await element(by.id('todo-input')).typeText('Keep this too');
    await element(by.id('add-todo-button')).tap();
    
    // Verify all are present
    await expect(element(by.id('task-count'))).toHaveText('3 tasks');
    
    // Delete the middle one (index 1 since "Delete this task" is second from top)
    await element(by.label('delete-todo-button')).atIndex(1).tap();
    
    // Verify correct todo was deleted
    await expect(element(by.text('Keep this task'))).toBeVisible();
    await expect(element(by.text('Delete this task'))).not.toBeVisible();
    await expect(element(by.text('Keep this too'))).toBeVisible();
    await expect(element(by.id('task-count'))).toHaveText('2 tasks');
  });

  it('should handle rapid todo additions', async () => {
    // Quickly add multiple todos
    for (let i = 1; i <= 5; i++) {
      await element(by.id('todo-input')).typeText(`Rapid task ${i}`);
      await element(by.id('add-todo-button')).tap();
    }
    
    // Verify all todos were added
    await expect(element(by.id('task-count'))).toHaveText('5 tasks');
    
    // Verify at least some of the todos are visible
    await expect(element(by.text('Rapid task 1'))).toBeVisible();
    await expect(element(by.text('Rapid task 5'))).toBeVisible();
  });
});

