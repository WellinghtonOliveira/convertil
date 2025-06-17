const express = require('express')
const router = express.Router()
const { verificadorValor, listarCategorias } = require('../controllers/verificadorController')

router.get('/buscar/:valor', verificadorValor)
router.get('/categorias', listarCategorias)
// router.get('/teste', (req, res) => {

//     setTimeout(() => {
//         res.json({})
//         console.log('rodando')
//     },30000)
// Rota para teste
// })

module.exports = router