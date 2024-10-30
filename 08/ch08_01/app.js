const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize({ // new Sequelize 생성
    dialect: 'sqlite', //Sqlite3 use
    storage: 'post.db' //data file name
});

`
create table User (
    username varchar(100) not null,
    email varchar(100)
);
`

//User모델읠 정의
//username과 email이라는 두개의 필드 가지며
//각각 스트링타입으로 지정됨.
//유저네임은 필수, 이메일은 선택
const User = sequelize.define("User", {
    username: {
        type : DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
});

//즉시 실행 비동기 함수
(async () => {
//await를 사용하기 위해서 즉시실행함수를 정의함
//실제 모델을 생성, 데이터를 가져오는 부분
    await sequelize.sync({force: false});

//다른 작업시 주석처리시작
//     user01생성하기
//     const user1 = await User.create({
//         username: 'user01',
//         email: 'user01@naver.com'
//     });
//     //user01이 잘 생성되었나 찍어보기
//     console.log(`user created => ${JSON.stringify(user1)}`)

//     //유저를 벌크로 생성하는 방법
//     //node app.js 실행시마다 생성되므로 다른 코드할때는 껐다가 실행해야함
//     const users = await User.bulkCreate([
//         {username : 'user02', email: 'user02@naver.com'},
//         {username : 'user03', email: 'user03@naver.com'},
//         {username : 'user04', email: 'user04@naver.com'}
// ]);
//주석처리끝

    // const users = await User.findAll();
    // users.forEach(user => {
    //     console.log(`id:${user.id}, username : ${user.username}, email: ${user.email}, createdAt:${user.createdAt}`)
    // })


    //내용 업데이트
    //인자 2개 중에서 첫번째는 업데이트할 것, 두번째는 조건
    await User.update({
        email:'user02@gmail.com'
    },{
        where : {
            username : 'user02'
        }
    })

    //내용 하나만 불러오기
    const user = await User.findOne({
        where : {
            username : 'user02'
        }
    });
    console.log(`user02 => ${JSON.stringify(user)}`);

    //내용 지우기
    const r = await User.destroy({
        where:{
            username : 'user01'
        }
    })
    console.log(r) //지워진 개수 출력됨
    
})();











