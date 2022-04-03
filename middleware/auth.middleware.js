const jwt = require("jsonwebtoken") // для раскодирования токена
const config = require("config")

// эта функция перехватывает определенные данные и делать логику которая тут
// next - параметр который позволяет продолжить выполнение запроса
// Этот метод из rest api который проверяет доступность сервера
module.exports = (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next()
    }
    try {
        // "Bearer TOKEN"
        const token = req.headers.authorization.split(" ")[1]
        if (!token) {   // если нет токена
            return res.status(401).json({message: "Нет авторизации"})  // 401 - нет авторизации
        }
        const decoded = jwt.verify(token, config.get("jwtSecret"))  // тут валится
        req.user = decoded
        next()

    } catch (ex) {
        console.log(ex.message)
        res.status(401).json({message: "Нет авторизации"})
    }
}
