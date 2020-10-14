'use strict';

/*
 * 省市区管理 
 */

const { Service } = require('egg');

class AreaService extends Service {
  /*
   * TODO 获取省市县区列表
   * @ {
   *  level: 省市区乡级别 1 - 4 
   *  parent： 父级id
   * } params
   */
  async list(params) {
    const { ctx } = this;
    try {
      const query = { levelType: '1' };
      if (params.level) {
        if (['1', '2', '3', '4'].includes(params.level)) query.levelType = params.level.toString()
        if (params.parent) {
          query.parentId = params.parent.toString()
        }
      }
      const data = await ctx.model.Tools.Area.findAndCountAll({
        attributes: ['id', 'name'],
        where: query,
        order: [['id', 'ASC']],
      });
      return await ctx.toSuccess('获取成功', data.rows, data.count);
    } catch (err) {
      return await ctx.toError(err);
    }
  }
}

module.exports = AreaService;