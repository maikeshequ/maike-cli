'use strict';

module.exports = app => {
  app.router.post('/PATHS/add', app.controller.ROOT.add);
  app.router.delete('/PATHS/delete', app.controller.ROOT.delete);
  app.router.get('/PATHS/list', app.controller.ROOT.list);
  app.router.get('/PATHS/getInfoById', app.controller.ROOT.getInfoById);
};