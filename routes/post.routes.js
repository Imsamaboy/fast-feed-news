const router = require("express").Router()
const pino = require("pino")
const logger = pino({level: process.env.LOG_LEVEL || "info", prettyPrint: true})

const auth = require("../middleware/auth.middleware")
const Post = require("../model/Post")
const User = require("../model/User")

/**
 * @swagger
 * /api/post/getId:
 *   get:
 *     summary: Retrieve a max PostId in our DB.
 *     description: Retrieve a max PostId in our DB. Can be used to generate new root /post/{maxPostId} + 1.
 *     responses:
 *       200:
 *         description: An Number with max PostId.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  maxPostId:
 *                     type: integer
 *                     description: The max post ID.
 *                     example: 12
 *       404:
 *         description: User has an error with the url path.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                    type: String
 *                    example: Try change your url
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
router.get("/getId", auth, async (req, res) => {
    try {
        // Достаём максимальный айдишник
        logger.info("Trying to get max post id from DB...")
        const existing = await Post.findOne().sort({postId: -1})
        logger.info("Max ID has been found...")
        return existing ? res.json({maxPostId: existing}) : res.json({maxPostId: 1})
    } catch (ex) {
        logger.error(`Something went wrong, server error: ${ex.message}`)
        res.status(500).json({message: "Something went wrong, server error." +
                                                  "It caused by DB error with Post collection."})
    }
})

/**
 * @swagger
 * /api/post/create:
 *   post:
 *     summary: Creates a new Post and saves in DB.
 *     description: Creates a new Post and saves in DB.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               header:
 *                 type: string
 *                 example: Leanne Graham
 *               content:
 *                 type: string
 *                 example: It's my name
 *     responses:
 *       201:
 *         description: New Post.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  content:
 *                      type: String
 *                      example: Pharaoh выпустил новый трек!
 *                  date:
 *                      type: Date
 *                      example: 2022-04-03T12:13:45.690Z
 *                  header:
 *                      type: String
 *                      example: Pharaoh
 *                  owner:
 *                      type: String
 *                      example: 62497580ed9a26090cf5be97
 *                  ownerName:
 *                      type: String
 *                      example: v@mail.ru
 *       400:
 *         description: User has an error with the url path.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                    type: String
 *                    example: Enter the title and content of the post
 *       404:
 *         description: User has an error with the url path or hasn't auth.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                    type: String
 *                    example: Try change your url or login.
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
router.post("/create", auth, async (req, res) => {
    try {
        logger.info("Trying to create new post...")
        const {header, content} = req.body
        if (!header || !content) {
            logger.error("Error with empty header or content...")
            return res.status(400).json({message: "Enter the title and content of the post"})
        }
        const user = await User.findById(req.user.userId)
        const ownerName = user.get("email")
        const post = new Post({
            owner: req.user.userId,
            ownerName: ownerName,
            header: header,
            content: content
        })
        // Обновляем юзера и сохраняем всё в бд
        user.posts.push(post)
        await user.save()
        await post.save()

        logger.info(`Post has been created: ${post}`)
        res.status(201).json({post})
    } catch (ex) {
        logger.error(`Errors in: ${ex.message}`)
        res.status(500).json({message: "Something went wrong, server error." +
                                                  "It caused by DB error with Post collection."})
    }
})

/**
 * @swagger
 * /api/post/:
 *   get:
 *     summary: Retrieve a list of Posts sorted by date.
 *     description: Retrieve a list of Posts sorted by date. We can use them to send on front.
 *     responses:
 *       200:
 *         description: A list of posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                      type: Array
 *       404:
 *         description: User has an error with the url path.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                    type: String
 *                    example: Try change your url
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
router.get("/", auth, async (req, res) => {
    try {
        logger.info("Trying to find all posts...")
        // Достаём посты из БД, отсортированные по дате
        const posts = await Post.find().sort({date: -1})
        logger.info(`Posts have been found: ${posts}`)
        res.json({posts: posts})
    } catch (ex) {
        logger.error(`Errors in: ${ex.message}`)
        res.status(500).json({message: "Something went wrong, server error." +
                                                  "It caused by DB error with Post collection."})
    }
})

module.exports = router