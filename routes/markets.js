const express = require('express');
const router = express.Router();
const marketsController = require('../controllers/markets');

router.use('/markets', marketsController.getMarkets);
router.post('/market', marketsController.addMarket);

router.use('/cities', marketsController.getCities);
router.post('/city', marketsController.addCity);

router.use('/pricings', marketsController.getPricings);
router.post('/pricing', marketsController.addPricing);

router.use('/clients', marketsController.getClients);
router.post('/client', marketsController.addClient);

router.use('/balanceSheets', marketsController.getBalanceSheets);
router.post('/balanceSheet', marketsController.addBalanceSheet);
router.put('/balanceSheet/:id', marketsController.updateBalanceSheet);

router.use('/balanceSheetDetails', marketsController.getBalanceSheetDetails);
router.post('/balanceSheetDetail', marketsController.addBalanceSheetDetails);

module.exports = router;
