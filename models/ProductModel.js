class ProductModel {
    constructor(id, nome, preco, categoria, status, descricao, imagem = '') {
        this.id = id;
        this.nome = nome;
        this.preco = parseFloat(preco);
        this.categoria = categoria;
        this.status = status;
        this.descricao = descricao || '';
        this.imagem = imagem;
        this.dataCriacao = new Date().toISOString();
    }
}