'use strict';
const { Service } = require('egg');

class TestService extends Service {
  async add(params) {
    const { ctx } = this;
    try {
      if (params.id) {
        const data = await ctx.model.ROOT.findOne({
          where: { id: params.id },
        });
        if (!data) throw new Error('获取信息失败');
        data.update({});
        data.save();
        return await ctx.toSuccess();
      }
      const data = await ctx.model.ROOT.create({

      });
      if (!data) throw new Error('操作失败');
      return await ctx.toSuccess();
    } catch (err) {
      return await ctx.toError(err);
    }
  }
  async delete(params) {
    const { ctx } = this;
    try {
      const data = await ctx.model.ROOT.destroy({
        where: {
          id: params.id,
        },
      });
      if (!data) throw new Error('操作失败');
      return await ctx.toSuccess();
    } catch (err) {
      return await ctx.toError(err);
    }
  }
  async list(params) {
    const { ctx } = this;
    try {
      const query = {};
      const data = await ctx.model.ROOT.findAndCountAll({
        attributes: ['id'],
        where: query,
        limit: parseInt(params.pagesize),
        offset: (parseInt(params.page) - 1) * parseInt(params.pagesize),
        order: [['created_at', 'DESC']],
      });
      return await ctx.toSuccess('获取成功', data.rows, data.count);
    } catch (err) {
      return await ctx.toError(err);
    }
  }
  async getInfoById(params) {
    const { ctx } = this;
    try {
      const query = { id: params.id };
      const data = await ctx.model.ROOT.findOne({
        attributes: ['id'],
        where: query,
      });
      return await ctx.toSuccess('获取成功', data);
    } catch (err) {
      return await ctx.toError(err);
    }
  }
}

module.exports = TestService;