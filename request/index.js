/**
 * 同时发送异步代码的次数
 * 
 */
  let ajaxTime=0;

export const request=(params)=>{

  //判断url是否带有 /my/ 请求的是私有的路径  带上header token
  let header = {...params.header}
  if(params.url.includes("/my/"))
  {
    //拼接 header 带上token
    header["Authorization"] = wx.getStorageSync("token"); 
  }
  ajaxTime++
  // 显示加载中
  wx.showLoading({
    title: "加载中",
    mask: true,
  });
 const baseURL="https://api-hmugo-web.itheima.net/api/public/v1"
  return new Promise((resolve,reject)=>{
    wx.request({
      ...params,
      header:header,
      url:baseURL+params.url,
      success:(result)=>{
        resolve(result.data.message)
      },
      fail:(err)=>{
        reject(err)
      },
      //成功失败都会执行
      complete:()=>{
        ajaxTime--
        if(ajaxTime===0)
        wx.hideLoading();
      }
    })
})
}