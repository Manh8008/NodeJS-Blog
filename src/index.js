const path = require('path');
const express = require('express');
const morgan = require('morgan');
// const handlebars = require('express-handlebars');
const {engine} = require('express-handlebars');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')))

// Sử dụng HTTP logger
app.use(morgan('combined'));

app.engine('hbs', engine({extname: '.hbs'}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Định nghĩa route cho trang chủ
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/news', (req, res) => {
  res.render('news');
});

// Lắng nghe các kết nối đến cổng port
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
