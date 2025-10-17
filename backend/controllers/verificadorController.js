const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
const dados = require('../utils/utils')
const cheerio = require('cheerio')
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const say = require('say');


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

function conversorTextoParaVoz(req, res) {
    const text = req.body.text;
    if (!text) {
        console.log('Texto vazio recebido');
        return res.status(400).send('Texto vazio');
    }

    // Cria um nome de arquivo único para cada requisição
    const filename = `saida-${Date.now()}.wav`;
    const outputFile = path.join(__dirname, filename);

    console.log(`Iniciando geração do áudio para texto: "${text}"`);
    console.log(`Arquivo de saída: ${outputFile}`);

    say.export(text, null, 1.0, outputFile, (err) => {
        if (err) {
            console.error('Erro ao gerar áudio:', err);
            return res.status(500).send('Erro ao gerar áudio');
        }

        // Verifica se arquivo foi criado
        fs.access(outputFile, fs.constants.F_OK, (accessErr) => {
            if (accessErr) {
                console.error('Arquivo de áudio não encontrado após geração:', outputFile);
                return res.status(500).send('Arquivo de áudio não encontrado');
            }

            console.log('Arquivo gerado com sucesso, enviando para cliente');

            res.setHeader('Content-Type', 'audio/wav');

            const stream = fs.createReadStream(outputFile);

            stream.on('error', (streamErr) => {
                console.error('Erro ao ler o arquivo:', streamErr);
                return res.status(500).send('Erro ao enviar áudio');
            });

            stream.pipe(res);

            stream.on('close', () => {
                // Apaga o arquivo depois de enviar
                fs.unlink(outputFile, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Erro ao apagar arquivo:', unlinkErr);
                    } else {
                        console.log(`Arquivo temporário apagado: ${outputFile}`);
                    }
                });
            });
        });
    });
}


module.exports = { verificadorValor, listarCategorias, funcSubmitForm, getMetadata, getVida, apiAnalyze, conversorTextoParaVoz }


// TODO lembrar de colocar banco de dados para salvar os emails