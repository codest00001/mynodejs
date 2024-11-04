const express = require('express');
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/post"); // 몽고디비 연결하기
const db = mongoose.connection; //mongoose.connection 객체를 db라는 변수에 저장하는 부분입니다. 이 db 변수는 MongoDB와의 연결 상태를 추적하고 관리하는 데 사용

db.on("error", (err)=>{ //에러 발생 시
    console.err(`db connect fail : ${JSON.stringify(err)}`);
});

db.once("open", ()=>{ //연결 성공 시
    console.log(`db connect success`);
});

//스키마 정의
const PostSchema = new mongoose.Schema({
    title : String,
    content : String,
    author : String,
    createdAt : {type : Date, default : Date.now},
});

const Post = mongoose.model('Post', PostSchema); // create collection, create table

const app = express();
app.use(express.json());

app.post("/posts", async (req,res)=>{
    const {title, content, author} = req.body; //바디에서 가져오기
    try{
        const post = new Post({ // 포스트 오브젝트만들기
            title : title,
            content : content,
            author : author,

        });
        await post.save(); // 몽고디비 저장
        res.status(200).json({data:post, message:'ok'}) //return result to user
    }catch(e){
        res.status(500).json({message:e})
    }
})

app.listen(3000, ()=>{
    console.log(`server is running`)
})

