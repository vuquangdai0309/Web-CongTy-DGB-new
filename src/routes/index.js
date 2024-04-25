const homeRouter = require('./home')
const adminRouter = require('./admin')
const baivietRouter = require('./baiviet')
const tracuuRouter = require('./tracuu')
const UserRouter = require('./user')

function route(app) {

   app.use('/admin/bai-viet', baivietRouter)
   app.use('/admin/tra-cuu-giay-chung-nhan', tracuuRouter)
   app.use('/admin', adminRouter)
   app.use('/user', UserRouter)
   app.use('/', homeRouter)

}
module.exports = route