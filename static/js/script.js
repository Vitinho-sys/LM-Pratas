// ══════════════════════════════════════════════════════
//  LUMIÈRE PRATAS — script.js
// ══════════════════════════════════════════════════════

// ──────────────────────────────────
// DATA STORE  (localStorage)
// ──────────────────────────────────
const STORE_KEY = 'Conceito_pratas_data';

function loadStore() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || null; }
  catch (e) { return null; }
}
function saveStore(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

function getDefaultProducts() {
  return [
    {
      id: 1, name: 'Anel Solitário Clássico', category: 'aneis',
      price: 89.90, oldPrice: null, material: 'Prata 925 · Pedra Zircônia',
      desc: 'Anel delicado com pedra central de zircônia cúbica, perfeito para uso diário. Acabamento polido e rhodiado para maior durabilidade.',
      badge: 'new', image: ''
    },
    {
      id: 2, name: 'Colar Gargantilha Lua', category: 'colares',
      price: 129.90, oldPrice: 159.90, material: 'Prata 925 · Pingente Lua',
      desc: 'Gargantilha em prata fina com pingente de meia lua. Ajuste em 40–45 cm. Uma peça que combina com tudo.',
      badge: 'promo', image: ''
    },
    {
      id: 3, name: 'Brinco Argola Fina', category: 'brincos',
      price: 69.90, oldPrice: null, material: 'Prata 925 · Argola 20 mm',
      desc: 'Argola clássica e atemporal. Leveza e elegância para qualquer look, do casual ao formal.',
      badge: '', image: ''
    },
    {
      id: 4, name: 'Pulseira Riviera Zircônia', category: 'pulseiras',
      price: 149.90, oldPrice: null, material: 'Prata 925 · 12 Zircônias',
      desc: 'Pulseira estilo riviera com 12 pedras de zircônia cravejadas. Fecho de segurança borboleta.',
      badge: 'new', image: ''
    },
    {
      id: 5, name: 'Tornozeleira Estrelas', category: 'tornozeleiras',
      price: 59.90, oldPrice: 79.90, material: 'Prata 925 · Pingentes Estrela',
      desc: 'Tornozeleira delicada com três pingentes de estrela. Ajustável de 22 a 28 cm.',
      badge: 'promo', image: ''
    },
    {
      id: 6, name: 'Colar Coração Pavê', category: 'colares',
      price: 179.90, oldPrice: null, material: 'Prata 925 · Micro Zircônias',
      desc: 'Colar com pingente coração cravejado em micro zircônias. Corrente 45 cm inclusa. Peça de destaque para ocasiões especiais.',
      badge: '', image: ''
    },
  ];
}

function getDefaultConfig() {
  return {
    storeName: 'Conceito Pratas',
    whatsapp: '14988365499',
    waMsg: 'Olá! Vi o catálogo e gostaria de mais informações sobre a peça: '
  };
}

let store = loadStore();
if (!store) {
  store = { products: getDefaultProducts(), config: getDefaultConfig(), nextId: 7 };
  saveStore(store);
}

// ──────────────────────────────────
// HELPERS
// ──────────────────────────────────
const catLabels = {
  aneis: 'Anéis', colares: 'Colares', brincos: 'Brincos',
  pulseiras: 'Pulseiras', tornozeleiras: 'Tornozeleiras'
};
const catEmojis = {
  aneis: '💍', colares: '📿', brincos: '✨',
  pulseiras: '⭕', tornozeleiras: '🔗'
};

function fmtPrice(v) {
  return 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ──────────────────────────────────
// CATALOG STATE
// ──────────────────────────────────
let currentFilter = 'todos';
let currentSearch = '';

function getFilteredProducts() {
  return store.products.filter(p => {
    const matchCat = currentFilter === 'todos' || p.category === currentFilter;
    const matchSearch = !currentSearch || p.name.toLowerCase().includes(currentSearch.toLowerCase());
    return matchCat && matchSearch;
  });
}

// ──────────────────────────────────
// RENDER CATALOG
// ──────────────────────────────────
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const countEl = document.getElementById('productsCount');
  const filtered = getFilteredProducts();

  countEl.textContent = filtered.length + (filtered.length === 1 ? ' peça' : ' peças');

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="empty-state">Nenhuma peça encontrada.</p>';
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="product-card" onclick="openLightbox(${p.id})">
      ${p.badge ? `<span class="product-badge badge-${p.badge}">${p.badge === 'new' ? 'Novidade' : 'Promoção'}</span>` : ''}
      <div class="product-img-placeholder">
        ${p.image ? `<img src="${p.image}" alt="${p.name}">` : (catEmojis[p.category] || '✦')}
      </div>
      <div class="product-info">
        <p class="product-category">${catLabels[p.category] || p.category}</p>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-material">${p.material}</p>
        <div class="product-footer">
          <div>
            ${p.oldPrice ? `<span class="product-price-old">${fmtPrice(p.oldPrice)}</span>` : ''}
            <span class="product-price">${fmtPrice(p.price)}</span>
          </div>
          <button class="product-whatsapp" onclick="event.stopPropagation(); openWhatsApp('${p.name}')">Ver</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterCategory(cat, el) {
  currentFilter = cat;
  document.querySelectorAll('.cat-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  renderProducts();
}

function searchProducts(val) {
  currentSearch = val;
  renderProducts();
}

// ──────────────────────────────────
// LIGHTBOX
// ──────────────────────────────────
function openLightbox(id) {
  const p = store.products.find(x => x.id === id);
  if (!p) return;

  document.getElementById('lbCat').textContent   = catLabels[p.category] || p.category;
  document.getElementById('lbName').textContent  = p.name;
  document.getElementById('lbMat').textContent   = p.material;
  document.getElementById('lbDesc').textContent  = p.desc;
  document.getElementById('lbPrice').textContent = fmtPrice(p.price);

  const imgEl = document.getElementById('lbImg');
  imgEl.innerHTML = p.image
    ? `<img src="${p.image}" alt="${p.name}">`
    : `<span>${catEmojis[p.category] || '✦'}</span>`;

  document.getElementById('lbBtn').onclick = () => openWhatsApp(p.name);
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
  if (!e || e.target === document.getElementById('lightbox')) {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ──────────────────────────────────
// WHATSAPP
// ──────────────────────────────────
function openWhatsApp(product, customMsg) {
  const cfg = store.config;
  const num = cfg.whatsapp.replace(/\D/g, '');
  const msg = customMsg !== undefined ? customMsg : (cfg.waMsg + (product || ''));
  window.open('https://wa.me/55' + num + '?text=' + encodeURIComponent(msg), '_blank');
}

// ──────────────────────────────────
// MOBILE NAV
// ──────────────────────────────────
function toggleMobileNav() {
  document.getElementById('mobileNav').classList.toggle('open');
}
function closeMobileNav() {
  document.getElementById('mobileNav').classList.remove('open');
}

// ──────────────────────────────────
// ADMIN AUTH
// ──────────────────────────────────
const ADMIN_USER = 'admin';
const ADMIN_PASS = '1234';
let isLoggedIn = false;

function openAdmin() {
  if (isLoggedIn) {
    openDash();
  } else {
    document.getElementById('adminOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeAdmin() {
  document.getElementById('adminOverlay').classList.remove('open');
  document.getElementById('adminDashOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function handleAdminOverlayClick(e) {
  if (e.target === document.getElementById('adminOverlay')) closeAdmin();
}
function handleDashOverlayClick(e) {
  if (e.target === document.getElementById('adminDashOverlay')) closeAdmin();
}

function doLogin() {
  const u = document.getElementById('loginUser').value;
  const p = document.getElementById('loginPass').value;

  if (u === ADMIN_USER && p === ADMIN_PASS) {
    isLoggedIn = true;
    document.getElementById('adminOverlay').classList.remove('open');
    openDash();
  } else {
    const errEl = document.getElementById('loginError');
    errEl.textContent = 'Usuário ou senha incorretos.';
    setTimeout(() => { errEl.textContent = ''; }, 2500);
  }
}

function doLogout() {
  isLoggedIn = false;
  closeAdmin();
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
  showToast('Sessão encerrada.');
}

function openDash() {
  loadConfigFields();
  renderAdminProducts();
  showAdminSection('products', document.querySelector('#adminDashOverlay .admin-nav-item'));
  document.getElementById('adminDashOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ──────────────────────────────────
// ADMIN NAVIGATION
// ──────────────────────────────────
function showAdminSection(name, el) {
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('visible'));
  document.getElementById('section-' + name).classList.add('visible');
  document.querySelectorAll('.admin-nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');

  if (name === 'addproduct') {
    document.getElementById('addProductTitle').textContent = 'Adicionar Produto';
    document.getElementById('editProductId').value = '';
    clearProdForm();
  }
}

// ──────────────────────────────────
// ADMIN — PRODUCT LIST
// ──────────────────────────────────
function renderAdminProducts() {
  const list = document.getElementById('adminProductsList');

  if (store.products.length === 0) {
    list.innerHTML = '<p style="color:var(--text-muted);font-size:0.82rem;text-align:center;padding:2rem;">Nenhum produto cadastrado.</p>';
    return;
  }

  list.innerHTML = store.products.map(p => `
    <div class="admin-product-row">
      <div class="admin-prod-thumb">
        ${p.image ? `<img src="${p.image}" alt="${p.name}">` : (catEmojis[p.category] || '✦')}
      </div>
      <div>
        <p class="admin-prod-name">${p.name}</p>
        <p class="admin-prod-info">${catLabels[p.category] || p.category} · ${fmtPrice(p.price)}</p>
      </div>
      <div class="admin-prod-actions">
        <button class="btn-secondary" style="padding:6px 12px;font-size:0.65rem;" onclick="editProduct(${p.id})">Editar</button>
        <button class="btn-danger" onclick="deleteProduct(${p.id})">Excluir</button>
      </div>
    </div>
  `).join('');
}

// ──────────────────────────────────
// ADMIN — EDIT PRODUCT
// ──────────────────────────────────
function editProduct(id) {
  const p = store.products.find(x => x.id === id);
  if (!p) return;

  document.getElementById('editProductId').value  = id;
  document.getElementById('prodName').value        = p.name;
  document.getElementById('prodCat').value         = p.category;
  document.getElementById('prodPrice').value       = p.price;
  document.getElementById('prodOldPrice').value    = p.oldPrice || '';
  document.getElementById('prodMaterial').value    = p.material;
  document.getElementById('prodDesc').value        = p.desc;
  document.getElementById('prodBadge').value       = p.badge || '';
  document.getElementById('prodImageData').value   = p.image || '';

  if (p.image) {
    const prev = document.getElementById('uploadPreview');
    prev.src = p.image;
    prev.style.display = 'block';
  }

  document.getElementById('addProductTitle').textContent = 'Editar Produto';
  showAdminSection('addproduct', document.querySelector('[data-section="addproduct"]'));
}

// ──────────────────────────────────
// ADMIN — DELETE PRODUCT
// ──────────────────────────────────
function deleteProduct(id) {
  if (!confirm('Excluir esta peça do catálogo?')) return;
  store.products = store.products.filter(p => p.id !== id);
  saveStore(store);
  renderAdminProducts();
  renderProducts();
  showToast('Peça excluída.');
}

// ──────────────────────────────────
// ADMIN — SAVE PRODUCT
// ──────────────────────────────────
function saveProduct() {
  const name  = document.getElementById('prodName').value.trim();
  const price = parseFloat(document.getElementById('prodPrice').value);

  if (!name || isNaN(price)) {
    showToast('Preencha pelo menos o nome e o preço.');
    return;
  }

  const editId = parseInt(document.getElementById('editProductId').value) || 0;

  const prod = {
    id:       editId || store.nextId++,
    name,
    category: document.getElementById('prodCat').value,
    price,
    oldPrice: parseFloat(document.getElementById('prodOldPrice').value) || null,
    material: document.getElementById('prodMaterial').value,
    desc:     document.getElementById('prodDesc').value,
    badge:    document.getElementById('prodBadge').value,
    image:    document.getElementById('prodImageData').value || ''
  };

  if (editId) {
    const idx = store.products.findIndex(p => p.id === editId);
    if (idx > -1) store.products[idx] = prod;
  } else {
    store.products.push(prod);
  }

  saveStore(store);
  renderProducts();
  renderAdminProducts();
  clearProdForm();
  showToast(editId ? 'Peça atualizada!' : 'Peça adicionada!');
  showAdminSection('products', document.querySelector('[data-section="products"]'));
}

function cancelEditProduct() {
  clearProdForm();
  document.getElementById('editProductId').value = '';
  showAdminSection('products', document.querySelector('[data-section="products"]'));
}

function clearProdForm() {
  ['prodName', 'prodPrice', 'prodOldPrice', 'prodMaterial', 'prodDesc', 'prodImageData']
    .forEach(id => { document.getElementById(id).value = ''; });
  document.getElementById('prodCat').value   = 'aneis';
  document.getElementById('prodBadge').value = '';
  const prev = document.getElementById('uploadPreview');
  prev.src = ''; prev.style.display = 'none';
}

// ──────────────────────────────────
// IMAGE UPLOAD PREVIEW
// ──────────────────────────────────
function previewImage(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const data = e.target.result;
    document.getElementById('prodImageData').value = data;
    const prev = document.getElementById('uploadPreview');
    prev.src = data;
    prev.style.display = 'block';
  };
  reader.readAsDataURL(file);
}

// ──────────────────────────────────
// ADMIN — CONFIG
// ──────────────────────────────────
function loadConfigFields() {
  const cfg = store.config;
  document.getElementById('cfgStoreName').value = cfg.storeName || '';
  document.getElementById('cfgWhatsApp').value  = cfg.whatsapp  || '';
  document.getElementById('cfgWaMsg').value     = cfg.waMsg     || '';
}

function saveConfig() {
  store.config.storeName = document.getElementById('cfgStoreName').value;
  store.config.whatsapp  = document.getElementById('cfgWhatsApp').value;
  store.config.waMsg     = document.getElementById('cfgWaMsg').value;
  saveStore(store);
  showToast('Configurações salvas!');
}

// ──────────────────────────────────
// TOAST NOTIFICATION
// ──────────────────────────────────
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

// ──────────────────────────────────
// INIT
// ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
});
