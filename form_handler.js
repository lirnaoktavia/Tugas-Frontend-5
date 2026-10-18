const localProductList = [];

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
};

const calculateStockValuation = (products) => {
  let totalValuation = 0;
  for (const product of products) {
    totalValuation += product.price * product.stock;
  }
  return totalValuation;
};

const renderProductList = () => {
  const productListEl = document.getElementById('product-list');
  const valuationEl = document.getElementById('total-valuation');
  
  if (localProductList.length === 0) {
    productListEl.innerHTML = '<li class="empty-msg">Belum ada produk tersimpan.</li>';
    valuationEl.textContent = formatRupiah(0);
    return;
  }

  productListEl.innerHTML = localProductList.map((product) => `
    <li class="product-item">
      <div class="product-info">
        <strong>${product.name}</strong>
        <small>${product.category} • ${formatRupiah(product.price)} (Stok: ${product.stock})</small>
      </div>
      <span class="product-id">ID: #${product.id}</span>
    </li>
  `).join('');

  const currentValuation = calculateStockValuation(localProductList);
  valuationEl.textContent = formatRupiah(currentValuation);
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('product-form');
  const feedback = document.getElementById('form-feedback');
  
  const inputName = document.getElementById('product-name');
  const inputCategory = document.getElementById('product-category');
  const inputPrice = document.getElementById('product-price');
  const inputStock = document.getElementById('product-stock');

  const prevName = document.getElementById('prev-name');
  const prevCategory = document.getElementById('prev-category');
  const prevPrice = document.getElementById('prev-price');
  const prevStock = document.getElementById('prev-stock');

  inputName.addEventListener('input', (e) => {
    prevName.textContent = e.target.value.trim() || 'Nama Produk...';
  });

  inputCategory.addEventListener('change', (e) => {
    prevCategory.textContent = e.target.value || '-';
  });

  inputPrice.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    prevPrice.textContent = !isNaN(val) && val > 0 ? formatRupiah(val) : 'Rp 0';
  });

  inputStock.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    prevStock.textContent = !isNaN(val) && val >= 0 ? val : 0;
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameInput = inputName.value.trim();
    const categoryInput = inputCategory.value;
    const priceInput = parseFloat(inputPrice.value);
    const stockInput = parseInt(inputStock.value);

    if (!nameInput || !categoryInput || isNaN(priceInput) || priceInput <= 0 || isNaN(stockInput) || stockInput < 0) {
      feedback.textContent = "Mohon isi seluruh data produk dengan valid!";
      feedback.className = "feedback-msg error";
      return;
    }

    const newProduct = {
      id: localProductList.length + 1,
      name: nameInput,
      category: categoryInput,
      price: priceInput,
      stock: stockInput
    };

    localProductList.push(newProduct);
    console.log("Data produk berhasil ditambahkan:", newProduct);

    renderProductList();

    feedback.textContent = `Sukses! Produk '${newProduct.name}' (${formatRupiah(newProduct.price)}) tersimpan.`;
    feedback.className = "feedback-msg success";

    form.reset();
    prevName.textContent = 'Nama Produk...';
    prevCategory.textContent = '-';
    prevPrice.textContent = 'Rp 0';
    prevStock.textContent = '0';
  });
});
