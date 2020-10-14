'use strict';

const { Controller } = require('egg');

class TestController extends Controller {
  async add() {
    const { ctx } = this;
    const cbody = ctx.request.body;
    try {
      ctx.validate({
        name: {
          type: 'string',
          allowNull: false,
          required: true,
        },
        },cbody);
    } catch (err) {
      ctx.body = { code: 0, msg: '参数验证错误' };
      return;
    }
    ctx.body = await ctx.service.ROOT.add(cbody)
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
        },cbody);
    } catch (err) {
      ctx.body = { code: 0, msg: '参数验证错误' };
      return;
    }
    ctx.body = await ctx.service.ROOT.delete(cbody)
  }
  async list() {
    const { ctx } = this;
    const cbody = ctx.query;
    cbody.page = cbody.page || 1
    cbody.pagesize = cbody.pagesize || 10
    ctx.body = await ctx.service.ROOT.list(cbody)
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
        }
        },cbody);
    } catch (err) {
      ctx.body = { code: 0, msg: '参数验证错误' };
      return;
    }
    ctx.body = await ctx.service.ROOT.getInfoById(cbody)
  }
}

module.exports =  TestController;