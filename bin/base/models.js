'use strict';

module.exports = app => {
  const { INTEGER, TEXT, STRING } = app.Sequelize;
  const Test = app.model.define(
    'Test',
    {
      id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      test1: {
        type: STRING(20),
        allowNull: true,
        defaultValue: '',
        comment: '',
      },
    },
    {
      freezeTableName: true,
      tableName: '',
      timestamp: true,
      paranoid: true,
    }
  );
  // Test.associate = function() {
  //   app.model.models.Test.belongsTo(app.model.models., {
  //     foreignKey: '',
  //     targetKey: 'id',
  //     constraints: false,
  //     as:'' // 多个外键关键时，查询include 需要使用
  //   });
  // };
  return Test;
};