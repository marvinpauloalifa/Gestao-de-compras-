class CarrinhoController {
    constructor(carrinhoModel, carrinhoView, productController) {
        this.carrinhoModel = carrinhoModel;
        this.carrinhoView = carrinhoView;
        this.productController = productController;
    }

    adicionarProduto(produto) {
        if (produto.status === 'pausado') {
            this.carrinhoView.mostrarToast('⚠️ Produto pausado, não pode ser adicionado!', 'error');
            return;
        }
        this.carrinhoModel.adicionarItem(produto);
        this.carrinhoView.mostrarToast(`🛒 "${produto.nome}" adicionado ao carrinho!`);
        this.carrinhoView.atualizarBadge(this.carrinhoModel.getTotalItens());
    }

    removerItem(id) {
        this.carrinhoModel.removerItem(id);
        this.carrinhoView.mostrarToast('🗑️ Item removido do carrinho', 'error');
        this.atualizarCarrinho();
    }

    aumentarQuantidade(id) {
        this.carrinhoModel.alterarQuantidade(id, +1);
        this.atualizarCarrinho();
    }

    diminuirQuantidade(id) {
        this.carrinhoModel.alterarQuantidade(id, -1);
        this.atualizarCarrinho();
    }

    limparCarrinho() {
        if (confirm('Tem certeza que deseja limpar o carrinho?')) {
            this.carrinhoModel.limparCarrinho();
            this.carrinhoView.mostrarToast('🗑️ Carrinho limpo!', 'error');
            this.atualizarCarrinho();
        }
    }

    finalizarCompra() {
        if (this.carrinhoModel.itens.length === 0) {
            this.carrinhoView.mostrarToast('⚠️ O carrinho está vazio!', 'error');
            return;
        }
        const total = this.carrinhoModel.getTotal();
        this.carrinhoModel.limparCarrinho();
        this.atualizarCarrinho();
        this.carrinhoView.mostrarToast(`🎉 Compra finalizada! Total: ${total.toFixed(2)} MZM`);
    }

    atualizarCarrinho() {
        this.carrinhoView.renderizarCarrinho(
            this.carrinhoModel.itens,
            this.carrinhoModel.getTotal(),
            (id) => this.removerItem(id),
            (id) => this.aumentarQuantidade(id),
            (id) => this.diminuirQuantidade(id),
            () => this.limparCarrinho(),
            () => this.finalizarCompra()
        );
        this.carrinhoView.atualizarBadge(this.carrinhoModel.getTotalItens());
    }

    mostrarSecaoCarrinho() {
        document.getElementById('section-form').style.display = 'none';
        document.getElementById('section-list').style.display = 'none';
        document.getElementById('section-carrinho').style.display = 'block';
        document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
        document.getElementById('menu-carrinho').classList.add('active');
        this.atualizarCarrinho();
    }

    init() {
        document.getElementById('menu-carrinho').onclick = () => {
            this.mostrarSecaoCarrinho();
        };
        this.carrinhoView.atualizarBadge(this.carrinhoModel.getTotalItens());
    }
}