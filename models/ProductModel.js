class ProductModel {
    constructor(id, nome, preco, categoria, status, descricao) {
        this.id = id;
        this.nome = nome;
        this.preco = parseFloat(preco);
        this.categoria = categoria;
        this.status = status;
        this.descricao = descricao || '';
        this.dataCriacao = new Date().toISOString();
    }
}