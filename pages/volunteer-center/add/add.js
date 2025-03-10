const app = getApp();
const models = app.globalData.models;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        studentList: [], // 学员列表
        selectedStudentId: null, // 选中的学员
        positionList: [], // 岗位列表
        selectedPosition: null // 选中的岗位
    },

    // 搜索输入
    onSearchInput(e) {
        this.searchKeyword = e.detail.value;
    },

    // 搜索学员
    async onSearch() {
        try {
            const { data } = await models.Users.get({
                filter: {
                    where: {
                        UserID: {
                            $eq: this.searchKeyword,
                        },
                    },
                },
            });
            if (Object.keys(data).length > 0) {
                wx.showToast({title: '搜索成功'});
                this.setData({studentList: [data]});
                // console.log('学员列表:',this.data.studentList);
                // console.log('学员列表长度:',this.data.studentList.length);
            }else{
                wx.showToast({title: '未搜索到相关数据', icon: 'none'});
                this.setData({studentList: []});
            }
        } catch (err) {
            console.error('搜索学员失败', err);
            wx.showToast({title: '搜索失败', icon: 'none'});
        }
    },

    // 选择学员
    onSelectStudent(e) {
        const studentId = e.currentTarget.dataset.id;
        if (this.data.selectedStudentId === studentId) {
            // 如果已经选中，则取消选择
            this.setData({
                selectedStudentId: null
            });
        } else {
            // 如果未选中，则选择该学员
            this.setData({
                selectedStudentId: studentId
            });
        }
        if (studentId!==null){
            console.log('选中的学员:',studentId);
            this.loadPositions();
        }
    },

    // 加载岗位列表
    async loadPositions() {
        try {
            this.setData({ isLoading: true });

            const { data } = await models.Posts.list({ // 改用list方法
                filter: {
                    where: { }, // 建议添加有效状态过滤
                    orderBy: { createTime: 'DESC' }
                }
            });

            // 适配标准返回结构
            const records = data?.records || [];
            this.setData({
                positionList: records,
                isLoading: false
            });

            if (records.length === 0) {
                wx.showToast({title: '无空闲岗位', icon: 'none'});
            }else{
                console.log(this.data.selectedStudentId)
                console.log('岗位列表:',this.data.positionList);
            }
        } catch (err) {
            console.error('加载失败:', err);
            this.setData({ isLoading: false });
            wx.showToast({
                title: err.message || '加载失败',
                icon: 'none'
            });
        }
    },


    // 选择岗位
    onPositionChange(e) {
        const index = e.detail.value;
        this.setData({selectedPosition: this.data.positionList[index]});
    },

    // 确认添加
    async onConfirm() {
        const {selectedStudent, selectedPosition} = this.data;
        const db = wx.cloud.database();
        try {
            await db.collection('Users').doc(selectedStudent._id).update({
                data: {
                    VolunteerUserID: selectedPosition._id
                }
            });
            wx.showToast({title: '添加成功'});
            this.setData({
                studentList: [],
                selectedStudent: null,
                selectedPosition: null
            });
        } catch (err) {
            console.error('添加志愿者失败', err);
            wx.showToast({title: '添加失败', icon: 'none'});
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})