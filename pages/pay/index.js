// pages/cart/index.js

/**
 * 一 页面加载的时候
 *    1.从缓存中获取购物车数据  渲染到页面
 *       这些数据checked=true
 * 二 n哪些人  哪些账号可以实现微信支付
 *    1.企业账号
 *    2.企业账号的小程序后台中  必须给开发者添加白名单
 *    3.一个appID 可以同时绑定多个开发者
 * 三 支付按钮
 *    1.判断缓存中有没有token
 *    2.没有的话  跳转到授权页面  进行获取token
 *    3.有的话  
 */
import { getSetting, chooseAddress, openSetting ,showModal,showToast,requestPayment} from "../../utils/axyncWx.js";
import regeneratorRuntime, { async } from "../../lib/runtime/runtime";
import { request } from "../../request/index.js";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0,
  },
  onShow() {
    //获取缓存中的收获地址信息
    const address = wx.getStorageSync("address");
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    // 过滤后的购物车数组
    cart = cart.filter(v=>v.checked)
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach((v) => {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
    });
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  
  
  //获取点击支付功能
  async handleOderPay(){
   try {
      //判断缓存中有没有token
    const token = wx.getStorageSync("token");
    if(!token)
    {
      wx.navigateTo({
        url: '/pages/auth/index',
      });
      return
    }
    // 创建订单

    //请求头参数
    //  const header = {Authorization:token}
    //请求体参数
    const order_price = this.data.totalPrice
    const consignee_addr = this.data.address.all
    const cart = this.data.cart
    let goods = []
    cart.forEach(v=>goods.push({
      goods_id:v.goods_id,
      goods_number:v.num,
      goods_price:v.goods_price
    }))
    const orderParams = {order_price,consignee_addr,goods}
  //发送订单
  const {order_number} = await request({url:'/my/orders/create',method:"post",data:orderParams})
  //发起预支付接口
  const {pay} = await request({url:'/my/orders/req_unifiedorder',method:"post",data:{order_number}})
    //发起支付
  //  await requestPayment(pay)
    // 查询后台  订单状态
    await request({url:'/my/orders/chkOrder',method:"post",data:{order_number}})
    await showToast({title:"支付成功"})

    //手动删除缓存中已经支付了的数据
    let newCart = wx.getStorageSync("cart");
    newCart = newCart.filter(v=>!v.checked)
    wx.setStorageSync("cart", newCart);
      
    //跳转到订单那页面
    wx.navigateTo({
      url: '/pages/order/index',
    });
      
   } catch (error) {
    
      await showToast({title:"支付失败"})  
      console.log(error);
   }
  }
});
