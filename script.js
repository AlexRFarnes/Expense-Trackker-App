const balance = document.getElementById('balance');
const moneyPlus = document.getElementById('money-plus');
const moneyMinus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');


// const dummyTransactions = [
//     {id: 1, text: 'Flower', amount: -20},
//     {id: 2, text: 'Salary', amount: 1000},
//     {id: 3, text: 'Book', amount: -15},
//     {id: 4, text: 'Course', amount: -10},
//     {id: 5, text: 'Additional class', amount: 600},
// ]

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorageTransactions !== null ? localStorageTransactions : [];

// Add transaction
function addTransaction(e) {
    e.preventDefault();

    if(text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add a text and amount');
    } else {
        const transaction = {
            id: generateID(),
            text: text.value.trim(),
            amount: +amount.value
        }
        transactions.push(transaction);

        addTransactionDOM(transaction);

        updateValue();

        updateLocalStorage();

        text.value= '';
        amount.value = '';
    }
}

// Generate random ID 
function generateID() {
    return Math.floor(Math.random() * 1000000);
}

// Add transactions to DOM list 
function addTransactionDOM(transaction) {
    // Get sign
    const sign = transaction.amount < 0 ? '-' : '+';

    const item = document.createElement('li');
    
    // Add class based on value
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span> <button class="delete-btn" onclick="deleteEntry(${transaction.id})">x</button>
    `;

    list.appendChild(item);
}

// Remove transaction by ID
function deleteEntry(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);

    updateLocalStorage();
    
    init();
}

// Update local storage
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Update the balance, income and expense
function updateValue() {
    const amounts = transactions.map(transaction => transaction.amount);
    
    const total = amounts.reduce((acc, amount) => acc + amount, 0).toFixed(2);

    const income = amounts
                        .filter(amount => amount > 0)
                        .reduce((acc, amount) => acc + amount, 0).toFixed(2);

    const expense = (amounts
                        .filter(amount => amount < 0)
                        .reduce((acc, amount) => acc + amount, 0) * -1).toFixed(2);

   balance.innerText = `$${total}`;
   moneyPlus.innerText = `$${income}`;
   moneyMinus.innerText = `-$${expense}`;
    
}


// Init app
function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValue();
}

init();

form.addEventListener('submit', addTransaction)