import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

// Твои настройки Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCkg-3Boc0rkRHEc1ZHcdGc3ih4pE0Zyos",
    authDomain: "coffeeportfolio-160a7.firebaseapp.com",
    projectId: "coffeeportfolio-160a7",
    storageBucket: "coffeeportfolio-160a7.firebasestorage.app",
    messagingSenderId: "463097421957",
    appId: "1:463097421957:web:9db7ccc6eab7ace8d8c9ec"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let products = [];
let cart = [];

const catalogContainer = document.getElementById('catalog');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountElement = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');

// Функция загрузки товаров из Firebase
async function loadProducts() {
    catalogContainer.innerHTML = '<p style="text-align:center; width:100%; grid-column: 1 / -1;">Загрузка меню из базы данных...</p>';
    
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        products = [];
        
        querySnapshot.forEach((doc) => {
            // Собираем данные и добавляем уникальный ID документа
            products.push({ id: doc.id, ...doc.data() });
        });

        if (products.length === 0) {
            catalogContainer.innerHTML = '<p style="text-align:center; width:100%; grid-column: 1 / -1;">Каталог пуст. Добавьте товары в Firebase.</p>';
            return;
        }

        renderCatalog();
    } catch (error) {
        console.error("Ошибка загрузки:", error);
        catalogContainer.innerHTML = '<p style="text-align:center; width:100%; grid-column: 1 / -1; color:red;">Ошибка подключения к базе данных.</p>';
    }
}

// Отрисовка каталога
function renderCatalog() {
    catalogContainer.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img-wrap">
                <img src="${product.img}" alt="${product.name}" class="product-img">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">${product.desc}</p>
                <div class="product-bottom">
                    <span class="product-price">${new Intl.NumberFormat('ru-RU').format(product.price)} ₸</span>
                    <button class="btn-add" onclick="addToCart('${product.id}')">В корзину</button>
                </div>
            </div>
        `;
        catalogContainer.appendChild(card);
    });
}

// Добавление в корзину (используем строковый ID из Firebase)
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    cart.push(product);
    
    const cartBtn = document.getElementById('cart-open');
    cartBtn.style.transform = 'scale(1.1)';
    setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);

    updateCartUI();
}

// Удаление из корзины
window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// Обновление интерфейса корзины
function updateCartUI() {
    cartCountElement.textContent = cart.length;
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Ваша корзина пуста</p>';
        cartTotalPrice.textContent = '0 ₸';
        return;
    }

    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${new Intl.NumberFormat('ru-RU').format(item.price)} ₸</p>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${index})">✕</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartTotalPrice.textContent = new Intl.NumberFormat('ru-RU').format(total) + ' ₸';
}

// Управление шторкой корзины
const cartOpenBtn = document.getElementById('cart-open');
const cartCloseBtn = document.getElementById('cart-close');
const cartOverlay = document.getElementById('cart-overlay');

function toggleCart() {
    document.body.classList.toggle('cart-active');
}

cartOpenBtn.addEventListener('click', toggleCart);
cartCloseBtn.addEventListener('click', toggleCart);
cartOverlay.addEventListener('click', toggleCart);

// Запускаем загрузку данных при открытии сайта
loadProducts();
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    
    const cartBtn = document.getElementById('cart-open');
    cartBtn.style.transform = 'scale(1.1)';
    setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);

    updateCartUI();
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    cartCountElement.textContent = cart.length;
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Ваша корзина пуста</p>';
        cartTotalPrice.textContent = '0 ₸';
        return;
    }

    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${new Intl.NumberFormat('ru-RU').format(item.price)} ₸</p>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${index})">✕</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartTotalPrice.textContent = new Intl.NumberFormat('ru-RU').format(total) + ' ₸';
}

const cartOpenBtn = document.getElementById('cart-open');
const cartCloseBtn = document.getElementById('cart-close');
const cartOverlay = document.getElementById('cart-overlay');

function toggleCart() {
    document.body.classList.toggle('cart-active');
}

cartOpenBtn.addEventListener('click', toggleCart);
cartCloseBtn.addEventListener('click', toggleCart);
cartOverlay.addEventListener('click', toggleCart);

renderCatalog();    const selectedWeight = document.querySelector('input[name="weight"]:checked');
    const multiplier = parseFloat(selectedWeight.getAttribute('data-multiplier'));

    const totalPrice = Math.round(basePrice * multiplier);

    priceDisplay.style.opacity = '0.5';
    setTimeout(() => {
        priceDisplay.textContent = formatPrice(totalPrice);
        priceDisplay.style.opacity = '1';
    }, 150);
};

// ГЛАВНОЕ: Функция проверки наличия в Базе Данных
async function checkInventory() {
    try {
        console.log("Загрузка данных из БД...");
        // Идем в таблицу (коллекцию) 'inventory'
        const querySnapshot = await getDocs(collection(db, "inventory"));
        
        querySnapshot.forEach((doc) => {
            const itemName = doc.id; // 'arabica', 'blend', 'ethiopia'
            const stock = doc.data().stock; // количество на складе
            
            const radioBtn = document.querySelector(`input[name="bean"][value="${itemName}"]`);
            
            if (radioBtn && stock <= 0) {
                // Если товара нет, блокируем кнопку
                radioBtn.disabled = true;
                radioBtn.checked = false; // снимаем галочку
                radioBtn.nextElementSibling.innerHTML += '<span class="out-of-stock-text">Нет в наличии</span>';
            }
        });
        
        // Если выбранный по умолчанию сорт оказался недоступен, выбираем первый доступный
        const checkedRadio = document.querySelector('input[name="bean"]:checked');
        if (!checkedRadio) {
            const firstAvailable = document.querySelector('input[name="bean"]:not(:disabled)');
            if (firstAvailable) firstAvailable.checked = true;
        }
        
        // Пересчитываем цену после обновления из БД
        calculatePrice();

    } catch (error) {
        console.error("Ошибка при получении данных из БД:", error);
    }
}

// Запускаем проверку базы данных при загрузке страницы
checkInventory();

// Слушатели событий
form.addEventListener('change', calculatePrice);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btnText = btnAddToCart.textContent;
    btnAddToCart.textContent = "Добавлено ✓";
    btnAddToCart.style.backgroundColor = "#d4a373";

    itemsInCart++;
    cartCount.textContent = itemsInCart;

    setTimeout(() => {
        btnAddToCart.textContent = btnText;
        btnAddToCart.style.backgroundColor = "";
    }, 2000);
});
