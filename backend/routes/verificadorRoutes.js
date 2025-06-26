const express = require('express')
const router = express.Router()
const { verificadorValor, listarCategorias, funcSubmitForm, getMetadata } = require('../controllers/verificadorController')

router.get('/buscar/:valor', verificadorValor)
router.get('/categorias', listarCategorias)
router.get('/get-metadata', getMetadata)

router.post('/submitForm', funcSubmitForm)

module.exports = router