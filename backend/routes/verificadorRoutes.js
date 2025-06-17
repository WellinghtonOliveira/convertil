const express = require('express')
const router = express.Router()
const { verificadorValor, listarCategorias, funcSubmitForm } = require('../controllers/verificadorController')

router.get('/buscar/:valor', verificadorValor)
router.get('/categorias', listarCategorias)

router.post('/submitForm', funcSubmitForm)

module.exports = router