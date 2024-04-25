import React from 'react';
import { createRoot } from 'react-dom/client';
import TodoList from './todo';
import AddTask from './addTask';

const App: React.FC<{ tab: string }> = ({tab}) => {
  return (
    <div>
      <h1>Task List</h1>
      <TodoList/>
      <AddTask/>
    </div>
  );
};

export default App;