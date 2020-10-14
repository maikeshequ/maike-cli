'use strict';

module.exports = app => {
  app.router.get('/tools/area/list', app.controller.tools.area.list);
};