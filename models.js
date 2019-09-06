const Sequelize = require('sequelize');
const sequelize = new Sequelize('Education', 'root', 'admin_123!', {
    host: '52.79.46.222',
    dialect: 'mariadb',
});

const User = sequelize.define('user1', {
    identity: Sequelize.DataTypes.STRING,
    password: Sequelize.DataTypes.STRING,
    nickname: Sequelize.DataTypes.STRING,
    level: Sequelize.DataTypes.INTEGER,
});

const Article = sequelize.define('article1', {
    title: Sequelize.DataTypes.STRING,
    contents: Sequelize.DataTypes.TEXT('medium'),
});

User.hasMany(Article);
Article.belongsTo(User);

module.exports = {
    Sequelize,
    sequelize,
    User,
    Article,
};