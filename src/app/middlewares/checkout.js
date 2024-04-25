
const Account = require('../models/Account')
var jwt = require('jsonwebtoken');
class CheckController {
    checkout(req, res, next) {
        var token = req.cookies.token
        if (token === undefined) {
            res.redirect('/user/login')
        }
        else {
            var idUser = jwt.verify(token, 'mk')
            Account.getAccountById(idUser._id, (err, results) => {
                if (err) {
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }
                else {
                    if (results.length === 0) {
                        res.redirect('/user/login')
                    }
                    else {
                        if (results[0].role >= 0) {
                            next()
                        }
                        else {
                            res.redirect('/user/login')
                        }
                    }
                }
            })
        }
    }
}
module.exports = new CheckController
