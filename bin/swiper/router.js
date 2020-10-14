'use strict';

module.exports = app => {
  app.router.post('/publicity/swiper/add', app.controller.publicity.swiper.add);
  app.router.post('/publicity/swiper/delete', app.controller.publicity.swiper.delete);
  app.router.get('/publicity/swiper/list', app.controller.publicity.swiper.list);
  app.router.get('/publicity/swiper/getInfoById', app.controller.publicity.swiper.getInfoById);
};
