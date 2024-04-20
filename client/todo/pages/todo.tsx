import React, { useState, useEffect } from 'react'

function Todo() {
    const [tasks, setTasks] = useState<any[]>([])

    const fetchTasks = () => {
        fetch('http://localhost:8080/api/tasks')
        .then(response => response.json())
        .then(data => setTasks(data))
        .catch(error => console.log('error fetching tasks: ', error));
    };

    useEffect(() => {
        fetchTasks();
        const intervalId = setInterval(fetchTasks, 5000);
        return () => clearInterval(intervalId)
    }, []);

  return (
    <div>
        <h2>Tasks:</h2>
        <ul>
            {tasks.map(task => (
                <li key={task.id}>{task.id} {task.content}</li>
            ))}
        </ul>
    </div>
  );
}

export default Todo;