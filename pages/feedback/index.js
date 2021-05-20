// pages/feedback/index.js
/**
 * 当点击  +
 *   调用小程序内置的选择图片的api
 *   获取到图片的路径 数组
 *    把图片路径  图片数组 进行循环显示
 */
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true,
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false,
      },
    ],
    chooseImgs: [],
    //文本域的内容
    textValue: "",
  },
  //外网的图片路径的数组
  UpLoadImg: [],
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
  //点击“+”选择图片
  handleChooseImg() {
    //调用小程序内置的选择图片的api
    wx.chooseImage({
      //同时选中的数量
      count: 9,
      //图片的格式  原图  压缩
      sizeType: ["original", "compressed"],
      //图片的来源  相册  照相机
      sourceType: ["album", "camera"],
      success: (result) => {
        this.setData({
          //把图片数组经行拼接
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths],
        });
      },
    });
  },
  //点击自定义图片组件  进行删除
  handleRemoveImg(e) {
    //获取被点击的图片索引
    const { index } = e.currentTarget.dataset;
    //获取data中的图片数组
    let { chooseImgs } = this.data;
    //删除元素
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs,
    });
  },
  //文本域输入事件
  handleInputText(e) {
    this.setData({
      textValue: e.detail.value,
    });
  },
  //提交按钮的点击事件
  handleFormSubmit() {
    const { textValue, chooseImgs } = this.data;
    wx.showLoading({
      title: "正在提交...",
      mask: true,
    });
    //判断有没有需要上传的图片数组
    if(chooseImgs.length != 0){
      chooseImgs.forEach((v, i) => {
        //合法性验证
        if (!textValue.trim()) {
          //不合法
          wx.showToast({
            title: "输入不合法",
            icon: "none",
            mask: true,
          });
          return;
        }
        //准备上传图片到专门的图片服务器
        //上传文件的api不支持多个文件同时上传  遍历数组  挨个上传
        var upTask = wx.uploadFile({
          //图片要上传到哪里
          url: "https://img.coolcr.cn/api/upload", //因为没有服务器  所以暂时放到了外网图床
          //被上传的文件路径
          filePath: v,
          //上传的文件的名称  后台来获取文件  file
          name: "image",
          //顺带的文本信息
          formData: {},
          success: (result) => {
            // console.log(result);
            let url = JSON.parse(result.data).url;
            this.UpLoadImg.push(url);
            //所有的图片都上传完毕了才触发
            if (i === chooseImgs.length - 1) {
              wx.hideLoading();
              // console.log("把文本内容和外网图片数组提交到后台");
              //提交完毕
              //重置页面
              this.setData({
                textValue: "",
                chooseImgs: [],
              });
              //返回上一个内面
              wx.navigateBack({
                delta: 1,
              });
            }
          },
        });
      });
    }
    else{
      console.log('只是提交了文本');
      wx.hideLoading();
        wx.navigateBack({
          delta: 1
        }); 
    }
  },
});
