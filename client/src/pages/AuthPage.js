import React, {useContext, useEffect, useState} from "react"
import {useHttp} from "../hooks/http.hook"
import {useMessage} from "../hooks/message.hook"
import {AuthContext} from "../context/AuthContext"

export const AuthPage = () => {

    const auth = useContext(AuthContext)
    const message = useMessage()

    // хук
    const {loading, request, error, clearError}  = useHttp()

    const [form, setForm] = useState({
        email: "", password: ""
    })

    //
    const changeHandler = event => {
        // оператор spread
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    // запросы на бэк по регистрации
    const registerHandler = async () => {
        try {
            const data = await request("/api/auth/register", "POST", {...form})
            console.log("Data", data)
            message(data.message)
        } catch (ex) {}
    }

    // запросы на бэк по логированию
    const loginHandler = async () => {
        try {
            const data = await request("/api/auth/login", "POST", {...form})
            auth.login(data.token, data.userId)
            // console.log("Data", data)
            // message(data.message)
        } catch (ex) {}
    }

    useEffect(() => {
        window.M.updateTextFields()
    })

    useEffect(() => {
        // console.log(error)
        message(error)
        clearError()
    }, [error, message, clearError])

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>Fast-News-Feed</h1>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Авторизация</span>
                        <div>
                            <div className="input-field">
                                <label htmlFor="email">Email</label>
                                <input
                                    placeholder="Введите email"
                                    id="email"
                                    type="text"
                                    name="email"
                                    className="yellow-input"
                                    value={form.email}
                                    onChange={changeHandler}
                                />
                            </div>
                            <div className="input-field">
                                <label htmlFor="email">Пароль</label>
                                <input
                                    placeholder="Введите пароль"
                                    id="password"
                                    type="password"
                                    name="password"
                                    className="yellow-input"
                                    value={form.password}
                                    onChange={changeHandler}    // будет обновляться форма
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
                            Войти
                        </button>
                        <button
                            className="btn grey lighten-1 black-text"
                            onClick={registerHandler}
                            disabled={loading}  // блокирование кнопок пока идёт запрос
                        >
                            Регистрация
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}