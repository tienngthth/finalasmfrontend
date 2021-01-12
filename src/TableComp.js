import React, {useEffect, useState} from "react";
const tableEndPoint = 'http://localhost:8082/tables'
const searchTableEndPoint = 'http://localhost:8082/tables/attributes'

export default function TableComp() {
    const [table, setTable] = useState({ id:"",seats: "",status: ""})
    const [tables, setTables] = useState([])
    const elementsPerPage = 6
    const [state, setState] = useState("Create")
    const [next, setNextPage] = useState("")
    const [page, setPage] = useState(0)

    useEffect(() => {
        load()
    }, []);

    const load = (startPage = page) =>{
        fetch(`${tableEndPoint}?startAt=${startPage * elementsPerPage}&maxResults=${elementsPerPage}`, {
            method: 'GET'
        })
         .then(response => response.json())
         .then(data => {
            if (data.length === 0) {
                setTables(tables)
                setPage(page)
                setNextPage("")
            } else {
                setTables(data)
                setNextPage("+")
            }
         });

    }

    const prevPage = () => {
        if (page > 0) {
            setPage(page - 1)
            load(page - 1)
        } else {
            load(page)
        }
    }

    const nextPage = () => {
        setPage(page + 1)
        load(page + 1)
    }

    const search = (startPage = page) => {
        console.log(table)
        console.log("a")
        fetch(`${searchTableEndPoint}?startAt=0&maxResults=5`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({...table})
        })
        .then(res =>  res.json())
        .then(data => {
            console.log(data)
            setTables(data)
        })
    }

    const update = (startPage = page) => {
        fetch(tableEndPoint,  {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({...table})
        })
        .then(res =>  res.json())
        .then(() => load())
    }

    const prepareUpdate = (temp) => {

        setTable(temp)
        console.log("table is called")
        console.log(table)

        setState("Update")
    }

    const inputTable = (newTable) => {
        setTable({...table, [newTable.action]: newTable.value})
    }

    const resetError = () => {
        // setFullNameError("")
        // setParentNameError("")
        // setPhoneError("")
        // setAddressError("")
        // setEmailError("")
    }
 
    return (
        <div>
            <div>
                <h1>Table Search</h1>
                <div style={{ fontSize: 12, color: "red" }}>{}</div>

                <table>
                    <thead>
                        <th>ID</th>
                        <th>Seat</th>
                        <th>Status</th>
                        <th>Action 1</th>
                        <th>Action 2</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td> {table.id} </td>
                            <td>
                                <input
                                    type="text"
                                    value={ table.seats }
                                    onChange={ (e) => inputTable (
                                         {action: "seats", value: e.target.value})
                                    }
                                />
                                <div style={{ fontSize: 12, color: "red" }}>{}</div> 
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={ table.status }
                                    onChange={ (e) => inputTable (
                                        {action: "status", value: e.target.value})
                                    }
                                />
                                <div style={{ fontSize: 12, color: "red" }}>{}</div>
                            </td>
                            <td>
                            
                                <button onClick={ () => search() }>Search</button>
                            </td>
                            <td>
                                <button onClick={ () => update() }>Update</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div>
                <h1>Table List</h1>

                <table>
                    <thead>
                        <th>ID</th>

                        <th>Seat</th>
                        
                        <th>Status</th>
                       
                        <th>Action 1</th>
                    </thead>
                    <tbody>
                    { tables.map(el => (
                        <tr>
                            <td>{el.id}</td>
                            <td>{el.seats}</td>
                            <td>{el.status}</td>
                            <td>
                                <button onClick={() => prepareUpdate(el) }
                                >Update</button>
                            </td>
                           
                        </tr>
                    )) }
                    </tbody>
                </table>
                <div className="page-numbers">
                    <span
                        style={{  cursor: "pointer", marginRight: "10px"}}
                        onClick={() => prevPage()}
                    >-</span>
                    <span>{page + 1}</span>
                    <span style={{  cursor: "pointer", marginLeft: "10px"}}
                          onClick={() => nextPage()}>{next}</span>
                </div>
            </div>
        </div>
    );
}