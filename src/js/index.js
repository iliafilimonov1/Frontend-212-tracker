// import snackbar from "snackbar";

const BALANCE = document.querySelector('#balance');
const MONEY_PLUS = document.querySelector('#money-plus');
const MONEY_MINUS = document.querySelector('#money-minus');
const LIST = document.querySelector('#list');
const FORM = document.querySelector('#form');
const TEXT = document.querySelector('#text');
const AMOUNT = document.querySelector('#amount');


// получение данных из localStorage
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));


// сохранение данных с localStorage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(TRANSACTIONS));
}


// данные из localStorage || []
let TRANSACTIONS = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];


// генерация id
function generateID() {
  return Math.floor(Math.random() * 10000000);
}


// добавление транзакции
function addTransaction(e) {
  e.preventDefault();

  if (TEXT.value.trim() === '' || AMOUNT.value.trim() === '') {
    alert('Please add a text and amount');
    // snackbar.show('Please add a text and amount');
  } else {
    const transaction = {
      id: generateID(),
      text: TEXT.value,
      amount: Number.parseInt(AMOUNT.value, 10)
    };

    // добавление новой записи в список транзакций
    TRANSACTIONS.push(transaction);

    // добавление данных в DOM
    addTransactionToDOM(transaction);

    // обновление значений в balance, дебет/кредит
    updateValues();

    // обновление localStorage
    updateLocalStorage();

    TEXT.value = '';
    AMOUNT.value = '';
  }
}


// добавление транзакции в DOM
function addTransactionToDOM(transaction) {

  // дебет/кредит
  const sign = transaction.amount < 0 ? '-' : '+';

  // генерация li в DOM
  const item = document.createElement('li');

  // добавение класса в зависимости от дебета/кредита
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(
    transaction.amount
  )}</span> <button class="delete-btn" onclick="removeTransaction(${transaction.id
    })">x</button>
  `;

  LIST.appendChild(item);

  // или так
  // LIST.insertAdjacentHTML("beforeend", `
  //   <li class=${transaction.amount < 0 ? 'minus' : 'plus'}>
  //     ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
  //     <button class='delete-btn' onclick="removeTransaction(${transaction.id})">x</button>
  //   </li>
  // `)
}


// обновление баланса, дебет/кредит
function updateValues() {
  // массив транзакций
  const amounts = TRANSACTIONS.map(transaction => transaction.amount);

  // общая сумма всех транзакций
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);


  // транзакции дебет
  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);


  // транзакции кредит
  const expense = amounts
    .filter(item => item < 0)
    .reduce((acc, item) => (acc += item), 0) * -1
      .toFixed(2);

  BALANCE.innerText = `$${total}`;
  MONEY_PLUS.innerText = `$${income}`;
  MONEY_MINUS.innerText = `$${expense}`;
}


// удаление транзакции по ID
function removeTransaction(id) {

  TRANSACTIONS = TRANSACTIONS.filter(transaction => transaction.id !== id);

  updateLocalStorage();

  init();
}


// инициализация приложения
function init() {
  LIST.innerHTML = '';

  TRANSACTIONS.forEach(addTransactionToDOM);
  updateValues();
}


init();


// обработчик событий
FORM.addEventListener('submit', addTransaction);