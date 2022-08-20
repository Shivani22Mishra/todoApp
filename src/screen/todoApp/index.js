import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './styles.css';
import {IconContext} from 'react-icons';
import {HiOutlinePencilAlt} from 'react-icons/hi';
import {RiDeleteBinLine} from 'react-icons/ri';
import {BsPlusLg} from 'react-icons/bs';
import {setTodoDetails} from '../../redux';


export const Todo = () =>{
    const dispatch = useDispatch();
    const todoRecords = useSelector((state) => state?.todoRecords)

    const [enteredTodo, setEnteredTodo] = useState('');
    const [todoData, setTodoData] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [isEditClick, setIsEditClick] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState({});
    const [pendingTodos, setPendingTodos] = useState([]);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('todoList'));
        if(data?.length){
            dispatch(setTodoDetails(data));
            const pendingTodoList = data.filter(item => !item?.isCompleted)
            setPendingTodos(pendingTodoList)
        }
        
    },[todoData])

    const handleTodoAdd = () => {
        if(!enteredTodo){
            setErrorMsg('Please enter todo name');
            return;
        }
        let todos = [...todoRecords];
        if(isEditClick){
            const updatedTodo = todoRecords.map(item => {
                if(item?.id === selectedTodo?.id){
                    item = {...item, todoSubName: enteredTodo}
                }
                return item;
            })
            todos = [...updatedTodo]
        }else{

            const data = {
                id: Math.random(),
                todoSubName: enteredTodo,
                isCompleted: false
            }
            
            todos.push(data);
        }
        localStorage.setItem('todoList', JSON.stringify(todos));
        setTodoData(todos);
        setEnteredTodo('');
        setErrorMsg('');
        setIsEditClick(false);
        setSelectedTodo({});
    }
    
    const handleTodoEdit = (id) => {
        const fetchTodo = todoRecords.filter(item => item?.id === id);
        const selectedData = fetchTodo[0]
        setSelectedTodo(selectedData);
        setEnteredTodo(selectedData?.todoSubName);
        setIsEditClick(true);
    }
    
    const handleTodoDelete = (id) => {
        const data = [...todoData];
        const indexNo = todoData?.findIndex(item => item?.id === id);
        if(indexNo >= 0){
            data.splice(indexNo, 1);
            
            localStorage.setItem('todoList', JSON.stringify(data));
            setTodoData(data);
        }
    }

    const handleTodoComplete = (id) => {
        const updatedTodo = todoRecords.map(item => {
            if(item?.id === id){
                item = {...item, isCompleted: !item?.isCompleted}
            }
            return item;
        })
        localStorage.setItem('todoList', JSON.stringify(updatedTodo));
        setTodoData(updatedTodo);
    }

    const handleClearAll = () => {
        localStorage.setItem('todoList', JSON.stringify([]));
        dispatch(setTodoDetails([]));
        setTodoData([]);
    }
    return(
        <div className='container'>
            <h2>Todo App</h2>
            <div className='inpDiv'>
                <input className='inpField' type='text' name='todoSub'  placeholder='Add your new todo' value={enteredTodo} onChange={(e) => {setEnteredTodo(e.target.value); setErrorMsg('')}}/>
                <button className='button' name='addTodo' onClick={handleTodoAdd}>
                    <IconContext.Provider value={{ color: "white" }} >
                        <div> 
                            <BsPlusLg/>
                        </div>
                    </IconContext.Provider>
                </button>
            </div>
            {errorMsg && <h5 style={{color: 'red'}}>{errorMsg}</h5>}
            <div className='listContainer'>
            {todoRecords?.length ? todoRecords.map((item, index) =>  
                    <div className='listDiv' key={index}>
                        <label className={item?.isCompleted ? 'custom-radioBut custom-radioButCh' : 'custom-radioBut'}>
                            <input 
                                type='checkbox' 
                                name='CheckboxBut' 
                                checked={item?.isCompleted}
                                onChange={() => handleTodoComplete(item?.id)}/>
                            <span className='checkmark'></span>
                        </label>
                        <span className={item?.isCompleted ? 'todoCompSubTxt' : 'todoRemSubTxt'}>{item?.todoSubName}</span>
                        <div className='imgDiv' >    
                            <IconContext.Provider value={{ color: "red" }} >
                                <div onClick={() => handleTodoDelete(item?.id)}> 
                                    <RiDeleteBinLine/>
                                </div>
                            </IconContext.Provider>    
                        </div>
                        <div className='imgDiv'>
                            <IconContext.Provider value={{ color: "blue"}}>
                                <div 
                                onClick={() => handleTodoEdit(item?.id)}
                                >
                                    <HiOutlinePencilAlt/>
                                </div>
                            </IconContext.Provider>
                        </div>
                    </div>
                )
                :
                <h3 style={{textAlign: 'center'}}>Todo List is empty</h3>
            }        
            {!!todoRecords?.length && <div className='todoFooter'>
                {pendingTodos?.length ? 
                    <h5>You have {pendingTodos?.length} pending {pendingTodos?.length === 1 ? "task" : "tasks"}</h5>
                    :
                    <h5 style={{color: 'green'}}>Congratulations, you have done all tasks</h5>
                }
                <button className='clearBut' name="clear" onClick={handleClearAll}>Clear All</button>
            </div>}
            </div>
        </div>
    )
}