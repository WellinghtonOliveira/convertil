const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
require('dotenv').config();
const dados = require('../utils/utils')
const cheerio = require('cheerio')
const mongoose = require('mongoose')

// const { exec } = require('child_process');
// const path = require('path');
// const fs = require('fs');

mongoose.connect(process.env.MONGO_API_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('🟢 Conectado ao MongoDB'))
    .catch(err => console.error('🔴 Erro ao conectar MongoDB:', err));
const MensagemSchema = new mongoose.Schema({
    nome: String,
    email: String,
    mensagem: String,
    criadoEm: {
        type: Date,
        default: Date.now
    }
});

const Mensagens = mongoose.model('Mensagens', MensagemSchema);

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
    const { nome, email, mensagem } = req.body;

    try {
        const novaMensagem = new Mensagens({ nome, email, mensagem });
        await novaMensagem.save();

        const msg = {
            to: '000devhome@gmail.com', 
            from: '000devhome@gmail.com',
            subject: `Nova mensagem de ${nome}`,
            text: `Nome: ${nome}\nEmail: ${email}\nMensagem: ${mensagem}`,
            html: `<strong>Nome:</strong> ${nome}<br>
             <strong>Email:</strong> ${email}<br>
             <strong>Mensagem:</strong> ${mensagem}`,
        };

        await sgMail.send(msg);

        return res.status(201).json({ mensagem: 'Salvo e e-mail enviado com sucesso!' });
    } catch (err) {
        console.error('Erro ao salvar ou enviar e-mail:', err);
        return res.status(500).json({ erro: 'Erro interno ao salvar ou enviar e-mail' });
    }
}

async function getMetadata(req, res) {
    const siteUrl = req.query.url;
    if (!siteUrl) return res.status(400).json({ error: 'URL ausente' });

    try {
        // Chamada à API PageSpeed
        const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(siteUrl)}&key=${process.env.PAGESPEED_API_KEY}&category=performance&category=seo`;
        const apiRes = await fetch(apiUrl);
        const apiData = await apiRes.json();

        // Título e descrição do site
        let title = 'Indisponível';
        let description = 'Indisponível';

        try {
            const pageRes = await fetch(siteUrl);
            const html = await pageRes.text();
            const $ = cheerio.load(html);
            title = $('title').text() || title;
            description = $('meta[name="description"]').attr('content') || description;
        } catch (e) {
            console.error('Erro ao capturar HTML:', e);
        }

        // Envia todos os dados em um único JSON
        res.json({
            lighthouseResult: apiData.lighthouseResult,
            audits: apiData.lighthouseResult?.audits ?? {},
            categories: apiData.lighthouseResult?.categories ?? {},
            title,
            description
        });

    } catch (err) {
        console.error('Erro ao analisar o site:', err);
        res.status(500).json({ error: 'Erro ao analisar o site' });
    }
}

async function apiAnalyze(req, res) {
    const { tag } = req.query;

    if (!tag) {
        return res.status(400).json({ error: 'A hashtag é obrigatória.' });
    }

    try {
        const apiUrl = `https://api.ritekit.com/v1/stats/hashtag-suggestions?text=${encodeURIComponent(tag)}&client_id=${process.env.ANALYZE_API_KEY}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar dados da API RiteTag' });
    }
}

module.exports = { verificadorValor, listarCategorias, funcSubmitForm, getMetadata, getVida, apiAnalyze }

