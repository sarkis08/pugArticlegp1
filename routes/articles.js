const express = require('express');
const router = express.Router();

// Article Model
let Article = require('../models/article');

// User Model
let User = require('../models/user');

// Add Route
router.get('/add', ensureAuthenticated, function(req, res){
    res.render('add_article', {
        title: 'Create Article'
    })
})

// Add Submit POST Route
router.post('/add', ensureAuthenticated, function(req, res){
    req.checkBody('title', 'Title is required').notEmpty();
    // req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('image', 'Image is required').notEmpty();
    req.checkBody('body', 'Description is required').notEmpty();

    // Get Errors
    let errors = req.validationErrors();

    if(errors){
        res.render('add_article', {
            errors:errors
        });
    } else {
        
        let article = new Article();
        article.title = req.body.title;
        article.author = req.user._id;
        article.image = req.body.image;
        article.body = req.body.body;

        article.save(function(err){
            if(err){
                console.log(err)
                return;
            } else {
                req.flash('success', 'Article Added Successfully!!!')
                res.redirect('/');
            }
        });
    }
});

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
    Article.findById(req.params.id, function(err, article){
        // if(article.author !== req.user._id){
        //     req.flash('danger', 'Not Authorized');
        //     res.redirect('/');
        // } else {
            
        // }
        res.render('edit_article', {
            title: 'Edit Single Article',
            article: article
        });
    });
});

// Update Submit POST Route
router.post('/edit/:id',  ensureAuthenticated, function(req, res){
    let article = {};
    article.title = req.body.title;
    article.author = req.user._id;
    article.image = req.body.image;
    article.body = req.body.body;

    let query = {_id: req.params.id}

    Article.update(query, article, function(err){
        if(err){
            console.log(err)
            return;
        } else {
            req.flash('success', 'Article Updated!!!!')
            res.redirect('/');
        }
    });
});

// Delete Article Route
router.delete('/:id', function(req, res){
    if(!req.user._id){
        res.status(500).send();
    }

    let query = {_id:req.params.id}

    Article.findById(req.params.id, function(err, article){
        if(article.author != req.user._id){
            res.status(500).send();
        } else {
            Article.remove(query, function(err){
                if(err) {
                    console.log(err);
                }
                res.send('Success');
            });
        }
    });

});

// Get Single Article
router.get('/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
        User.findById(article.author, function(err, user){
            res.render('view_article', {
                title: 'View Single Article',
                article: article,
                author:user.name
            });
        });
    });
});

// Access Control
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('danger', 'Please Login first and continue!!!');
        res.redirect('/users/login');
    }
}

module.exports = router; 