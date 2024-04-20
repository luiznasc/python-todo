import React, { useEffect, useState } from 'react'
import Todo from './todo'
import AddTask from './addTask'

function Index() {
  return (
    <div>
      <h1>Task List</h1>
      <Todo/>
      <AddTask/>
    </div>
  )
}

export default Index