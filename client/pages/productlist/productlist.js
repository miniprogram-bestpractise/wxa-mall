import shoppingCart from '../../templates/cart/cart';
import goods from '../../models/goods';

Page({
    data:{
        allGoodsList: [],
        scrollTop: 0,
        scrollHeight: 600,
        allGoodsPage: 1,
        allGoodsEnd: false,
        allOrderBy: "iSoldNum",
        allSort: "desc",
        allIsSort: 0,
        cat_tag_type:'all',
        cat_tag_id:1,
        opt_type:'goods_list',
        subMenu: 1,
        allcount:0,
        keyword:""
    },
    onLoad: function(option){
            this.getAllGoodsList(this, 1);

    },
    onShow(){
    },

    getAllGoodsList(that, page) {
        goods.getProductList(page).then(function (data) {
            if (data.list.length === 0) {
                if (page === 1) {
                    that.data.allGoodsList = [];//allcount
                    that.setData({
                        allcount: 1,
                        allGoodsList: [],
                    });
                }
                that.setData({
                        allGoodsPage: page,
                        allGoodsEnd: true
                    });
            } else {
                if (page === 1) {
                    that.data.allGoodsList = [];
                }
                var goodsList = that.data.allGoodsList;
                for (var i = 0; i < data.list.length; i++) {
                    goodsList.push(data.list[i]);
                }
                that.setData({
                    allGoodsList: goodsList,
                    allGoodsPage: page,
                    allGoodsEnd: false
                });
            }
        });
    },
    allBindCartTap(e) {
        shoppingCart.init(this, this.curBiz, e.currentTarget.id);
    },
    bindAllGoodsDownLoad() {
        if (!this.data.allGoodsEnd) {
            this.data.allGoodsPage++;
            this.getAllGoodsList(this, this.data.allGoodsPage);
            console.log(this.data.allGoodsPage);
        } else {
            console.log("end");
        }
    },
    allGoodsListClick(e) {
        var p = e.currentTarget.id
        console.log('/pages/detail/detail?id=' + p);
        wx.navigateTo({url: '/pages/detail/detail?id=' + p})
    },
    subMenuClick(e) {
        var id = e.currentTarget.id;
        console.log("testdddddddddddddd" + id);
        if (id == 1) {
            this.data.allOrderBy = "iSoldNum";
            this.data.allSort = "desc";
            this.data.allIsSort = 0;
            this.getAllGoodsList(this, 1);


        } else if (id == 2) {
            this.data.allOrderBy = "dtBuyTime";
            this.data.allSort = "desc";
            this.data.allIsSort = 0;
            this.getAllGoodsList(this, 1);

        } else if (id == 3) {
            this.data.allOrderBy = "iPrice";
            this.data.allSort = (this.data.allSort == "desc") ? "asc" : "desc";
            this.data.allIsSort = (this.data.allSort == "desc") ? 1 : 2;
            this.getAllGoodsList(this, 1);
        }
        this.setData({
            subMenu: id,
            allIsSort: this.data.allIsSort
        })
    },
    bindKeyInput(e){
        var tempt=e.detail.value;
        if(tempt.length>0)
        {
            this.data.opt_type = "goods_list_search";
            this.data.keyword=tempt;
        }else{
            this.data.opt_type = "goods_list";
            this.data.keyword=tempt;
        }
        this.getAllGoodsList(this, 1);
        console.log(e.detail.value);
    }
})
