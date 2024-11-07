//익스프레스 서버 띄우기 위한 작업 // 익스프레스에서는 app.js가 먼저 시작됨. 엔트리포인트.
const express = require('express');
const fs = require('fs');
const path = require('path');
//라우터 임포트. routes라는 디렉토리에 설정된 라우터들을 임포트.
const userRoute = require('./routes/userRoute');
const postRoute = require('./routes/postRoute');
const authRoute = require('./routes/authRoute');

const models = require('./models') //모델스 안의 index.js가 실행되는 것
const app = express();
const PORT = 3000;

app.use(express.json());

//라우터 추가
app.use('/users', userRoute); // /users 주소넣으면 userRoute연결해. ./users라고 적으면 안됨. 점을 찍으면 안됨.
app.use('/posts', postRoute);
app.use('/auth', authRoute);


app.listen(PORT, ()=> {
    console.log(`server is running on ${PORT}`)
    models.sequelize.sync({force:false}) //모델을 테이블로 생성하는 것. force가 false면 있으면 생성하지 않는 다는 의미.
    .then(()=>{ //모델 생성 성공 시, 디비 객체 연결 성공 시
        console.log(`db connected`)
    }).catch((err)=>{ //모델 생성 실패 시, 디비 객체 연결 실패 시
        console.log(`db connected error : ${err}`)
        process.exit();
    })
})

//코드 만드는 순서
//데이터베이스 부터 시작해서 쿼리문으로 먼저 파악해 봄
//내가 받아 올 데이터를 먼저 생각해보고 쿼리문 작성해서 불러와 봄
//dao - service - controller - router 의 순서대로 작성
