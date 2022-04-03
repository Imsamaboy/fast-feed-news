import React from "react"
import {Routes, Route, Navigate} from "react-router-dom"
import {CreatePostPage} from "./pages/CreatePostPage"
import {AuthPage} from "./pages/AuthPage"
import {FeedPage} from "./pages/FeedPage"

export const useRoutes = isAuthenticated => {
    // navigate скорее всего неправильно прописаны
    if (isAuthenticated) {
        console.log("Авторизован")
        return (
            <Routes>
                <Route path="/feed" exact element={ <FeedPage/> }/>
                <Route path="/create/post/:id" exact element={ <CreatePostPage/> }/>
                <Route
                    path="*"
                    element={<Navigate to="/feed" replace />}
                />
            </Routes>
        )
    } else {
        console.log("Не Авторизован")
        return (
            <Routes>
                <Route path="/" exact element={ <AuthPage/> }/>
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />
            </Routes>
        )
    }
}