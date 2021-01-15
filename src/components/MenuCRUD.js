import React, { useState, useEffect } from "react";
import PageFooter from "./PageFooter";
import {errorLog} from "../styles/styles";

const dishEndpoint = "http://localhost:8989/menu"
const searchDishEndpoint = "http://localhost:8989/menu/attributes"
 
export default function Menu() {
    const [id, setID] = useState('')
    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [dishes, setDishes] = useState([]);
    const [searchDishes, setSearchDishes] = useState([])
    const [actionResult, setActionResult] = useState("")
    const [nameError, setNameError] = useState("")
    const [state, setState] = useState('Create')
    const [next, setNextPage] = useState("")
    const [page, setPage] = useState(0)
    const elementsPerPage = 2

    useEffect(() => {
        load()
    }, []);

    const load = (startPage = page) => {
        fetch(`${dishEndpoint}?startAt=${startPage * elementsPerPage}&maxResults=${elementsPerPage}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => checkLoadedRecords(data));
    }

    const checkLoadedRecords = (data) => {
        if (!data.error) {
            if (data.length === 0) {
                setDishes(dishes)
                setPage(page)
                setNextPage("")
            } else {
                setDishes(data)
                setNextPage("+")
            }
        }
    }

    const search = () => {
        resetError()
        fetch(`${searchDishEndpoint}?maxResults=${elementsPerPage}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({name: name, category: category, description: description})
        })
        .then(response => response.json())
        .then(data => checkSearchedResult(data));
    }

    const checkSearchedResult = (data) => {
        if (!data.error) {
            setSearchDishes(data)
        }
    }

    const deleteFunc = (id) => {
        resetError()
        fetch(`${dishEndpoint}/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res =>  res.text())
        .then(res => checkDelete(res))
    }

    const checkDelete = (res) => {
        if (res.includes("Deleted")) {
            if (dishes.length === 1) {
                if (page > 0) {
                    setPage(page - 1)
                    load(page - 1)
                } else {
                    setDishes([])
                }
            } else {
                load()
            }
        }
    }

    const submitDish = () => {
        if (validate()) {
            const method = (state === "Edit") ? "PUT" : "POST"
            fetch(dishEndpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id, name: name, category: category, description: description })
            })
                .then(res => res.json())
                .then(() => {
                    setActionResult("Action Completed")
                    load()
                })
                .catch(() => { setActionResult("Action Failed") })
        }

    }

    const validate = () => {
        resetError()
        let valid = 1
        const nameRegex = /[A-Za-z]+/
        if (!name.match(nameRegex)){
            setNameError("Name must not be empty.")
            valid = 0
        }
        return valid
    }

    const editFunc = (id, name, category, description) => {
        resetError()
        setState("Edit")
        setID(id)
        setName(name)
        setCategory(category)
        setDescription(description)
    }

    const reset = () => {
        setID("")
        setState("Create")
        setCategory("")
        setDescription("")
        setName("")
        resetError()
    }

    const resetError = () => {
        setActionResult("")
        setNameError("")
    }

    return (
        <div>
            <h1>Dishes Form</h1>
            <div style={ errorLog }>{ actionResult }</div>
            <table>
                <thead>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Action 1</th>
                <th>Action 2</th>
                <th>Action 3</th>
                </thead>
                <tbody>
                <td>{id}</td>
                <td>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <div style={ errorLog }>{ nameError }</div>
                </td>
                <td>
                    <select value={ category }
                            onChange={ (e) =>
                                setCategory(e.target.value)}
                    >
                        <option value=""/>
                        <option value="appetizer">appetizer</option>
                        <option value="main">main</option>
                        <option value="dessert">dessert</option>
                    </select>
                </td>
                <td>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </td>
                <td>
                    <button onClick={ () => submitDish() }>{ state }</button>
                </td>
                <td>
                    <button onClick={ () => search() }>Search</button>
                </td>
                <td>
                    <button onClick={ () => reset() }>Reset</button>
                </td>
                </tbody>
            </table>

            <h1>Dishes List</h1>
            <table>
                <thead>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </thead>
                <tbody>
                {dishes.map(el => (
                    <tr key={el.id}>
                        <td>{el.id}</td>
                        <td>{el.name}</td>
                        <td>{el.category}</td>
                        <td>{el.description}</td>
                        <td>
                            <button onClick={() => editFunc(el.id, el.name, el.category, el.description)}>Edit</button>
                        </td>
                        <td>
                            <button onClick={() => deleteFunc(el.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <PageFooter
                reset={ reset }
                load={ load }
                setPage={ setPage }
                page={ page }
                next={ next }
            />

            <h1>Search results</h1>
            <table>
                <thead>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Description</th>
                </thead>
                <tbody>
                {searchDishes.map(el => (
                    <tr key={el.id}>
                    <td>{el.id}</td>
                    <td>{el.name}</td>
                    <td>{el.category}</td>
                    <td>{el.description}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
