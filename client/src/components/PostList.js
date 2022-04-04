import React from "react"
import "@vkontakte/vkui/dist/vkui.css"
import {Avatar, Text, Title} from "@vkontakte/vkui"
import {Post} from "../styles/Post"
import {Header} from "../styles/Header"
import {Content} from "../styles/Content"
import {Author} from "../styles/Author"
import {PostWrapper} from "../styles/PostWrapper"


export const PostList = ({posts}) => {

    if (!posts.length) {
        return (
            <PostWrapper>
                <div className="card-panel hoverable">
                    <Title className="center" level="1" style={{ marginBottom: 0 }}> Feed is empty 😔 </Title>
                </div>
            </PostWrapper>
        )
    }

    const Posts = post => (
        <Post>
            <div className="card-panel hoverable">
            <Author>
                <Avatar size={72}/>
                <Text weight="medium" style={{marginBottom: 2}}>
                    Author: {post.ownerName}
                </Text>
                <Text weight="regular" style={{marginBottom: 16}}>
                    {post.date.slice(0, 10) + " " + post.date.slice(11, 19)}
                </Text>
            </Author>
            <Header>
                <Title level="1" style={{ marginBottom: 0 }}>
                    {post.header}
                </Title>
            </Header>

            <Content>
                <Text weight="regular" style={{marginBottom: 16}}>
                    {post.content}
                </Text>
            </Content>
            </div>
        </Post>
    );

    return (
        posts.map((post) =>
            <PostWrapper>
                {Posts(post)}
            </PostWrapper>)
    )
}