'use strict';

module.exports = app => {
  const { STRING } = app.Sequelize;
  const Area = app.model.define(
    'Area',
    {
      id: {
        type: STRING(20),
        allowNull: true,
        comment: 'id',
        primaryKey: true,
        unique: true,
      },
      parentId: {
        type: STRING(20),
        allowNull: true,
        defaultValue: '',
        comment: '父id',
      },
      levelType: {
        type: STRING(1),
        allowNull: true,
        defaultValue: '',
        comment: '级别',
      },
      name: {
        type: STRING(50),
        allowNull: true,
        defaultValue: '',
        comment: '地点名称',
      },
      province: {
        type: STRING(50),
        allowNull: true,
        defaultValue: '',
        comment: '省份',
      },
      city: {
        type: STRING(50),
        allowNull: true,
        defaultValue: '',
        comment: '城市',
      },
      district: {
        type: STRING(50),
        allowNull: true,
        defaultValue: '',
        comment: '县区',
      },
      town: {
        type: STRING(50),
        allowNull: true,
        defaultValue: '',
        comment: '乡镇',
      },
    },
    {
      freezeTableName: true,
      tableName: 'area',
      timestamp: true,
      paranoid: true,
    }
  );
  return Area;
};
