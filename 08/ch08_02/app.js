const express = require('express');
const path = require('path');
const models = require('./models');
const app = express();
const PORT = 3000;


app.use(express.json());
app.use(express.urlencoded({extended:true}));

//내용추가
app.post("/posts", async (req,res)=>{
    const {title, content, author} = req.body;
    const post = await models.Post.create({
        title : title,
        content : content,
        author : author,
    });
    res.status(201).json({post:post})
})

//게시글 가져오기
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

//게시글 하나 가져오기
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

//수정하기
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

//삭제하기
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

//코멘트등록
app.post("/posts/:id/comments", async (req, res) => {
    const postId = req.params.id;
    const {content} = req.body;
    const comment = await models.Comment.create({
        PostId : postId,
        content : content,
    });
    res.status(201).json({data:comment})
});



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