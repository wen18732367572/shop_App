// index.js
// 获取应用实例
// 引用发送请求的方法
import { request } from "../../request/index.js";
const app = getApp();

//Page Object
Page({
  data: {
    //轮播图数组
    swiperList: [],
    // 导航 数组
    cateList: [],
    // 楼层数据
    floorList: [],
  },
  //页面开始加载就会触发
  onLoad(options) {
    this.getSwiperList(); //轮播图数据
    this.getCateList(); //分类导航数据
    this.getfloorList(); //获取楼层数据
  },
  //获取轮播图数据
  getSwiperList() {
    //发送异步请求获取轮播图数据
    //  wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   header: {'content-type':'application/json'},
    //   method: 'GET',
    //   success: (result) => {
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   },
    // });
    request({ url: "/home/swiperdata" }).then((result) => {
      this.setData({
        swiperList: result,
      });
    });
  },
  //获取分类导航数据
  getCateList() {
    request({ url: "/home/catitems" }).then((result) => {
      this.setData({
        cateList: result,
      });
    });
  },
  //楼层数据
  getfloorList() {
    request({ url: "/home/floordata" }).then((result) => {
      for (let k = 0; k < result.length; k++) {
        result[k].product_list.forEach((v, i) => {
          result[k].product_list[i].navigator_url = v.navigator_url.replace(
            "?",
            "/index?"
          );
        });
      }
      this.setData({
        floorList: result,
      });
     
    });
  },
});
