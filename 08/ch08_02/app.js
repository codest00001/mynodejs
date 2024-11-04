const express = require('express');
const path = require('path');
const models = require('./models');
const multer = require('multer');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/downloads", express.static(path.join(__dirname, "public/uploads"))); 
//req : http://localhost:3000/downloads/test.png
//res : public/uploads/test.png

//0멀터로 파일첨부 기능
const upload_dir = "public/uploads";
const storage = multer.diskStorage({
    destination: `./${upload_dir}`,
    filename : function(req, file, cb){
        cb(null,
            path.parse(file.originalname).name + 
            "-" +
            Date.now() +
            path.extname(file.originalname)
        )
    }
});
const upload = multer({storage : storage});

//시퀄라이즈로 마이그레이션하기"sequelize-cli": "^6.6.2" 이용함
//터미널에 아래의 코드를 입력
//npx sequelize-cli migration:generate --name add-filename-to-posts


//------------------------------------------------------------------------------------------


//1내용추가
app.post("/posts", upload.single("file"), async (req,res)=>{
    const {title, content, author} = req.body;
    let filename = req.file ? req.file.filename : null;
    filename = `/downloads/${filename}`;
    const post = await models.Post.create({
        title : title,
        content : content,
        author : author,
        filename: filename,
    });
    res.status(201).json({post:post})
})

//------------------------------------------------------------------------------------------

//2게시글 가져오기
app.get("/posts", async (req, res)=>{
    // console.log("/posts");
    const posts = await models.Post.findAll({
            include : [
                {model:models.Comment}
            ]

    });
    console.log("/posts", JSON.stringify(posts));
    res.json({data:posts})
})

//------------------------------------------------------------------------------------------

//3게시글 하나 가져오기
app.get("/posts/:id",async (req,res)=>{
    const id = req.params.id;
    console.log('get post id', id)
    
    const post = await models.Post.findOne({
        where : {id:id}
    });
    if(post){
        res.status(200).json({data:post});
    }else{
        res.status(404).json({data:'post not found'});
    } 
});

//------------------------------------------------------------------------------------------

//4수정하기
app.put("/posts/:id", async (req,res)=>{
    const id = req.params.id;
    const {title, content, author} = req.body; // author도 추가 / 각 항목이 다 들어가야함
    const post = await models.Post.findByPk(id);
    if(post){
        post.title = title;
        post.content = content;
        post.author = author; //저자수정추가
        await post.save();
        res.status(200).json({data:post})
    }else{
        res.status(404).json({result:"post not found"})
    }
})
// 확인방법
// 포스트맨에가서 PUT 선택하고 localhost:3000/posts/1라고 입력한 후
// body raw json 선택하고 아래의 코드를 넣으면 코멘트등록됨
// {"title" : "일번글제목","content" : "일번글내용","author" : "일번글저자"}

//------------------------------------------------------------------------------------------

//5삭제하기
app.delete("/posts/:id", async (req, res)=>{
    const result = await models.Post.destroy({
        where : {
            id: req.params.id
        }
    });
    if(result){
            res.status(204).send();
        }else{
            res.status(404).json({result:'post not found'})
        }
})

//------------------------------------------------------------------------------------------

//6코멘트등록
app.post("/posts/:id/comments", async (req, res) => {
    const postId = req.params.id;
    const {content} = req.body;
    const comment = await models.Comment.create({ //insert into comments(postId, content) values(?,?)와 같은 구문임
         PostId : postId,
        content : content,
    });
    res.status(201).json({data:comment})
});
// 확인방법
// 포스트맨에가서 POST로 선택하고 localhost:3000/posts/1/comments라고 입력한 후
// body raw json 선택하고 아래의 코드를 넣으면 코멘트등록됨
// {"content" : "일번글에코멘트등록"}

//------------------------------------------------------------------------------------------

//7코멘트 업데이트
app.put("/posts/:postId/comments/:commentId", async(req,res)=>{
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const {content} = req.body;
    const comment = await models.Comment.findByPk(commentId);
    if(comment){
        comment.content = content;
        await comment.save();
        res.status(200).json({data:comment});
    }else{
        res.status(404).json({result:"comment not found"})
    }
})

//------------------------------------------------------------------------------------------

//8코멘트 지우기
app.delete("/posts/:postId/comments/:commentId", async(req,res)=>{
    const commentId = req.params.commentId;
    //delete from comments where id = commentId와 같은 코드임
    const result = await models.Comment.destroy({
        where : {id : commentId}
    });
    console.log(`result is ${JSON.stringify(result)}`) //삭제된 개수를 출력해 줌
    if(result){
        res.status(204).json();
    }else{
        res.status(404).json({result:"comment not found"})
    }
})

//------------------------------------------------------------------------------------------
//9첨부파일






//------------------------------------------------------------------------------------------

app.listen(PORT, ()=>{
    console.log(`server listening on ${3000}`);
    models.sequelize
        .sync({force:false})
        .then(()=>{
            console.log('DB Connected')
        })
        .catch((err)=>{
            console.log(`DB err : ${err}`);
            process.exit();
        })
});