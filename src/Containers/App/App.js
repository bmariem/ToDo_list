// Lib
import React, { useState, useRef, useEffect } from 'react';
import classes from './App.module.css';
import axios from '../../axios-firebase';

// Components
import Task from '../../Components/Task/Task'
import Spinner from '../../Components/UI/Spinner/Spinner'


function App() {
  // States
  const [taskList, setTaskList] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Ref
  const inputRef = useRef('');

  // lifecycle  
  // <=> ~ componentDidMount
  useEffect(() => {
    inputRef.current.focus();
    
    fetchTask();
  }, []);

  // Methods
  const removeTaskClickedHandler = index => {
    const updatedTaskList = [...taskList];
    updatedTaskList.splice(index, 1);
    setTaskList(updatedTaskList);
    
    // Axios
    axios
      .delete('/ToDoList/' + taskList[index].id + '.json' )
      .then(response => {
        console.log(response)
      })
      .catch(error=> {
        console.log(error)
      });
  };

  const checkTaskClickedHandler = index => {
    const updatedTaskList = [...taskList];
    updatedTaskList[index].done = !taskList[index].done ;
    setTaskList(updatedTaskList);

    // Axios
    axios
      .put('/ToDoList/' + taskList[index].id + '.json', taskList[index] )
      .then(response => {
        console.log(response);
        fetchTask();
      })
      .catch(error=> {
        console.log(error)
      });
  };

  const submitTaskHandler = e => {
    e.preventDefault();

    let newListTask = {
      content: input,
      done: false
    };    
    
    setTaskList([newListTask, ...taskList]);
    setInput('');

    // Axios
    axios
        .post('/ToDoList.json', newListTask )
        .then(response => {
          console.log(response);
          fetchTask();
        })
        .catch(error =>{
          console.log(error);
        });
  };

  const addTaskChangedHandler = event => {
    setInput(event.target.value);
  };

  const fetchTask = () => {
    setLoading(true);
    
    // Axios
    axios
    .get('/ToDoList.json' )
    .then(response => {
      const newListTask = [];
      for (let key in response.data) {
        newListTask.push({
          ...response.data[key],
          id: key
        });
      }

      setTaskList(newListTask);
      setLoading(false);
    })
    .catch(error =>{
      console.log(error);
      setLoading(false);
    });
  };


  // Variables
  let displayList = taskList.map((task, index) => {
    return (
      <Task 
        key = {index}
        content = {task.content}
        done = {task.done}
        removeTask = {() => { removeTaskClickedHandler(index)}}
        checkTask = { (e) => { checkTaskClickedHandler(index, e)}}
      />
    );
  });


  // JSX
  return (
    <div className={classes.App}>
      <header>
        <span>TODO List</span>
        <i className={classes.description}>React Project</i>
      </header>
      <div className={classes.add}>
        <form onSubmit={(e) => submitTaskHandler(e)}> 
          <input
            type="text" 
            value={input}
            ref={inputRef}
            onChange={(e) => addTaskChangedHandler(e)} 
            placeholder="What do you want to add?" 
          />
          <button type="submit">
            Add
          </button>
        </form>
      </div>
          
      { loading ? <Spinner/> : <>{displayList}</> }
          
    </div>
  );
}

export default App;
