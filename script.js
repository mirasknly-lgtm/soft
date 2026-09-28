// Импортируем модули Firebase напрямую через CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

// Твои настройки из Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCkg-3Boc0rkRHEc1ZHcdGc3ih4pE0Zyos",
    authDomain: "coffeeportfolio-160a7.firebaseapp.com",
    projectId: "coffeeportfolio-160a7",
    storageBucket: "coffeeportfolio-160a7.firebasestorage.app",
    messagingSenderId: "463097421957",
    appId: "1:463097421957:web:9db7ccc6eab7ace8d8c9ec",
    measurementId: "G-QCJ496WQ4E"
};

// Инициализируем базу данных
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Получаем элементы DOM
const form = document.getElementById('coffee-form');
const priceDisplay = document.getElementById('total-price');
const cartCount = document.getElementById('cart-count');
const btnAddToCart = document.getElementById('add-to-cart');

let itemsInCart = 0;

// Функция для форматирования цены
const formatPrice = (price) => new Intl.NumberFormat('ru-RU').format(price) + ' ₸';

// Функция перерасчета цены
const calculatePrice = () => {
    const selectedBean = document.querySelector('input[name="bean"]:checked');
    if (!selectedBean) return; // Если ничего не выбрано, выходим

    const basePrice = parseInt(selectedBean.getAttribute('data-price'));
    const selectedWeight = document.querySelector('input[name="weight"]:checked');
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
