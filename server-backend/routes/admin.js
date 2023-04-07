const router = require('express').Router();
const adminController = require('../controllers/adminController.js');
const { uploadSingle, uploadMultiple } = require('../middlewares/multer');
const auth = require('../middlewares/auth');

router.get('/signin', adminController.viewSign);
router.post('/signin', adminController.actionSignin);
router.use(auth);
router.get('/logout', adminController.actionLogout);
router.get('/dashboard', adminController.viewDashboard);

//endpoint category
router.get('/category', adminController.viewCategory);
router.post('/category', adminController.addCategory);
router.put('/category', adminController.editCategory);
router.delete('/category/:id', adminController.deleteCategory);

//endpoint bank
router.get('/bank', adminController.viewBank);
router.post('/bank', uploadSingle ,adminController.addBank);
router.put('/bank', uploadSingle, adminController.editBank);
router.delete('/bank/:id', adminController.deleteBank);

//endpoint item
router.get('/item', adminController.viewItem);
router.post('/item', uploadMultiple, adminController.addItem);
router.get('/item/show-image/:id', adminController.showImageItem);
router.get('/item/:id', adminController.editItem);
router.put('/item/:id', uploadMultiple, adminController.updateItem);
router.delete('/item/:id',adminController.deleteItem);

// endpoint detail feature
router.get('/item/show-detail-item/:itemId', adminController.viewDetailItem);
router.post('/item/add/feature', uploadSingle, adminController.addFeature);
router.put('/item/update/feature', uploadSingle ,adminController.updateFeature);
router.delete('/item/:itemId/feature/:id', adminController.deleteFeature);

// endpoint detail activity
router.post('/item/add/activity', uploadSingle, adminController.addActivity);
router.put('/item/update/activity', uploadSingle ,adminController.updateActivity);
router.delete('/item/:itemId/activity/:id', adminController.deleteActivity);

router.get('/booking', adminController.viewBooking);
router.get('/booking/:id', adminController.showDetailBooking);

module.exports = router;