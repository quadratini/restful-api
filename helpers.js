const bcrypt = require("bcrypt");

async function hashPassword(password, saltLength = 10) {
    const salt = await bcrypt.genSalt(saltLength);
    const hashed_password = await bcrypt.hash(password, salt);
    return hashed_password;
}

async function validatePassword(password, hash) {
    bcrypt.compare(password, hash, (err, res) => {
        if (err) {
            console.error(err);
        }
        if (res) {
            console.log(res);
        }
    });
}
async function fn() {
    let hashed_password = await hashPassword('pass');
    let res = await validatePassword('passs', hashed_password);
    console.log(res);
}

fn();