import React, {useCallback, useContext, useEffect, useState} from "react"
import {Button, ButtonGroup, Div, FormItem, Textarea} from "@vkontakte/vkui"
import "@vkontakte/vkui/dist/vkui.css"
import {useNavigate} from "react-router-dom"
import {AuthContext} from "../context/AuthContext"
import {useHttp} from "../hooks/http.hook"
import {useMessage} from "../hooks/message.hook";


export const CreatePostPage = () => {
    const navigate = useNavigate()
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {request, error, clearError} = useHttp()

    const [content, setContent] = useState("")
    const [header, setHeader] = useState("")

    const pressAddHandler = useCallback(async () => {
        await request("/api/post/create", "POST",
            {header: header, content: content},
            {Authorization: `Bearer ${auth.token}`}
        )
        navigate(`/feed`)
    }, [request, auth.token, header, content, navigate])

    const pressCancelHandler = async () => {
        navigate("/feed")
    }

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    return (
        <div className="container"
            style={
            {display: "flex",
            flexDirection: "column",
            gap: "1em",
            width: "50vw",
            height: "85vh"}}>
            <React.Fragment>
                <FormItem top="Header">
                    <Textarea
                        placeholder="Input header"
                        type="text"
                        id="header"
                        sizeY={500}
                        value={header}
                        onChange={e => setHeader(e.target.value)}
                    />
                </FormItem>

                <FormItem top="Content">
                    <Textarea
                        cols={10}
                        sizeY={500}
                        placeholder="Write something here"
                        type="text"
                        id="content"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    />
                </FormItem>
            </React.Fragment>

            <React.Fragment>
                <Div>
                    <ButtonGroup
                        mode="horizontal"
                        gap="m"
                        style={{ minWidth: 328, display: "flex", flex: "1 0 auto" }}>
                        <Button
                            size="l"
                            appearance="accent"
                            stretched
                            onClick={pressAddHandler}
                        >
                            Add
                        </Button>
                        <Button
                            size="l"
                            appearance="accent"
                            stretched
                            onClick={pressCancelHandler}
                        >
                            Cancel
                        </Button>
                    </ButtonGroup>
                </Div>
            </React.Fragment>
        </div>
    )
}