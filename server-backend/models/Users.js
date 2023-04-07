const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");

const usersSchema = new Schema ({
    username : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
});

usersSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
})

module.exports = mongoose.model("Users", usersSchema);
