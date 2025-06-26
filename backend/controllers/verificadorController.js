const dados = require('../utils/utils')
const cheerio = require('cheerio')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

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

module.exports = { verificadorValor, listarCategorias, funcSubmitForm, getMetadata }
