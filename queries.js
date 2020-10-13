require('dotenv').config();
const { Pool, Client } = require('pg');
const pool = new Pool();

const createCustomer = async (req, res) => {
    const { email, phone_number, first_name, last_name } = req.body;

    let q_res = await pool.query('INSERT INTO customers (email, phone_number, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING customer_id',
        [email, phone_number, first_name, last_name]);

    res.status(201).send(`User added with ID: ${q_res.rows[0].customer_id}`);
}

const updateCustomer = async (req, res) => {
    const id = req.params.id;
    const { email, phone_number, first_name, last_name } = req.body

    let q_res = await pool.query('UPDATE customers SET email = $1, phone_number = $2, first_name = $3, last_name = $4 WHERE customer_id = $5',
        [email, phone_number, first_name, last_name, id]);


    res.status(201).send(`User modified with ID: ${id}`);
}

const getCustomers = async (req, res) => {
    let query = `
        SELECT * FROM customers ORDER BY customer_id ASC
    `;
    let q_res = await pool.query(query);
    res.status(200).json(q_res.rows);

};

const getCustomerById = async (req, res) => {
    const id = req.params.id;
    let query = `
        SELECT * FROM customers
        WHERE customer_id='${id}'
    `;
    let q_res = await pool.query(query);
    res.status(200).json(q_res.rows);
};

const deleteCustomer = async (req, res) => {
    const id = parseInt(req.params.id);

    let q_res = await pool.query('DELETE FROM customers WHERE customer_id = $1',
        [id]);

    res.status(201).send(`User deleted with ID: ${id}`);
}



module.exports = {
    createCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer
}