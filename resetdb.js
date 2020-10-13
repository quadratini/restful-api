require('dotenv').config();
const { Pool, Client } = require('pg');
const pool = new Pool();

fn();

async function fn() {
    let query = `
        DROP TABLE IF EXISTS customers, items, cart_items, orders, order_items;
    `;
    await pool.query(query);
    query = `
        CREATE TABLE IF NOT EXISTS items(
            item_id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            unit_price DECIMAL,
            item_category VARCHAR(50),
            description TEXT
        );
    `;
    await pool.query(query);
    query = `
        CREATE TABLE IF NOT EXISTS customers(
            customer_id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE,
            phone_number VARCHAR(20),
            first_name VARCHAR(50),
            last_name VARCHAR(50)
        );
    `;
    await pool.query(query);
    query = `
        CREATE TABLE IF NOT EXISTS cart_items(
            cart_item_id SERIAL PRIMARY KEY,
            customer_id INTEGER REFERENCES customers(customer_id),
            item_id INTEGER REFERENCES items(item_id),
            quantity INTEGER
        );
    `;
    await pool.query(query);
    query = `
        CREATE TABLE IF NOT EXISTS orders(
            order_id SERIAL PRIMARY KEY,
            customer_id INTEGER REFERENCES customers(customer_id)
        );
    `;
    await pool.query(query);
    query = `
        CREATE TABLE IF NOT EXISTS order_items(
            order_item_id SERIAL PRIMARY KEY,
            order_id INTEGER REFERENCES orders(order_id),
            item_id INTEGER REFERENCES items(item_id),
            purchase_price DECIMAL,
            quantity INTEGER
        );
    `;
    await pool.query(query);
}