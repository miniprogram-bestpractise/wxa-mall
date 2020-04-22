import noticeModel from '../../models/notice'

Page({
    data: {},

    onLoad(option){
        console.log(option);

        if (option.id != '') {
            this.render(option.id);
        }
    },

    render(id){
        var that = this;

        // 通过model读取并格式化数据
        noticeModel.getDetail({id: id}).then(function (data) {
            that.setData(data.info);
        });
    }
})
