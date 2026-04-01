const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
require('dotenv').config();

const nodemailer = require('nodemailer')
const dados = require('../utils/utils')
const cheerio = require('cheerio')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_API_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('🟢 Conectado ao MongoDB'))
    .catch(err => console.error('🔴 Erro ao conectar MongoDB:', err))

const MensagemSchema = new mongoose.Schema({
    nome: String,
    email: String,
    mensagem: String,
    criadoEm: {
        type: Date,
        default: Date.now
    }
})

const Mensagens = mongoose.model('Mensagens', MensagemSchema)

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS
    }
})

async function enviarEmail(nome, email, mensagem) {
    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: process.env.SMTP_EMAIL,
        subject: `Nova mensagem de ${nome}`,
        text: `
Nome: ${nome}
Email: ${email}

Mensagem:
${mensagem}
`,
        html: `
<h3>Nova mensagem recebida</h3>
<p><strong>Nome:</strong> ${nome}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Mensagem:</strong></p>
<p>${mensagem}</p>
`
    }

    return transporter.sendMail(mailOptions)
}

let contReq = 0

function getVida(req, res) {
    console.log(`Servidor Vivo req #${contReq++}`)
    res.json({})
}

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

async function funcSubmitForm(req, res) {

    const { nome, email, mensagem } = req.body

    if (!nome || !email || !mensagem) {
        return res.status(400).json({ erro: "Campos obrigatórios ausentes" })
    }

    try {

        /* salva no banco */
        const novaMensagem = new Mensagens({
            nome,
            email,
            mensagem
        })

        await novaMensagem.save()

        /* tenta enviar email */
        try {
            await enviarEmail(nome, email, mensagem)
            console.log("📧 Email enviado com sucesso")
        } catch (emailErr) {
            console.error("Erro ao enviar email:", emailErr)
        }

        return res.status(201).json({
            mensagem: "Mensagem enviada com sucesso"
        })

    } catch (err) {

        console.error('Erro ao salvar no banco:', err)

        return res.status(500).json({
            erro: 'Erro ao salvar mensagem'
        })

    }
}

async function getMetadata(req, res) {

    const siteUrl = req.query.url

    if (!siteUrl)
        return res.status(400).json({ error: 'URL ausente' })

    try {

        const apiUrl =
            `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(siteUrl)}&key=${process.env.PAGESPEED_API_KEY}&category=performance&category=seo`

        const apiRes = await fetch(apiUrl)
        const apiData = await apiRes.json()

        let title = 'Indisponível'
        let description = 'Indisponível'

        try {

            const pageRes = await fetch(siteUrl)
            const html = await pageRes.text()

            const $ = cheerio.load(html)

            title = $('title').text() || title
            description = $('meta[name="description"]').attr('content') || description

        } catch (e) {
            console.error('Erro ao capturar HTML:', e)
        }

        res.json({
            lighthouseResult: apiData.lighthouseResult,
            audits: apiData.lighthouseResult?.audits ?? {},
            categories: apiData.lighthouseResult?.categories ?? {},
            title,
            description
        })

    } catch (err) {

        console.error('Erro ao analisar o site:', err)

        res.status(500).json({
            error: 'Erro ao analisar o site'
        })

    }
}

async function apiAnalyze(req, res) {

    const { tag } = req.query

    if (!tag) {
        return res.status(400).json({
            error: 'A hashtag é obrigatória.'
        })
    }

    try {

        const apiUrl =
            `https://api.ritekit.com/v1/stats/hashtag-suggestions?text=${encodeURIComponent(tag)}&client_id=${process.env.ANALYZE_API_KEY}`

        const response = await fetch(apiUrl)
        const data = await response.json()

        res.json(data)

    } catch (err) {

        console.error(err)

        res.status(500).json({
            error: 'Erro ao buscar dados da API RiteTag'
        })

    }
}

module.exports = {
    verificadorValor,
    listarCategorias,
    funcSubmitForm,
    getMetadata,
    getVida,
    apiAnalyze
}