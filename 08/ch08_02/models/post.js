module.exports = (sequelize,DataTypes) => {
    const Post = sequelize.define("Post",{
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: DataTypes.STRING,
        author: DataTypes.STRING,
        filename : {
            type : DataTypes.STRING,
            allowNull : true
        } //논리적인 내용은 여기에서 이렇게 따로 추가필요
    });
    Post.associate = function(models){
        Post.hasMany(models.Comment)
    }
    return Post;
};