const express = require("express")
const config = require("config")
const mongoose = require("mongoose")
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const pino = require("pino")
const expressPino = require("express-pino-logger")

const logger = pino({level: process.env.LOG_LEVEL || "info", prettyPrint: true})
const expressLogger = expressPino({logger})

const PORT = config.get("port") || 8080
const app = express()
const router = require("./routes/auth.routes")
const postRouter = require("./routes/post.routes")

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Express API for FAST-NEWS-FEED',
        version: '1.0.0',
        description:
            'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.'
    },
    servers: [
        {
            url: 'http://localhost:8080',
            description: 'Development server',
        },
    ],
}

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'],
}

const swaggerSpec = swaggerJSDoc(options)

app.use(express.json({extended: true}))
app.use("/api/auth", router)
app.use("/api/post", postRouter)
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(expressLogger)

async function start() {
    try {
        // изучить mongoose.connect
        await mongoose.connect(config.get("mongoUri"), {useNewUrlParser: true})
        app.listen(PORT, () =>{
            logger.info(`Server running on port ${PORT}...`)
        })
    } catch (ex) {
        // Порефакторить
        console.log("Server error: ", ex.message)
        process.exit(1)
    }
}

start()
