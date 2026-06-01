const detailContainer = document.getElementById('productDetail');
const params = new URLSearchParams(window.location.search);
const productId = Number(params.get('id'));
const product = products.find(item => item.id === productId);

function formatPrice(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

if (!product) {
  detailContainer.innerHTML = `
    <div class="detail-card">
      <h2>Produto não encontrado</h2>
      <p>O produto solicitado não está disponível ou o link está incorreto.</p>
      <a href="index.html" class="btn btn-secondary">Voltar ao catálogo</a>
    </div>
  `;
} else {
  detailContainer.innerHTML = `
    <article class="detail-card">
      <div class="detail-visual">
        ${product.image ? `<img src="${product.image}" alt="${product.name}" />` : product.icon}
      </div>
      <div>
        <span class="section-tag">${product.category}</span>
        <h1>${product.name}</h1>
        <div class="product-meta">
          <span>⭐ ${product.rating}</span>
          <strong>${formatPrice(product.price)}</strong>
        </div>
        ${product.sizes ? `<div class="product-sizes"><strong>Tamanhos:</strong> ${product.sizes.join(' | ')}</div>` : ''}
        <p>${product.description}</p>
        <div class="detail-actions">
          <a href="index.html" class="btn btn-secondary">Voltar ao catálogo</a>
          <a href="index.html#produtos" class="btn btn-primary">Comprar agora</a>
        </div>
      </div>
    </article>
  `;
}
