const dados = require('../utils/utils')

function verificadorValor(req, res) {
    const valorBuscado = parseInt(req.params.valor)
    const encontrado = dados.some(obj => Object.values(obj).includes(valorBuscado))
    res.json({ encontrado })
}

function listarCategorias(req, res) {
    console.log('Dados enviados com sucesso')
    const categorias = dados.map(obj => obj.category)
    const nome = dados.map(obj => obj.name)
    const descricao = dados.map(obj => obj.description)
    const link = dados.map(obj => obj.link)
    res.json({ categorias, nome, descricao, link })
}

function funcSubmitForm(req, res) {
    const { nome, email, mensagem } = req.body
    console.log(`Dados recebidos => NOME:-- ${nome} --, EMAIL:-- ${email} --, MENSAGEM:-- ${mensagem} --`)

    // Aqui você pode enviar e-mail, salvar no banco, etc
    return res.status(200).json({ mensagem: 'Recebido com sucesso' })
}

module.exports = { verificadorValor, listarCategorias, funcSubmitForm }
