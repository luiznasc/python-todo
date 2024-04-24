import React, { useState, useEffect } from 'react';

function Todo() {
    const [tasks, setTasks] = useState<any[]>([])

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080/ws/tasks');

        socket.onopen = () =>{
            console.log('WebSocket connection established');
        };

        socket.onmessage = event => {
            const data = JSON.parse(event.data);
            setTasks(data);
        };

        socket.onerror = error => {
            console.log('WebSocket connection error: ', error)
        };

        return () => {
            socket.close();
        };
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