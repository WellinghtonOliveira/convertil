// Função adicional para garantir que os filtros funcionem
function filterTools() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toUpperCase();
    const tools = document.querySelectorAll('.tool-card');

    tools.forEach(tool => {
        const toolName = tool.getAttribute('data-name').toUpperCase();
        if (toolName.indexOf(filter) > -1) {
            tool.style.display = '';
        } else {
            tool.style.display = 'none';
        }
    });
}

function filterByCategory(categoria) {
    const ferramentas = document.querySelectorAll('#toolsContainer .tool-card')

    ferramentas.forEach(tool => {
        const toolCategoria = tool.getAttribute('data-category')
        if (categoria === 'all' || toolCategoria === categoria) {
            tool.classList.remove('hidden')
        } else {
            tool.classList.add('hidden')
        }
    })
}


// Adicionando evento de input para o campo de busca
document.getElementById('searchInput').addEventListener('input', filterTools);