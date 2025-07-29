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


// SERVIR CONVERSOR DE ÁUDIO
app.use('/conversor-de-audio', express.static(path.join(__dirname, 'frontend/conversor-de-audio')))

// Fallback para SPA (Single Page Application) — serve o index.html para rotas internas
app.get('/conversor-de-audio/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/conversor-de-audio', 'index.html'))
})


app.use('/', verificadorRoutes)

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})