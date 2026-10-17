// 1. Ambil seluruh elemen berdasarkan ID yang ada di HTML Anda
const productForm = document.getElementById('product-form');
const productName = document.getElementById('product-name');
const productCategory = document.getElementById('product-category');
const productPrice = document.getElementById('product-price');
const productStock = document.getElementById('product-stock');
const formFeedback = document.getElementById('form-feedback');

// Elemen untuk Live Preview
const previewName = document.getElementById('preview-name');
const previewCategory = document.getElementById('preview-category');
const previewPrice = document.getElementById('preview-price');
const previewStock = document.getElementById('preview-stock');

// 2. Fungsi Live Preview Data Produk (Otomatis berubah saat mengetik/memilih)
function updatePreview() {
    previewName.textContent = productName.value || "-";
    previewCategory.textContent = productCategory.value || "-";
    previewStock.textContent = productStock.value || "-";
    
    if (productPrice.value) {
        // Format mata uang rupiah untuk harga produk
        previewPrice.textContent = "Rp " + parseInt(productPrice.value).toLocaleString('id-ID');
    } else {
        previewPrice.textContent = "-";
    }
}

// Pasang Event Listener agar Live Preview berjalan realtime
productName.addEventListener('input', updatePreview);
productCategory.addEventListener('change', updatePreview);
productPrice.addEventListener('input', updatePreview);
productStock.addEventListener('input', updatePreview);

// 3. Handle pengiriman data (Submit Form) ke Backend Flask
productForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Mencegah halaman refresh otomatis

    // Menyusun data sesuai dengan ALLOWED_FIELDS di product_service backend Anda
    const payload = {
        name: productName.value,
        category: productCategory.value,
        price: parseFloat(productPrice.value)
        // Catatan: Jika ItemRepository Anda sudah mendukung field stok, bisa tambahkan: stock: parseInt(productStock.value)
    };

    // Tampilkan feedback visual loading awal
    formFeedback.textContent = "Sedang memproses dan menyimpan data...";
    formFeedback.className = "feedback-msg";
    formFeedback.style.color = "#333"; 

    try {
        // Panggil endpoint backend Flask untuk item/produk Anda
        const response = await fetch('http://127.0.0', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        // Cek jika response backend sukses (status 200/201 dan JSON status "success")
        if (response.ok && result.status === 'success') {
            formFeedback.textContent = "✓ Produk berhasil disimpan ke Backend!";
            formFeedback.style.color = "green";
            
            // Reset form dan tampilan live preview ke kondisi awal (-)
            productForm.reset();
            updatePreview();
        } else {
            // Menampilkan pesan error validasi dari Flask (misal nama kosong, harga minus)
            formFeedback.textContent = `❌ Gagal menyimpan: ${result.message || 'Terjadi kesalahan sistem'}`;
            formFeedback.style.color = "red";
        }
    } catch (error) {
        // Error handling jika server backend Flask mati / CORS diblokir
        formFeedback.textContent = "❌ Terjadi kesalahan! Pastikan server backend Flask (app.py) Anda sudah dijalankan.";
        formFeedback.style.color = "red";
    }
});
