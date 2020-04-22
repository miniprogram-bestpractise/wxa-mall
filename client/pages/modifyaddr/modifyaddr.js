import toast from '../../templates/toast/toast';

Page({
    data: {
        isShowRegionSelector: false,
        address: {
            id:'',
            name: '',
            mobile: '',
            region: '',
            detail: ''
        },
        region: {
            provinces:[],
            citys: [],
            districts: []
        }
    },

    onLoad(params){
        console.log('params', params);

        let that = this;

        this.biz = comm.getCurBiz();

        if(params.id) {
            addressModel.getById(params.id, {bizcode: this.biz}).then(function (data) {
                that.setData({
                    address: data
                })
            });
        }
    },

    /**
     * 显示区域选择器
     */
    showRegionSelector(){
        this.isInitRegionSelector = true;

        this.renderRegionSelector(0, 0, 0); // 默认选中第一个

        this.setData({
            isShowRegionSelector: true
        });
    },

    /**
     * 隐藏区域选择器
     */
    hideRegionSelector(){

        this.setData({
            isShowRegionSelector: false
        });
    },

    /**
     * 渲染地址选择器
     * @param selectedProvinceIndex 选择的省份的索引
     * @param selectedCityIndex 选择的城市的索引
     * @param selectedDistrictIndex 选择的地区的索引
     */
    renderRegionSelector(selectedProvinceIndex, selectedCityIndex, selectedDistrictIndex){

        let that = this;

        regionModel.get({}).then((data)=>{

            let selectedProvince = data.provinces[selectedProvinceIndex],
                selectedCity = data.citys[selectedProvince.key][selectedCityIndex],
                selectDistrict = data.districts[selectedCity.key][selectedDistrictIndex];

            console.log(selectedProvince, selectedCity, selectDistrict);

            this.setData({
                'region.provinces': data.provinces,
                'region.citys': data.citys[selectedProvince.key],
                'region.districts': data.districts[selectedCity.key],
                'address.region':[selectedProvince.name,selectedCity.name,selectDistrict.name].join('|')
            });

            setTimeout(function () {
                that.isInitRegionSelector = false;
            }, 500)
        });
    },

    /**
     * 区域选择变化
     * @param e
     */
    onRegionChange(e){
        if(!this.isInitRegionSelector) {
            const idxs = e.detail.value
            console.log('onRegionChange', idxs);
            this.renderRegionSelector(idxs[0], idxs[1], idxs[2]);
        }
    },

    /**
     * 保存地址
     * @param e
     */
    save(e){
        let that = this, data = e.detail.value;

        console.log('add address infos', data);

        if(this.valid(data)){
            addressModel.add({
                sShipAddress: JSON.stringify(data)
            }).then(function () {
                toast.show(that, '亲~地址添加成功！');
                setTimeout(function () {
                    wx.navigateBack();
                }, 1000)
            });
        }
    },

    /**
     * 验证输入
     * @param data 输入表单数据
     * @returns {boolean}
     */
    valid(data){
        let field = '';

        if(data.name == ''){
            field = '姓名';
        } else if(data.mobile == ''){
            field = '手机号';
        } else if(data.region == ''){
            field = '城市';
        } else if(data.detail == ''){
            field = '详细地址';
        } else {
            return true;
        }

        toast.show(this, '请输入'+field);

        return false;
    }
})
