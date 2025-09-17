const express = require('express')
const router = express.Router()
const { listarCategorias, funcSubmitForm, getMetadata, getVida, apiAnalyze, conversorTextoParaVoz } = require('../controllers/verificadorController')

router.get('/categorias', listarCategorias)
router.get('/get-metadata', getMetadata)
router.get('/ping', getVida)
router.get('/analyze', apiAnalyze)

router.post('/ctpv', conversorTextoParaVoz)//conversor-de-texto-para-voz
router.post('/submitForm', funcSubmitForm)

module.exports = router