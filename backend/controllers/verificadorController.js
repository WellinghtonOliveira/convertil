const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
const dados = require('../utils/utils')
const cheerio = require('cheerio')
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose')


const MONGO_URI = 'mongodb+srv://000devhome:35xqnaqw@convertil.30xesl4.mongodb.net/?retryWrites=true&w=majority&appName=Convertil';

mongoose.connect(MONGO_URI, {
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

const Mensagem = mongoose.model('Mensagem', MensagemSchema);
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
  console.log(`Dados recebidos => NOME:-- ${nome} --, EMAIL:-- ${email} --, MENSAGEM:-- ${mensagem} --`);

  try {
    const novaMensagem = new Mensagem({ nome, email, mensagem });
    await novaMensagem.save(); // salva no MongoDB

    return res.status(201).json({ mensagem: 'Salvo com sucesso no banco!' });
  } catch (err) {
    console.error('Erro ao salvar no MongoDB:', err);
    return res.status(500).json({ erro: 'Erro interno ao salvar' });
  }
}

async function getMetadata(req, res) {  
    const API_KEY = 'AIzaSyA0EqtqtjlUng3Yt_cWNlfWhDxJP_QkvoQ';

    const siteUrl = req.query.url;
    if (!siteUrl) return res.status(400).json({ error: 'URL ausente' });

    try {
        // Chamada à API PageSpeed
        const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(siteUrl)}&key=${API_KEY}&category=performance&category=seo`;
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
    const API_KEY = '14299872be3fd205be014943456b6a8f3e8739341144';
    const { tag } = req.query;

    if (!tag) {
        return res.status(400).json({ error: 'A hashtag é obrigatória.' });
    }

    try {
        const apiUrl = `https://api.ritekit.com/v1/stats/hashtag-suggestions?text=${encodeURIComponent(tag)}&client_id=${API_KEY}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar dados da API RiteTag' });
    }
}

module.exports = { verificadorValor, listarCategorias, funcSubmitForm, getMetadata, getVida, apiAnalyze }

