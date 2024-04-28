import React, { useState, MouseEventHandler, MouseEvent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';


interface Task {
  id: number;
  content: string;
  date_created: string;
}

interface UpdateTaskProps {
  task: Task;
}

function UpdateTask({ task }: UpdateTaskProps) {

  const [content, setTaskContent] = useState<string>(task.content);

  const handleClick = (event: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    fetch(`http://localhost:8080/api/delete/${task.id}`, {
      method: 'DELETE',
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
        <FontAwesomeIcon icon={faTrashAlt} onClick={handleClick} style={{ cursor: 'pointer', marginLeft: '5px' }} />
    </div>
  )
}

export default UpdateTask;