const express = require('express');
const postController = require ('../controllers/postController');
const { check } = require('express-validator')
const {authenticate} = require('../middleware/auth_middleware')
const router = express.Router();

//app.get("/users", (req, res)=>{}) 부분에 해당함
//findAll뒤에 () 안 적는다. ()넣으면 바로 호출되므로.
//app.js 에서 /users라고 들어오는 모든 것을 userRoute로 오게 했기 때문에 여기서는 / 만 적음.
router.get('/', postController.findAll); 
//http://localhost:3000/posts
router.post('/', authenticate, postController.createPost); //app.post("/users", (req, res)=>{})부분에 해당함
router.get('/:id', postController.findPostById);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;