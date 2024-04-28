import React, { Component } from 'react';
import {io, Socket} from 'socket.io-client';
import Router from 'next/router';
import DeleteTask from './deleteTask'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

interface Task {
    id: number;
    content: string;
    date_created: string;
}
  

interface State {
    tasks: Task[];
}

class TodoList extends Component<{}, State> {
    private socket: Socket | null = null;

    constructor(props: {}){
        super(props);
        this.state = {
            tasks: [],
        };
    }

    componentDidMount() { 
        if (typeof window !== 'undefined') {
            this.socket = io('http://localhost:8080/tasks')
            this.socket.on('tasks_data', (data: Task[] | any) => {
                this.setState({ tasks: JSON.parse(data) });
            });
        }
    }

    componentWillUnmount() {
        if (this.socket){
            this.socket.disconnect();
        }
    }

    render() {
        const {tasks} = this.state;

        if (tasks.length === 0) {
            return <div>No Task</div>;
        }

        return (
            <div style={{ display: 'inline-block', margin: 0, padding: 0 }}>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {tasks.map(task => (
                        <li key={task.id} style={{ display: 'table', marginRight: '10px', padding: '7px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span>{task.id} - {task.content}</span>
                                <div style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
                                    <FontAwesomeIcon icon={faEdit} onClick={() => Router.push(`/updateTask/` + task.id)} style={{ cursor: 'pointer'}}/><DeleteTask task={task}/>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        )
    };
};

export default TodoList;