const mongoose = require("mongoose");
const { Schema } = mongoose;

const imageSchema = new Schema({
    imageUrl : {
        type : String,
        require : true
    }
});

module.exports = mongoose.model('Image', imageSchema);