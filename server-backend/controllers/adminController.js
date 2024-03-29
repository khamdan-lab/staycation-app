const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Item = require('../models/Item');
const Image = require('../models/Image');
const Feature = require('../models/Feature');
const Activity = require('../models/Activity');
const Booking = require('../models/Booking');
const Member = require('../models/Member');
const Users = require('../models/Users');

const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcryptjs');

module.exports = {
    viewSign: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus, };
            if (req.session.user == null || req.session.user == undefined) {
                res.render('index', {
                    alert,
                    title: "Staycation | Login"
                });
            } else {
                res.redirect('/admin/dashboard');
            }

        } catch (error) {
            res.redirect('/admin/signin');
        }
    },
    actionSignin: async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await Users.findOne({ username: username });
            if (!user) {
                req.flash('alertMessage', 'User yang anda masukan tidak ada!!!');
                req.flash('alertStatus', 'danger');
                res.redirect('/admin/signin');
            }
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                req.flash('alertMessage', 'Password yang anda masukan tidak cocok!!!');
                req.flash('alertStatus', 'danger');
                res.redirect('/admin/signin');
            }

            req.session.user = {
                id: user.id,
                username: user.username
            }
            res.redirect('/admin/dashboard');

        } catch (error) {
            res.redirect('/admin/signin');
        }
    },
    actionLogout: (req, res) => {
        req.session.destroy();
        res.redirect('/admin/signin');
    },
    viewDashboard: async (req, res) => {
        try {
            res.render('admin/dashboard/view_dashboard', {
                title: "Staycation | Dashboard",
                user: req.session.user
            });
        } catch (error) {

        }
    },
    viewCategory: async (req, res) => {
        try {
            const category = await Category.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {
                message: alertMessage,
                status: alertStatus,
            }
            res.render('admin/category/view_category', {
                category,
                alert,
                title: "Staycation | Category",
                user: req.session.user
            });
        } catch (error) {
            res.redirect('admin/category');
        }
    },
    addCategory: async (req, res) => {
        try {
            const { name } = req.body;
            await Category.create({ name });
            req.flash('alertMessage', 'Success Add Category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');
        }
    },
    editCategory: async (req, res) => {
        try {
            const { id, name } = req.body;
            const category = await Category.findOne({ _id: id });
            category.name = name;
            await category.save();
            req.flash('alertMessage', 'Success Update Category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');
        }

    },
    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await Category.findOne({ _id: id });
            await category.remove();
            req.flash('alertMessage', 'Success Delete Category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');
        }
    },
    viewBank: async (req, res) => {
        try {
            const bank = await Bank.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {
                message: alertMessage,
                status: alertStatus,
            }
            res.render('admin/bank/view_bank', {
                bank,
                alert,
                title: "Staycation | Bank",
                user: req.session.user
            });
        } catch (error) {
            res.redirect('admin/bank');
        }
    },
    addBank: async (req, res) => {
        try {
            const { nameBank, nomorRekening, name } = req.body;
            await Bank.create({
                nameBank,
                nomorRekening,
                name,
                imageUrl: `images/${req.file.filename}`
            });
            req.flash('alertMessage', 'Success Add Bank');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/bank');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },
    editBank: async (req, res) => {
        try {
            const { id, name, nameBank, nomorRekening } = req.body;
            const bank = await Bank.findOne({ _id: id });
            if (req.file == undefined) {
                bank.name = name;
                bank.nameBank = nameBank;
                bank.nomorRekening = nomorRekening;
                await bank.save();
                req.flash('alertMessage', 'Success Update Bank');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/bank');
            } else {
                await fs.unlink(path.join(`public/${bank.imageUrl}`));
                bank.nameBank = nameBank;
                bank.nomorRekening = nomorRekening;
                bank.name = name;
                bank.imageUrl = `images/${req.file.filename}`;
                await bank.save();
                req.flash('alertMessage', 'Success Update Bank');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/bank');
            }

        } catch (error) {
            console.log(error);
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },
    deleteBank: async (req, res) => {
        try {
            const { id } = req.params;
            const bank = await Bank.findOne({ _id: id });
            await fs.unlink(path.join(`public/${bank.imageUrl}`));
            await bank.remove();
            req.flash('alertMessage', 'Success Delete Category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/bank');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },
    viewItem: async (req, res) => {
        try {
            const category = await Category.find();
            const item = await Item.find()
                .populate({ path: 'imageId', select: 'id imageUrl' })
                .populate({ path: 'categoryId', select: 'id name' });
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {
                message: alertMessage,
                status: alertStatus,
            }
            res.render('admin/item/view_item', {
                title: 'Staycation | Item',
                alert,
                category,
                item,
                action: 'view',
                user: req.session.user
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },
    showImageItem: async (req, res) => {
        try {
            const { id } = req.params;
            const item = await Item.findOne({ _id: id })
                .populate({ path: 'imageId', select: 'id imageUrl' });
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {
                message: alertMessage,
                status: alertStatus,
            }
            res.render('admin/item/view_item', {
                title: 'Show Image Item',
                alert,
                item,
                action: 'show-image',
                user: req.session.user
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },
    addItem: async (req, res) => {
        try {
            const { title, price, country, city, categoryId, description } = req.body;
            if (req.files.length > 0) {
                const category = await Category.findOne({ _id: categoryId });
                const newItem = {
                    title,
                    price,
                    country,
                    city,
                    categoryId: category._id,
                    description
                }
                const item = await Item.create(newItem);
                category.itemId.push({ _id: item._id });
                category.save();
                for (let i = 0; i < req.files.length; i++) {
                    const imageSave = await Image.create({
                        imageUrl: `images/${req.files[i].filename}`
                    });
                    item.imageId.push({ _id: imageSave._id });
                    await item.save();
                }
                req.flash('alertMessage', 'Success add Item');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/item');
            }

        } catch (error) {
            console.log(error);
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },
    editItem: async (req, res) => {
        try {
            const { id } = req.params;
            const item = await Item.findOne({ _id: id })
                .populate({ path: 'imageId', select: 'id imageUrl' })
                .populate({ path: 'categoryId', select: 'id name' });
            const category = await Category.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {
                message: alertMessage,
                status: alertStatus,
            }
            res.render('admin/item/view_item', {
                title: 'Staycation | Edit Item',
                item,
                category,
                alert,
                action: 'edit item'
            });
        } catch (error) {
            console.log(error);
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },
    updateItem: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, price, country, city, categoryId, description } = req.body;
            const item = await Item.findOne({ _id: id })
                .populate({ path: 'imageId', select: 'id imageUrl' })
                .populate({ path: 'categoryId', select: 'id name' });
            console.log(item);
            if (req.files.length > 0) {
                for (let i = 0; i < item.imageId.length; i++) {
                    const imageUpdate = await Image.findOne({ _id: item.imageId[i]._id });
                    await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
                    imageUpdate.imageUrl = `images/${req.files[i].filename}`;
                    await imageUpdate.save();
                }
                item.title = title;
                item.price = price;
                item.country = country;
                item.city = city;
                item.categoryId = categoryId;
                item.description = description;
                await item.save();
                req.flash('alertMessage', 'Success update Item');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/item');
            } else {
                item.title = title;
                item.price = price;
                item.country = country;
                item.city = city;
                item.categoryId = categoryId;
                item.description = description;
                await item.save();
                req.flash('alertMessage', 'Success update Item');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/item');
            }
        } catch (error) {
            console.log(error);
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },
    deleteItem: async (req, res) => {
        try {
            const { id } = req.params;
            const item = await Item.findOne({ _id: id })
                .populate({ path: 'imageId', select: 'id imageUrl' });
            for (let i = 0; i < item.imageId.length; i++) {
                const imageDelete = await Image.findOne({ _id: item.imageId[i]._id });
                await fs.unlink(path.join(`public/${imageDelete.imageUrl}`));
                imageDelete.remove();
            }
            await Item.remove();
            req.flash('alertMessage', 'Success Delete Category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/item');
        } catch (error) {
            console.log(error);
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },
    viewDetailItem: async (req, res) => {
        const { itemId } = req.params;
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus };
            const feature = await Feature.find({ itemId: itemId });
            const activity = await Activity.find({ itemId: itemId });

            res.render('admin/item/detail_item/view_detail_item', {
                title: 'Staycation | Show Detail Item',
                alert,
                itemId,
                feature,
                activity,
                user: req.session.user
            });
        } catch (error) {
            console.log(error);
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
    },
    addFeature: async (req, res) => {
        try {
            const { name, qty, itemId } = req.body;

            if (!req.file) {
                req.flash('alertMessage', 'Image Not Found');
                req.flash('alertStatus', 'danger');
                res.redirect(`/admin/item/show-detail-item/${itemId}`);
            }
            const feature = await Feature.create({
                name,
                qty,
                itemId,
                imageUrl: `images/${req.file.filename}`
            });
            const item = await Item.findOne({ _id: itemId });
            item.featureId.push({ _id: feature._id });
            await item.save();
            req.flash('alertMessage', 'Success Add Feature');
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        } catch (error) {
            console.log(error);
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
    },
    updateFeature: async (req, res) => {
        try {
            const { id, name, qty, itemId } = req.body;
            const feature = await Feature.findOne({ _id: id });
            if (req.file == undefined) {
                feature.name = name;
                feature.qty = qty;
                await feature.save();
                req.flash('alertMessage', 'Success Update Feature');
                req.flash('alertStatus', 'success');
                res.redirect(`/admin/item/show-detail-item/${itemId}`)
            } else {
                await fs.unlink(path.join(`public/${feature.imageUrl}`));
                feature.name = name;
                feature.qty = qty;
                feature.imageUrl = `images/${req.file.filename}`;
                await feature.save();
                req.flash('alertMessage', 'Success Update Feature');
                req.flash('alertStatus', 'success');
                res.redirect(`/admin/item/show-detail-item/${itemId}`);
            }
        } catch (error) {
            console.log(error);
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
    },
    deleteFeature: async (req, res) => {
        try {
            const { id, itemId } = req.params;
            const feature = await Feature.findOne({ _id: id });
            const item = await Item.findOne({ _id: itemId }).populate('featureId');
            for (let i = 0; i < item.featureId.length; i++) {
                if (item.featureId[i]._id.toString() === feature._id.toString()) {
                    item.featureId.pull({ _id: feature._id });
                    await item.save();
                }
            }
            await fs.unlink(path.join(`public/${feature.imageUrl}`));
            await feature.remove();
            req.flash('alertMessage', 'Success Delete Feature');
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
        } catch (error) {
            console.log(error);
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
    },
    addActivity: async (req, res) => {
        try {
            const { name, type, itemId } = req.body;

            if (!req.file) {
                req.flash('alertMessage', 'Image Not Found');
                req.flash('alertStatus', 'danger');
                res.redirect(`/admin/item/show-detail-item/${itemId}`);
            }
            const activity = await Activity.create({
                name,
                type,
                itemId,
                imageUrl: `images/${req.file.filename}`
            });
            const item = await Item.findOne({ _id: itemId });
            item.activityId.push({ _id: activity._id });
            await item.save();
            req.flash('alertMessage', 'Success Add Activity');
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        } catch (error) {
            console.log(error);
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
    },
    updateActivity: async (req, res) => {
        try {
            const { id, name, type, itemId } = req.body;
            const activity = await Activity.findOne({ _id: id });
            if (req.file == undefined) {
                activity.name = name;
                activity.type = type;
                await activity.save();
                req.flash('alertMessage', 'Success Update Activity');
                req.flash('alertStatus', 'success');
                res.redirect(`/admin/item/show-detail-item/${itemId}`)
            } else {
                await fs.unlink(path.join(`public/${activity.imageUrl}`));
                activity.name = name;
                activity.type = type;
                activity.imageUrl = `images/${req.file.filename}`;
                await activity.save();
                req.flash('alertMessage', 'Success Update Activity');
                req.flash('alertStatus', 'success');
                res.redirect(`/admin/item/show-detail-item/${itemId}`);
            }
        } catch (error) {
            console.log(error);
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
    },
    deleteActivity: async (req, res) => {
        try {
            const { id, itemId } = req.params;
            const activity = await Activity.findOne({ _id: id });
            const item = await Item.findOne({ _id: itemId }).populate('activityId');
            for (let i = 0; i < item.activityId.length; i++) {
                if (item.activityId[i]._id.toString() === activity._id.toString()) {
                    item.activityId.pull({ _id: activity._id });
                    await item.save();
                }
            }
            await fs.unlink(path.join(`public/${activity.imageUrl}`));
            await activity.remove();
            req.flash('alertMessage', 'Success Delete Activity');
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
        } catch (error) {
            console.log(error);
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
    },
    viewBooking: async (req, res) => {
        try {
            const booking = await Booking.find()
            .populate('memberId')
            .populate('bankId');
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {
                message: alertMessage,
                status: alertStatus,
            }
            res.render('admin/booking/view_booking', {
                title: 'Staycation | Show Booking',
                booking,
                alert,
                user: req.session.user
            });
        } catch (error) {
            res.redirect('admin/booking');
        }
    },
    showDetailBooking : async (req, res) => {
        const { id } = req.params;
        try {
            const booking = await Booking.findOne({_id:id})
            .populate('memberId')
            .populate('bankId');
        res.render('admin/booking/show_detail_booking', {
            title: 'Staycation | Show Detail Booking',
            booking,
            user: req.session.user
        });      
        } catch (error) {
            res.redirect('admin/booking');
        }
    }

}