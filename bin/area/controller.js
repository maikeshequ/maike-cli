'use strict';
const { Controller } = require('egg');

class AreaController extends Controller {
  async list() {
    const { ctx, app } = this;
    const cbody = ctx.query;
    try {
      ctx.validate({
        level: {
          type: 'string',
          allowNull: false,
          required: false,
        },
      }, cbody);
    } catch (err) {
      ctx.body = { code: 0, msg: '参数验证错误' };
      return;
    }
    ctx.body = await ctx.service.tools.area.list(cbody);
  }
}

module.exports = AreaController;
