import React, { useState, useEffect } from "react";

const getURL = "http://localhost:8084/menu"
const getByCategoryURl = "http://localhost:8084/menu/category?startAt=&maxResults="
const deleteURL = "http://localhost:8084/menu/"
const addAndUpdateURL = "http://localhost:8084/menu"
 
export default function Menu() {
    const [editing, setEditing] = useState(false);
    const [id, setID] = useState(0)
    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [data, setData] = useState([]);
    const [searchData, setSearchData] = useState([]);
    const [searchCategory, setSearchCategory] = useState('')

    // Get all
    useEffect(() => {
        fetch(getURL)
        .then(response => response.json())
        .then(data => setData(data));
    });

    // Get by category
    const getByCategory = (category) => {
        fetch(getByCategoryURl.replace("category", category))
        .then(response => response.json())
        .then(searchData => setSearchData(searchData));
    }

    // Delete
    const deleteFunc = (id) => {
        fetch(deleteURL + String(id), {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json'
            }
        }).then(data => data )
    }

    // Edit/Add
    const save = () => {
        var updateID
        if(editing) {
        updateID = id
        setEditing(false)
        }
        else {
        updateID = 0
        }
        fetch(addAndUpdateURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: updateID, name: name, category: category, description: description })
        }).then(data => data.json() )
    } 

    const editFunc = (id, name, category, description) => {
        setEditing(true)
        setID(id)
        setName(name)
        setCategory(category)
        setDescription(description)
    }
    
    return (
        <div>
        <div>
            <div>All dishes</div>

            <table>
            <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Edit</th>
                <th>Delete</th>
            </tr>
            </thead>
            <tbody>
            {data.map(el => (
                <tr key={el.id}>
                <td>{el.id}</td>
                <td>{el.name}</td>
                <td>{el.category}</td>
                <td>{el.description}</td>
                <td><button onClick={()=> editFunc(el.id, el.name, el.category, el.description)}>Edit</button></td>
                <td><button onClick={()=> deleteFunc(el.id)}>Delete</button>  </td>  
                </tr>
            ))}
            </tbody>
            </table><br/><br/>

            <div>Add or update dish</div>

            <form onSubmit={() => save()}>
            <label htmlFor="name">Name:</label><br/>
            <input type="text" id="name" name="name" value={name} onChange={(e)=>setName(e.target.value)}/><br/>
            <label htmlFor="category">Category:</label><br/>
            <input type="text" id="category" name="category" value={category} onChange={(e)=>setCategory(e.target.value)}/><br/>
            <label htmlFor="description">Description:</label><br/>
            <input type="text" id="description" name="description" value={description} onChange={(e)=>setDescription(e.target.value)}/><br/>   
            <input type="submit" value="Submit"></input>
            </form><br/><br/>
        </div>

        <div>
            <label htmlFor="searchCategory">Search by category:</label><br/>
            <input type="text" id="searchCategory" name="searchCategory" value={searchCategory} onChange={(e)=>setSearchCategory(e.target.value)}/><br/>
            <button onClick={()=> getByCategory(searchCategory)}>Find</button>
        </div>

        <div>Search results</div>
        
        <table>
            <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Description</th>
            </tr>
            </thead>
            <tbody>
            {searchData.map(el => (
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
