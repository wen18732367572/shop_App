// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "商品收藏",
        isActive: true,
      },
      {
        id: 1,
        value: "品牌收藏",
        isActive: false,
      },
      {
        id: 2,
        value: "店铺收藏",
        isActive: false,
      },
      {
        id: 3,
        value: "浏览器足迹",
        isActive: false,
      },
    ],
    collect:[]
  },
  onShow(){
    const collect = wx.getStorageSync("collect") || [];
    this.setData({
      collect
    })
      
  },
  handleTabsItemChange(e) {
    //获取被点击的标题的索引
    const { index } = e.detail;
    let { tabs } = this.data;
    tabs.forEach((v, i) => {
      i === index ? (v.isActive = true) : (v.isActive = false);
    });
    //赋值到data中
    this.setData({
      tabs,
    });
    
  },
})