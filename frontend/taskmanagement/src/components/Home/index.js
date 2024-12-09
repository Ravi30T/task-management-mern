import { useState, useEffect } from 'react'
import Cookies from 'js-cookie';
import { ThreeDots } from "react-loader-spinner";
import {Link} from 'react-router-dom'
import { IoHome } from "react-icons/io5";
import { IoIosContact } from "react-icons/io";
import { MdLogout } from "react-icons/md";

import './index.css'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const statusSelect = {
  todo: 'To Do',
  inProgress: 'In Progress',
  completed: 'Completed'
}

const requestStatus = {
  initial: 'INITIAL',
  progress: 'PROGRESS',
  done: 'DONE',
  failed: 'FAILED',
  noData: 'NO DATA'
}

const Home = () => {
    const [todoData, setTodoData] = useState([])
    const [task, setTask] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState(statusSelect.todo)
    const [error, setError] = useState('')
    const [dataStatus, setDataStatus] = useState(requestStatus.initial)
    const [editBtn, setEditBtn] = useState(false)
    const [updateTodoId, setUpdateTodoId] = useState('')
    const [filterTask, setFilterTask] = useState('All')

    const history = useHistory()


    const todosData = async () => {
      setDataStatus(requestStatus.progress)
      const url = 'https://task-manager-backend-utp2.onrender.com/tasks'
      const jwtToken = Cookies.get('jwt')
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`
        }
      })
      
      if (response.ok){
        const data = await response.json()
        if (data.length === 0){
          setDataStatus(requestStatus.noData)
          return
        }
        setDataStatus(requestStatus.done)
        setTodoData(data)
        setError('')
      } else {
        setDataStatus(requestStatus.failed)
        setError('Something went wrong')
      }
      
      
    }

    useEffect(() => {
      todosData()
    }, [])

    const onAddBtn = async () => {
      

      if (task === ''){
        setError('Please Enter Task Name')
        return
      } else if (description === ''){
        setError('Please Enter Description')
        return 
      }

      const todoTask = {
        title: task,task, status, description
      }


      try{
        const jwtToken = Cookies.get('jwt')
        const url = 'https://task-manager-backend-utp2.onrender.com/tasks'
        const response = await fetch(url,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`
          },
          body: JSON.stringify(todoTask)
        })
      } catch (e) {
        return 
        
      }

      setError('')
      setStatus(statusSelect.todo)
      setTask('')
      setDescription('')
      todosData()
    }


    const onDeleteTodo = async (id) => {
      const url = `https://task-manager-backend-utp2.onrender.com/tasks/${id}`
      const jwtToken = Cookies.get('jwt')

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`
        }
      });

      todosData()
    }
    

    const onEditTodo = async () => {

       const updateTodoData = {
        title: task, status, description
      }

      const url = `https://task-manager-backend-utp2.onrender.com/tasks/${updateTodoId}`
      const jwtToken = Cookies.get('jwt')

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`
        },
        body: JSON.stringify(updateTodoData)
      });

      console.log(response)

      setUpdateTodoId('')
      setEditBtn(false)
      setTask('')
      setDataStatus('')
      setStatus(statusSelect.todo)
      todosData()

    }


    const onUpdateTodoId = (id) => {
      setEditBtn(true)
      setUpdateTodoId(id)
    }

    const onLogoutBtn = () => {
      Cookies.remove('jwt')
      return history.push('/login')
    }

    const filterData = filterTask !== 'All' ? todoData.filter(each => each.status === filterTask) : todoData

    return (
      <>
      {
        dataStatus === requestStatus.progress && <div className='page-center-position'>
          <div className="products-loader-container">
        <ThreeDots type="ThreeDots" color="#0b69ff" height="50" width="50" />
      </div>
        </div>
      }

      {
        dataStatus === requestStatus.failed && <div className='page-center-position'>
          <div class="error-container">
          <h1>Something Went Wrong</h1>
          <p>We couldn't process your request. Please try again later.</p>
          <button class="retry-btn" onClick={todosData}>Retry</button>
      </div>
        </div>
      }

      {
        dataStatus === requestStatus.noData && 
        
        <div className="todos-container">

        <h1 className="todos-header">
          <h1>Tasks List</h1>
        </h1>
        <div className="add-task-container">
          <input type="text" value={task} className="task-input" onChange={e => setTask(e.target.value)} placeholder="Task Name" />
          <select value={status} className="status-select" onChange={e => setStatus(e.target.value)}>
            <option value="To Do">To Do</option>
            {/*<option value="Done">Done</option>*/}
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          {
            editBtn ? <button className="add-task-btn"  onClick={onEditTodo}>Save</button> : 
            <button className="add-task-btn" onClick={onAddBtn}>Add Task</button>
          }
        </div>
        <textarea className='description-box' onChange={e => setDescription(e.target.value)}></textarea>
        {error && <p className="error">{error}</p>}
        <div className="no-data-container">
          <h1>No Task's Available</h1>
        </div>
      </div>    
      
      }

      {
        dataStatus === requestStatus.done && <div className="todos-container">
        <h1 className="todos-header">
          <h1>Tasks List</h1>
        </h1>
        <div className="add-task-container">
          <input type="text" value={task} className="task-input" onChange={e => setTask(e.target.value)} placeholder="Task Name" />
          <select value={status} className="status-select" onChange={e => setStatus(e.target.value)}>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          {
            editBtn ? <button className="add-task-btn"  onClick={onEditTodo}>Save</button> : 
            <button className="add-task-btn" onClick={onAddBtn}>Add Task</button>
          }
        </div>
        <textarea className='description-box' onChange={e => setDescription(e.target.value)}></textarea>
        {error && <p className="error">{error}</p>}

        <select className="status-select filter-option" onChange={e => setFilterTask(e.target.value)}>
        <option value="All">All</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        <ul className="todos-list">
          {
            filterData.map(each => (
              <li className="todo-item" key={each.id}>
                <div className="todo-content">
                  <p className="todo-title">{each.title}</p>
                  <p className="task-description">{each.description}</p>
                </div>
                <span className="todo-status todo">{each.status}</span>
                <div className="todo-actions">
                  <button className={editBtn ? 'edit-btn-disabled' : 'edit-btn'} onClick={() => onUpdateTodoId(each.id)} disabled={editBtn}>Edit</button>
                  <button className={editBtn ? 'delete-btn-disabled' : 'delete-btn'} onClick={() => onDeleteTodo(each.id)} disabled={editBtn}>Delete</button>
                </div>
                
              </li>
            ))
          }
        </ul>
      </div>
      }

      
    </>
    )
}

export default Home