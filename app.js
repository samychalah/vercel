const KEY = 'cash-tracker-v1'

const state = loadState() || { balance: 0, history: [] }

const elBalance = document.getElementById('balance')
const elAmount = document.getElementById('amount')
const elNote = document.getElementById('note')
const elHistory = document.getElementById('history')
const btnDeposit = document.getElementById('btn-deposit')
const btnWithdraw = document.getElementById('btn-withdraw')
const btnReset = document.getElementById('btn-reset')

render()

btnDeposit.addEventListener('click', () => addTx('plus'))
btnWithdraw.addEventListener('click', () => addTx('minus'))
btnReset.addEventListener('click', () => {
  if (!confirm('Réinitialiser le solde et l historique')) return
  state.balance = 0
  state.history = []
  saveState()
  render()
})

function addTx(kind) {
  const raw = elAmount.value
  const amount = Number.parseFloat(raw)
  if (!Number.isFinite(amount) || amount <= 0) {
    alert('Entre un montant positif')
    return
  }
  const note = elNote.value.trim()
  const ts = new Date().toISOString()

  const signed = kind === 'plus' ? amount : -amount
  state.balance = round2(state.balance + signed)
  state.history.unshift({ ts, kind, amount, note })

  elAmount.value = ''
  elNote.value = ''

  saveState()
  render()
}

function render() {
  elBalance.textContent = fmt(state.balance) + ' CHF'
  elHistory.innerHTML = ''
  if (state.history.length === 0) {
    const li = document.createElement('li')
    li.textContent = 'Aucune opération'
    elHistory.appendChild(li)
    return
  }
  state.history.forEach(tx => {
    const li = document.createElement('li')
    const badge = document.createElement('span')
    badge.className = 'badge ' + tx.kind
    badge.textContent = tx.kind === 'plus' ? 'Ajout' : 'Retrait'

    const note = document.createElement('div')
    note.textContent = tx.note || 'Sans note'

    const right = document.createElement('div')
    right.textContent = (tx.kind === 'plus' ? '+' : '-') + fmt(tx.amount)

    li.appendChild(badge)
    li.appendChild(note)
    li.appendChild(right)
    elHistory.appendChild(li)
  })
}

function saveState() {
  localStorage.setItem(KEY, JSON.stringify(state))
}

function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function fmt(n) {
  return n.toFixed(2)
}

function round2(n) {
  return Math.round(n * 100) / 100
}

