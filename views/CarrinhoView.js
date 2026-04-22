class CarrinhoView {
    constructor() {
        this.sectionCarrinho = document.getElementById('section-carrinho');
        this.carrinhoContainer = document.getElementById('carrinho-container');
        this.menuCarrinho = document.getElementById('menu-carrinho');
        this.badgeCarrinho = document.getElementById('badge-carrinho');
        this.toast = document.getElementById('toast');
    }

    renderizarCarrinho(itens, total, onRemover, onAumentar, onDiminuir, onLimpar, onFinalizar) {
        if (itens.length === 0) {
            this.carrinhoContainer.innerHTML = `
                <div style="text-align:center; padding:40px; color:#999;">
                    <div style="font-size:4rem; margin-bottom:1rem;">🛒</div>
                    <p style="font-size:1.1rem;">O carrinho está vazio.</p>
                    <p style="font-size:0.9rem; margin-top:8px;">Adicione produtos na lista de produtos.</p>
                </div>`;
            return;
        }

        let html = `<table style="width:100%; border-collapse:collapse;">
            <thead>
                <tr style="text-align:left; border-bottom:2px solid #eee;">
                    <th style="padding:12px;">Produto</th>
                    <th style="padding:12px;">Preço Unit.</th>
                    <th style="padding:12px;">Quantidade</th>
                    <th style="padding:12px;">Subtotal</th>
                    <th style="padding:12px;">Ações</th>
                </tr>
            </thead>
            <tbody>`;

        itens.forEach(item => {
            html += `
                <tr style="border-bottom:1px solid #f5f5f5;">
                    <td style="padding:12px;">
                        <strong>${item.nome}</strong>
                        <br><small style="color:#999;">${item.categoria}</small>
                    </td>
                    <td style="padding:12px;">${item.preco.toFixed(2)} MZM</td>
                    <td style="padding:12px;">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <button class="btn-diminuir" data-id="${item.id}"
                                style="background:#e0e0e0; border:none; width:28px; height:28px; border-radius:50%; cursor:pointer; font-size:1rem;">−</button>
                            <span style="font-weight:600; min-width:20px; text-align:center;">${item.quantidade}</span>
                            <button class="btn-aumentar" data-id="${item.id}"
                                style="background:#e0e0e0; border:none; width:28px; height:28px; border-radius:50%; cursor:pointer; font-size:1rem;">+</button>
                        </div>
                    </td>
                    <td style="padding:12px; font-weight:600;">${(item.preco * item.quantidade).toFixed(2)} MZM</td>
                    <td style="padding:12px;">
                        <button class="btn-remover-carrinho" data-id="${item.id}"
                            style="background:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">Remover</button>
                    </td>
                </tr>`;
        });

        html += `</tbody></table>
            <div style="margin-top:24px; padding-top:20px; border-top:2px solid #eee; display:flex; justify-content:space-between; align-items:center;">
                <button id="btn-limpar-carrinho"
                    style="background:#95a5a6; color:white; border:none; padding:10px 20px; border-radius:8px; cursor:pointer; font-size:0.9rem;">
                    🗑️ Limpar Carrinho
                </button>
                <div style="text-align:right;">
                    <p style="font-size:1.4rem; font-weight:700; color:#1a1a2e;">
                        Total: <span style="color:#ee5a24;">${total.toFixed(2)} MZM</span>
                    </p>
                    <button id="btn-finalizar-compra"
                        style="margin-top:10px; background:linear-gradient(135deg,#2ecc71,#27ae60); color:white; border:none; padding:12px 30px; border-radius:10px; cursor:pointer; font-size:1rem; font-weight:600;">
                        ✅ Finalizar Compra
                    </button>
                </div>
            </div>`;

        this.carrinhoContainer.innerHTML = html;

        this.carrinhoContainer.querySelectorAll('.btn-remover-carrinho').forEach(btn => {
            btn.onclick = () => onRemover(btn.dataset.id);
        });
        this.carrinhoContainer.querySelectorAll('.btn-aumentar').forEach(btn => {
            btn.onclick = () => onAumentar(btn.dataset.id);
        });
        this.carrinhoContainer.querySelectorAll('.btn-diminuir').forEach(btn => {
            btn.onclick = () => onDiminuir(btn.dataset.id);
        });
        document.getElementById('btn-limpar-carrinho').onclick = onLimpar;
        document.getElementById('btn-finalizar-compra').onclick = onFinalizar;
    }

    atualizarBadge(totalItens) {
        if (!this.badgeCarrinho) return;
        if (totalItens > 0) {
            this.badgeCarrinho.textContent = totalItens;
            this.badgeCarrinho.style.display = 'inline-block';
        } else {
            this.badgeCarrinho.style.display = 'none';
        }
    }

    mostrarToast(mensagem, tipo = 'success') {
        this.toast.innerHTML = mensagem;
        this.toast.className = 'toast show';
        if (tipo === 'error') this.toast.classList.add('error');
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }
}