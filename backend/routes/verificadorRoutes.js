const express = require('express')
const router = express.Router()
const { verificadorValor } = require('')

router.get('/buscar/:valor', verificadorValor)

module.exports = router