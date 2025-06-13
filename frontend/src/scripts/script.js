async function carregarCategorias() {
    const res = await fetch('http://localhost:3000/categorias')
    const data = await res.json()
    return data
}

document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('toolsContainer')

    let arraycategorias = []
    let arrayNomes = []
    let arrayDescricao = []

    carregarCategorias().then(cat => {

        cat.categorias.forEach(cat => {
            arraycategorias.push(cat)
        })
        
        cat.nome.forEach(cat => {
            arrayNomes.push(cat)
        })

        cat.descricao.forEach(cat => {
            arrayDescricao.push(cat)
        })

        console.log(cat)
        
        for (let i = 0; i < arraycategorias.length; i++) {
            let category = arraycategorias[i]
            let nome = arrayNomes[i]
            let descricao = arrayDescricao[i]

            let categoryColor = '';
            let icon = '';

            switch (category) {
                case 'design':
                    categoryColor = 'bg-green-500';
                    icon = 'fa-paint-brush';
                    break;
                case 'dev':
                    categoryColor = 'bg-yellow-500';
                    icon = 'fa-code';
                    break;
                case 'productivity':
                    categoryColor = 'bg-red-500';
                    icon = 'fa-tasks';
                    break;
                case 'marketing':
                    categoryColor = 'bg-purple-500';
                    icon = 'fa-bullhorn';
                    break;
                case 'finance':
                    categoryColor = 'bg-gray-600';
                    icon = 'fa-chart-line';
                    break;
            }

            const toolCard = `
                <div class="tool-card bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out" data-name="coloqueAqui${i}" data-category="${category}">
                    <a href="coloqueAqui${i}.html" class="block">
                        <div class="p-5">
                            <div class="flex items-center mb-4">
                                <div class="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${categoryColor} text-white">
                                    <i class="fas ${icon}"></i>
                                </div>
                                <div class="ml-4">
                                    <h3 class="text-lg font-medium text-gray-900">${nome}</h3>
                                    <span class="inline-block px-2 py-1 text-xs font-semibold rounded-full ${categoryColor} text-white mt-1">${category.charAt(0).toUpperCase() + category.slice(1)}</span>
                                </div>
                            </div>
                            <p class="text-gray-600">${descricao}</p>
                        </div>
                        <div class="px-5 py-3 bg-gray-50 border-t border-gray-100 text-right">
                            <span class="text-blue-600 hover:text-blue-800 font-medium">Acessar <i class="fas fa-arrow-right ml-1"></i></span>
                        </div>
                    </a>
                </div>`

            container.insertAdjacentHTML('beforeend', toolCard);
        }
    });
})

// Função para filtrar ferramentas por busca
function filterTools() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toUpperCase();
    const tools = document.querySelectorAll('.tool-card');

    tools.forEach(tool => {
        const toolName = tool.dataset.name.toUpperCase();
        if (toolName.indexOf(filter) > -1) {
            tool.style.display = '';
        } else {
            tool.style.display = 'none';
        }
    });
}

// Função para filtrar por categoria
function filterByCategory(category) {
    const tools = document.querySelectorAll('.tool-card');

    tools.forEach(tool => {
        if (category === 'all' || tool.dataset.category === category) {
            tool.style.display = '';
        } else {
            tool.style.display = 'none';
        }
    });
}