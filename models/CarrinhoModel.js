class CarrinhoModel {
    constructor() {
        this.itens = [];
        this.carregarCarrinho();
    }

    carregarCarrinho() {
        const dados = localStorage.getItem('carrinho_loja');
        if (dados) {
            try {
                this.itens = JSON.parse(dados);
            } catch (e) {
                this.itens = [];
            }
        }
    }

    salvarCarrinho() {
        localStorage.setItem('carrinho_loja', JSON.stringify(this.itens));
    }

    adicionarItem(produto) {
        const existente = this.itens.find(item => item.id === produto.id);
        if (existente) {
            existente.quantidade += 1;
        } else {
            this.itens.push({
                id: produto.id,
                nome: produto.nome,
                preco: produto.preco,
                categoria: produto.categoria,
                quantidade: 1
            });
        }
        this.salvarCarrinho();
    }

    removerItem(id) {
        this.itens = this.itens.filter(item => item.id != id);
        this.salvarCarrinho();
    }

    alterarQuantidade(id, delta) {
        const item = this.itens.find(item => item.id == id);
        if (item) {
            item.quantidade += delta;
            if (item.quantidade <= 0) {
                this.removerItem(id);
                return;
            }
            this.salvarCarrinho();
        }
    }

    limparCarrinho() {
        this.itens = [];
        this.salvarCarrinho();
    }

    getTotal() {
        return this.itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
    }

    getTotalItens() {
        return this.itens.reduce((acc, item) => acc + item.quantidade, 0);
    }
}