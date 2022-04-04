import React, {useCallback, useContext, useEffect, useState} from "react"
import {Button} from "@vkontakte/vkui"
import {Icon20AddCircle} from "@vkontakte/icons"
import {useNavigate} from "react-router-dom"

import {AuthContext} from "../context/AuthContext"
import {useHttp} from "../hooks/http.hook"
import {PostList} from "../components/PostList"
import {Loader} from "../components/Loader";


export const FeedPage = () => {
    const navigate = useNavigate()
    const {token} = useContext(AuthContext)
    const {loading, request} = useHttp()
    const [posts, setPosts] = useState([])

    const fetchPosts = useCallback(async () => {
        try {
            const data = await request("/api/post", "GET", null, {
                Authorization: `Bearer ${token}`
            })
            setPosts(data["posts"])
        } catch (ex) {
            console.log(`Error: ${ex.message}`)
        }
    }, [request, token])

    const pressHandler = useCallback(async () => {
        try {
            navigate("/create/post/")
        } catch (ex) {
            console.log(`Error: ${ex.message}`)
        }
    }, [navigate])

    useEffect(() => {
        fetchPosts()
    }, [fetchPosts])

    if (loading) {
        return <Loader/>
    }

    return (
        <div className="container">
            {!loading && <PostList posts={posts}/>}
            <div className="container" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <Button
                    size="l"
                    appearance="accent"
                    mode="tertiary"
                    before={<Icon20AddCircle />}
                    onClick={pressHandler}
                >
                    Add post
                </Button>
            </div>
        </div>
    )
}
