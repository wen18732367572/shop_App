// pages/order/index.js
/**
 * onShow  不同于onLoad  无法接受options参数
 * 1.当订单被打开时  onShow
 *   判断缓存中有没有token
 *   获取url的参数type
 *   根据type，去发送获取订单数据据
 *      根据type  来决定也页面数组元素哪个被激活选中
 *   渲染页面
 * 2.点击不同的标题  重新发送请求并渲染数据
 */
import { request } from "../../request/index.js";
import regeneratorRuntime, { async } from "../../lib/runtime/runtime";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true,
      },
      {
        id: 1,
        value: "待付款",
        isActive: false,
      },
      {
        id: 2,
        value: "待发货",
        isActive: false,
      },
      {
        id: 3,
        value: "退货/退款",
        isActive: false,
      },
    ],
    orders: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: "/pages/auth/index",
      });
      return;
    }
    //获取当前小程序的页面栈
    //数组中索引最大的就是当前页面
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    //获取url上的type参数
    const { type } = currentPage.options;
    //激活选中页面标题
    this.changeTitleByIndex(type-1)  //当type=1  index=0
    this.getOrders(type);
  },
  //获取订单列表的方法
  async getOrders(type) {
    const res = await request({ url: "/my/orders/all", data: { type } });
    this.setData({
      orders: res.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    });
    console.log(res);
  },
  handleTabsItemChange(e) {
    //获取被点击的标题的索引
    const { index } = e.detail;
    this.changeTitleByIndex(index)
    //重新发送请求并渲染数据
    this.getOrders(index+1)
  },
  //根据标题索引激活选中  标题数组
  changeTitleByIndex(index) {
    //修改原数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => {
      i === index ? (v.isActive = true) : (v.isActive = false);
    });
    //赋值到data中
    this.setData({
      tabs,
    });
  },
});
