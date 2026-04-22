class ProductController {
    constructor(productView) {
        this.productView = productView;
        this.produtos = [];
        this.nextId = 1;
        this.editandoId = null;
        this.carregarProdutos();
    }

    carregarProdutos() {
        const dados = localStorage.getItem('produtos_loja');
        if (dados) {
            try {
                this.produtos = JSON.parse(dados);
                // Define o próximo ID baseado no maior ID existente
                this.nextId = this.produtos.length > 0 
                    ? Math.max(...this.produtos.map(p => p.id)) + 1 
                    : 1;
            } catch(e) {
                this.produtos = [];
            }
        }
    }

    salvarProdutos() {
        localStorage.setItem('produtos_loja', JSON.stringify(this.produtos));
    }

    processarFormulario() {
        const dados = this.productView.getDadosProduto();
        if (!dados) return;

        if (this.editandoId) {
            // Lógica de Edição
            const index = this.produtos.findIndex(p => p.id == this.editandoId);
            if (index !== -1) {
                this.produtos[index] = { ...this.produtos[index], ...dados };
                this.productView.mostrarToast('✅ Produto atualizado com sucesso!');
            }
            this.editandoId = null;
        } else {
            // Lógica de Novo Produto (CORRIGIDO AQUI)
            const novoProduto = new ProductModel(
                this.nextId++,
                dados.nome,
                dados.preco,
                dados.categoria,
                dados.status,
                dados.descricao
            );
            
            this.produtos.push(novoProduto);
            this.productView.mostrarToast(`✨ Produto "${dados.nome}" adicionado!`);
        }

        this.salvarProdutos();
        this.productView.limparFormulario();
        
        // Pequeno delay para o usuário ver o Toast antes de trocar de aba
        setTimeout(() => {
            this.productView.alternarAba('lista');
            this.atualizarTabela();
        }, 800);
    }

    removerProduto(id) {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            this.produtos = this.produtos.filter(p => p.id != id);
            this.salvarProdutos();
            this.atualizarTabela();
            this.productView.mostrarToast('🗑️ Produto removido', 'error');
        }
    }

    prepararEdicao(id) {
        const produto = this.produtos.find(p => p.id == id);
        if (produto) {
            this.editandoId = id;
            this.productView.prepararFormEdicao(produto);
        }
    }

    atualizarTabela() {
        this.productView.renderizarProdutos(
            this.produtos,
            (id) => this.removerProduto(id),
            (id) => this.prepararEdicao(id)
        );
    }

    init() {
        // Configura cliques no Menu
        document.getElementById('menu-adicionar').onclick = () => {
            this.editandoId = null;
            this.productView.limparFormulario();
            this.productView.alternarAba('form');
        };

        document.getElementById('menu-lista').onclick = () => {
            this.productView.alternarAba('lista');
            this.atualizarTabela();
        };

        // Configura o envio do formulário
        this.productView.bindSubmit(() => this.processarFormulario());

        // Renderiza a lista inicial
        this.atualizarTabela();
    }
}