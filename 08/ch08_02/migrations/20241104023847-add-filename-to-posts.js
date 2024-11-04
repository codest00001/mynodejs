'use strict';


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    //성공할 때의 내용. 
    await queryInterface.addColumn('Posts', 'filename', {
      type : Sequelize.STRING,
      allowNull : true,
    })

  },

  async down (queryInterface, Sequelize) {
    //실패할 경우의 내용
    await queryInterface.removeColumn('Posts', 'filename');
  }
};

//npx sequelize-cli db:migrate 터미널에 입력하기
//post.db에 가면 filename이라는 컬럼이 생기고 내용은 NULL로 뜨면 성공
//시퀄라이즈메타에 등록되어있으면, 마이그레이트 한 번 실행할 때마다 여기 계속 등록됨 