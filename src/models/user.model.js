const bcrypt = require("bcryptjs");
const { Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);


//  Hashing my password
userSchema.pre("save", function (next) {
    //  create and update
    if (!this.isModified("password")) return next();
    // const hash = bcrypt.hashSync(this.password, 10);
    // this.password = hash;

    bcrypt.hash(this.password, 10, (err, hash) => {
        this.password = hash;
        return next();
    });

    // this.password = hash;

    // return next();
});



userSchema.methods.checkPassword = function (password) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, this.password, function (err, same) {
            if (err) return (err);
            return resolve(same);
        });
    });
};




module.exports = model("user", userSchema); //  users