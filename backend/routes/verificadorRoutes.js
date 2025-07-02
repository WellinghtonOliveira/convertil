const express = require('express')
const router = express.Router()
const { verificadorValor, listarCategorias, funcSubmitForm, getMetadata, getVida, apiAnalyze } = require('../controllers/verificadorController')

router.get('/buscar/:valor', verificadorValor)
router.get('/categorias', listarCategorias)
router.get('/get-metadata', getMetadata)
router.get('/ping', getVida)
router.get('/analyze', apiAnalyze)

router.post('/submitForm', funcSubmitForm)

module.exports = router