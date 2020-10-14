'use strict';

module.exports = app => {
  const { INTEGER, STRING, BOOLEAN, TEXT } = app.Sequelize;
  const Swiper = app.model.define(
    'Swiper',
    {
      id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: STRING,
        allowNull: true,
        defaultValue: '',
        comment: 'swiper标题',
      },
      image: {
        type: TEXT,
        allowNull: false,
        defaultValue: '',
        comment: 'swiper资源存储位置',
      },
      toid: {
        type: INTEGER,
        allowNull: true,
        defaultValue: null,
        comment: 'swiper跳转类型id',
      },
      type: {
        type: INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: '跳转类型 0 无跳转 ',
      },
      index: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'swiper显示排序，降序',
      },
      isshow: {
        type: BOOLEAN,
        defaultValue: true,
        comment: 'swiper展示状态',
      },
    },
    {
      freezeTableName: true,
      tableName: 'swiper',
      timestamp: true,
      paranoid: true,
    }
  );
  return Swiper;
};
