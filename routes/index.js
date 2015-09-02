var express = require('express');
var router = express.Router();

var crypto = require('crypto');     //加密密码
var User = require('../models/user');    //user.js用户模型文件

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '青木博客' });
});

/* GET register page */
router.get('/reg', function(req, res){
    res.render('reg', { title : '注册' });
});

/* POST register message */
router.post('/reg', function(req, res){
    var uname = req.body.uname,
        password = req.body.password,
        repassword = req.body['repassword'];
    //检验用户两次输入的密码是否一致
    if (repassword != password) {
        req.flash('error', '两次输入的密码不一致!');
        return res.redirect('/reg');//返回注册页
    }
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
        repassword: repassword,
        password: password,
        email: req.body.email
    });
    //检查用户名是否已经存在
    User.get(newUser.uname, function (err, user) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        if (user) {
            req.flash('error', '用户已存在!');
            return res.redirect('/reg');//返回注册页
        }
        //如果不存在则新增用户
        newUser.save(function (err, user) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/reg');//注册失败返回主册页
            }
            req.session.user = user;//用户信息存入 session
            req.flash('success', '注册成功!');
            res.redirect('/');//注册成功后返回主页
        });
    });
});

/* GET login page */
router.get('/login', function(req, res){
    res.render('login', { title : '登录' });
});

/* POST login message */
router.post('/login', function(req, res){

});

/* GET loginout */
router.get('/logout', function(req, res){

});

module.exports = router;
