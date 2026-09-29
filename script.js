const products = [
    { id: 1, name: "Эфиопия Иргачеффе", desc: "Светлая обжарка. Ноты: бергамот, жасмин, персик.", price: 5500, img: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=600&q=80" },
    { id: 2, name: "Фирменный Бленд", desc: "Средняя обжарка. Идеально для эспрессо и капучино.", price: 4000, img: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=600&q=80" },
    { id: 3, name: "Колумбия Супремо", desc: "Темная обжарка. Насыщенный вкус с нотами темного шоколада.", price: 4500, img: "https://images.unsplash.com/photo-1554497676-e2659e51c86d?auto=format&fit=crop&w=600&q=80" },
    { id: 4, name: "Миндальный Круассан", desc: "Свежая выпечка с нежным миндальным кремом.", price: 1200, img: "https://images.unsplash.com/photo-1549903072-7e6e0d6594b4?auto=format&fit=crop&w=600&q=80" },
    { id: 5, name: "Сет Макарун (5 шт)", desc: "Французские десерты. Фисташка, малина, ваниль.", price: 3500, img: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=600&q=80" },
    { id: 6, name: "Чизкейк Нью-Йорк", desc: "Классический сливочный десерт на песочной основе.", price: 1800, img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80" }
];

let cart = [];

const catalogContainer = document.getElementById('catalog');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountElement = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');

function renderCatalog() {
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
                    <button class="btn-add" onclick="addToCart(${product.id})">В корзину</button>
                </div>
            </div>
        `;
        catalogContainer.appendChild(card);
    });
}

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
