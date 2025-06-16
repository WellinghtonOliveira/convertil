const express = require('express')
const cors = require('cors')
const verificadorRoutes = require('./routes/verificadorRoutes')

const generateSitemap = require('./utils/generate-sitemap')// chama o sitemap
generateSitemap()

const PORT = process.env.PORT || 3000

const app = express()
app.use(cors())
app.use(express.json())

app.use('/', verificadorRoutes)

app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})