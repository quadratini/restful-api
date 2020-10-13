require('dotenv').config();
const { Pool, Client } = require('pg');
const pool = new Pool();

clearDb().then(() => {
    fillDb();
})

async function clearDb() {
    let query = `
        TRUNCATE items, customers, cart_items, orders, order_items
    `;
    return await pool.query(query);
}

async function fillDb() {
    createInitial();
}

async function createInitial() {
    createItem(`Echo Dot (3rd Gen) - Smart speaker with Alexa - Charcoal`, 39.99, 'Electronics', `Use your voice to play a song, artist, or genre through Amazon Music, Apple Music, Spotify, Pandora, and others. With compatible Echo devices in different rooms, you can fill your whole home with music. Also listen to Audible, podcasts, radio stations, or pair with Fire TV to voice control movies and entertainment.`);
    createItem(`HOZZQ DIY Halloween Party Supplies PVC 3D Decorative Scary Bats Wall Decal Wall Sticker, Halloween Eve Decor Home Window Decoration Set, 28pcs, Black`, 11.99, 'Toys', 'Scary 3D bats all over the wall / window. Arrange them as you wish. You definitely want them in your Halloween Party. Comes with easy to apply style.');
    createItem(`HOZZQ DIY Halloween Party Supplies PVC 3D Decorative Scary Bats Wall Decal Wall Sticker, Halloween Eve Decor Home Window Decoration Set, 28pcs, Black`, 11.99, 'Toys', 'Scary 3D bats all over the wall / window. Arrange them as you wish. You definitely want them in your Halloween Party. Comes with easy to apply style.');
    createCustomer('ronnyrit@gmail.com', 5108889203, 'Ronnapob', 'Ritprasert');
    createItem('pp', 69, 'Toys', 'popo');
    createCustomer('kil@kil.com', 4123, 'kil', 'kil');
    let kil = await getCustomerByEmail('kil@kil.com');
    let rony = await getCustomerByEmail('ronnyrit@gmail.com');
    kil = kil.rows[0];
    rony = rony.rows[0];
    let echo = await getItemByName(`Echo Dot (3rd Gen) - Smart speaker with Alexa - Charcoal`);
    echo = echo.rows[0];
    let hallo = await getItemByName('HOZZQ DIY Halloween Party Supplies PVC 3D Decorative Scary Bats Wall Decal Wall Sticker, Halloween Eve Decor Home Window Decoration Set, 28pcs, Black');
    hallo = hallo.rows[0];
    updateItem(hallo.item_id, 'Updated: Item #2', 3.99, 'Food', 'Updated item.');
    deleteCustomer(kil.customer_id);
    updateCustomer(rony.customer_id, 'ronis@gmail.com', 123232323, 'rony', 'ronit');
    addToCart(rony.customer_id, echo.item_id, 2);
    addToCart(rony.customer_id, hallo.item_id, 4);
}

async function addToCart(customer_id, item_id, quantity) {
    let query = `
        INSERT INTO cart_items(customer_id, item_id, quantity)
        VALUES ('${customer_id}', '${item_id}', '${quantity}')
    `;
    return await pool.query(query);
}

async function createCustomer(email, phone_number, first_name, last_name) {
    let query = `
        INSERT INTO customers(email, phone_number, first_name, last_name)
        VALUES ('${email}', '${phone_number}', '${first_name}', '${last_name}')
    `;
    return await pool.query(query);
}

async function getCustomerByEmail(email) {
    let query = `
        SELECT * FROM customers
        WHERE email='${email}'
    `;
    return await pool.query(query);
}

async function updateCustomer(customer_id, email, phone_number, first_name, last_name) {
    let query = `
        UPDATE customers
        SET email = '${email}',
            phone_number = '${phone_number}',
            first_name =  '${first_name}',
            last_name = '${last_name}'
        WHERE customer_id = '${customer_id}'
    `;
    return await pool.query(query);
}

async function deleteCustomer(customer_id) {
    let query = `
        DELETE FROM customers
        WHERE customer_id = '${customer_id}'
    `;
    return await pool.query(query);
}

async function createItem(name, unit_price, item_category, description) {
    let query = `
        INSERT INTO items(name, unit_price, item_category, description)
        VALUES ('${name}', '${unit_price}', '${item_category}', '${description}')
    `;
    return await pool.query(query);
}

async function getItemByName(name) {
    let query = `
        SELECT * FROM items
        WHERE name='${name}'
    `;
    return await pool.query(query);
}

async function updateItem(item_id, name, unit_price, item_category, description) {
    let query = `
        UPDATE items
        SET name = '${name}',
            unit_price = '${unit_price}',
            item_category =  '${item_category}',
            description = '${description}'
        WHERE item_id = '${item_id}'
    `;
    return await pool.query(query);
}

async function deleteItem(item_id) {
    let query = `
        DELETE FROM items
        WHERE item_id = '${item_id}'
    `;
    return await pool.query(query);
}
