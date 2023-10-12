// index.js,获取用户信息，跳转页面

// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
      // console.log(wx.getUserProfile.userInfo.language)
    }
    const sysInfo = wx.getSystemInfoSync();
    if(sysInfo.platform!='devtools'){
      wx.startWifi({
        success:()=>{
          this.data.isEnabledWifi=true;
          wx.getConnectedWifi({
            success:(res)=>{
              console.log('connect wifi info',res)
            },
            fail(err){
              // app.showModal(err.errMsg);
              console.error(err)
            }
          })
        },
        fail(err){
          app.showModal(err.errMsg)
          console.error(err)
        }
      });
    }
  },
  onUnload(){
    if(this.data.isEnabledWifi){
      wx.stopWifi();
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        // const { nickName, avatarUrl } = res.userInfo;
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onClick(e){
    const { key } = e.currentTarget.dataset;
    const { avatarUrl, nickName } = this.data.userInfo;
    switch(key){
      case 'join-game':
        wx.navigateTo({
          url: '/pages/scan/scan',
          success(res){
            res.eventChannel.emit('args', {
              avatarUrl,
              nickName,
            });
          }
        });
        break;
      case 'create-game':
        wx.navigateTo({
          url: '/pages/game/game',
          success(res){
            res.eventChannel.emit('args',{
              localInfo:{
                avatarUrl,
                nickName,
              }
            })
          }
        });
        break;
    }
  }
})
