// server.js
const express = require('express')
const path = require('path')

const app = express()
const PORT = 8080

// Adiciona os cabeçalhos CORS + COOP/COEP
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
  res.setHeader('Access-Control-Allow-Origin', '*')
  next()
})

// Serve arquivos estáticos
app.use(express.static(path.join(__dirname, '.')))

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
