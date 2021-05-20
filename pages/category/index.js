import { request } from "../../request/index.js";
import regeneratorRuntime, { async } from '../../lib/runtime/runtime'
// pages/category/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //左侧的菜单数据
    leftMenuList: [],
    //右侧的商品数据
    rightContent: [],
    //接口中返回的数据
    Cates: [],
    //被点击左侧菜单
    currentIndex: 0,
    //右侧内容的滚动条距离顶部的距离
    scrollTop:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*先判断本地存储有没有旧的数据
      没有的话就发送新的请求
       有旧的的数据，同时旧数据也没有过期 就是用本低存储中的旧数据即可
    */
    //获取本地存储中的数据（小程序中也是存在本地存储中的技术）
    const Cates = wx.getStorageSync("cates");
    //判断
    if (!Cates) {
      // 不存在  则发送
      this.getCates();
    } else {
      //有旧的数据 判断是否过期 如果过期
      if (Date.now() - Cates.time > 6000 * 10) {
        //重新发请求
        this.getCates();
      } else {
        //旧数据可以使用
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map((v) => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent,
        });
      }
    }
  },
  // 获取分类数据
  async getCates() {
    // request({
    //   url: "/categories",
    // }).then((res) => {
    //   this.Cates = res.data.message;
    //   //将接口的数据存入到本地存储
    //   wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });

    //   //构造左侧的数据
    //   let leftMenuList = this.Cates.map((v) => v.cat_name);
    //   //构造右侧的商品数据
    //   let rightContent = this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent,
    //   });
    // });

    // 使用es7的async await来发送请求 语法
    const res = await request({url:"/categories"})
        // this.Cates = res.data.message;
        this.Cates = res;
      //将接口的数据存入到本地存储
      wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
      //构造左侧的数据
      let leftMenuList = this.Cates.map((v) => v.cat_name);
      //构造右侧的商品数据
      let rightContent = this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightContent,
      });
  },
  //左侧菜单点击事件
  handleItemTap(e) {
    /**
     * 获取被点击的标题身上的索引
     * 给data中的currentIndex赋值即可
     * 根据不同的索引渲染商品内容
     * 
     */
    const  {index}  = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置 右侧内容的scroll-view标签距离顶部的距离
      scrollTop:0
    });
  },
});
