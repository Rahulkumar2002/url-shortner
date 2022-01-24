const router = require("express").Router()
const Url = require("../models/Url")

router.get("/:code", async (req, res) => {
    try {
        const url = await Url.findOne({ urlCode: req.params.code })

        if (url) {
            return res.status(200).redirect(url.longUrl)
        } else {
            return res.status(404).json('No url found!')
        }
    } catch (err) {
        res.status(500).json(err)
    }
})
module.exports = router