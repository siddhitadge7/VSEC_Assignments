
import React, { useEffect, useMemo, useState } from 'react';

const CATEGORIES = [
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Education',
  'Health',
  'Entertainment',
  'Other',
];

const SAMPLE_EXPENSES = [
  {
    id: 1,
    title: 'Lunch',
    amount: 150,
    category: 'Food',
    date: '2026-10-10',
  },
  {
    id: 2,
    title: 'Bus fare',
    amount: 50,
    category: 'Travel',
    date: '2026-10-10',
  },
  {
    id: 3,
    title: 'Notebook',
    amount: 120,
    category: 'Education',
    date: '2026-10-09',
  },
];

const today = new Date().toLocaleDateString('en-CA');

function loadExpenses() {
  try {
    const saved = localStorage.getItem('personal-expenses');
    return saved === null ? SAMPLE_EXPENSES : JSON.parse(saved);
  } catch {
    return SAMPLE_EXPENSES;
  }
}

function App() {
  const [expenses, setExpenses] = useState(loadExpenses);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(today);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    localStorage.setItem('personal-expenses', JSON.stringify(expenses));
  }, [expenses]);

  const total = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  const currentMonth = today.slice(0, 7);

  const monthlyTotal = expenses
    .filter((expense) => expense.date.startsWith(currentMonth))
    .reduce((sum, expense) => sum + Number(expense.amount), 0);

  const average = expenses.length ? total / expenses.length : 0;

  const categoryTotals = useMemo(() => {
    return CATEGORIES.map((name) => ({
      name,
      total: expenses
        .filter((expense) => expense.category === name)
        .reduce((sum, expense) => sum + Number(expense.amount), 0),
    })).filter((item) => item.total > 0);
  }, [expenses]);

  const visibleExpenses = expenses
    .filter((expense) => filter === 'All' || expense.category === filter)
    .filter((expense) =>
      expense.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  function addExpense(event) {
    event.preventDefault();

    if (!title.trim() || !amount || Number(amount) <= 0 || !date) {
      alert('Please enter a title, a valid amount, and a date.');
      return;
    }

    const newExpense = {
      id: Date.now(),
      title: title.trim(),
      amount: Number(amount),
      category,
      date,
    };

    setExpenses((previous) => [newExpense, ...previous]);
    setTitle('');
    setAmount('');
    setCategory('Food');
    setDate(today);
  }

  function deleteExpense(id) {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses((previous) =>
        previous.filter((expense) => expense.id !== id)
      );
    }
  }

  function clearExpenses() {
    if (
      expenses.length > 0 &&
      window.confirm('Delete all expenses? This cannot be undone.')
    ) {
      setExpenses([]);
    }
  }

  function formatMoney(value) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(value);
  }

  const highestCategory = categoryTotals.reduce(
    (highest, item) => item.total > highest.total ? item : highest,
    { name: 'None', total: 0 }
  );

  return (
    <main className="app-container">
      <header className="hero">
        <div>
          <p className="eyebrow">PERSONAL FINANCE MANAGER</p>
          <h1>Personal Expense Tracker</h1>
          <p className="subtitle">
            Record your spending, understand your habits, and manage your money.
          </p>
        </div>
        <div className="hero-icon">₹</div>
      </header>

      <section className="summary-grid">
        <article className="summary-card total-card">
          <span className="card-label">Total Expenses</span>
          <h2>{formatMoney(total)}</h2>
          <p>All recorded transactions</p>
        </article>

        <article className="summary-card">
          <span className="card-label">This Month</span>
          <h2>{formatMoney(monthlyTotal)}</h2>
          <p>Expenses for the current month</p>
        </article>

        <article className="summary-card">
          <span className="card-label">Average Expense</span>
          <h2>{formatMoney(average)}</h2>
          <p>Average per transaction</p>
        </article>

        <article className="summary-card">
          <span className="card-label">Top Category</span>
          <h2 className="category-heading">{highestCategory.name}</h2>
          <p>{formatMoney(highestCategory.total)} spent</p>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <h2>Add New Expense</h2>
              <p>Enter your transaction details below.</p>
            </div>
            <span className="heading-icon">＋</span>
          </div>

          <form onSubmit={addExpense} className="expense-form">
            <label htmlFor="title">Expense Title</label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Grocery shopping"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />

            <label htmlFor="amount">Amount (₹)</label>
            <input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Enter amount"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
            />

            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <label htmlFor="date">Expense Date</label>
            <input
              id="date"
              type="date"
              value={date}
              max={today}
              onChange={(event) => setDate(event.target.value)}
              required
            />

            <button className="primary-button" type="submit">
              + Add Expense
            </button>
          </form>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <div>
              <h2>Expense Analysis</h2>
              <p>See where your money goes.</p>
            </div>
            <span className="heading-icon">↗</span>
          </div>

          {categoryTotals.length === 0 ? (
            <div className="empty-analysis">
              <span>📊</span>
              <p>No expenses to analyze yet.</p>
              <small>Add an expense to see your category breakdown.</small>
            </div>
          ) : (
            <div className="chart">
              {categoryTotals
                .slice()
                .sort((a, b) => b.total - a.total)
                .map((item) => (
                  <div className="bar-item" key={item.name}>
                    <div className="bar-label">
                      <span>{item.name}</span>
                      <strong>{formatMoney(item.total)}</strong>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${(item.total / Math.max(...categoryTotals.map((entry) => entry.total))) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}

          <div className="analysis-footer">
            <span>Transactions recorded</span>
            <strong>{expenses.length}</strong>
          </div>
        </article>
      </section>

      <section className="panel transactions-panel">
        <div className="panel-heading transaction-heading">
          <div>
            <h2>Expense History</h2>
            <p>View, search, filter, and manage your transactions.</p>
          </div>
          <button
            className="danger-button"
            onClick={clearExpenses}
            type="button"
          >
            Clear All
          </button>
        </div>

        <div className="filters">
          <input
            type="search"
            placeholder="Search expense title..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search expenses"
          />

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Filter by category"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Expense</th>
                <th>Category</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="expense-name">{expense.title}</td>
                  <td>
                    <span className="category-pill">{expense.category}</span>
                  </td>
                  <td>{expense.date}</td>
                  <td className="amount-cell">
                    {formatMoney(Number(expense.amount))}
                  </td>
                  <td>
                    <button
                      className="delete-button"
                      type="button"
                      onClick={() => deleteExpense(expense.id)}
                      aria-label={`Delete ${expense.title}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {visibleExpenses.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-table">
                    No expenses found. Add an expense or change your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="table-footer">
          Showing {visibleExpenses.length} of {expenses.length} expenses
        </p>
      </section>

      <footer className="app-footer">
        Personal Expense Tracker · Built with React
      </footer>
    </main>
  );
}

export default App;
