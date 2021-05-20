/**
 * 滚动条触底  开始加载吓一跳数据
 * 滚动条触底事件
 * 是否还是下一页数据
 *    获取到总页数 和当前页码
 *    总页数  = Math.ceil(总条数/页容量)（向上取整）
 *            
 * 假如没有  提示用户
 * 有的话继续加载数据 
 */
import { request } from "../../request/index.js";
import regeneratorRuntime, { async } from "../../lib/runtime/runtime";
// pages/goods_list/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true,
      },
      {
        id: 1,
        value: "销量",
        isActive: false,
      },
      {
        id: 2,
        value: "价格",
        isActive: false,
      },
    ],
    goodsList: [],
  },
  // 接口要的参数
  QueryParams: {
    query: "",
    cid: "",
    pageNum: 1,
    pagesize: 10,
  },
  //总页数
  totalPages:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //通过options可以获取传递的参数
    this.QueryParams.cid = options.cid || "";
    this.QueryParams.query = options.query || "";
    this.getGoodsList();
  },
  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({ url: "/goods/search", data: this.QueryParams });
    //获取总条数
    const {total} = res
    //计算总页数
    this.totalPages = Math.ceil(total/this.QueryParams.pagesize)
    this.setData({
      // 拼接数组
      goodsList:[...this.data.goodsList,...res.goods]
    })
    //关闭下拉刷新的窗口  如果没有调用下拉刷新的窗口  直接关闭也没有关系  不会报错
    wx.stopPullDownRefresh()
  },
  //标题的点击事件  通过子组件见传递
  handleTabsItemChange(e) {
    //获取被点击的标题的索引
    const { index } = e.detail;
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
  // 页面触底事件
  onReachBottom(){
      // 判断还有没有下一页数据
      if(this.QueryParams.pageNum>this.totalPages)
      {
        //没有下一页
      wx.showToast({
        title: '我也是有底线的！！',
      });
      }else{
        this.QueryParams.pageNum++
        this.getGoodsList()
      }
  },

  /**
   * 下拉刷新页面
   *    1.触发下拉刷新事件  需要在json中开启一个配置 "enablePullDownRefresh"
   *    2.充值数据数组
   *    3.重置页码  设置为1 
   *    4.重新发送请求
   *    5.数据请求回来  需要关闭等待效果
   */
  //下拉刷新事件
   onPullDownRefresh:function(){
      this.setData({
        goodsList:[]
      })
      this.QueryParams.pageNum=1
      this.getGoodsList()
  }
});
