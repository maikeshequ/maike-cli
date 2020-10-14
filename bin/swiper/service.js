'use strict';

const { Service } = require('egg');
class SwiperService extends Service {
  async add(params) {
    const { ctx } = this;
    try {
      if (params.id) {
        const data = await ctx.model.Publicity.Swiper.findOne({
          where: { id: params.id },
        });
        if (!data) throw new Error('获取信息失败');
        data.update({
          name: params.name,
          image: params.image,
          toid: params.toid,
          type: params.type,
          index: params.index,
          isshow: params.isshow,
        });
        data.save();
        return await ctx.toSuccess();
      }
      const data = await ctx.model.Publicity.Swiper.create({
        name: params.name,
        image: params.image,
        toid: params.toid,
        type: params.type,
        index: params.index,
        isshow: params.isshow,
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
      const data = await ctx.model.Publicity.Swiper.destroy({
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
      const query = {
        isshow: params.isshow || true,
      };
      const data = await ctx.model.Publicity.Swiper.findAndCountAll({
        attributes: [ 'id', 'name', 'image', 'toid', 'type', 'index' ],
        where: query,
        limit: parseInt(params.pagesize),
        offset: (parseInt(params.page) - 1) * parseInt(params.pagesize),
        order: [[ 'created_at', 'DESC' ]],
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
      const data = await ctx.model.Publicity.Swiper.findOne({
        attributes: [ 'id', 'name', 'image', 'toid', 'type', 'index' ],
        where: query,
      });
      return await ctx.toSuccess('获取成功', data);
    } catch (err) {
      return await ctx.toError(err);
    }
  }
}

module.exports = SwiperService;