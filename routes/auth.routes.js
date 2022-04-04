const router = require("express").Router()
const {check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const pino = require("pino")
const logger = pino({level: process.env.LOG_LEVEL || "info", prettyPrint: true})

const config = require("config")
const User = require("../model/User")

// /api/auth
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Creates a new User and saves in DB.
 *     description: Creates a new User and saves in DB.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: v@mail.ru
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: new User
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  message:
 *                      type: String
 *                      example: Пользователь создан
 *       400:
 *         description: Incorrect data during validation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                    type: Array
 *                 message:
 *                    type: String
 *                    example: Enter the title and content of the post
 *       404:
 *         description: User has an error with the url path.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                    type: String
 *                    example: Wrong url
 *       500:
 *         description: Server has an error with DB.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                    type: String
 *                    example: Something went wrong, server error
 */
router.post(
    "/register",
    [
        check("email", "Некорректный email").isEmail(),
        check("password", "Минимальная длина пароля 6 символов").isLength({min: 6})
    ],
    async (req, res) => {
        try {
            logger.info(`Trying to register new user: ${req.body}`)
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                logger.error(`Incorrect data during validation: ${errors}`)
                return res.status(400).json(
                    {
                        errors: errors.array(),
                        message: "Некорректные данные при валидации"
                    })
            }

            const {email, password} = req.body
            const candidate = await User.findOne({email})
            if (candidate) {
                logger.error(`This user already exists: ${candidate}`)
                return res.status(400).json({message: "Такой пользователь уже существует!"})
            }

            // bcrypt асинхронная, хэшируем пароль
            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({email: email, password: hashedPassword})
            await user.save()
            logger.info(`User has been created...`)
            res.status(201).json({message: "Пользователь создан"})
        } catch (ex) {
            logger.error(`Something went wrong...`)
            res.status(500).json({message: "Что-то пошло не так..."})
        }
    })

// /api/auth
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Logging into your account.
 *     description: Logging into your account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: v@mail.ru
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  message:
 *                      type: String
 *                      example: Logged in
 *       400:
 *         description: Incorrect data during validation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                    type: Array
 *                 message:
 *                    type: String
 *                    example: Incorrect data during logging
 *       404:
 *         description: User has an error with the url path.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                    type: Array
 *                 message:
 *                    type: String
 *                    example: Wrong url
 *       500:
 *         description: Server has an error with DB.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                    type: String
 *                    example: Something went wrong, server error
 */
router.post(
    "/login",
    [
        check("email", "Введите корректный email").normalizeEmail().isEmail(),
        check("password", "Введите пароль").exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                // возвращаем ошибки сервера на фронт
                logger.error(`Incorrect data during logging: ${errors}`)
                return res.status(400).json(
                    {
                        errors: errors.array(),
                        message: "Некорректные данные при входе в систему"
                    })
            }
            const {email, password} = req.body
            const user = await User.findOne({email})
            // проверка на существование
            if (!user) {
                logger.error(`User isn't found: ${User}`)
                return res.status(400).json({message: "Пользователь не найден"})
            }
            // проверка на совпадение паролей
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                logger.error(`Password is incorrect: ${isMatch}`)
                return res.status(400).json({message: "Неверный пароль, попробуйте снова"})
            }
            // Авторизация jwt token
            const token = jwt.sign(
                {userId: user.id},
                config.get("jwtSecret"),
                {expiresIn: "1h"}
            )
            logger.info(`Logging went successfully`)
            // status 200 default
            res.json({token, userId: user.id})
        } catch (ex) {
            logger.error(`Something went wrong...`)
            res.status(500).json({message: "Что-то пошло не так..."})
        }
    })

module.exports = router