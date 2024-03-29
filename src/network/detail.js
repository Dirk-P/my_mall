import {request} from './request'

export function getDetail(iid){
    return request ({
        url:'./detail',
        params:{
            iid
        }
    })
}

export class Goods {
    constructor(itemInfo,columns,services){
        this.title = itemInfo.title
        this.desc = itemInfo.desc
        this.newPrice = itemInfo.price
        this.oldPrice = itemInfo.pldPrice
        this.discount = itemInfo.discountDesc
        this.columns = columns
        this.services = services
        this.realPrice = itemInfo.lowPrice
    }
}

export class Shop{
    constructor(shopInfo){
        this.logo = shopInfo.shopLogo
        this.name = shopInfo.shopname
        this.fans = shopInfo.cFans
        this.sells = shopInfo.cSells
        this.score = shopInfo.score
        this.goodsCount = shopInfo.cGoods
    }
}

export class GoodsParam{
    constructor(info,rule){
        this.image= info.image ? info.images[0] :''
        this.infos = info.set
        this.sizes = rule.tables
    }
}