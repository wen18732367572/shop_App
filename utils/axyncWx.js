
export const getSetting=()=>{
  return new Promise((resolve,reject)=>{
    wx.getSetting({
      success: (result)=>{
        resolve(result)
      },
      fail: (err)=>{reject(err)},
    });
  })
}


export const chooseAddress=()=>{
  return new Promise((resolve,reject)=>{
    wx.chooseAddress({
      success: (result)=>{
        resolve(result)
      },
      fail: (err)=>{reject(err)},
    });
  })
}

export const openSetting=()=>{
  return new Promise((resolve,reject)=>{
    wx.openSetting({
      success: (result)=>{
        resolve(result)
      },
      fail: (err)=>{reject(err)},
    });
  })
}
/**
 * 
 * @param {object} param0
 * @returns 
 */
export const showModal=({content})=>{
  return new Promise((resolve,reject)=>{
    wx.showModal({
      title: '提示',
      content: content,
      success: (result) => {
       resolve(result)
      },
      fail:(err)=>{
        reject(err)
      }
    });
  })
}

/**
 * 
 * @param {object} param0 
 * @returns 
 */

export const showToast = ({title}) => {
  return new Promise((resolve,reject)=>{
    wx.showToast({
      title: title,
      icon: 'none',
      mask: false,
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {}
    });
      
  })
}

export const login = () => {
  return new Promise((resolve,reject)=>{
    wx.login({
      timeout:10000,
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {}
    });
  })
}

/**
 * 
 * @param {object} pay 支付所必要的参数 
 * @returns 
 */

export const requestPayment = (pay) => {
  return new Promise((resolve,reject)=>{
   wx.requestPayment({
     ...pay,
     success: (result)=>{
        resolve(reject)
     },
     fail: (err)=>{
       reject(err)
     },
     complete: ()=>{}
   });
  })
}

