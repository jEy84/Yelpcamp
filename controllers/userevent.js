const User = require('../models/user');


module.exports.renderRegister = (req, resp) => {
    resp.render('usersauth/register');
}

module.exports.renderLogin = (req, resp) => {
    resp.render('usersauth/login');
}

module.exports.registerUser = async (req, resp) => {

    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'You Register Successfully');
            resp.redirect('/campground');
        })

    } catch (e) {
        req.flash('error', e.message);
        resp.redirect('register');
    }

}

module.exports.loginUser = (req, res) => {
    req.flash('success', 'welcome back!');
    //for flash msg
    const redirectUrl = req.session.returnTo || '/campground';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logOutUser = (req, resp, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', 'GoodBye..👋👋');
        resp.redirect('/campground');
    })
}