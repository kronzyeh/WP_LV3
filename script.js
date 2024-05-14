const cartButton = document.querySelector('.cart-button');
const cartBadge = document.querySelector('.cart-badge');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.close');
const buyButton = document.querySelector('.buy-btn');
const cartItemsList = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const itemsGrid = document.querySelector('.items-grid');

let items = [
    {
        id: 1,
        name: 'T-shirt',
        price: 15.99,
        imageUrl: '/images/tshirt.png',
    },
    {
        id: 2,
        name: 'Watch',
        price: 99.99,
        imageUrl: '/images/watch.png',
    },
    {
        id: 3,
        name: 'Headphones',
        price: 49.99,
        imageUrl: '/images/headphones.png',
    },
    {
        id: 4,
        name: 'Backpack',
        price: 29.99,
        imageUrl: '/images/backpack.png',
    },
    {
        id: 5,
        name: 'Sunglasses',
        price: 19.99,
        imageUrl: '/images/sunglasses.png',
    },
    {
        id: 6,
        name: 'Smartphone',
        price: 399.99,
        imageUrl: '/images/smartphone.jpg',
    },
    {
        id: 7,
        name: 'Laptop',
        price: 799.99,
        imageUrl: '/images/laptop.png',
    },
    {
        id: 8,
        name: 'Fitness Tracker',
        price: 69.99,
        imageUrl: '/images/fitness-tracker.jpg',
    },
    {
        id: 9,
        name: 'Running Shoes',
        price: 59.99,
        imageUrl: '/images/running-shoes.jpg',
    },
    {
        id: 10,
        name: 'Camera',
        price: 249.99,
        imageUrl: '/images/camera.png',
    },
];

let cart = [];
let walletAmount = 1000; 

function addListenersToCartButtons() {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
            const itemElement = button.closest('.item');
            const quantityElement = itemElement.querySelector('.quantity');
            const currentQuantity = parseInt(quantityElement.textContent);
            const itemId = parseInt(button.getAttribute('data-id'));
            addToCart(itemId, currentQuantity);
            quantityElement.textContent = 0;
            updateAddToCartButton(itemElement);
        });
    });
}

function fillItemsGrid(itemsToDisplay) {

    itemsGrid.innerHTML = '';

    for (const item of itemsToDisplay) {
        let itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}">
            <h2>${item.name}</h2>
            <p>$${item.price}</p>
            <button class="add-to-cart-btn" data-id="${item.id}">Add to cart (0)</button>
            <div class="quantity-controls">
                <button class="decrement-btn">-</button>
                <span class="quantity">0</span>
                <button class="increment-btn">+</button>
            </div>
        `;
        itemsGrid.appendChild(itemElement);
    }
    addListenersToCartButtons(); 
}

function toggleModal() {
    modal.classList.toggle('show-modal');
    document.querySelectorAll('.empty-cart-message, .purchase-message, .insufficient-funds-message')
        .forEach(msg => msg.style.display = 'none');
}

cartButton.addEventListener('click', toggleModal);
modalClose.addEventListener('click', toggleModal);

fillItemsGrid(items);

function addToCart(itemId, quantity = 1) {
    const selectedItem = items.find(item => item.id === itemId);
    for (let i = 0; i < quantity; i++) {
        cart.push(selectedItem); 
    }
    updateCart();
}

function removeFromCart(itemId) {
    const index = cart.findIndex(item => item.id === itemId);
    if (index !== -1) {
        cart.splice(index, 1);
        updateCart();
    }
}

function updateCart() {
    cartItemsList.innerHTML = '';
    let totalPrice = 0;
    const itemQuantities = {};

    cart.forEach(item => {
        if (item.id in itemQuantities) {
            itemQuantities[item.id]++;
        } else {
            itemQuantities[item.id] = 1;
        }
    });

    for (const itemId in itemQuantities) {
        const itemQuantity = itemQuantities[itemId];
        const item = items.find(item => item.id === parseInt(itemId));
        const cartItemElement = document.createElement('li');
        const itemTotalPrice = item.price * itemQuantity;
        cartItemElement.innerHTML = `
            <span>• ${item.name} (${itemQuantity}) - $${itemTotalPrice.toFixed(2)}</span>
            <button class="remove-from-cart-btn" data-id="${itemId}">-</button>
        `;
        cartItemsList.appendChild(cartItemElement);
        totalPrice += itemTotalPrice;
    }

    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
    cartBadge.textContent = Object.values(itemQuantities).reduce((a, b) => a + b, 0); 

    const removeFromCartButtons = document.querySelectorAll('.remove-from-cart-btn');
    removeFromCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemId = parseInt(button.getAttribute('data-id'));
            removeFromCart(itemId);
        });
    });
}

buyButton.addEventListener('click', () => {
    const totalItemsPrice = parseFloat(cartTotal.textContent.slice(1));
    const purchaseMessage = document.querySelector('.purchase-message');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const insufficientFundsMessage = document.querySelector('.insufficient-funds-message');
    
    if (totalItemsPrice === 0) {
        emptyCartMessage.style.display = 'block';
        purchaseMessage.style.display = 'none';
        insufficientFundsMessage.style.display = 'none';
        return;
    }
    
    if (walletAmount >= totalItemsPrice) {
        walletAmount -= totalItemsPrice;
        cart = [];
        updateCart();
        updateWalletAmount();
        
        purchaseMessage.style.display = 'block';
        insufficientFundsMessage.style.display = 'none';
        emptyCartMessage.style.display = 'none';
    } else {
        insufficientFundsMessage.style.display = 'block';
        purchaseMessage.style.display = 'none';
        emptyCartMessage.style.display = 'none';
    }
});

function updateAddToCartButton(itemElement) {
    const quantity = parseInt(itemElement.querySelector('.quantity').textContent);
    const addToCartButton = itemElement.querySelector('.add-to-cart-btn');
    addToCartButton.textContent = `Add to cart (${quantity})`;
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
            const itemElement = button.closest('.item');
            const quantityElement = itemElement.querySelector('.quantity');
            const currentQuantity = parseInt(quantityElement.textContent);
            const itemId = parseInt(button.getAttribute('data-id'));
            addToCart(itemId, currentQuantity);
            quantityElement.textContent = 0;
            updateAddToCartButton(itemElement);
        });
    });

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('increment-btn')) {
            const itemElement = event.target.closest('.item');
            const quantityElement = itemElement.querySelector('.quantity');
            const currentQuantity = parseInt(quantityElement.textContent);
            quantityElement.textContent = currentQuantity + 1;
            updateAddToCartButton(itemElement);
        } else if (event.target.classList.contains('decrement-btn')) {
            const itemElement = event.target.closest('.item');
            const quantityElement = itemElement.querySelector('.quantity');
            const currentQuantity = parseInt(quantityElement.textContent);
            if (currentQuantity > 0) {
                quantityElement.textContent = currentQuantity - 1;
                updateAddToCartButton(itemElement);
            } else {
                quantityElement.textContent = 0;
                updateAddToCartButton(itemElement, 0);
            }
        }
    });
    
    document.getElementById('sort-select').addEventListener('change', function() {
        const sortBy = this.value;
        if (sortBy === 'lowest') {
            items.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'highest') {
            items.sort((a, b) => b.price - a.price);
        }
        else if (sortBy === 'alphabetical') {
            items.sort((a, b) => a.name.localeCompare(b.name));
        }
        fillItemsGrid(items);
    });
});

function updateWalletAmount() {
    const walletAmountElement = document.querySelector('.wallet-amount');
    walletAmountElement.textContent = `$${walletAmount.toFixed(2)}`;
}

function handleSearch() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchInput));
    fillItemsGrid(filteredItems);
}

const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', handleSearch);
