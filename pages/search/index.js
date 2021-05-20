// pages/search/index.js
/**
 * 输入框绑定事件  值改变事件  input事件
 *  1.获取输入框的值
 *  2.合法性的判断
 *  3.检验通过  把输入框的值发送到后台
 *  4.将返回的值打印到页面上
 * 
 *  防抖(防止抖动)  多用于输入框
 *    利用定时器
 *  节流：多用于页面下拉和上拉
 *   
 */
 import { request } from "../../request/index.js";
 import regeneratorRuntime, { async } from "../../lib/runtime/runtime";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    //按钮是否显示
    isFocus:false,
    inputValue:""
  },
  TimeId:-1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //输入框的值改变事件
  handleInput(e){
   
    //获取输入框的值
    const {value} = e.detail
    if(!value.trim()){
       this.setData({
         goods:[],
         isFocus:false
       })
       return
    }
    this.setData({
      isFocus:true
    })
    clearTimeout(this.TimeId)
    this.TimeId = setTimeout(() => {
      this.qsearch(value)
    }, 1000);
    
  },
  //发送请求的函数  获取搜索建议的数据
  async qsearch(query){
    const res = await request({url:"/goods/qsearch",data:{query}})
   this.setData({
     goods:res
   })
  },
  handleCancel(){
    this.setData({
      inputValue:"",
      isFocus:false,
      goods:[]
    })
  }
})