const productGrid = document.getElementById('productGrid');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const categoryButtons = document.querySelectorAll('.category-card');
const cartDrawer = document.getElementById('cartDrawer');
const openCartBtn = document.getElementById('openCartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartOverlay = document.getElementById('cartOverlay');
const checkoutBtn = document.getElementById('checkoutBtn');
const focusSearchBtn = document.getElementById('focusSearch');
const profileBtn = document.getElementById('profileBtn');
const openLoginBtn = document.getElementById('openLoginBtn');
const loginModal = document.getElementById('loginModal');
const loginOverlay = document.getElementById('loginOverlay');
const closeLoginBtn = document.getElementById('closeLoginBtn');
const loginForm = document.getElementById('loginForm');
const userNameInput = document.getElementById('userName');
const userEmailInput = document.getElementById('userEmail');
const userCpfInput = document.getElementById('userCpf');
const userBadge = document.getElementById('userBadge');
const userGreeting = document.getElementById('userGreeting');
const profilePanel = document.getElementById('profilePanel');
const profileHeadline = document.getElementById('profileHeadline');
const profileDescription = document.getElementById('profileDescription');
const profileSummary = document.getElementById('profileSummary');
const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');
const profileCpf = document.getElementById('profileCpf');
const profileJoined = document.getElementById('profileJoined');
const profileStatus = document.getElementById('profileStatus');
const gotoLoginBtn = document.getElementById('gotoLoginBtn');

const hasCatalog = Boolean(productGrid);
const hasSearch = Boolean(searchInput);
const hasSort = Boolean(sortSelect);
const hasProfileSection = Boolean(profileHeadline || profileSummary || profilePanel);

let selectedCategory = 'todos';
let cart = JSON.parse(localStorage.getItem('futstore-cart')) || [];
const favoriteStorage = new Set(JSON.parse(localStorage.getItem('futstore-favorites')) || []);
let currentUser = JSON.parse(localStorage.getItem('futstore-user')) || null;

function saveFavorites() {
  localStorage.setItem('futstore-favorites', JSON.stringify([...favoriteStorage]));
}

function toggleFavorite(productId) {
  if (favoriteStorage.has(productId)) {
    favoriteStorage.delete(productId);
  } else {
    favoriteStorage.add(productId);
  }
  saveFavorites();
  renderProducts();
}

function isFavorite(productId) {
  return favoriteStorage.has(productId);
}

function formatPrice(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function saveCart() {
  localStorage.setItem('futstore-cart', JSON.stringify(cart));
}

function saveUser() {
  if (currentUser) {
    localStorage.setItem('futstore-user', JSON.stringify(currentUser));
  } else {
    localStorage.removeItem('futstore-user');
  }
}

function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function renderUserProfile() {
  if (currentUser) {
    if (userBadge) userBadge.hidden = false;
    if (gotoLoginBtn) gotoLoginBtn.hidden = true;
    if (userGreeting) userGreeting.textContent = currentUser.name.split(' ')[0] || currentUser.name;
    if (openLoginBtn) openLoginBtn.textContent = 'Sair';
    if (profileHeadline) profileHeadline.textContent = `Bem-vindo, ${currentUser.name}`;
    if (profileDescription) profileDescription.textContent = 'Aqui estão os dados do seu perfil e sua conta.';
    if (profileSummary) profileSummary.hidden = false;
    if (profileName) profileName.textContent = currentUser.name;
    if (profileEmail) profileEmail.textContent = currentUser.email;
    if (profileCpf) profileCpf.textContent = currentUser.cpf;
    if (profileJoined) profileJoined.textContent = formatDate(currentUser.joinedAt);
    if (profileStatus) profileStatus.textContent = 'Ativo';
  } else {
    if (userBadge) userBadge.hidden = true;
    if (gotoLoginBtn) gotoLoginBtn.hidden = false;
    if (openLoginBtn) openLoginBtn.textContent = 'Entrar';
    if (profileHeadline) profileHeadline.textContent = 'Faça login para ver seu perfil';
    if (profileDescription) profileDescription.textContent = 'O perfil mostrará seu nome, e-mail e CPF após o login.';
    if (profileSummary) profileSummary.hidden = true;
  }
}

function openLogin() {
  loginModal.classList.add('open');
  loginModal.setAttribute('aria-hidden', 'false');
  userNameInput.focus();
}

function closeLogin() {
  loginModal.classList.remove('open');
  loginModal.setAttribute('aria-hidden', 'true');
}

function logoutUser() {
  currentUser = null;
  saveUser();
  renderUserProfile();
  openLogin();
}

function sanitizeCpf(value) {
  return value.replace(/\D/g, '').slice(0, 11);
}

function getFilteredProducts() {
  if (typeof products === 'undefined' || !hasCatalog) {
    return [];
  }

  let filtered = [...products];
  const term = hasSearch ? searchInput.value.trim().toLowerCase() : '';

  if (selectedCategory !== 'todos') {
    filtered = filtered.filter(product => product.category === selectedCategory);
  }

  if (term) {
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    );
  }

  switch (sortSelect.value) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      break;
  }

  return filtered;
}

function renderProducts() {
  if (!hasCatalog) {
    return;
  }

  const filteredProducts = getFilteredProducts();
  const productsToShow = selectedCategory === 'todos' ? filteredProducts : filteredProducts.slice(0, 5);

  if (!productsToShow.length) {
    productGrid.innerHTML = '<div class="no-results">Nenhum produto encontrado com esse filtro.</div>';
    return;
  }

  productGrid.innerHTML = productsToShow.map(product => `
    <article class="product-card">
      <div class="product-visual">${product.image ? `<img src="${product.image}" alt="${product.name}" />` : product.icon}</div>
      <div class="product-meta">
        <span>${product.category}</span>
        <span>⭐ ${product.rating}</span>
      </div>
      <h3><a href="product.html?id=${product.id}" class="product-link" aria-label="Ver detalhes de ${product.name}">${product.name}</a></h3>
      <p>${product.description}</p>
      ${product.sizes ? `<div class="product-sizes"><strong>Tamanhos:</strong> ${product.sizes.join(' | ')}</div>` : ''}
      <div class="price-row">
        <strong>${formatPrice(product.price)}</strong>
        <div class="product-buttons">
          <a href="product.html?id=${product.id}" class="btn btn-secondary btn-small">Comprar</a>
          <button class="add-cart-btn" data-id="${product.id}">Adicionar</button>
        </div>
      </div>
      <button class="favorite-btn" data-fav="${product.id}" aria-pressed="${isFavorite(product.id)}">
        ${isFavorite(product.id) ? '♥' : '♡'} Favoritar
      </button>
    </article>
  `).join('');

  document.querySelectorAll('.add-cart-btn').forEach(button => {
    button.addEventListener('click', () => addToCart(Number(button.dataset.id)));
  });

  document.querySelectorAll('.favorite-btn').forEach(button => {
    button.addEventListener('click', () => toggleFavorite(Number(button.dataset.fav)));
  });
}

function addToCart(productId) {
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const product = products.find(item => item.id === productId);
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  renderCart();
  openCart();
}

function updateQuantity(productId, delta) {
  cart = cart.map(item => item.id === productId
    ? { ...item, quantity: item.quantity + delta }
    : item
  ).filter(item => item.quantity > 0);

  saveCart();
  renderCart();
}

function removeItem(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  renderCart();
}

function renderCart() {
  if (!cart.length) {
    cartItemsContainer.innerHTML = '<div class="empty-cart">Seu carrinho está vazio.</div>';
    cartTotal.textContent = formatPrice(0);
    cartCount.textContent = '0';
    return;
  }

  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-thumb">${item.icon}</div>
      <div>
        <h4>${item.name}</h4>
        <small>${formatPrice(item.price)} cada</small>
        <div class="qty-controls">
          <button data-action="decrease" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button data-action="increase" data-id="${item.id}">+</button>
        </div>
      </div>
      <div>
        <strong>${formatPrice(item.price * item.quantity)}</strong>
        <button class="remove-btn" data-action="remove" data-id="${item.id}">Remover</button>
      </div>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  cartTotal.textContent = formatPrice(total);
  cartCount.textContent = String(count);

  cartItemsContainer.querySelectorAll('button').forEach(button => {
    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    button.addEventListener('click', () => {
      if (action === 'increase') updateQuantity(id, 1);
      if (action === 'decrease') updateQuantity(id, -1);
      if (action === 'remove') removeItem(id);
    });
  });
}

function openCart() {
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
}

categoryButtons.forEach(button => {
  button.addEventListener('click', () => {
    selectedCategory = button.dataset.filter;
    categoryButtons.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    renderProducts();
  });
});

if (hasSearch) {
  searchInput.addEventListener('input', renderProducts);
}
if (hasSort) {
  sortSelect.addEventListener('change', renderProducts);
}
if (openCartBtn) {
  openCartBtn.addEventListener('click', openCart);
}
if (closeCartBtn) {
  closeCartBtn.addEventListener('click', closeCart);
}
if (cartOverlay) {
  cartOverlay.addEventListener('click', closeCart);
}
if (focusSearchBtn && hasSearch) {
  focusSearchBtn.addEventListener('click', () => searchInput.focus());
}
if (profileBtn) {
  profileBtn.addEventListener('click', () => {
    if (!currentUser) {
      openLogin();
    } else if (profilePanel) {
      profilePanel.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = 'profile.html';
    }
  });
}
if (openLoginBtn) {
  openLoginBtn.addEventListener('click', () => {
    if (currentUser) {
      logoutUser();
    } else {
      openLogin();
    }
  });
}
if (closeLoginBtn) {
  closeLoginBtn.addEventListener('click', closeLogin);
}
if (loginOverlay) {
  loginOverlay.addEventListener('click', closeLogin);
}
if (loginForm) {
  loginForm.addEventListener('submit', event => {
    event.preventDefault();
    currentUser = {
      name: userNameInput.value.trim(),
      email: userEmailInput.value.trim(),
      cpf: sanitizeCpf(userCpfInput.value),
      joinedAt: new Date().toISOString(),
    };
    saveUser();
    renderUserProfile();
    closeLogin();
    loginForm.reset();
  });
}

if (gotoLoginBtn) {
  gotoLoginBtn.addEventListener('click', () => {
    openLogin();
  });
}

if (userCpfInput) {
  userCpfInput.addEventListener('input', () => {
    userCpfInput.value = sanitizeCpf(userCpfInput.value);
  });
}

if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (!cart.length) {
      alert('Seu carrinho está vazio.');
      return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    alert(`Pedido demonstrativo finalizado! Total: ${formatPrice(total)}.\n\nPara vender de verdade, você pode integrar um checkout externo, WhatsApp ou link de pagamento.`);
  });
}

if (hasCatalog) {
  renderProducts();
}
if (cartItemsContainer) {
  renderCart();
}
renderUserProfile();
if (!currentUser && loginModal) {
  openLogin();
}
