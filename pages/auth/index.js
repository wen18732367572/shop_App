// pages/auth/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime, { async } from "../../lib/runtime/runtime";
import {login} from '../../utils/axyncWx.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //获取用户信息
 async handleGetUserInfo(e){
   try{
       //获取用户信息
   const {encryptedData,rawData,iv,signtrue} = e.detail
   //获取小程序登录成功后的code
    const {code} = await login()
    const loginParams = {encryptedData,rawData,iv,signtrue,code}
    //发送请求  获取token值
    // const res = await request({url:'/users/wxlogin',data:loginParams,method:"post"})
    let token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
      // console.log(res);//这里token获取不到  因为不是企业账号
    //将token存入缓存  同时跳转到支付页面
    wx.setStorageSync("token", token);
      wx.navigateBack({
        delta: 1
      });
   }
   catch(err){
     console.log(err);
   }
        
  }
})