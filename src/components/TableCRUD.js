import React, { useEffect, useState } from "react";
import PageFooter from "./PageFooter";

const tableEndpoint = 'http://localhost:8989/tables'
const searchTableEndpoint = `${tableEndpoint}/attributes`

export default function TableCRUD() {
    const [table, setTable] = useState({ id:"", seats: "", status: ""})
    const [tables, setTables] = useState([])
    const [next, setNextPage] = useState("")
    const [state, setState] = useState("Search")
    const [seatsError, setSeatsError] = useState("")
    const [page, setPage] = useState(0)
    const elementsPerPage = 5

    useEffect(() => {
        load()
    }, []);

    const load = (startPage = page) =>{
        fetch(`${tableEndpoint}?startAt=${startPage * elementsPerPage}&maxResults=${elementsPerPage}`, {
            method: 'GET'
        })
         .then(response => response.json())
         .then(data => checkLoadedRecords(data));
    }

    const checkLoadedRecords = (data) => {
        if (!data.error) {
            if (data.length === 0) {
                setTables(tables)
                setPage(page)
                setNextPage("")
            } else {
                setTables(data)
                setNextPage("+")
            }
        }
    }

    const submit = () => {
        switch (state) {
            case "Update":
                update()
                break
            case "Search":
                search()
                break
            default:
                break
        }
    }

    const search = () => {
        prepareSearch()
        fetch(`${searchTableEndpoint}?maxResults=${elementsPerPage}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...table })
        })
        .then(res => res.json())
        .then(data => checkSearchedResult(data))
    }

    const prepareSearch = () => {
        setSeatsError("")
        setPage(0)
    }

    const checkSearchedResult = (data) => {
        if (!data.error) {
            setTables(data)
        }
    }

    const prepareUpdate = (currentTable) => {
        reset()
        setState("Update")
        setTable(currentTable)
    }

    const update = () => {
        fetch(tableEndpoint,  {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ ...table })
        })
        .then(res =>  res.json())
        .then(() => load())
    }

    const inputTable = (newTable) => {
        if (state === "Update" && newTable.attribute === "seats") {
            setSeatsError("Can not update seats")
        } else {
            setTable({ ...table, [newTable.attribute]: newTable.value })
        }
    }

    const reset = () => {
        setState("Search")
        setSeatsError("")
        setTable({ id: "", seats: "", status: "" })
    }
 
    return (
        <div className={"mainPage"}>
            <div className={"pageSection"}>
                <h1>Table Form</h1>
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
                        <td> { table.id } </td>
                        <td>
                            <input
                                type="number"
                                min="1"
                                value={ table.seats }
                                onChange={ (e) => inputTable (
                                     { attribute: "seats", value: e.target.value })
                                }
                            />
                            <div className = { "errorLog" }>{ seatsError }</div>
                        </td>
                        <td>
                            <select value={ table.status }
                                    onChange={ (e) =>
                                    inputTable({ attribute: "status", value: e.target.value })}
                            >
                                <option value=""/>
                                <option value="available">available</option>
                                <option value="unavailable">unavailable</option>
                            </select>
                        </td>
                        <td>
                            <button onClick={ () => submit() }>{ state }</button>
                        </td>
                        <td>
                            <button onClick={ () => reset() }>Reset</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            </div>
            <div className={"pageSection"}>
                <h1>Table List</h1>
                <table>
                    <thead>
                        <th>ID</th>
                        <th>Seats</th>
                        <th>Status</th>
                        <th>Action 1</th>
                    </thead>
                    <tbody>
                    { tables.map(el => (
                        <tr>
                            <td>{ el.id }</td>
                            <td>{ el.seats }</td>
                            <td>{ el.status }</td>
                            <td>
                                <button className={"updateButton"} onClick={ () => prepareUpdate(el) }>Update</button>
                            </td>
                        </tr>
                    )) }
                    </tbody>
                </table>

                <PageFooter
                    reset={ reset }
                    load={ load }
                    setPage={ setPage }
                    page={ page }
                    next={ next }
                />
            </div>
        </div>
    );
}