const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookingSchema = new Schema({
    bookingStartDate : {
        type : Date,
        required : true
    },
    bookingEndDate : {
        type : Date,
        required : true
    },
    itemId : [{
        id : {
            type : ObjectId,
            ref : "Item",
            required : true
        },
        price : {
            type : Number,
            required : true
        },
        night : {
            type : Number,
            required : true
        }
    }],
    memberId : {
        type : ObjectId,
        ref : 'Member'
    },
    bankId : {
        type : ObjectId,
        ref : 'Bank'
    },
    proofPayment : {
        type : String,
        required : true
    },
    bankFrom : {
        type : String,
        required : true
    },
    accountHolder : {
        type : String,
        required : true
    },
    imageUrl : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model("Booking", bookingSchema);
