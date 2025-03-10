// app.js 修改如下
const { init } = require("./wxCloudClientSDK.umd.js");

App({
    globalData: {
        models: null // 新增全局变量
    },
    onLaunch() {
        wx.cloud.init({
            env: "dev-6gl33id70e4efe87"
        });
        const client = init(wx.cloud);
        this.globalData.models = client.models; // 挂载到全局
    }
});
