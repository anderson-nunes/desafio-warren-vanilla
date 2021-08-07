const api = "https://warren-transactions-api.herokuapp.com/api"
let transactionsFilter = []

async function buscarTransacoes() {
  try {
    const response = await fetch(`${api}/transactions`)
    const transactions = await response.json()
    return transactions

  } catch (error) {
    console.log(error)
  }
}

function exibirTransacoes(transactionsParams) {
  const tbody = document.getElementById('table-body')
  tbody.innerHTML = ''
  transactionsParams.forEach(transaction => {
    const linha = document.createElement('tr')
    const title = `<td>${transaction.title}</td>`
    const description = `<td>${transaction.description}</td>`
    const status = `<td>${transaction.status}</td>`
    const amount = `<td>${formatarParaDinheiro(transaction.amount)}</td>`
    linha.innerHTML = title + description + status + amount
    linha.onclick = () => abriModal(transaction) // Essa linha serve para abrir o modal
    tbody.appendChild(linha)
  });
}

function filtroPorTitulo(event) {
  event.preventDefault()
  const busca = document.getElementById('search-transaction').value.toLowerCase()
  const transactionsFiltered = transactionsFilter.filter(transaction => {
    return transaction.title.toLowerCase().includes(busca)
  })

  exibirTransacoes(transactionsFiltered)

}

function filtroPorStatus() {
  const status = document.getElementById('status').value
  if (status === "all") {
    exibirTransacoes(transactionsFilter)
  } else {
    const filterStatus = transactionsFilter.filter(transaction => {
      return transaction.status === status
    })

    exibirTransacoes(filterStatus)
  }
}

function abriModal(transaction) {
  const modal = document.getElementById('modal')
  document.getElementById('titulo').innerHTML = transaction.title
  document.getElementById('from').innerHTML = transaction.from
  document.getElementById('from-amount').innerHTML = formatarParaDinheiro(transaction.amount)
  document.getElementById('to').innerHTML = transaction.to
  document.getElementById('to-amount').innerHTML = formatarParaDinheiro(transaction.amount)

  modal.style.display = "flex"
}

function fecharModal() {
  const modal = document.getElementById('modal')
  modal.style.display = "none"
}

function formatarParaDinheiro(valor) {
  return valor.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL'
  });
}

async function init() {
  const transactions = await buscarTransacoes()
  transactionsFilter = transactions
  exibirTransacoes(transactions)

  const modal = document.getElementById('modal')
  modal.addEventListener('click', function (e) {
    if (e.target == this) fecharModal();
  });
}

init()