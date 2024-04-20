import React, { useState } from 'react'

function AddTask() {

    const [content, setTaskContent] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTaskContent(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        fetch('http://localhost:8080/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({content: content}),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add task');
            }
            setTaskContent('');
        })
        .catch(error => console.error('Error adding task: ', error));
    };

  return (
    <div>
        <p>Add Task:</p>
        <form onSubmit={handleSubmit}>
            <input
            type='text'
            placeholder='Task name'
            value={content}
            onChange={handleInputChange}
            />
            <button type='submit'>Add Task</button>
        </form>
    </div>
  )
};

export default AddTask;