const express = require('express');
const router = express.Router();
const marketsController = require('../controllers/markets');
const auth = require('../middleware/auth');

router.use('/markets', auth, marketsController.getMarkets);
router.post('/market', auth, marketsController.addMarket);
router.delete('market/:id', auth, marketsController.deleteMarket);

router.use('/cities', auth, marketsController.getCities);
router.post('/city', auth, marketsController.addCity);

router.use('/pricings', auth, marketsController.getPricings);
router.post('/pricing', auth, marketsController.addPricing);

router.use('/clients', auth, marketsController.getClients);
router.post('/client', auth, marketsController.addClient);

router.use('/balanceSheets', auth, marketsController.getBalanceSheets);
router.post('/balanceSheet', auth, marketsController.addBalanceSheet);
router.put('/balanceSheet/:id', auth, marketsController.updateBalanceSheet);
router.delete('/balanceSheet/:id', auth, marketsController.deleteBalanceSheet);

router.use('/invoices', auth, marketsController.getInvoices);
router.post('/invoice', auth, marketsController.addInvoice);
router.delete('/invoice/:id', auth, marketsController.deleteInvoice);

module.exports = router;
