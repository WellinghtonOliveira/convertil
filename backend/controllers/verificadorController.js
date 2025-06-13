const dados = require('../utils/utils')

function verificadorValor(req, res) {
    const valorBuscado = parseInt(req.params.valor)
    const encontrado = dados.some(obj => Object.values(obj).includes(valorBuscado))
    res.json({ encontrado })
}

function listarCategorias(req, res) {
    console.log(dados)
    const categorias = dados.map(obj => obj.category)
    res.json({ categorias })
}

module.exports = { verificadorValor, listarCategorias }
