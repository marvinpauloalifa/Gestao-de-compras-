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
        const precoRaw = this.precoInput.value;
        const preco = parseFloat(precoRaw);
        const categoria = this.categoriaSelect.value;
        const status = this.getStatusSelecionado();
        const descricao = this.descricaoTextarea.value.trim();

        // Validação correta em JavaScript
        if (!nome || isNaN(preco) || preco <= 0 || !categoria) {
            this.mostrarToast('⚠️ Preço não pode ser negativo!', 'error');
            return null;
        }

        return { nome, preco, categoria, status, descricao };
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

    renderizarProdutos(produtos, onDelete, onEdit, onAdicionarCarrinho) {
        if (produtos.length === 0) {
            this.listaContainer.innerHTML = '<p style="padding: 20px; color: #667;">Nenhum produto cadastrado.</p>';
            return;
        }

        let html = `
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="text-align: left; border-bottom: 2px solid #eee;">
                        <th style="padding: 12px;">Produto</th>
                        <th style="padding: 12px;">Categoria</th>
                        <th style="padding: 12px;">Preço</th>
                        <th style="padding: 12px;">Status</th>
                        <th style="padding: 12px;">Ações</th>
                    </tr>
                </thead>
                <tbody>`;

        produtos.forEach(p => {
            const statusBadge = p.status === 'ativo'
                ? '<span style="background:#d5f5e3; color:#27ae60; padding:3px 8px; border-radius:20px; font-size:0.8rem;">🟢 Ativo</span>'
                : '<span style="background:#fadbd8; color:#e74c3c; padding:3px 8px; border-radius:20px; font-size:0.8rem;">🔴 Pausado</span>';

            html += `
                <tr style="border-bottom: 1px solid #f5f5f5;">
                    <td style="padding: 12px; font-weight:500;">${p.nome}</td>
                    <td style="padding: 12px; color:#777;">${p.categoria}</td>
                    <td style="padding: 12px; font-weight:600;">${p.preco.toFixed(2)} MZM</td>
                    <td style="padding: 12px;">${statusBadge}</td>
                    <td style="padding: 12px; white-space:nowrap;">
                        <button class="btn-carrinho" data-id="${p.id}" style="background:#2ecc71; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; margin-right:5px;">🛒</button>
                        <button class="btn-edit" data-id="${p.id}" style="background:#3498db; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; margin-right:5px;">Editar</button>
                        <button class="btn-delete" data-id="${p.id}" style="background:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">Remover</button>
                    </td>
                </tr>`;
        });

        html += '</tbody></table>';
        this.listaContainer.innerHTML = html;

        // Binds de eventos após renderizar o HTML
        this.listaContainer.querySelectorAll('.btn-delete').forEach(btn => {
            btn.onclick = () => onDelete(btn.dataset.id);
        });
        this.listaContainer.querySelectorAll('.btn-edit').forEach(btn => {
            btn.onclick = () => onEdit(btn.dataset.id);
        });
        if (onAdicionarCarrinho) {
            this.listaContainer.querySelectorAll('.btn-carrinho').forEach(btn => {
                btn.onclick = () => onAdicionarCarrinho(btn.dataset.id);
            });
        }
    }

    prepararFormEdicao(produto) {
        this.formTitle.innerText = "📝 Editar Produto";
        this.btnSubmitText.innerText = "Salvar Alterações";
        this.nomeInput.value = produto.nome;
        this.precoInput.value = produto.preco;
        this.categoriaSelect.value = produto.categoria;
        this.descricaoTextarea.value = produto.descricao;

        // Marcar o rádio correspondente ao status
        this.statusRadios.forEach(radio => {
            radio.checked = (radio.value === produto.status);
        });

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
        if (tipo === 'error') {
            this.toast.classList.add('error');
        } else {
            this.toast.classList.remove('error');
        }

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