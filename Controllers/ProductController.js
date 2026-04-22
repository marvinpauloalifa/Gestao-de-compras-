class ProductController {
    constructor(productView) {
        this.productView = productView;
        this.produtos = [];
        this.nextId = 1;
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
                this.nextId = 1;
            }
        }
    }

    salvarProdutos() {
        localStorage.setItem('produtos_loja', JSON.stringify(this.produtos));
    }

    adicionarProduto() {
        const dados = this.productView.getDadosProduto();
        
        if (!dados) return;

        const novoProduto = {
            id: this.nextId++,
            ...dados,
            dataCriacao: new Date().toISOString()
        };

        this.produtos.push(novoProduto);
        this.salvarProdutos();

        this.productView.mostrarSucesso(novoProduto.nome);
        
        console.log(`✅ Produto adicionado:`, novoProduto);
        console.log(`📦 Total de produtos no sistema: ${this.produtos.length}`);
    }

    init() {
        this.productView.bindSubmit(() => this.adicionarProduto());
    }
}