from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError
from flask_cors import CORS
from datetime import datetime
from flask_socketio import SocketIO
import json

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'

db = SQLAlchemy(app)

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return '<Task %r>' % self.id
    
@app.cli.command('initdb')
def initdb():
    db.create_all()
    print('initialized the sqlite database')

@app.route('/api/task/<int:id>', methods=['GET'])
def getTask(id):
    task = Todo.query.get_or_404(id)
    task = {
        'id': task.id,
        'content': task.content,
        'date_created': task.date_created.strftime('%Y-%m-%d %H:%M:%S'),
    }
    return task

@app.route('/api/tasks', methods=['POST', 'GET'])
def tasks():
    if request.method == 'POST':
        task_content = request.json.get("content")
        new_task = Todo(content=task_content)
        try:
            db.session.add(new_task)
            db.session.commit()
            emit_tasks_data()
            return jsonify({'success': True})
        except SQLAlchemyError as e:
            db.session.rollback()
            error_message = str(e)
            print("Error: ", error_message)
            return jsonify({
                'message': "couldn't add task. Error: {}".format(error_message),
            })
        
        
    else:
        tasks = Todo.query.order_by(Todo.date_created).all()
        serialized_tasks = []
        for task in tasks:
            serialized_tasks.append({
                'id': task.id,
                'content': task.content,
                'date_created': task.date_created.strftime('%Y-%m-%d %H:%M:%S'),
            })
        return jsonify(serialized_tasks)
    
@app.route('/api/delete/<int:id>', methods=['DELETE'])
def delete(id):
    task_to_delete = Todo.query.get_or_404(id)
    
    try:
        db.session.delete(task_to_delete)
        db.session.commit()
        emit_tasks_data()
        return jsonify({
            'message': 'Task deleted',
        })
    except:
        return jsonify({
            'message': 'problem deleting task',
        })
    
@app.route('/api/update/<int:id>', methods=['GET','PUT'])
def update(id):
    task = Todo.query.get_or_404(id)
    if request.method == 'PUT':
        task.content = request.json.get('content')
        try:
            db.session.commit()
            emit_tasks_data()
            return jsonify({'message':'success'})
        except:
            return jsonify({'message':'error updating task'})
    else:
        task = {
            'id': task.id,
            'content': task.content,
            'date_created': task.date_created.strftime('%Y-%m-%d %H:%M:%S'),
        }
        return task
    
@socketio.on('connect', namespace='/tasks')
def tasks_socket():
    print("WebSocket client connected to /tasks namespace")
    emit_tasks_data()
    
def emit_tasks_data():
    tasks = Todo.query.order_by(Todo.date_created).all()
    serialized_tasks = [{
        'id': task.id,
        'content': task.content,
        'date_created': task.date_created.strftime('%Y-%m-%d %H:%M:%S'),
    } for task in tasks]
    socketio.emit('tasks_data', json.dumps(serialized_tasks), namespace='/tasks')
    
if __name__ == '__main__':
    socketio.run(app, debug=True, port=8080)