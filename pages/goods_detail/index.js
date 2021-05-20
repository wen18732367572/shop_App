import { request } from "../../request/index.js";
import regeneratorRuntime, { async } from "../../lib/runtime/runtime";
// pages/goods_detail/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    isCollect:false
  },
  //商品对象
  GoodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    //获取参数
    let pages =  getCurrentPages();
    let currentPage = pages[pages.length-1]
    let options = currentPage.options
    const { goods_id } = options;
    this.getGoodsDetail(goods_id);      
  },
  /**
   * 商品收藏
   */
  //获取商品详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({
      url: "/goods/detail",
      data: { goods_id },
    });
    this.GoodsInfo = goodsObj;
    //获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    //判断当前商品是否被收藏
    let isCollect = collect.some(v=>v.goods_id === this.GoodsInfo.goods_id)
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, ".jpg"),
        //ipone不问手机不识别 webp图片格式
        pics: goodsObj.pics,
      },
      isCollect
    });
  },
  //点击轮播图放大预览
  handlePreviewImage(e) {
    /**
     * 先构造要预览的图片数组
     */
    const urls = this.GoodsInfo.pics.map((v) => v.pics_mid);
    // 接受传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls,
    });
  },
  //加入购物车点击事件
  handleCartAdd() {
    /**
     * 1.获取缓存中的购物车  数组
     */
    let cart = wx.getStorageSync("cart") || [];
    //判断商品对象是否存在于购物车数组中
    let index = cart.findIndex((v) => v.goods_id === this.GoodsInfo.goods_id);
    if (index === -1) {
      //表示不存在
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else {
      // 已经存在购物车数据  执行数量+1
      // console.log(123);
      cart[index].num++;
    }
    //把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart);
    //弹窗提示
    wx.showToast({
      title: "加入成功",
      icon: "success",
      mask: true, //当为true  1.5秒后才能点击  防止连续点击
    });
  },
  //点击商品收藏图标
  handleCollect(){
    let isCollect = false
    //获取缓存中中的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    console.log(collect);
    //判断该商品是否被收藏过
    let index = collect.findIndex(v=>v.goods_id === this.GoodsInfo.goods_id)
    //当index不等于-1  表示已经收藏过了
    if(index!==-1){
      //能找到  已经收藏过了
      collect.splice(index,1)
      isCollect = false
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true,
      });    
    } 
    else{
      collect.push(this.GoodsInfo)
      isCollect = true
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true,
      });
    }
    //把数组存入缓存
    wx.setStorageSync("collect", collect);
    //修改data中的属性  
    this.setData({
      isCollect
    })
  }
});
