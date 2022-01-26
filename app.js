const express = require("express")
const shortId = require("shortid")
const mongoose = require("mongoose")
const createHttpError = require("http-errors")
const helmet = require("helmet")
const morgan = require("morgan")
const path = require("path")
const dotenv = require("dotenv")
const ShortUrl = require("./models/url.models")
const app = express()
const port = 8080

dotenv.config()

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(function () {
    console.log("Succesfully Connected to MongoDB")
}).catch((error) => console.log(error))

app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))
app.use(express.urlencoded({ extended: false }))

app.set("view engine", "ejs")

app.get("/", async (req, res, next) => {
    res.render("index")
})

app.get("/:shortId", async (req, res, next) => {
    try {
        const { shortId } = req.params
        const result = await ShortUrl.findOne({ shortId })
        if (!result) {
            throw createHttpError.NotFound("ShortId not found")
        }
        res.redirect(result.url)
    } catch (error) {
        next(error)
    }
})

app.post("/", async (req, res, next) => {
    try {
        const { url } = req.body
        if (!url) {
            throw createHttpError.BadRequest("Provide a valid URL")
        }
        const urlExists = await ShortUrl.findOne({ url })
        if (urlExists) {
            res.render('index', { short_url: `${req.headers.host}/${urlExists.shortId}` })
            return
        }

        const shortUrl = new ShortUrl({ url: url, shortId: shortId.generate() })
        const result = await shortUrl.save()
        res.render('index', {
            // short_url : ${req.hostname}/${result.shortId}
            short_url: `${req.headers.host}/${result.shortId}`
        })
    } catch (error) {
        next(error)
    }
})

app.use((req, res, next) => {
    next(createHttpError.NotFound())
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.render('index', { error: err.message })
})
app.listen(port, () => {
    console.log("App is running at port:", port)
})