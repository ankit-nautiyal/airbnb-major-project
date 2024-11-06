const mongoose= require("mongoose");
const Schema= mongoose.Schema;
const passportLocalMongoose= require("passport-local-mongoose");

const userSchema= new Schema({
    email:{
        type: String,
        required: true
    },
    fName:{
        type: String,
        required: true
    },
    lName:{
        type: String,
    },
    image: {
		url: String,
		filename: String,
    },
    providerId: String,         // --------google------------
    provider: String,
})
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
