class ProductView {
    constructor() {
        this.form = document.getElementById('productForm');
        this.nomeInput = document.getElementById('productName');
        this.precoInput = document.getElementById('productPrice');
        this.categoriaSelect = document.getElementById('productCategory');
        this.statusRadios = document.querySelectorAll('input[name="status"]');
        this.descricaoTextarea = document.getElementById('productDescription');
        this.toast = document.getElementById('toast');
        
        this.sectionForm = document.getElementById('section-form');
        this.sectionList = document.getElementById('section-list');
        this.listaContainer = document.getElementById('lista-container');
        this.menuAdicionar = document.getElementById('menu-adicionar');
        this.menuLista = document.getElementById('menu-lista');
        this.formTitle = document.getElementById('form-title');
        this.btnSubmitText = document.getElementById('btn-submit-text');
    }

    getStatusSelecionado() {
        let status = 'ativo';
        this.statusRadios.forEach(radio => {
            if (radio.checked) status = radio.value;
        });
        return status;
    }

    getDadosProduto() {
        const nome = this.nomeInput.value.trim();
        const preco = this.precoInput.value;
        const categoria = this.categoriaSelect.value;
        const status = this.getStatusSelecionado();
        const descricao = this.descricaoTextarea.value.trim();

        if (!nome || !preco || parseFloat(preco) <= 0 || !categoria) {
            this.mostrarToast('⚠️ Preencha os campos obrigatórios!', 'error');
            return null;
        }

        return { nome, preco: parseFloat(preco), categoria, status, descricao };
    }

    alternarAba(aba) {
        if (aba === 'lista') {
            this.sectionForm.style.display = 'none';
            this.sectionList.style.display = 'block';
            this.menuLista.classList.add('active');
            this.menuAdicionar.classList.remove('active');
        } else {
            this.sectionForm.style.display = 'block';
            this.sectionList.style.display = 'none';
            this.menuAdicionar.classList.add('active');
            this.menuLista.classList.remove('active');
        }
    }

    renderizarProdutos(produtos, onDelete, onEdit) {
        if (produtos.length === 0) {
            this.listaContainer.innerHTML = '<p style="padding: 20px; color: #667;">Nenhum produto cadastrado.</p>';
            return;
        }

        let html = `<table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="text-align: left; border-bottom: 2px solid #eee;">
                    <th style="padding: 12px;">Produto</th>
                    <th style="padding: 12px;">Preço</th>
                    <th style="padding: 12px;">Ações</th>
                </tr>
            </thead>
            <tbody>`;

        produtos.forEach(p => {
            html += `
                <tr style="border-bottom: 1px solid #f5f5f5;">
                    <td style="padding: 12px;">${p.nome}</td>
                    <td style="padding: 12px;">${p.preco.toFixed(2)} MZM</td>
                    <td style="padding: 12px;">
                        <button class="btn-edit" data-id="${p.id}" style="background:#3498db; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; margin-right:5px;">Editar</button>
                        <button class="btn-delete" data-id="${p.id}" style="background:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">Remover</button>
                    </td>
                </tr>`;
        });

        html += '</tbody></table>';
        this.listaContainer.innerHTML = html;

        this.listaContainer.querySelectorAll('.btn-delete').forEach(btn => {
            btn.onclick = () => onDelete(btn.dataset.id);
        });
        this.listaContainer.querySelectorAll('.btn-edit').forEach(btn => {
            btn.onclick = () => onEdit(btn.dataset.id);
        });
    }

    prepararFormEdicao(produto) {
        this.formTitle.innerText = "📝 Editar Produto";
        this.btnSubmitText.innerText = "Salvar Alterações";
        this.nomeInput.value = produto.nome;
        this.precoInput.value = produto.preco;
        this.categoriaSelect.value = produto.categoria;
        this.descricaoTextarea.value = produto.descricao;
        this.alternarAba('form');
    }

    limparFormulario() {
        this.form.reset();
        this.formTitle.innerText = "➕ Adicionar novo produto";
        this.btnSubmitText.innerText = "Adicionar Produto";
    }

    mostrarToast(mensagem, tipo = 'success') {
        this.toast.innerHTML = mensagem;
        this.toast.className = 'toast show';
        if (tipo === 'error') this.toast.classList.add('error');
        
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }

    bindSubmit(handler) {
        this.form.onsubmit = (e) => {
            e.preventDefault();
            handler();
        };
    }
}