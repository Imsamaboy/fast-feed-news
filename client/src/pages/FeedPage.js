import React, {useCallback, useContext, useEffect, useState} from "react"
import {Button, Div} from "@vkontakte/vkui"
import {Icon16ArrowTriangleDown, Icon20AddCircle} from "@vkontakte/icons"
import {useNavigate} from "react-router-dom"

import {AuthContext} from "../context/AuthContext"
import {useHttp} from "../hooks/http.hook"
import {PostList} from "../components/PostList"


export const FeedPage = () => {
    const navigate = useNavigate()
    const {token} = useContext(AuthContext)
    const {request} = useHttp()
    const [posts, setPosts] = useState([])

    // почему то только при нажатии на кнопку в навбаре появляются посты, хотя должны появляться всегда при попадании в ленту
    // кажется просто страница грузится пока делается запрос в бд
    // тогда нужно сделать лоадер!!!

    // было обёрнуто в useCallback(, но почему? смотреть проект мерн
    const fetchPosts = useCallback(async () => {
        try {
            // console.log("HERE")
            const data = await request("/api/post", "GET", null, {
                Authorization: `Bearer ${token}`
            })
            // console.log("FETCHED: ", data)
            setPosts(data["posts"])
        } catch (ex) {
            console.log("HERE")
        }
    }, [request, token])

    const pressHandler = async () => {
        const data = await request("/api/post/getId", "GET", null, {
            Authorization: `Bearer ${token}`
        })
        navigate(`/create/post/${data["maxPostId"] + 1}`)
    }

    useEffect(() => {
        fetchPosts()
    }, [fetchPosts])

    return (
        <Div>
            <PostList posts={posts}/>
            <Div className="row"
                 style={{
                display: "flex",
                flexDirection: "column",
                color: "gray",
                alignItems: "center"
            }}>
                <Button
                    size="l"
                    appearance="accent"
                    mode="tertiary"
                    before={<Icon20AddCircle />}
                    // after={<Icon16ArrowTriangleDown />}
                    onClick={pressHandler}
                >
                    Add post
                </Button>
            </Div>
        </Div>
    )
}
