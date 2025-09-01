const express = require('express')
const cors = require('cors')
const verificadorRoutes = require('./routes/verificadorRoutes')
const path = require('path')
const generateSitemap = require('./utils/generate-sitemap')
generateSitemap()

const PORT = process.env.PORT || 8080

const app = express()
app.use(cors())
app.use(express.json())


app.use('/conversor-de-audio', (req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
    next()
}, express.static(path.join(__dirname, 'frontend/conversor-de-audio')))

app.use('/', verificadorRoutes)

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})
