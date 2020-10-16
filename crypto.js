const bcrypt = require("bcrypt");

async function hashPassword(password, saltLength = 10) {
    const salt = await bcrypt.genSalt(saltLength);
    const hashed_password = await bcrypt.hash(password, salt);
    return hashed_password;
}

async function validatePassword(password, hash) {
    const res = await bcrypt.compare(password, hash);
    return res;
}
/*
async function saveAccessToken(access_token, user_id) {
    const query = `INSERT INTO access_tokens (access_token, user_id) VALUES ('${access_token}', ${user_id});`;
    await pool.query(query);
}

async function getCustomerIdFromBearerToken(bearer_token) {
    const query = `SELECT * FROM access_tokens WHERE access_token = '${bearer_token}';`;

    return await pool.query(query, (res) => {
        const customer_id =
            res.results && res.results.rowCount == 1
                ? res.results.rows[0].customer_id
                : null;

        return customer_id;
    });
}
 */

module.exports = {
    hashPassword,
    validatePassword,
    /*
    saveAccessToken,
    getCustomerIdFromBearerToken
     */
}
