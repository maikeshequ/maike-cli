'use strict';

const { Controller } = require('egg');

class SwiperController extends Controller {
  async add() {
    const { ctx } = this;
    const cbody = ctx.request.body;
    try {
      ctx.validate(
        {
          name: {
            type: 'string',
            allowNull: false,
            required: true,
          },
          image: {
            type: 'string',
            allowNull: false,
            required: true,
          },
          toid: {
            type: 'number',
            allowNull: true,
            required: false,
          },
          type: {
            type: 'number',
            allowNull: true,
            required: false,
          },
          index: {
            type: 'number',
            allowNull: false,
            required: false,
          },
          isshow: {
            type: 'bool',
            allowNull: true,
            required: false,
          },
        },
        cbody
      );
    } catch (err) {
      ctx.body = {
        code: 0,
        msg: '参数验证错误',
      };
      return;
    }
    ctx.body = await ctx.service.publicity.swiper.add(cbody);
  }
  async delete() {
    const { ctx } = this;
    const cbody = ctx.request.body;
    try {
      ctx.validate({
        id: {
          type: 'int',
          allowNull: false,
          required: true,
        },
      }, cbody);
    } catch (err) {
      ctx.body = { code: 0, msg: '参数验证错误' };
      return;
    }
    ctx.body = await ctx.service.publicity.swiper.delete(cbody);
  }
  async list() {
    const { ctx } = this;
    const cbody = ctx.query;
    cbody.page = cbody.page || 1;
    cbody.pagesize = cbody.pagesize || 10;
    ctx.body = await ctx.service.publicity.swiper.list(cbody);
  }
  async getInfoById() {
    const { ctx } = this;
    const cbody = ctx.query;
    try {
      ctx.validate({
        id: {
          type: 'int',
          allowNull: false,
          required: true,
        },
      }, cbody);
    } catch (err) {
      ctx.body = { code: 0, msg: '参数验证错误' };
      return;
    }
    ctx.body = await ctx.service.publicity.swiper.getInfoById(cbody);
  }
}

module.exports = SwiperController;