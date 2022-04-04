import React, {useContext} from "react"
import { NavLink, useNavigate } from "react-router-dom"
import {AuthContext} from "../context/AuthContext"

export const Navbar = () => {
    const navigate = useNavigate()
    const auth = useContext(AuthContext)

    const logoutHandler = (event) => {
        event.preventDefault()
        auth.logout()
        navigate("/")
    }

    return (
        <nav>
            <div className="nav-wrapper grey darken-4" style={{padding: "0 2rem"}}>
                <span className="brand-logo">Fast-News-Feed</span>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><NavLink to="/feed">Feed</NavLink></li>
                    <li><a href="/" onClick={logoutHandler}>Sign out</a></li>
                </ul>
            </div>
        </nav>
    )
}