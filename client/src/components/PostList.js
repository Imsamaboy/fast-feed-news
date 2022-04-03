import React from "react"
import {Div, Text} from "@vkontakte/vkui"
import "@vkontakte/vkui/dist/vkui.css"


export const PostList = ({posts}) => {
    // пофиксить
    // console.log(!posts.length)
    if (!posts.length) {
        return <p className="center">Лента пока пустая :(</p>
    }

    const Posts = post => (
        <Div>
            <Text weight="medium"
                  style={{marginBottom: 16, background: "white"}}>
                {post.header}
            </Text>
            <Text weight="regular" style={{marginBottom: 16}}>
                {post.ownerName}
            </Text>
            <Text weight="regular" style={{marginBottom: 16}}>
                {post.date}
            </Text>
            <Text weight="regular" style={{marginBottom: 16}}>
                {post.content}
            </Text>
        </Div>
    );

    return (
        posts.map((post) => <Div
            style={{
                    display: "flex",
                    flexDirection: "column",
                    color: "black",
                    alignItems: "center",
                    background: "gray"
            }}>
            {Posts(post)}
        </Div>)
    )
}