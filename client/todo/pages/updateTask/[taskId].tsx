import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import Router from 'next/router';

interface Task {
  id: number;
  content: string;
  date_created: string;
}

interface UpdateTaskProps {
}

function UpdateTask({}: UpdateTaskProps) {

  const [content, setTaskContent] = useState<string>('');
  const [taskId, setTaskId] = useState<number | null>(null);

  useEffect(() => {
    const pathname = window.location.pathname;
    const parts = pathname.split('/');
    const id = parseInt(parts[parts.length - 1]);
    if (!isNaN(id)) {
      setTaskId(id);
      
      fetch(`http://localhost:8080/api/task/${id}`)
      .then((response) => response.json())
      .then((data: Task) => {
        setTaskContent(data.content);
      })
      .catch((err) => {
        console.error('task fetch error', err);
      });
    };
  }, []);

  const handleContentChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTaskContent(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetch(`http://localhost:8080/api/update/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({content})
    })
    .then(response => response.json())
    .then(data => {
      console.log('task data updated: ', data);
    })
    .catch(error => {
      console.error('task update error: ', error);
    });
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type='text' value={content} onChange={handleContentChange}/>
        <button type='submit' onClick={() => Router.push(`/`)}>Update Task</button>
      </form>
    </div>
  )
}

export default UpdateTask;