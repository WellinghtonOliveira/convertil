const express = require('express')
const router = express.Router()
const { verificadorValor, listarCategorias } = require('../controllers/verificadorController')

router.get('/buscar/:valor', verificadorValor)
router.get('/categorias', listarCategorias)

module.exports = router