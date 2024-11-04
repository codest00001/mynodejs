const mongoose = require('mongoose');

(async()=>{
    await mongoose.connect("mongodb://localhost:27017/mydb");
    console.log(`connected to mongodb`);

    const {Schema} = mongoose;
    const userSchema = new Schema({
        name: {type: String, required:true},
        age: {type: Number, min:0, max:120},
        city: {type: String, required:false}
    });

    const User = mongoose.model(`User`, userSchema);

    //업데이트할때는 여기 주석처리하고
    // const user1 = new User({name:'Alice', age:50, city:'Seoul'});

    // const result1 = await user1.save();
    // console.log(`user1 : ${JSON.stringify(result1)}`);

    // const users = await User.find({});
    // console.log(`users lift : ${JSON.stringify(users)}`);


    //업데이트 //updateOne을 하면 하나만 바뀌고, updateMany를 하면 앨리스 전체의 나이가 30으로 바뀐다.
    // const updatedUser1 = await User.updateOne({name:'Alice'}, {$set:{age:50}});
    // console.log(`Alice age is ${JSON.stringify(updatedUser1)}`);

    //삭제하기 deleteOne은 하나 지우기, deleteMany는 다 지우기 
    const deletedUser1 = await User.deleteMany({name : 'Alice'});
    console.log(`users list : ${JSON.stringify(deletedUser1)}`)

    //리스트 보여주기
    const users = await User.find({});
    console.log(`users list : ${JSON.stringify(users)}`);

})();