// Получаем элементы DOM
const form = document.getElementById('coffee-form');
const priceDisplay = document.getElementById('total-price');
const cartCount = document.getElementById('cart-count');
const btnAddToCart = document.getElementById('add-to-cart');

let itemsInCart = 0;

// Функция для форматирования числа в формат цены (например: 4 500)
const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₸';
};

// Главная функция перерасчета цены
const calculatePrice = () => {
    // Находим выбранный сорт зерна и забираем его базовую цену
    const selectedBean = document.querySelector('input[name="bean"]:checked');
    const basePrice = parseInt(selectedBean.getAttribute('data-price'));

    // Находим выбранный вес и забираем его множитель
    const selectedWeight = document.querySelector('input[name="weight"]:checked');
    const multiplier = parseFloat(selectedWeight.getAttribute('data-multiplier'));

    // Считаем итоговую цену
    const totalPrice = Math.round(basePrice * multiplier);

    // Анимированно обновляем цену в интерфейсе
    priceDisplay.style.opacity = '0.5';
    setTimeout(() => {
        priceDisplay.textContent = formatPrice(totalPrice);
        priceDisplay.style.opacity = '1';
    }, 150);
};

// Слушаем изменения в форме (клики по радио-кнопкам)
form.addEventListener('change', calculatePrice);

// Инициализируем цену при первой загрузке страницы
calculatePrice();

// Логика добавления в корзину
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы
    
    // Анимация кнопки
    const originalText = btnAddToCart.textContent;
    btnAddToCart.textContent = "Добавлено ✓";
    btnAddToCart.style.backgroundColor = "#d4a373";

    // Обновляем счетчик корзины
    itemsInCart++;
    cartCount.textContent = itemsInCart;

    // Собираем данные о заказе (чтобы показать в консоли/алерте)
    const orderData = {
        bean: document.querySelector('input[name="bean"]:checked').nextElementSibling.textContent,
        roast: document.querySelector('input[name="roast"]:checked').nextElementSibling.textContent,
        weight: document.querySelector('input[name="weight"]:checked').nextElementSibling.textContent,
        price: priceDisplay.textContent
    };
    
    console.log("Новый заказ:", orderData);

    // Возвращаем кнопку в исходное состояние через 2 секунды
    setTimeout(() => {
        btnAddToCart.textContent = originalText;
        btnAddToCart.style.backgroundColor = "";
    }, 2000);
});
