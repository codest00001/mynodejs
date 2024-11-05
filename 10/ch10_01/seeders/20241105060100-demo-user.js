'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.bulkInsert('users',[{
    email: 'aaa@gmail.com',
    password: 'test1234',
    name: 'aaa_admin',
    address: 'seoul',
    createdAt: new Date(),
    updatedAt: new Date,
   },{
    email: 'bbb@gmail.com',
    password: 'test1234',
    name: 'bbb_admin',
    address: 'busan',
    createdAt: new Date(),
    updatedAt: new Date,
   },
   {
    email: 'ccc@gmail.com',
    password: 'test1234',
    name: 'ccc_admin',
    address: 'ulsan',
    createdAt: new Date(),
    updatedAt: new Date,
   }
  ]);
  // console.log(result)
//실행 : 터미널에 npx sequelize-cli db:seed:all라고 입력 
//psql켜서 비밀번호 넣고 \c ch10 넣어서 ch10으로 들어가서 select * from users; 해보기.
},
  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
