const router = require("express").Router()
const valdiUrl = require("valid-url")
const shortid = require("shortid")
const Url = require("../models/Url")


router.post("/shorten", async (req, res) => {
    const { longUrl } = req.body
    const baseUrl = process.env.BASE_URL
    //Check Base Url
    if (!valdiUrl.isUri(baseUrl)) {
        return res.status(401).json("Invalid Base Url")
    }

    //Creating Short Url  
    const urlCode = shortid.generate()

    //Check long Url 
    if (valdiUrl.isUri(longUrl)) {
        try {
            let url = await Url.findOne({ longUrl });
            if (url) {
                res.status(200).json(url)
            } else {
                const shortUrl = baseUrl + "/" + urlCode

                url = new Url({
                    longUrl,
                    shortUrl,
                    urlCode,
                });

                await url.save()

                res.status(200).json(url)

            }
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    } else {
        res.status(401).json("Invalid Long url")
    }

})

module.exports = router