const path = require('path');
const express = require('express');
const morgan = require('morgan');
// const handlebars = require('express-handlebars');
const { engine } = require('express-handlebars');
const app = express();
const port = 3000;

const route = require('./router');

app.use(express.static(path.join(__dirname, 'public')));

// Cái trung gian để xử lí dữ liệu từ form submit lên
// Dưới dạng form gửi lên thì có cái  app.use(express.urlencoded()) xử lí
app.use(express.urlencoded({ extended: true }));
// Gửi từ code js lên thì có app.use(express.json()) xử lí
app.use(express.json());

// Sử dụng HTTP logger
app.use(morgan('combined'));

app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

//Routes init
route(app);

// Lắng nghe các kết nối đến cổng port
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
