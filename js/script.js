/* ============================================================
   FIO DE LUZ ATELIÊ — Script Principal
   ============================================================ */

/* ---------- Estado do Carrinho ---------- */
let carrinho = [];

/* ---------- Header scroll ---------- */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ---------- Menu Mobile ---------- */
const menuBtn  = document.getElementById('menuBtn');
const mobileNav = document.getElementById('mobileNav');

menuBtn.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  menuBtn.classList.toggle('open', isOpen);
  menuBtn.setAttribute('aria-expanded', isOpen);
});

function closeMobileNav() {
  mobileNav.classList.remove('open');
  menuBtn.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', false);
}

/* Fecha menu ao clicar fora */
document.addEventListener('click', (e) => {
  if (!header.contains(e.target)) {
    closeMobileNav();
  }
});

/* ---------- Filtros de Produtos ---------- */
const filtros      = document.querySelectorAll('.filtro-btn');
const produtoCards = document.querySelectorAll('.produto-card');

filtros.forEach(btn => {
  btn.addEventListener('click', () => {
    filtros.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filtro = btn.dataset.filter;

    produtoCards.forEach(card => {
      if (filtro === 'all' || card.dataset.category === filtro) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ---------- Carrinho ---------- */
const cartBtn     = document.getElementById('cartBtn');
const cartCount   = document.getElementById('cartCount');
const cartOverlay = document.getElementById('cartOverlay');
const cartSidebar = document.getElementById('cartSidebar');
const cartItems   = document.getElementById('cartItems');
const cartTotal   = document.getElementById('cartTotal');
const cartWhatsapp = document.getElementById('cartWhatsapp');

cartBtn.addEventListener('click', abrirCarrinho);

function abrirCarrinho() {
  cartOverlay.classList.add('open');
  cartSidebar.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function fecharCarrinho() {
  cartOverlay.classList.remove('open');
  cartSidebar.classList.remove('open');
  document.body.style.overflow = '';
}

// Fecha com tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') fecharCarrinho();
});

function adicionarCarrinho(btn) {
  const nome  = btn.dataset.nome;
  const preco = parseFloat(btn.dataset.preco);

  const existente = carrinho.find(item => item.nome === nome);
  if (existente) {
    existente.qtd++;
  } else {
    carrinho.push({ nome, preco, qtd: 1 });
  }

  atualizarCarrinhoUI();
  mostrarToast(`"${nome}" adicionado ao carrinho ✦`);
}

function removerItem(nome) {
  carrinho = carrinho.filter(item => item.nome !== nome);
  atualizarCarrinhoUI();
}

function atualizarCarrinhoUI() {
  const total = carrinho.reduce((acc, item) => acc + item.preco * item.qtd, 0);
  const qtdTotal = carrinho.reduce((acc, item) => acc + item.qtd, 0);

  /* Contador no header */
  cartCount.textContent = qtdTotal;
  cartCount.classList.toggle('visible', qtdTotal > 0);

  /* Lista de itens */
  if (carrinho.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Seu carrinho está vazio.</p>';
  } else {
    cartItems.innerHTML = carrinho.map(item => `
      <div class="cart-item">
        <div class="cart-item__info">
          <p class="cart-item__name">${item.nome}</p>
          <p class="cart-item__price">
            ${item.qtd > 1 ? `${item.qtd}x ` : ''}
            R$ ${(item.preco * item.qtd).toFixed(2).replace('.', ',')}
          </p>
        </div>
        <button class="cart-item__remove" onclick="removerItem('${item.nome}')" aria-label="Remover ${item.nome}">×</button>
      </div>
    `).join('');
  }

  /* Total */
  cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

  /* Link WhatsApp com resumo do pedido */
  if (carrinho.length > 0) {
    const resumo = carrinho.map(i => `${i.qtd}x ${i.nome} (R$ ${(i.preco * i.qtd).toFixed(2).replace('.', ',')})`).join('%0A');
    const msg = `Olá! Quero finalizar meu pedido:%0A%0A${resumo}%0A%0ATotal: R$ ${total.toFixed(2).replace('.', ',')}`;
    cartWhatsapp.href = `https://wa.me/553897419826?text=${msg}`;
  }
}

/* ---------- Toast ---------- */
const toastEl = document.getElementById('toast');
let toastTimer;

function mostrarToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2800);
}

/* ---------- Animação de entrada dos cards (IntersectionObserver) ---------- */
const cards = document.querySelectorAll('.produto-card');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

cards.forEach((card, i) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(24px)';
  card.style.transitionDelay = `${i * 0.07}s`;
  observer.observe(card);
});

/* ---------- Scroll suave para âncoras ---------- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
