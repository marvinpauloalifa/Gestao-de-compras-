class ProductView {
    constructor() {
        this.form = document.getElementById('productForm');
        this.nomeInput = document.getElementById('productName');
        this.precoInput = document.getElementById('productPrice');
        this.categoriaSelect = document.getElementById('productCategory');
        this.statusRadios = document.querySelectorAll('input[name="status"]');
        this.descricaoTextarea = document.getElementById('productDescription');
        this.toast = document.getElementById('toast');
    }

    getStatusSelecionado() {
        for (let radio of this.statusRadios) {
            if (radio.checked) return radio.value;
        }
        return 'ativo';
    }

    getDadosProduto() {
        const nome = this.nomeInput.value.trim();
        const preco = this.precoInput.value;
        const categoria = this.categoriaSelect.value;
        const status = this.getStatusSelecionado();
        const descricao = this.descricaoTextarea.value.trim();

        // Validações
        if (!nome) {
            this.mostrarToast('❌ Por favor, informe o nome do produto', 'error');
            return null;
        }

        if (!preco || parseFloat(preco) <= 0) {
            this.mostrarToast('❌ Por favor, informe um preço válido (maior que zero)', 'error');
            return null;
        }

        if (!categoria) {
            this.mostrarToast('❌ Por favor, selecione uma categoria', 'error');
            return null;
        }

        return {
            nome,
            preco: parseFloat(preco),
            categoria,
            status,
            descricao
        };
    }

    limparFormulario() {
        this.form.reset();
        // Resetar status para o padrão
        document.querySelector('input[value="ativo"]').checked = true;
        this.nomeInput.focus();
    }

    mostrarToast(mensagem, tipo = 'success') {
        this.toast.className = 'toast';
        this.toast.classList.add(tipo);
        this.toast.innerHTML = `<span>${tipo === 'success' ? '✅' : '⚠️'}</span> ${mensagem}`;
        this.toast.classList.add('show');

        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }

    mostrarSucesso(produtoNome) {
        this.mostrarToast(`✨ Produto "${produtoNome}" adicionado com sucesso!`, 'success');
        this.limparFormulario();
    }

    bindSubmit(handler) {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            handler();
        });
    }
}