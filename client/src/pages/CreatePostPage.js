import React, {useContext, useState} from "react"
import {Button, ButtonGroup, Div, FormItem, Textarea} from "@vkontakte/vkui"
import "@vkontakte/vkui/dist/vkui.css"
import {useNavigate} from "react-router-dom"
import {AuthContext} from "../context/AuthContext"
import {useHttp} from "../hooks/http.hook"


export const CreatePostPage = () => {
    const navigate = useNavigate()
    const auth = useContext(AuthContext)
    const {request} = useHttp()

    const [content, setContent] = useState("")
    const [header, setHeader] = useState("")

    const pressAddHandler = async () => {
        const data = await request("/api/post/create", "POST",
            {header: header, content: content},
            {Authorization: `Bearer ${auth.token}`}
        )
        navigate(`/feed`)
        console.log(data)
    }

    const pressCancelHandler = async () => {
        navigate("/feed")
    }

    return (
        <div className="row">
            <FormItem top="Заголовок">
                <Textarea
                    placeholder="Введите название"
                    type="text"
                    id="header"
                    value={header}
                    onChange={e => setHeader(e.target.value)}
                />
            </FormItem>
            <FormItem top="Контент">
                <Textarea
                    cols={10}
                    placeholder="Напиши сюда что-нибудь..."
                    type="text"
                    id="content"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                />
            </FormItem>
            <React.Fragment>
                <Div>
                    <ButtonGroup
                        mode="horizontal"
                        gap="m"
                        style={{ minWidth: 328, display: "flex", flex: "1 0 auto" }}>
                        <Button
                            size="l"
                            appearance="accent"
                            // color="green"
                            stretched   // ?
                            onClick={pressAddHandler}
                        >
                            Add
                        </Button>
                        <Button
                            size="l"
                            appearance="accent"
                            // color="red"
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