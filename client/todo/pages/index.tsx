import React from 'react';
import TodoList from './todo';
import AddTask from './addTask';


interface Task {
  id: number;
  content: string;
  date_created: string;
}

const App: React.FC = () => {
  return (
    <div>
    <h1>Task List</h1>
    <TodoList/>
    <AddTask />
    </div>
  );
};

export default App;