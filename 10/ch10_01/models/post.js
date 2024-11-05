module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        id : {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        title: DataTypes.STRING,
        content: DataTypes.STRING,
        count: DataTypes.INTEGER,
    },{
        tableName: "posts" //생성될 테이블의 이름
    });
    Post.associate = function(models){ //foreign key
        models.Post.belongsTo(models.User); //유저모델과 관계설정 //유저아이디 FK create
    }
    return Post;
}