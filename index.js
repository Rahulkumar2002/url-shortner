const express = require("express")
const morgan = require("morgan")
const helmet = require("helmet")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const mainRoute = require("./routes/index")
const urlRoute = require("./routes/url")
const app = express()

dotenv.config()

const ConnectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true })

        console.log("App is connected to MongoDB")
    } catch (err) { console.log("Error in connection with MongoDB :", err) }

}
ConnectToDB()

app.use(express.json({ extented: false }))
app.use(morgan("common"))
app.use(helmet())

const port = 8080

//Routes :
app.use("/", mainRoute)
app.use("/api/url", urlRoute)

app.listen(port, () => {
    console.log("Your app is listing at port no:", port)
})



