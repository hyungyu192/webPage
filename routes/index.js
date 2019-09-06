var express = require('express');
var router = express.Router();

const { User, Article, sequelize } = require('../models');
sequelize.sync();

router.get('/', function(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login')
  }
  res.render('index', { 
    title: 'Express',
    query: req.query,
    session: req.session,
   });
});

router.get('/board', async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login')
  }
  const articles = await Article.findAll({
    include: [User],
    order: [["id", "desc"]]
  });
  res.render('board', { 
    title: '게시판',
    query: req.query,
    session: req.session,
    articles,
    moment: require('moment'),
   });
});

router.get('/view/:articleId', async(req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login')
  }
  const article = await Article.findByPk(req.params.articleId, {
    include: [ User ]
  });
  if (!article) {
    return next();
  }
  res.render('view', { 
    title: article.title,
    query: req.query,
    session: req.session,
    article,
    moment: require('moment'),
   });
});

router.get('/write', async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login')
  }
  const articleId = req.query.articleId;
  let article = null;
  if (articleId) {
    article = await Article.findByPk(articleId);
  }
  res.render('write', { 
    title: "글쓰기",
    query: req.query,
    session: req.session,
    moment: require('moment'),
    message : '',
    article,
   });
});

router.post('/write', async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login')
  }
  const title = req.body.title;
  const contents = req.body.contents;
  const articleId = req.body.articleId;
  if (!title || !contents) {
    return res.render('write', { 
      title: "글쓰기",
      query: req.query,
      session: req.session,
      moment: require('moment'),
      message: "제목 혹은 내용이 기재되지 않았습니다.",
      article: null,
     });
  }
  if (articleId) {
    const article = await Article.findByPk(articleId);
    if (!article || article.user1Id !== req.session.user.id) {
      if (req.session.user.level < 3) {
        return res.redirect('/');
      }
    }
    await Article.update({
      title,
      contents
    }, {
      where: { id: articleId }
    });
    return res.redirect(`/view/${articleId}`);
  }
  const article = await Article.create({
    title,
    contents,
    user1Id: req.session.user.id,
  });
  res.redirect(`/view/${article.id}`);
});

router.get('/login', function(req, res, next) {
  if (req.session.user) {
    return res.redirect('/')
  }
  res.render('login', { 
   });
});

router.get('/logout', (req, res, next) => {
  req.session.user = null;
  res.redirect('/login');
});

module.exports = router;
