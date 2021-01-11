import React, {useEffect, useState} from "react";

const getAllEndPoint = 'http://localhost:8080/students/all'
const newStudentEndPoint = 'http://localhost:8080/students/new'
const updateStudentEndPoint = 'http://localhost:8080/students/update'
const deleteStudentEndPoint = 'http://localhost:8080/students/delete'

export default function StudentComp() {
    const [student, setStudent] = useState(
        {id: "", fullName: "", parentName: "", phone: "", email: "", address: "", grade: "1"}
        )
    const [students, setStudents] = useState([])
    const [fullNameError, setFullNameError] = useState("")
    const [parentNameError, setParentNameError] = useState("")
    const [addressError, setAddressError] = useState("")
    const [phoneError, setPhoneError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [state, setState] = useState("Create")
    const [pageNumbers, setPageNumbers] = useState([0])
    const [page, setPage] = useState(0)
    const elementsPerPage = 1
    const [sortBy, setSortBy] = useState("name")

    useEffect(() => {
       load()
    }, []);

    const load = () =>{
        fetch(getAllEndPoint)
        .then(response => response.json())
        .then(data => {
            updatePageNumbers(data)
            setStudents(data)
        });
    }

    const updatePageNumbers = (students) => {
        const maxPageNumbers = Math.ceil(students.length / elementsPerPage)
        const newPageNumbers = []
        for (let i = 0; i < maxPageNumbers; i++) {
            newPageNumbers.push(i)
        }
        setPageNumbers([...newPageNumbers])
        if (page === maxPageNumbers && page > 0) {
            setPage(page - 1)
        }
    }

    const getStudents = () => {
        const paginatedStudents = students.slice(page*elementsPerPage, page*elementsPerPage + elementsPerPage)
        return paginatedStudents.sort((a, b) => {
            if (a[sortBy] > b[sortBy]) {
                return 1
            }
            if (a[sortBy] < b[sortBy]) {
                return -1
            }
            return 0
        })
    }

    const prevPage = () => {
        if (page > 0) {
            setPage(page - 1)
        }
    }

    const nextPage = () => {
        if (page < pageNumbers.slice(-1)[0]) {
            setPage(page + 1)
        }
    }

    const inputStudent = (newStudent) => {
        setStudent({...student, [newStudent.action]: newStudent.value})
    }

    const save = () => {
        if (validate()) {
            switch (state) {
                case "Update":
                    update()
                    break
                case "Create":
                    create()
                    break
                default:
                    break
            }
            reset()
        }
    }

    const validate = () => {
        resetError()
        const phoneNoRegex = /^\d{10,20}$/
        const addressRegex = /.{10,20}/
        const nameRegex = /[A-Za-z]+\s[A-Za-z]+/
        const emailRegex = /.*[@].*/
        let valid = 1
        if (!student.phone.match(phoneNoRegex)){
            setPhoneError("Phone must have 10 - 20 digits")
            valid = 0
        }
        if (!student.fullName.match(nameRegex)){
            setFullNameError("Full Name must have at least 2 words separated by a space.")
            valid = 0
        }
        if (!student.parentName.match(nameRegex)){
            setParentNameError("Parent Name must have at least 2 words separated by a space.")
            valid = 0
        }
        if (!student.email.match(emailRegex)){
            setEmailError("Email address must contain at least an @ character.")
            valid = 0
        }
        if (!student.address.match(addressRegex)){
            setAddressError("Address must have 10 - 20 characters.")
            valid = 0
        }
        return valid
    }

    const create = () => {
        fetch(newStudentEndPoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(student)
        })
        .then(res =>  res.json())
        .then(data => {
            const updatedStudentsList = [...students, data]
            setStudents(updatedStudentsList)
            updatePageNumbers(updatedStudentsList)
        })
    }

    const prepareUpdate = (student) => {
        setStudent(student)
        setState("Update")
    }

    const update = () => {
        fetch(updateStudentEndPoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({...student})
        })
        .then(res =>  res.json())
        .then(data => load())
    }

    const deleteStudent = (id) => {
        fetch(`${deleteStudentEndPoint}?sId=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id})
        })
        .then(res =>  res.json())
        .then(data => load())
        reset()
    }

    const search = (id) => {
        reset()
    }

    const reset = () => {
        setState("Create")
        setStudent({id: "", fullName: "", parentName: "", phone: "", email: "", address: "", grade: "1"})
        resetError()
    }

    const resetError = () => {
        setFullNameError("")
        setParentNameError("")
        setPhoneError("")
        setAddressError("")
        setEmailError("")
    }

return (
        <div>
            <div>
                <h1>Input Form</h1>
                <table>
                    <thead>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Parent Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Grade</th>
                        <th>Action 1</th>
                        <th>Action 2</th>
                        <th>Action 3</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td> {student.id} </td>
                            <td>
                                <input
                                    type="text"
                                    value={ student.fullName }
                                    onChange={ (e) => inputStudent(
                                        {action: "fullName", value: e.target.value})
                                    }
                                />
                                <div style={{ fontSize: 12, color: "red" }}>{fullNameError}</div>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={ student.parentName }
                                    onChange={ (e) => inputStudent(
                                        {action: "parentName", value: e.target.value})
                                    }
                                />
                                <div style={{ fontSize: 12, color: "red" }}>{parentNameError}</div>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={ student.phone }
                                    onChange={ (e) => inputStudent(
                                        { action: "phone", value: e.target.value })
                                    }
                                />
                                <div style={{ fontSize: 12, color: "red" }}>{phoneError}</div>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={ student.email }
                                    onChange={ (e) => inputStudent(
                                        {action: "email", value: e.target.value})
                                    }
                                />
                                <div style={{ fontSize: 12, color: "red" }}>{emailError}</div>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={ student.address }
                                    onChange={ (e) => inputStudent(
                                        {action: "address", value: e.target.value})
                                    }
                                />
                                <div style={{ fontSize: 12, color: "red" }}>{addressError}</div>
                            </td>
                            <td>
                                <select value={ student.grade }
                                        onChange={ (e) =>
                                            inputStudent({ action: "grade", value: e.target.value })}
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                </select>
                            </td>
                            <td>
                                <button onClick={ () => save() }>{ state }</button>
                            </td>
                            <td>
                                <button onClick={ () => reset() }>Reset</button>
                            </td>
                            <td>
                                <button onClick={ () => search() }>Search</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <h1>Student List
                    <span style={{marginLeft: "20px"}}>
                        <select value={ sortBy }
                                onChange={ (e) => setSortBy(e.target.value)}
                        >
                            <option value="id">ID</option>
                            <option value="fullName">Full Name</option>
                            <option value="grade">Grade</option>
                            <option value="phone">Phone</option>
                        </select>
                    </span>
                </h1>
                <table>
                    <thead>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Parent Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Grade</th>
                        <th>Action 1</th>
                        <th>Action 2</th>
                    </thead>
                    <tbody>
                    { getStudents().map(el => (
                        <tr>
                            <td>{el.id}</td>
                            <td>{el.fullName}</td>
                            <td>{el.parentName}</td>
                            <td>{el.phone}</td>
                            <td>{el.email}</td>
                            <td>{el.address}</td>
                            <td>{el.grade}</td>
                            <td>
                                <button onClick={ (e) => prepareUpdate(el) }
                                >Update</button>
                            </td>
                            <td>
                                <button onClick={ () => deleteStudent(el.id) }>Delete</button>
                            </td>
                        </tr>
                    )) }
                    </tbody>
                </table>
                <div className="page-numbers">
                    <span
                        style={{  cursor: "pointer", marginRight: "10px"}}
                        onClick={ (e) => prevPage()}
                    >-</span>
                    <select value={ page }
                            onChange={ (e) =>
                                setPage(parseInt(e.target.value))}
                    >
                        {
                            pageNumbers.map(number => {
                                return (
                                    <option value={ number }>{ number + 1 }</option>
                                );
                            })
                        }
                    </select>
                    <span style={{  cursor: "pointer", marginLeft: "10px"}}
                          onClick={ (e) => nextPage()}>+</span>
                </div>
            </div>
        </div>
    );
}
