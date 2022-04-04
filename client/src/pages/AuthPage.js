import React, {useContext, useEffect, useState} from "react"
import {useHttp} from "../hooks/http.hook"
import {useMessage} from "../hooks/message.hook"
import {AuthContext} from "../context/AuthContext"

const pino = require("pino")
const logger = pino({level: process.env.LOG_LEVEL || "info", prettyPrint: true})

export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage()

    const {loading, request, error, clearError}  = useHttp()

    const [form, setForm] = useState({
        email: "", password: ""
    })

    const changeHandler = event => {
        // оператор spread
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    // запросы на бэк по регистрации
    const registerHandler = async () => {
        try {
            const data = await request("/api/auth/register", "POST", {...form})
            message(data.message)
        } catch (ex) {
            console.log("Catch: ", ex.message)
            logger.error(`Error: ${ex.message}`)
        }
    }

    // запросы на бэк по логированию
    const loginHandler = async () => {
        try {
            const data = await request("/api/auth/login", "POST", {...form})
            auth.login(data.token, data.userId)
        } catch (ex) {
            console.log("Catch: ", ex.message)
            logger.error(`Error: ${ex.message}`)
        }
    }

    useEffect(() => {
        window.M.updateTextFields()
    })

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    return (
        <div className="container" style={{width: "50vw", height: "95vh"}}>
            <div className="col s6 offset-s3">
                <h1>Fast-News-Feed</h1>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Authorization</span>
                        <div>
                            <div className="input-field">
                                <label htmlFor="email">Email</label>
                                <input
                                    placeholder="Input email"
                                    id="email"
                                    type="text"
                                    name="email"
                                    className="yellow-input"
                                    value={form.email}
                                    onChange={changeHandler}
                                />
                            </div>
                            <div className="input-field">
                                <label htmlFor="email">Password</label>
                                <input
                                    placeholder="Input password"
                                    id="password"
                                    type="password"
                                    name="password"
                                    className="yellow-input"
                                    value={form.password}
                                    onChange={changeHandler}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button
                            className="btn yellow darken-4"
                            style={{marginRight: 10}}
                            onClick={loginHandler}
                            disabled={loading}
                        >
                            Log in
                        </button>
                        <button
                            className="btn grey lighten-1 black-text"
                            onClick={registerHandler}
                            disabled={loading}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}