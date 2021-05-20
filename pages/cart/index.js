// pages/cart/index.js
import { getSetting, chooseAddress, openSetting ,showModal,showToast} from "../../utils/axyncWx.js";
import regeneratorRuntime, { async } from "../../lib/runtime/runtime";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0,
  },
  onShow() {
    //获取缓存中的收获地址信息
    const address = wx.getStorageSync("address");
    // 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart") || [];
    this.setData({
      address
    })
     this.setCart(cart)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  //点击  获取地址
  async handleChooseAddress() {
    // //获取权限状态  scope
    // wx.getSetting({
    //   success: (result) => {
    //     //获取权限状态  当发现属性名怪异的时候  需要用[]形式来获取属性值
    //     const scopeAddress = result.authSetting["scope.address"];
    //     if (scopeAddress === true || scopeAddress === undefined) {
    //       wx.chooseAddress({
    //         success: (result1) => {
    //           console.log(result1);
    //         },
    //       });
    //     } else {
    //       //用户拒绝过授予权限  诱导用户打开授权界面
    //       wx.openSetting({
    //         success: (result2) => {
    //           //可以调用收货地址代码
    //           wx.chooseAddress({
    //             success: (result3) => {
    //               console.log(result3);
    //             },
    //           });
    //         },
    //       });
    //     }
    //   },
    //   fail: () => {},
    //   complete: () => {},
    // });

    // 获取权限状态
    try {
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      //判断权限状态
      if (scopeAddress === false) {
        //用户拒绝过授予权限  诱导用户打开授权界面
        await openSetting();
      }
      //调用获取收货地址的代码API
      let address = await chooseAddress();
      address.all =
        address.provinceName +
        address.cityName +
        address.countyName +
        address.detailInfo;
      //存入缓存中
      wx.setStorageSync("address", address);

      // console.log(res2);
    } catch (err) {
      console.log(error);
    }
  },
  /**
   *  商品的选中
   *   1.绑定change事件
   *   2.获取到被修改的商品对象
   *   3.商品对象的选中状态取反
   *   4.重新填充回data中和缓存中
   *   5.重新计算全选 总价格  总价格 。。
   */
  handleItemChange(e) {
    // 获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id;
    // 获取购物车数组
    let { cart } = this.data;
    // 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 选中状态取反
    cart[index].checked = !cart[index].checked;
    this.setCart(cart)
  },

  /**
   * 设置购物车状态  重新计算底部工具栏的数据
   */
  setCart(cart){
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach((v) => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    });
    wx.setStorageSync("cart", cart);
  },

  /**
   * 全选事件
   */
   handleItemAllChecked(){
     let {cart,allChecked} = this.data
    allChecked = !allChecked
    cart.forEach(v => {
      v.checked = allChecked
    });
    this.setCart(cart)
   },
  
   /**
    * 商品数量的编辑功能
    * 区分的关键  自定义属性
    * ”+“ +1
    * ”-“ -1
    * 传递被点击的商品id goods_id
    * 获取data中的购物车数组  来获取需要被修改的商品对象
    * 直接修改商品对象的数量 num
    * 把cart数组  重新设置回缓存中和data中
    */

   async handleItemEdit(e){
      // 获取传递的参数 
      const {operation,id} = e.currentTarget.dataset
      //获取购物车数组
      let {cart} = this.data
      const index = cart.findIndex(v=>v.goods_id===id)
      //判断是否要执行删除
      if(cart[index].num === 1 && operation===-1){
        const res = await showModal({content:"确定要删除吗"})
        if(res.confirm){
          cart.splice(index,1)
          this.setCart(cart)
        }
        else if(res.cancel){
          console.log(用户点击了取消);
        }
      }
      else{
        // 修改数量
        cart[index].num+=operation
      }
      this.setCart(cart)
    },
  /**
   * 结算点击事件
   */
   async handlePay(){
    //判断收货地址
    const {address,totalNum} = this.data
    if(!address.userName){
      await showToast({title:"您还未选择收货地址"})
      return
    }
    //判断是否选中商品
    if(totalNum === 0){
      await showToast({title:"您还未选购商品"})
      return
    }
    //跳转到支付页面
    wx.navigateTo({
      url:'/pages/pay/index'
    });
      

   }
});
