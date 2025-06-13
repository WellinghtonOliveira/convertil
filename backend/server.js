const express = require('express')
const cors = require('cors')
const verificadorRoutes = require('./routes/verificadorRoutes')

const PORT = 3000

const app = express()
app.use(cors())
app.use(express.json())

app.use('/', verificadorRoutes)

app.listen(PORT, () => {
    console.log(`Servidor rodando em PORT`)
})