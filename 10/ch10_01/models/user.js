module.exports = (sequelize, DataTypes) => {
    //Sequelize의 define 메서드는 새로운 모델을 정의하는 데 사용
    const User = sequelize.define('User', { //User라는 이름의 모델을 생성
        id : {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING, //postgresql에서는 기본 varchar 255로 설정됨
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: DataTypes.STRING,
        address: DataTypes.STRING
    }, {
        tableName: "users"
    });
    return User;
}
