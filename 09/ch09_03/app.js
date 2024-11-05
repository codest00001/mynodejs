const express = require('express');
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/post"); // 몽고디비 연결하기
const db = mongoose.connection; //mongoose.connection객체를 db라는 변수에 저장하는 부분.이 db 변수는 MongoDB와의 연결 상태를 추적하고 관리하는 데 사용

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

//---------------------------------------------------------------------------------------------------------------------------

// 글 추가하기
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

//---------------------------------------------------------------------------------------------------------------------------

//1105화.글목록가져오기
app.get("/posts", async(req,res)=>{
    try{
        const posts = await Post.find({});
        res.status(200).json({data:posts,message:'ok'})
    }catch(e){
        res.status(500).json({message:e})
    }
})

//---------------------------------------------------------------------------------------------------------------------------

//1105화.게시글 하나가져오기
app.get("/posts/:id", async(req, res)=>{
    const { id } = req.params; // _id : 67287991cba2897678be332// 코드에서는 언더바 안써도됨. 매핑된 _id로 자동적으로 찾아줌.
    try{
        const post = await Post.findById(id);
        res.status(200).json({data:post,message:'ok'})

    }catch(e){
        res.status(500).json({message:e})
    }
})

//---------------------------------------------------------------------------------------------------------------------------

//1105화.글 업데이트하기
app.put("/posts/:id", async(req,res)=>{
    const { id } = req.params;
    const { title, content } = req.body;
    try{
        const post = await Post.findByIdAndUpdate(
            id,
            {
                title : title,
                content : content,
            },
            {new : true}
        )
        res.status(200).json({data:post, message:'ok'})
    }catch(e){
        res.status(500).json({message:e})
    }
})
//실습방법. 포스트맨 열어서 PUT으로 바꾸고 localhost:3000/posts/67287991cba2897678be3324 (마지막 긴 영숫자는 id임) 주소창에 넣고
//{"title" : "title2.2", "content" : "content2.2"} body - raw - json 에 넣어보기

//---------------------------------------------------------------------------------------------------------------------------

//1105화. 글 하나 삭제하기.
app.delete("/posts/:id", async(req,res)=>{
    const {id} = req.params;
    try{
        await Post.findByIdAndDelete(id);
        res.status(204).send();
    }catch(e){
        res.status(500).json({message:e})
    }
})
//실습방법. 포스트맨 열어서 DELETE로 바꾸고 localhost:3000/posts/글id

//---------------------------------------------------------------------------------------------------------------------------

app.listen(3000, ()=>{
    console.log(`server is running`)
})

//