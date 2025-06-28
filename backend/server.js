const express = require('express')
const cors = require('cors')
const verificadorRoutes = require('./routes/verificadorRoutes')

const generateSitemap = require('./utils/generate-sitemap')// chama o sitemap
generateSitemap()

const PORT = process.env.PORT || 8080

const app = express()
app.use(cors())
app.use(express.json())

app.use('/', verificadorRoutes)

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})