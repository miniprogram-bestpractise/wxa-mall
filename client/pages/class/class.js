
Page({
    data:{
        Categories: [{
            "iCatId": "101",
            "iSortOrder": "1",
            "iSortOrsCatNameder": "手机数码",
            "submit": [{
                "iCatId": "121",
                "iSortOrsCatNameder": "小米手机"
            }, {
                "iCatId": "122",
                "iSortOrsCatNameder": "华为手机"
            }, {
                "iCatId": "208",
                "iSortOrsCatNameder": "魅族手机"
            }, {
                "iCatId": "676",
                "iSortOrsCatNameder": "三星手机"
            }
            ]
        }, {
            "iCatId": "119",
            "iSortOrder": "4",
            "iSortOrsCatNameder": "家用电器",
            "submit": [{
                "iCatId": "126",
                "iSortOrsCatNameder": "电水壶"
            }, {
                "iCatId": "125",
                "iSortOrsCatNameder": "电饭煲"
            }, {
                "iCatId": "125",
                "iSortOrsCatNameder": "电磁炉"
            }, {
                "iCatId": "125",
                "iSortOrsCatNameder": "微波炉"
            }]
        },{
            "iCatId": "119",
            "iSortOrder": "4",
            "iSortOrsCatNameder": "运动户外",
            "submit": [{
                "iCatId": "126",
                "iSortOrsCatNameder": "跑步鞋"
            }, {
                "iCatId": "125",
                "iSortOrsCatNameder": "体育用品"
            }, {
                "iCatId": "125",
                "iSortOrsCatNameder": "山地车"
            }, {
                "iCatId": "125",
                "iSortOrsCatNameder": "跑步机"
            }]
        }, {
            "iCatId": "119",
            "iSortOrder": "4",
            "iSortOrsCatNameder": "男女服饰",
            "submit": [{
                "iCatId": "126",
                "iSortOrsCatNameder": "早春新品"
            }, {
                "iCatId": "125",
                "iSortOrsCatNameder": "连衣裙"
            }, {
                "iCatId": "125",
                "iSortOrsCatNameder": "衬衫"
            }, {
                "iCatId": "125",
                "iSortOrsCatNameder": "牛仔裤"
            }, {
                "iCatId": "125",
                "iSortOrsCatNameder": "卫衣"
            }, {
                "iCatId": "125",
                "iSortOrsCatNameder": "针织衫"
            }]
        },]
    },

    onLoad(){
        this.init();
    },

    onShow(){

    },

    init(){
    },
    tapClick(e) {
        var p = e.currentTarget.id
        console.log('/pages/productlist/productlist?id=' + p);
        wx.navigateTo({url: '/pages/productlist/productlist?id=' +p})
    },
})
