// backend/routes/index.js
const express = require("express")
const router = express.Router()
const apiRouter = require("./api") // import from index.js file of api directory

//! Test Routes

router.get("/hello/world", function (req, res) {
  res.cookie("XSRF-TOKEN", req.csrfToken())
  res.send("Hello World!")
})

// backend/routes/index.js
// ...
// Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken()
  res.cookie("XSRF-TOKEN", csrfToken)
  res.status(200).json({
    "XSRF-Token": csrfToken
  })
})
// ...

router.use("/api", apiRouter) // ALL routes for this entire project begin with "/api"
process.env.NODE_ENV = "production"
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === "production") {
  const path = require("path")
  // Serve the frontend's index.html file at the root route
  router.get("/", (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken())
    return res.sendFile(
      path.resolve(__dirname, "../../frontend", "dist", "index.html")
    )
  })

  // Serve the static assets in the frontend's build folder
  router.use(express.static(path.resolve("../frontend/dist")))

  // Serve the frontend's index.html file at all other routes NOT starting with /api
  router.get(/^(?!\/api).*/, (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken())
    return res.sendFile(
      path.resolve(__dirname, "../../frontend", "dist", "index.html")
    )
  })
}
if (process.env.NODE_ENV !== "production") {
  router.get("/api/csrf/restore", (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken())
    return res.json({})
  })
}
module.exports = router
