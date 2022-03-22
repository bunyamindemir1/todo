import React, {useEffect, useState} from "react";
import "./App.scss";
import {Button, Card, Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";


function Todo({todo, index, markTodo, removeTodo}) {
    return (
        <div
            className="todo"

        >
            <span style={{textDecoration: todo.isDone ? "line-through" : ""}} className={''}>{todo.text}</span>
            <div>
                <Button variant="outline-success" onClick={() => markTodo(index)}>✓</Button>{' '}
                <Button variant="outline-danger" onClick={() => removeTodo(index)}>✕</Button>
            </div>
        </div>
    );
}

function FormTodo({addTodo}) {
    const [value, setValue] = React.useState("");


    const handleSubmit = e => {
        e.preventDefault();
        if (!value) return;
        const data = JSON.stringify({
            "todolist": value,
            "isDone": false,

        });

        const config = {
            method: 'post',
            url: 'http://127.0.0.1:8000/api/todo',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });
        addTodo(value);
        setValue("");
    };

    return (

        <Form onSubmit={handleSubmit}>
            <div className={'formStyle'}>
                <Form.Group>
                    <Form.Label><b>Add Todo</b></Form.Label>
                    <Form.Control type="text" className="input" value={value} onChange={e => setValue(e.target.value)}
                                  placeholder="Yeni Ekle "/>
                </Form.Group>
                <Button className={'button-area'} variant="primary " type="submit">
                    +
                </Button>
            </div>
        </Form>

    );
}


function App() {
    useEffect(() => {
        let data = JSON.stringify({});

        const config = {
            method: 'get',
            url: 'http://127.0.0.1:8000/api/todo',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                setTodos(response.data)
            })
            .catch(function (error) {
                console.log(error);
            });

    }, []);


    const [todos, setTodos] = React.useState([]);

    const addTodo = text => {
        const newTodos = [...todos, {text}];
        setTodos(newTodos);
    };

    const markTodo = (index, id) => {
        const newTodos = [...todos];
        newTodos[index].isDone = true;
        doneApi(id);
        setTodos(newTodos);
    };

    const doneApi = (id) => {
        const data = JSON.stringify({
            "isDone": 1
        });

        const config = {
            method: 'get',
            url: 'http://127.0.0.1:8000/api/todo/' + id + '/edit/',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });

    };

    const deleteApi = (id) => {

        const data = JSON.stringify({});

        const config = {
            method: 'DELETE',
            url: 'http://127.0.0.1:8000/api/todo/' + id + '/',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    const [deleteId, setDeleteId] = useState();
    const removeTodo = (index, id) => {
        const newTodos = [...todos];
        newTodos.splice(index, 1);
        setDeleteId(id);
        setTodos(newTodos);
        deleteApi(id);
    };


    return (
        <div className="app">
            <div className="container">
                <h1 className="text-center mb-4">Todo List</h1>
                <FormTodo addTodo={addTodo}/>
                <div>
                    {todos.map((todo, index) => (
                        <Card>
                            <Card.Body>
                                <Todo
                                    key={index}
                                    index={index}
                                    todo={todo}
                                    markTodo={() => markTodo(index, todo.id)}
                                    removeTodo={() => removeTodo(index, todo.id)}
                                />
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;