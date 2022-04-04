import React from "react"
import {BrowserRouter} from "react-router-dom"
import "materialize-css"
import {AppRoot} from "@vkontakte/vkui"

import {Navbar} from "./components/Navbar"
import {useRoutes} from "./routes"
import {useAuth} from "./hooks/auth.hook"
import {AuthContext} from "./context/AuthContext"
import {Footer} from "./components/Footer"
import {Loader} from "./components/Loader"

const App = () => {
    const {token, logout, login, userId, ready} = useAuth()
    const isAuthenticated = !!token
    const routes = useRoutes(isAuthenticated)

    if (!ready) {
        return <Loader/>
    }

    return (
        <AppRoot>
            <AuthContext.Provider value={
                {token, login, logout, userId, isAuthenticated}
            }>
                <BrowserRouter>
                    {isAuthenticated && <Navbar/>}
                    <div className="container" style={{minHeight: "85vh"}}>
                        { routes }
                    </div>
                    <Footer style={{display: "flex", alignSelf: "flex-end"}}/>
                </BrowserRouter>
            </AuthContext.Provider>
        </AppRoot>
    )
}

export default App
