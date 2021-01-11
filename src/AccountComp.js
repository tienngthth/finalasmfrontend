import React, {useEffect, useState} from "react";

const getAllEndPoint = 'http://localhost:8083/accounts'
const createEndPoint = 'http://localhost:8083/accounts'
const updateEndPoint = 'http://localhost:8083/accounts'
const deleteEndPoint = 'http://localhost:8083/accounts'

export default function AccountComp() {
    const [account, setAccount] = useState(
        {id: "", fullName: "", username: "", password: "", phone: "", email: "", address: ""}
        )
    const [accounts, setAccounts] = useState([])
    const [fullNameError, setFullNameError] = useState("")
    const [usernameError, setUsernameError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [addressError, setAddressError] = useState("")
    const [phoneError, setPhoneError] = useState("")
    const [actionError, setActionError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [state, setState] = useState("Create")
    const [next, setNextPage] = useState("+")
    const [page, setPage] = useState(0)
    const elementsPerPage = 1

    useEffect(() => {
       load()
    }, []);

    const load = (startPage = page) =>{
        // const startAt = page * elementsPerPage
        fetch(`${getAllEndPoint}?startAt=${startPage * elementsPerPage}&maxResults=${elementsPerPage}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                setPage(page)
                setNextPage("")
            } else {
                setAccounts(data)
            }
        });
    }

    const prevPage = () => {
        if (page > 0) {
            setNextPage("+")
            setPage(page - 1)
            load(page - 1)
        }
    }

    const nextPage = () => {
        setPage(page + 1)
        load(page + 1)
    }

    const inputAccount = (newAccount) => {
        setAccount({...account, [newAccount.action]: newAccount.value})
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
        const credential = /.{5,}/
        const nameRegex = /[A-Za-z]+\s[A-Za-z]+/
        const emailRegex = /.*[@].*/
        let valid = 1
        if (!account.phone.match(phoneNoRegex)){
            setPhoneError("Phone must have 10 - 20 digits")
            valid = 0
        }
        if (!account.fullName.match(nameRegex)){
            setFullNameError("Full Name must have at least 2 words separated by a space.")
            valid = 0
        }
        if (!account.username.match(credential)){
            setUsernameError("Username must have more 5 characters and be unique.")
            valid = 0
        }
        if (!account.password.match(credential)){
            setPasswordError("Password must have more 5 characters and be unique.")
            valid = 0
        }
        if (!account.email.match(emailRegex)){
            setEmailError("Email address must contain at least an @ character and be unique.")
            valid = 0
        }
        if (!account.address.match(addressRegex)){
            setAddressError("Address must have 10 - 20 characters.")
            valid = 0
        }
        return valid
    }

    const create = () => {
        fetch(createEndPoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(account)
        })
        .then(res => res.json())
        .then(data => {
            const updatedAccountsList = [...accounts, data]
            setAccounts(updatedAccountsList)
        })
        .catch(() => {setActionError("Failed to create new account")})
    }

    const prepareUpdate = (account) => {
        setAccount(account)
        setState("Update")
    }

    const update = () => {
        fetch(updateEndPoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({...account})
        })
        .then(res =>  res.json())
        .then(() => load())
    }

    const deleteAccount = (id) => {
        fetch(`${deleteEndPoint}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id})
        })
        .then(res =>  res.text())
        .then(() => load())
        reset()
    }

    const search = (id) => {
        reset()
    }

    const reset = () => {
        setState("Create")
        setAccount({id: "", fullName: "", username: "", password: "", phone: "", email: "", address: ""})
        resetError()
    }

    const resetError = () => {
        setFullNameError("")
        setUsernameError("")
        setPhoneError("")
        setAddressError("")
        setEmailError("")
        setPasswordError("")
        setActionError("")
    }

return (
        <div>
            <div>
                <h1>Input Form</h1>
                <div style={{ fontSize: 12, color: "red" }}>{actionError}</div>
                <table>
                    <thead>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Username</th>
                        <th>Password</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Action 1</th>
                        <th>Action 2</th>
                        <th>Action 3</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td> {account.id} </td>
                            <td>
                                <input
                                    type="text"
                                    value={ account.fullName }
                                    onChange={ (e) => inputAccount(
                                        {action: "fullName", value: e.target.value})
                                    }
                                />
                                <div style={{ fontSize: 12, color: "red" }}>{fullNameError}</div>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={ account.username }
                                    onChange={ (e) => inputAccount(
                                        {action: "username", value: e.target.value})
                                    }
                                />
                                <div style={{ fontSize: 12, color: "red" }}>{usernameError}</div>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={ account.password }
                                    onChange={ (e) => inputAccount(
                                        {action: "password", value: e.target.value})
                                    }
                                />
                                <div style={{ fontSize: 12, color: "red" }}>{passwordError}</div>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={ account.phone }
                                    onChange={ (e) => inputAccount(
                                        { action: "phone", value: e.target.value })
                                    }
                                />
                                <div style={{ fontSize: 12, color: "red" }}>{phoneError}</div>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={ account.email }
                                    onChange={ (e) => inputAccount(
                                        {action: "email", value: e.target.value})
                                    }
                                />
                                <div style={{ fontSize: 12, color: "red" }}>{emailError}</div>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={ account.address }
                                    onChange={ (e) => inputAccount(
                                        {action: "address", value: e.target.value})
                                    }
                                />
                                <div style={{ fontSize: 12, color: "red" }}>{addressError}</div>
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
                <h1>Account List</h1>
                <table>
                    <thead>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Username</th>
                        <th>Password</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Action 1</th>
                        <th>Action 2</th>
                    </thead>
                    <tbody>
                    { accounts.map(el => (
                        <tr>
                            <td>{el.id}</td>
                            <td>{el.fullName}</td>
                            <td>{el.username}</td>
                            <td>{el.password}</td>
                            <td>{el.phone}</td>
                            <td>{el.email}</td>
                            <td>{el.address}</td>
                            <td>
                                <button onClick={() => prepareUpdate(el) }
                                >Update</button>
                            </td>
                            <td>
                                <button onClick={() => deleteAccount(el.id) }>Delete</button>
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
