const express = require('express');
const router = express.Router();
const mockData = require('../data/mockData');

router.post('/manual', (req, res) => {
  const newTransaction = { id: Date.now().toString(), ...req.body, date: new Date().toISOString() };
  mockData.transactions.push(newTransaction);
  res.json(newTransaction);
});

router.post('/import', (req, res) => {
  res.json({ message: 'Statement imported successfully', transactions: mockData.transactions });
});

router.get('/summary', (req, res) => {
  const summary = mockData.transactions.reduce((acc, txn) => {
    acc.totalExpense += txn.amount;
    acc.categories[txn.category] = (acc.categories[txn.category] || 0) + txn.amount;
    return acc;
  }, {
    totalIncome: 5000000,
    totalExpense: 0,
    savings: 0,
    categories: {},
  });
  summary.savings = summary.totalIncome - summary.totalExpense;
  
  res.json(summary);
});

router.get('/', (req, res) => {
  res.json({ transactions: mockData.transactions });
});

module.exports = router;
