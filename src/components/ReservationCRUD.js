import React, { useEffect, useState } from "react";
import { errorLog } from "../styles/styles";
import DateTimePicker from "./DateTime"
import PageFooter from "./PageFooter"

const reservationEndpoint = 'http://localhost:8989/reservations'
const adminEndpoint = 'http://localhost:8989/users/reservations'
const searchAdminEndpoint = `${adminEndpoint}/attributes`

export default function ReservationCRUD() {
    const [reservation, setReservation] = useState(
        { id: "", name: "", email: "", phone: "", tableId: "", seats: "", startTime: new Date(), note: "", status: "" }
    )
    const [reservations, setReservations] = useState([])
    const [nameError, setNameError] = useState("")
    const [phoneError, setPhoneError] = useState("")
    const [tableIdError, setTableIdError] = useState("")
    const [seatsError, setSeatsError] = useState("")
    const [startTimeError, setStartTimeError] = useState("")
    const [actionResult, setActionResult] = useState("")
    const [emailError, setEmailError] = useState("")
    const [state, setState] = useState("Create")
    const [next, setNextPage] = useState("")
    const [page, setPage] = useState(0)
    const elementsPerPage = 5

    useEffect(() => {
       load()
    }, []);

    const load = (startPage = page) => {
        fetch(`${adminEndpoint}?startAt=${startPage * elementsPerPage}&maxResults=${elementsPerPage}`)
        .then(response => response.json())
        .then(data => checkLoadedRecords(data));
    }

    const checkLoadedRecords = (data) => {
        if (!data.error) {
            if (data.length === 0) {
                setReservations(reservations)
                setPage(page)
                setNextPage("")
            } else {
                setReservations(data)
                setNextPage("+")
            }
        }
    }

    const search = () => {
        prepareSearch()
        const searchFields = convertTimeField()
        fetch(`${ searchAdminEndpoint }?maxResults=${elementsPerPage}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(searchFields)
        })
        .then(res => res.json())
        .then(data => checkSearchResult(data))
    }

    const prepareSearch = () => {
        resetError()
        setPage(0)
    }

    const checkSearchResult = (data) => {
        if (!data.error) {
            setReservations(data)
        }
    }

    const prepareUpdate = (reservation) => {
        reset()
        setReservation(reservation)
        setState("Update")
    }

    const submitReservation = () => {
        if (validate()) {
            const method = (state === "Update") ? "PUT" : "POST"
            const submitReservation = convertTimeField()
            fetch(adminEndpoint, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submitReservation)
            })
                .then(res => res.text())
                .then(res => checkError(res))
                .catch(() => { setActionResult("Action Failed") })
        }
    }

    const validate = () => {
        resetError()
        const phoneNoRegex = /^\d{10,20}$/
        const nameRegex = /[A-Za-z]+/
        const emailRegex = /.*[@].*/
        const { phone, name, email, tableId, startTime } = reservation
        let valid = 1
        if (!phone.match(phoneNoRegex)){
            setPhoneError("Phone must have 10 - 20 digits")
            valid = 0
        }
        if (!name.match(nameRegex)){
            setNameError("Name must not be empty.")
            valid = 0
        }
        if (!email.match(emailRegex)){
            setEmailError("Email address must contain at least an @ character.")
            valid = 0
        }
        if (tableId <= 0 || tableId === ""){
            setTableIdError("Table id must be a positive number")
            valid = 0
        }
        if (startTime === null) {
            setStartTimeError("Start time must have format MM/DD/YYYY, HH:MM AM/PM")
            valid = 0
        }
        if (state === "Create" && reservation.seats) {
            setSeatsError("Can not specify seats for table")
            valid = 0
        }
        return valid
    }

    const convertTimeField = () => {
        let newReservation = { ...reservation }
        const { startTime } = newReservation
        if (startTime ) {
            const convertedTime = new Date(newReservation.startTime)
            convertedTime.setSeconds(0)
            convertedTime.setMilliseconds(0)
            convertedTime.setHours(convertedTime.getHours() +7)
            newReservation = {
                ...newReservation,
                "startTime": new Date(convertedTime).toJSON()
            }
        }
        return newReservation
    }

    const getIndochinaTime = (time) => {
        return new Date(time).toLocaleString()
    }

    const checkError = (res) => {
        if (res.includes("Failed")) {
            setActionResult("Action Failed")
        } else {
            setActionResult("Action Completed")
        }
    }

    const deleteReservation = (id) => {
        fetch(`${reservationEndpoint}/${id}`, { method: 'DELETE' })
        .then(res =>  res.text())
        .then(res => checkDelete(res))
    }

    const checkDelete = (res) => {
        if (res.includes("Deleted")) {
            if (reservations.length === 1) {
                if (page > 0) {
                    setPage(page - 1)
                    load(page - 1)
                } else {
                    setReservations([])
                }
            } else {
                load()
            }
        }
    }

    const inputReservation = (newReservation) => {
        if (newReservation) {
            if (state === "Update" && newReservation.attribute === "seats") {
                setSeatsError("Can not update seats")
            } else {
                setReservation({...reservation, [newReservation.attribute]: newReservation.value})
            }
        }
    }

    const reset = () => {
        setState("Create")
        setReservation({ id: "", name: "", email: "", phone: "", tableId: "", seats: "", startTime: new Date(), note: "", status: "" })
        resetError()
    }

    const resetError = () => {
        setNameError("")
        setPhoneError("")
        setEmailError("")
        setTableIdError("")
        setSeatsError("")
        setStartTimeError("")
        setActionResult("")
    }

return (
        <div>
            <h1>Reservation Form</h1>
            <div style={ errorLog }>{ actionResult }</div>
            <table>
                <thead>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Table Id</th>
                    <th>Seats</th>
                    <th colSpan="2">Start time</th>
                    <th>Note</th>
                    <th>Status</th>
                    <th>Action 1</th>
                    <th>Action 2</th>
                    <th>Action 3</th>
                </thead>
                <tbody>
                    <tr>
                        <td> { reservation.id } </td>
                        <td>
                            <input
                                type="text"
                                value={ reservation.name }
                                onChange={ (e) => inputReservation(
                                    { attribute: "name", value: e.target.value })
                                }
                            />
                            <div style={ errorLog }>{ nameError }</div>
                        </td>
                        <td>
                            <input
                                type="text"
                                value={ reservation.email }
                                onChange={ (e) => inputReservation(
                                    { attribute: "email", value: e.target.value })
                                }
                            />
                            <div style={ errorLog }>{ emailError }</div>
                        </td>
                        <td>
                            <input
                                type="text"
                                value={ reservation.phone }
                                onChange={ (e) => inputReservation(
                                    { attribute: "phone", value: e.target.value })
                                }
                            />
                            <div style={ errorLog }>{ phoneError }</div>
                        </td>
                        <td>
                            <input
                                type="number"
                                min="1"
                                value={ reservation.tableId }
                                onChange={ (e) => inputReservation(
                                    { attribute: "tableId", value: e.target.value })
                                }
                            />
                            <div style={ errorLog }>{ tableIdError }</div>
                        </td>
                        <td>
                            <input
                                type="number"
                                min="1"
                                value={ reservation.seats }
                                onChange={ (e) => inputReservation(
                                    { attribute: "seats", value: e.target.value })
                                }
                            />
                            <div style={ errorLog }>{ seatsError }</div>
                        </td>
                        <td colSpan="2">
                            <DateTimePicker
                                startTime={ reservation.startTime }
                                updateReservation={ inputReservation }
                            />
                            <div style={ errorLog }>{ startTimeError }</div>
                        </td>
                        <td>
                            <textarea
                                value={ reservation.note }
                                onChange={ (e) => inputReservation(
                                    { attribute: "note", value: e.target.value })
                                }
                            />
                        </td>
                        <td>
                            <select value={ reservation.status }
                                    onChange={ (e) =>
                                        inputReservation({ attribute: "status", value: e.target.value })}
                            >
                                <option value=""/>
                                <option value="booked">booked</option>
                                <option value="cancelled">cancelled</option>
                                <option value="done">done</option>
                            </select>
                        </td>
                        <td>
                            <button onClick={ () => submitReservation() }>{ state }</button>
                        </td>
                        <td>
                            <button onClick={ () => search() }>Search</button>
                        </td>
                        <td>
                            <button onClick={ () => reset() }>Reset</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <h1>Reservation List</h1>
            <table>
                <thead>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Table Id</th>
                    <th>Seats</th>
                    <th>Start time</th>
                    <th>Note</th>
                    <th>Status</th>
                    <th>Action 1</th>
                    <th>Action 2</th>
                </thead>
                <tbody>
                { reservations.map(el => (
                    <tr>
                        <td>{ el.id}</td>
                        <td>{ el.name }</td>
                        <td>{ el.email }</td>
                        <td>{ el.phone }</td>
                        <td>{ el.tableId }</td>
                        <td>{ el.seats }</td>
                        <td>
                            { getIndochinaTime(el.startTime) }
                        </td>
                        <td>{ el.note }</td>
                        <td>{ el.status }</td>
                        <td>
                            <button onClick={() => prepareUpdate(el) }>Update</button>
                        </td>
                        <td>
                            <button onClick={() => deleteReservation(el.id) }>Delete</button>
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
    );
}
