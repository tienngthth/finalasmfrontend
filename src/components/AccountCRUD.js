import React, { useEffect, useState } from "react";
import PageFooter from "./PageFooter";

const accountEndpoint = 'http://localhost:8989/accounts'
const searchAccountEndpoint = `${accountEndpoint}/attributes`

export default function AccountCRUD() {
    const [account, setAccount] = useState(
        { id: "", fullName: "", username: "", password: "", phone: "", email: "", address: "" }
    )
    const [accounts, setAccounts] = useState([])
    const [fullNameError, setFullNameError] = useState("")
    const [usernameError, setUsernameError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [addressError, setAddressError] = useState("")
    const [phoneError, setPhoneError] = useState("")
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
        fetch(`${accountEndpoint}?startAt=${startPage * elementsPerPage}&maxResults=${elementsPerPage}`)
        .then(response => response.json())
        .then(data => checkLoadedRecords(data));
    }

    const checkLoadedRecords = (data) => {
        if (!data.error) {
            if (data.length === 0) {
                setAccounts(accounts)
                setPage(page)
                setNextPage("")
            } else {
                setAccounts(data)
                setNextPage("+")
            }
        }
    }

    const search = () => {
        prepareSearch()
        fetch(`${searchAccountEndpoint}?maxResults=${elementsPerPage}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({...account})
        })
            .then(res =>  res.json())
            .then(data => checkSearchResult(data))
    }

    const prepareSearch = () => {
        resetError()
        setPage(0)
    }

    const checkSearchResult = (data) => {
        if (!data.error) {
            setAccounts(data)
        }
    }

    const prepareUpdate = (account) => {
        reset()
        setAccount({ ...account, ["password"]: "" })
        setState("Update")
    }

    const submitAccount = () => {
        if (validate()) {
            const method = (state === "Update") ? "PUT" : "POST"
            fetch(accountEndpoint, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...account })
            })
                .then(res =>  res.json())
                .then(() => {
                    setActionResult("Action Completed")
                    load()
                })
                .catch(() => { setActionResult("Action Failed") })
        }
    }

    const validate = () => {
        resetError()
        const phoneNoRegex = /^\d{10,20}$/
        const addressRegex = /.{10,20}/
        const credential = /.{5,}/
        const nameRegex = /[A-Za-z]+/
        const emailRegex = /.*[@].*/
        let valid = 1
        if (!account.phone.match(phoneNoRegex)){
            setPhoneError("Phone must have 10 - 20 digits")
            valid = 0
        }
        if (!account.fullName.match(nameRegex)){
            setFullNameError("Full Name must not be empty.")
            valid = 0
        }
        if (!account.username.match(credential)){
            setUsernameError("Username must have more than 5 characters and be unique.")
            valid = 0
        }
        if (state === "Create" && !account.password.match(credential)){
            setPasswordError("Password must have more than 5 characters.")
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

    const deleteAccount = (id) => {
        resetError()
        fetch(`${accountEndpoint}/${id}`, { method: 'DELETE' })
        .then(res =>  res.text())
        .then(res => checkDelete(res))
    }

    const checkDelete = (res) => {
        if (res.includes("Deleted")) {
            if (accounts.length === 1) {
                if (page > 0) {
                    setPage(page - 1)
                    load(page - 1)
                } else {
                    setAccounts([])
                }
            } else {
                load()
            }
        }
    }

    const inputAccount = (newAccount) => {
        setAccount({...account, [newAccount.attribute]: newAccount.value})
    }

    const reset = () => {
        setState("Create")
        setAccount({ id: "", fullName: "", username: "", password: "", phone: "", email: "", address: "" })
        resetError()
    }

    const resetError = () => {
        setFullNameError("")
        setUsernameError("")
        setPhoneError("")
        setAddressError("")
        setEmailError("")
        setPasswordError("")
        setActionResult("")
    }

return (
        <div className={"mainPage"}>
            <div className={"pageSection"}>
                <h1>Account Form
                    <div className={"actionResult"}>{ actionResult }</div>
                </h1>
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
                        <td> { account.id } </td>
                        <td>
                            <input
                                type="text"
                                value={ account.fullName }
                                onChange={ (e) => inputAccount(
                                    { attribute: "fullName", value: e.target.value })
                                }
                            />
                            <div className = { "errorLog" }>{fullNameError}</div>
                        </td>
                        <td>
                            <input
                                type="text"
                                value={ account.username }
                                onChange={ (e) => inputAccount(
                                    { attribute: "username", value: e.target.value })
                                }
                            />
                            <div className = { "errorLog" }>{usernameError }</div>
                        </td>
                        <td>
                            <input
                                type="text"
                                value={ account.password }
                                onChange={ (e) => inputAccount(
                                    { attribute: "password", value: e.target.value })
                                }
                            />
                            <div className = { "errorLog" }>{ passwordError }</div>
                        </td>
                        <td>
                            <input
                                type="text"
                                value={ account.phone }
                                onChange={ (e) => inputAccount(
                                    { attribute: "phone", value: e.target.value })
                                }
                            />
                            <div className = { "errorLog" }>{ phoneError }</div>
                        </td>
                        <td>
                            <input
                                type="text"
                                value={ account.email }
                                onChange={ (e) => inputAccount(
                                    { attribute: "email", value: e.target.value })
                                }
                            />
                            <div className = { "errorLog" }>{ emailError }</div>
                        </td>
                        <td>
                            <input
                                type="text"
                                value={ account.address }
                                onChange={ (e) => inputAccount(
                                    { attribute: "address", value: e.target.value })
                                }
                            />
                            <div className = { "errorLog" }>{ addressError }</div>
                        </td>
                        <td>
                            <button onClick={ () => submitAccount() }>{ state }</button>
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
            </div>
            <div className={"pageSection"}>
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
                    {accounts.map(el => (
                        <tr>
                            <td>{el.id}</td>
                            <td>{el.fullName}</td>
                            <td>{el.username}</td>
                            <td>{el.password}</td>
                            <td>{el.phone}</td>
                            <td>{el.email}</td>
                            <td>{el.address}</td>
                            <td>
                                <button className={"updateButton"} onClick={() => prepareUpdate(el)}>Update</button>
                            </td>
                            <td>
                                <button className={"deleteButton"} onClick={() => deleteAccount(el.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <PageFooter
                    reset={reset}
                    load={load}
                    setPage={setPage}
                    page={page}
                    next={next}
                />
            </div>
        </div>
    );
}
