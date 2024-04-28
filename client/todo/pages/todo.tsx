import React, { Component } from 'react';
import {io, Socket} from 'socket.io-client';
import Router from 'next/router';
import DeleteTask from './deleteTask'

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
            <div >
                <ul>
                    {tasks.map(task => (
                        <li key={task.id}>
                            {task.id} - {task.content} <DeleteTask task={task}/>
                            <button type="button" onClick={() => Router.push(`/updateTask/` + task.id)}>update</button>
                        </li>
                    ))}
                </ul>
            </div>
        )
    };
};

export default TodoList;