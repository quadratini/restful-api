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


const createItem = async (req, res) => {
    const { name, unit_price, item_category, description } = req.body;

    let query = `
        INSERT INTO items(name, unit_price, item_category, description)
        VALUES ($1, $2, $3, $4) RETURNING item_id
    `;

    let q_res = await pool.query(query,
        [name, unit_price, item_category, description]);

    res.status(201).send(`Item added with ID: ${q_res.rows[0].item_id}`);
}

const updateItem = async (req, res) => {
    const id = req.params.id;
    const { name, unit_price, item_category, description } = req.body

    let q_res = await pool.query('UPDATE items SET ' +
        'name = $1, unit_price = $2, item_category = $3, description = $4' +
        'WHERE item_id = $5',
        [name, unit_price, item_category, description, id]);


    res.status(201).send(`Item modified with ID: ${id}`);
}

const getItems = async (req, res) => {
    let query = `
        SELECT * FROM items ORDER BY item_id ASC
    `;
    let q_res = await pool.query(query);
    res.status(200).json(q_res.rows);

};

const getItemById = async (req, res) => {
    const id = req.params.id;
    let query = `
        SELECT * FROM items
        WHERE item_id='${id}'
    `;
    let q_res = await pool.query(query);
    res.status(200).json(q_res.rows);
};

const deleteItem = async (req, res) => {
    const id = parseInt(req.params.id);

    let q_res = await pool.query('DELETE FROM items WHERE item_id = $1',
        [id]);

    res.status(201).send(`User deleted with ID: ${id}`);
}

const createCustomerCartItem = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const { item_id, quantity } = req.body;

        let query = `
        INSERT INTO cart_items(customer_id, item_id, quantity)
        VALUES ($1, $2, $3) RETURNING cart_item_id
    `;

        let q_res = await pool.query(query,
            [id, item_id, quantity]);

        res.status(201).send(`Cart item added with ID: ${q_res.rows[0].cart_item_id}`);
    } catch(err) {
        console.error(err);
        res.status(500).send(err);
    }

}

const getCustomerCartItems = async (req, res) => {
    const id = parseInt(req.params.id);
    let query = `
        SELECT * FROM cart_items WHERE customer_id = $1
    `;
    let q_res = await pool.query(query, [id]);
    res.status(200).json(q_res.rows);
};

const updateCustomerCartItem = async (req, res) => {
    const cart_item_id = req.params.cart_item_id;
    const { quantity } = req.body

    let q_res = await pool.query('UPDATE cart_items SET quantity = $1 WHERE cart_item_id = $2',
        [quantity, cart_item_id]);

    res.status(201).send(`Cart Item modified with ID: ${cart_item_id}`);
}

const deleteCustomerCartItem = async (req, res) => {
    try {
        const cart_item_id = parseInt(req.params.cart_item_id);

        let q_res = await pool.query('DELETE FROM cart_items WHERE cart_item_id = $1',
            [cart_item_id]);

        res.status(201).send(`Cart Item deleted with ID: ${cart_item_id}`);
    } catch(err) {
        console.error(err);
        res.status(500).send(err);
    }

};

const deleteCustomerCart = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        let q_res = await pool.query('DELETE FROM cart_items WHERE customer_id = $1',
            [id]);

        res.status(201).send(`Cart deleted with customer ID: ${q_res.rows.length}`);
    } catch(err) {
        console.error(err);
        res.status(500).send(err);
    }
};

const getOrdersByCustomerId = async (req, res) => {
    const id = parseInt(req.params.id);
    let query = `
        SELECT * FROM orders WHERE customer_id = $1
    `;
    let q_res = await pool.query(query, [id]);
    res.status(200).json(q_res.rows);
};

const createOrderFromCustomerCart = async(req, res) => {
    const id = parseInt(req.params.id);

    let query = `INSERT INTO orders(customer_id) VALUES($1) RETURNING order_id`;
    let q_res = await pool.query(query, [id]);
    let order_id = q_res.rows[0].order_id;

    query = `
        SELECT cart_items.item_id, cart_items.quantity, items.unit_price
        FROM cart_items
        INNER JOIN items
        ON items.item_id = cart_items.item_id
        WHERE customer_id = $1
    `;
    let q_res2 = await pool.query(query, [id]);

    let order_item_ids = [];
    for (let i = 0; i < q_res2.rows.length; ++i) {
        const { item_id, unit_price, quantity } = q_res2.rows[i];

        let q_res3 = await pool.query(`
            INSERT INTO order_items(order_id, item_id, purchase_price, quantity)
            VALUES ($1, $2, $3, $4) RETURNING order_item_id
        `, [order_id, item_id, unit_price, quantity]);

        let order_item_id = q_res3.rows[0].order_item_id;
        order_item_ids.push(order_item_id);
    }
    res.status(200).json(q_res.rows);
}

const getOrders = async (req, res) => {
    let query = `
        SELECT * FROM orders ORDER BY order_id ASC
    `;
    let q_res = await pool.query(query);
    res.status(200).json(q_res.rows);
};

const getOrderById = async (req, res) => {
    const id = req.params.id;
    let query = `
        SELECT * FROM orders
        WHERE order_id='${id}'
    `;
    let q_res = await pool.query(query);
    res.status(200).json(q_res.rows);
};

const getOrderItemsByOrderId = async (req, res) => {
    const id = req.params.id;
    let query = `
        SELECT * FROM order_items
        WHERE order_id='${id}'
    `;
    let q_res = await pool.query(query);
    res.status(200).json(q_res.rows);
};

module.exports = {
    createCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,

    createItem,
    getItems,
    getItemById,
    updateItem,
    deleteItem,

    createCustomerCartItem,
    getCustomerCartItems,
    updateCustomerCartItem,
    deleteCustomerCartItem,

    deleteCustomerCart,

    getOrdersByCustomerId,

    createOrderFromCustomerCart,

    getOrders,
    getOrderById,
    getOrderItemsByOrderId
}
