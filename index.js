const express = require('express')
const app = express()
const port = 3001
const path = require('path');
const morgan = require('morgan')
const handlebars = require('express-handlebars');
const route = require('./src/routes')
const db = require('./src/config/db')
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
const striptags = require('striptags');
app.use(bodyParser.urlencoded({ extended: false }));


//cookies
app.use(cookieParser())

app.use(express.urlencoded({
    extended: true
}))

//change method
app.use(methodOverride('_method'))

//body
//app.use(express.urlencoded())
app.use(express.json())


//template
app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    helpers: {

        sum: (a, b) => a + b,
        truncateDescription: function (description) {
            if (description.length > 0) {
                return striptags(description.substring(0, 150) + '...');
            }
            return description;
        },
        formatDate: function (dateString) {
            const parts = dateString.split('-');
            if (parts.length === 3) {
                return parts[2] + '-' + parts[1] + '-' + parts[0];
            }
            return dateString;

        }

    }
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src\\resources\\views'));

//morgan console log
app.use(morgan('combined'))
app.use(express.static(path.join(__dirname, 'src\\public')))


//đường dẫn đến file ảnh
app.use('/uploads', express.static('uploads'))
route(app)
db.connection;

app.listen(port, () => {
    console.log(`Example app listening on port : http://localhost:${port}/`)
})