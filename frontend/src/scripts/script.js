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
            const res = await fetch('https://megasitebackend-4il9.onrender.com/categorias')
            if (!res.ok) throw new Error('Erro na requisição')
            const data = await res.json()
            stopLoadingAnimation()
            loading.textContent = 'Todas as Ferramentas Disponíveis'
            return data
        } catch (error) {
            stopLoadingAnimation()
            loading.textContent = 'Passando por reformas'
            console.error(error)
            return null
        }
    }

    function closeContactModal() {
        document.getElementById('contactModal').classList.add('hidden')
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault()

        const nome = form.nome.value.trim();
        const email = form.email.value.trim();
        const mensagem = form.mensagem.value.trim()
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!/^[a-zA-Z\s]+$/.test(nome)) {
            showModal('Erro! Digite um nome válido.');
            e.preventDefault();
            return;
        }

        if (!emailRegex.test(email)) {
            showModal('Erro! Digite um email válido!');
            closeModal()
            e.preventDefault();
            return;
        }

        if (mensagem.length < 5 || mensagem.length > 150) {
            showModal('Erro! A mensagem deve ter de 5 a 150 caracteres.');
            e.preventDefault();
            return;
        }

        const formData = new FormData(form)
        const dados = Object.fromEntries(formData.entries())

        try {
            const res = await fetch('https://megasitebackend-4il9.onrender.com/submitForm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            })

            if (res.ok) {
                showModal('Sucesso! enviado com sucesso.')
                form.reset()
                closeContactModal()
            } else {
                showModal('Erro ao enviar, tente novamente.')
            }
        } catch (error) {
            console.log(error)
            showModal('Erro de rede, tente mais tarde.')
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

    // Contatar ---

    // spans
    const spanNome = document.getElementById("span-nome")
    const spanEmail = document.getElementById("span-email")
    const spanMsg = document.getElementById("span-msg")

    // inputs
    const form1 = document.getElementById("input-form-text-0")
    const form2 = document.getElementById("input-form-text-1")
    const form3 = document.getElementById("input-form-text-2")

    form1.addEventListener("focus", () => {
        spanNome.style.top = "0"
        spanNome.style.color = "white"
        spanNome.style.textShadow = "1px 1px 3px rgba(255, 255, 255, 0.4)"
    })

    form2.addEventListener("focus", () => {
        spanEmail.style.top = "0"
        spanEmail.style.color = "white"
        spanEmail.style.textShadow = "1px 1px 3px rgba(255, 255, 255, 0.4)"
    })

    form3.addEventListener("focus", () => {
        spanMsg.style.top = "0"
        spanMsg.style.color = "white"
        spanMsg.style.textShadow = "1px 1px 3px rgba(255, 255, 255, 0.4)"
    })

    // blur
    form1.addEventListener("blur", () => {
        if (form1.value == 0) {
            spanNome.style.top = "3.3em"
            spanNome.style.color = "black"
            spanNome.style.textShadow = "none"
        }

    })

    form2.addEventListener("blur", () => {
        if (form2.value == 0) {
            spanEmail.style.top = "3.3em"
            spanEmail.style.color = "black"
            spanEmail.style.textShadow = "none"
        }

    })

    form3.addEventListener("blur", () => {
        if (form3.value == 0) {
            spanMsg.style.top = "3.3em"
            spanMsg.style.color = "black"
            spanMsg.style.textShadow = "none"
        }

    })

    

    function showModal(message) {
        // Definir a mensagem no modal
        document.getElementById('modal-message').innerText = message;

        // Verificar se é uma mensagem de erro ou sucesso
        if (message.includes('Erro')) {
            document.getElementById('modal').classList.remove('modal-success');
        } else {
            document.getElementById('modal').classList.add('modal-success');
        }

        // Mostrar o modal
        document.getElementById('modal').style.display = 'block';
        setTimeout(() => {closeModal()}, 3000)
    }

    function closeModal() {
        // Fechar o modal
        document.getElementById('modal').style.display = 'none';
    }

})


