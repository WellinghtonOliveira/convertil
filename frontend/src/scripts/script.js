document.addEventListener('DOMContentLoaded', async function () {
    const form = document.querySelector('#contatarForm')
    const loading = document.querySelector('#load-inicio-chamada')
    const container = document.getElementById('toolsContainer')
    const paginationContainer = document.getElementById('pagination')

    let intervalId = null

    function startLoadingAnimation() {
        const ponto = ['.', '..', '...']
        let i = 0
        loading.textContent = 'Carregando'
        intervalId = setInterval(() => {
            loading.textContent = `Carregando${ponto[i]}`
            i = (i + 1) % ponto.length
        }, 500)
    }

    function stopLoadingAnimation() {
        clearInterval(intervalId)
        intervalId = null
    }

    async function carregarCategorias() {
        startLoadingAnimation()
        try {
            const res = await fetch('http://localhost:3000/categorias')// https://megasitebackend.onrender.com
            if (!res.ok) throw new Error('Erro na requisição')
            const data = await res.json()
            stopLoadingAnimation()
            loading.textContent = 'Todas as Ferramentas Disponíveis'
            return data
        } catch (error) {
            stopLoadingAnimation()
            loading.textContent = 'Erro ao carregar categorias'
            console.error(error)
            return null
        }
    }

    function closeContactModal() {
        document.getElementById('contactModal').classList.add('hidden')
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault()

        const formData = new FormData(form)
        const dados = Object.fromEntries(formData.entries())

        try {
            const res = await fetch('https://megasitebackend.onrender.com/submitForm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            })

            if (res.ok) {
                alert('Mensagem enviada com sucesso.')
                form.reset()
                closeContactModal()
            } else {
                alert('Erro ao enviar, tente novamente.')
            }
        } catch (error) {
            console.log(error)
            alert('Erro de rede, tente mais tarde.')
        }
    })

    // Parte de ferramentas e paginação
    const itemsPerPage = 30
    let currentPage = 1

    const arraycategorias = []
    const arrayNomes = []
    const arrayDescricao = []
    const arrayLink = []

    const cat = await carregarCategorias()
    if (!cat) return

    cat.categorias.forEach(cat => arraycategorias.push(cat))
    cat.nome.forEach(cat => arrayNomes.push(cat))
    cat.descricao.forEach(cat => arrayDescricao.push(cat))
    cat.link.forEach(cat => arrayLink.push(cat))

    const totalItems = arrayNomes.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)

    function renderTools(page) {
        container.innerHTML = ''

        const start = (page - 1) * itemsPerPage
        const end = start + itemsPerPage

        for (let i = start; i < end && i < totalItems; i++) {
            const category = arraycategorias[i]
            const nome = arrayNomes[i]
            const descricao = arrayDescricao[i]
            const link = arrayLink[i]

            let categoryColor = ''
            let icon = ''

            switch (category) {
                case 'design':
                    categoryColor = 'bg-green-500'; icon = 'fa-paint-brush'; break
                case 'dev':
                    categoryColor = 'bg-yellow-500'; icon = 'fa-code'; break
                case 'productivity':
                    categoryColor = 'bg-red-500'; icon = 'fa-tasks'; break
                case 'marketing':
                    categoryColor = 'bg-purple-500'; icon = 'fa-bullhorn'; break
                case 'finance':
                    categoryColor = 'bg-gray-600'; icon = 'fa-chart-line'; break
                default:
                    categoryColor = 'bg-blue-500'; icon = 'fa-toolbox'; break
            }

            const toolCard = `
                <div class="tool-card bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out" data-name="${nome}" data-category="${category}">
                    <a href="${link}" class="block">
                        <div class="p-5">
                            <div class="flex items-center mb-4">
                                <div class="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${categoryColor} text-white">
                                    <i class="fas ${icon}"></i>
                                </div>
                                <div class="ml-4">
                                    <h3 class="text-lg font-medium text-gray-900">${nome}</h3>
                                    <span class="inline-block px-2 py-1 text-xs font-semibold rounded-full ${categoryColor} text-white mt-1">
                                        ${category.charAt(0).toUpperCase() + category.slice(1)}
                                    </span>
                                </div>
                            </div>
                            <p class="text-gray-600">${descricao}</p>
                        </div>
                        <div class="px-5 py-3 bg-gray-50 border-t border-gray-100 text-right">
                            <span class="text-blue-600 hover:text-blue-800 font-medium">Acessar <i class="fas fa-arrow-right ml-1"></i></span>
                        </div>
                    </a>
                </div>`

            container.insertAdjacentHTML('beforeend', toolCard)
        }
    }

    function renderPagination() {
        paginationContainer.innerHTML = ''

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('a')
            btn.href = '#'
            btn.textContent = i
            btn.className = `px-3 py-1 rounded-md ${i === currentPage ? 'bg-blue-600 text-white font-medium' : 'text-gray-700 hover:bg-gray-100'}`

            btn.addEventListener('click', (e) => {
                e.preventDefault()
                currentPage = i
                renderTools(currentPage)
                renderPagination()
            })

            paginationContainer.appendChild(btn)
        }
    }

    renderTools(currentPage)
    renderPagination()
})
