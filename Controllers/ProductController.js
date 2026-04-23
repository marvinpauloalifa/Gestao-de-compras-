class ProductController {
    constructor(productView) {
        this.productView = productView;
        this.produtos = [];
        this.nextId = 1;
        this.editandoId = null;
        this.carrinhoController = null;
        this.carregarProdutos();
    }

    carregarProdutos() {
        const dados = localStorage.getItem('produtos_loja');
        if (dados) {
            try {
                this.produtos = JSON.parse(dados);
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
            const index = this.produtos.findIndex(p => p.id == this.editandoId);
            if (index !== -1) {
                this.produtos[index] = { ...this.produtos[index], ...dados };
                this.productView.mostrarToast('✅ Produto atualizado com sucesso!');
            }
            this.editandoId = null;
        } else {
            const novoProduto = new ProductModel(
                this.nextId++,
                dados.nome,
                dados.preco,
                dados.categoria,
                dados.status,
                dados.descricao,
                dados.imagem
            );
            this.produtos.push(novoProduto);
            this.productView.mostrarToast(`✨ Produto "${dados.nome}" adicionado!`);
        }

        this.salvarProdutos();
        this.productView.limparFormulario();

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
            (id) => this.prepararEdicao(id),
            (id) => {
                if (this.carrinhoController) {
                    const produto = this.produtos.find(p => p.id == id);
                    if (produto) this.carrinhoController.adicionarProduto(produto);
                }
            }
        );
    }

    init() {
        document.getElementById('menu-adicionar').onclick = () => {
            this.editandoId = null;
            this.productView.limparFormulario();
            this.productView.alternarAba('form');
            document.getElementById('section-carrinho').style.display = 'none';
            document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
            document.getElementById('menu-adicionar').classList.add('active');
        };

        document.getElementById('menu-lista').onclick = () => {
            this.productView.alternarAba('lista');
            document.getElementById('section-carrinho').style.display = 'none';
            document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
            document.getElementById('menu-lista').classList.add('active');
            this.atualizarTabela();
        };

        this.productView.bindSubmit(() => this.processarFormulario());
        this.atualizarTabela();
    }
}