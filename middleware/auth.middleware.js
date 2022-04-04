const jwt = require("jsonwebtoken") // для раскодирования токена
const config = require("config")
const pino = require("pino")
const logger = pino({level: process.env.LOG_LEVEL || "info", prettyPrint: true})


module.exports = (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next()
    }
    try {
        // "Bearer TOKEN"
        const token = req.headers.authorization.split(" ")[1]
        if (!token) {
            logger.error(`No authorization: ${token}`)
            return res.status(401).json({message: "Нет авторизации"})
        }
        const decoded = jwt.verify(token, config.get("jwtSecret"))
        req.user = decoded
        logger.info("Token values match...")
        next()
    } catch (ex) {
        logger.error(`No authorization: ${ex.message}`)
        res.status(401).json({message: "Нет авторизации"})
    }
}
