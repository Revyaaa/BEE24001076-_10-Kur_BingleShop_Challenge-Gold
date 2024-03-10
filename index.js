const express = require('express');
const app = express();
// const bcrypt = require ('bcrypt');
const {Op} = require('sequelize');
const {User, Order, Item} = require('./models');
const user = require('./models/user');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.set('view engine', 'ejs');


const port = 3002;
//to do: buat middleware untuk console log path yang dihit

app.listen(port, () => console.log(`Listening on port ${port}...`))

// Show users
app.get('/users', async (req, res) => {
    const users = await User.findAll()
    res.send(users) 
})


// // Register pelanggan baru
// app.get('/register', (req, res) => {
//     res.render('register')
// })

app.post('/register', async (req, res) => {
    const {id, username, password, email, phone} = req.body;
    const user = new User;
    user.id = id;
    user.username = username;
    user.password = password;
    // user.password = bcrypt.hashSync(password, 10);
    user.email = email;
    user.phone = phone;
    await user.save().then(res.status(200).send('Successfully created a new user'))
})

// // Tampilkan login pelanggan
// app.get('/login', (req, res) => {
//     res.render('login');
// })

// Check data pelanggan yang login
app.post('/login', async (req, res) => {
    const username_ = req.body.username;
    const password_ = req.body.password;
    const user = await User.findOne({where: {
        username: username_, password: password_
    }})

    if (user == null) return res.status(401).send('Wrong username or password')
    else return res.send('Login successful') 
})


// Menampilkan data item
app.get('/items', async (req, res) => {
    const items = await Item.findAll();
    res.send(items)
    // res.send('This is show item get request')
})

// Menambah data item
app.post('/items', async(req,res) => {
    const {name, price} = req.body
    const item = new Item;
    item.name = name;
    item.price = price;
    await item.save().
    then(
        res.status(200).send(`Item: "${item.name}" with price: ${item.price} has been registered`)
    )
})


// Menampilkan data pesanan
app.get('/orders', async (req, res) => {
    const orders = await Order.findAll();
    res.status(200).json(orders)
})

// Membuat pesanan baru
app.post('/orders', async (req, res) => {
    try{
        const {total_price, quantity, status, user_id} = req.body;
        const order = new Order;
        order.total_price = total_price;
        order.quantity = quantity;
        order.status = status;
        order.user_id = user_id;
        await order.save()
        res.status(200).json(
            {
            message: 'The order has been created',
            order: order
        })
    }
    catch(err) {
        console.log(`Error message: ${err.message}`)
        res.status(400).send(`Error: ${err.message}`)
    }
})

// Memperbarui status pesanan
app.patch('/orders/:id', async (req, res) => {
    const order = await Order.findOne({where:{id:req.params.id}})
    if (order) {
        order.status = 'finished'
        await order.save()
        res.status(200).json({
            message:`The status of order id:${order.id} has been updated to "finished".`,
            order: order
        })
    }
    else res.status(400).send(`Order with the id:${req.params.id} is not found.`)
})
