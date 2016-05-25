/**
 * Created by Turbo on 2016/3/22.
 */

/**
 * @author Turbo
 * @Date 2016-02-04
 * @Method 移动端滑动方法  针对一个大容器内部的容器做滑动
 * @param args args.swipeDom 大容器对象  args.swipeType 滑动类型  args.swipeDistance 缓冲距离
 * 传入 要滑动元素的父节点  滑动类型 （x或y）  缓冲距离
 * 注意：子容器的高宽度是取的内容的高宽 所以padding的大小有影响
 *  数据格式eg:
 *  var c =  Tswipe.iScroll({
         swipeDom:$slideUl.get(0),
         swipeType:'x',
         swipeDistance:70
         });
 */

if(!window.Tswipe){
    window.Tswipe = {};
}
Tswipe.iScroll = function(args){
    /*调用的时候没有初始化的话就是初始化一次*/
    if(!(this instanceof arguments.callee)) {
        //返回的new出来的实例就继承prototype上的方法
        return new arguments.callee(args);
    }
    this.init(args);
    //第一次this是window ,下一次就是自己了，而且继承自自己的原型
    //这个this 是new 出来的实例
    //console.log(this);

};
Tswipe.iScroll.prototype = {
    constructor:Tswipe.iScroll,
    //有关scroll 扩展的方法 都可以加到这里
    init:function(args){
        /*局部变量来接受当前的this*/
        var that  = this;
        /*如果传入的对象是一个Dom对象就把他看作是我们的大容器盒子*/
        if(args.swipeDom && typeof  args.swipeDom == 'object'){
            that.parentDom = args.swipeDom;
        }
        /*如果不存在父容器就停止初始化*/
        if(!that.parentDom) return false;
        /*找到子容器*/
        that.childDom = that.parentDom.children&&that.parentDom.children[0]?that.parentDom.children[0]:'';
        /*如果不存在子容器就停止初始化*/
        if(!that.childDom) return false;
        /*初始化传入的参数*/
        that.settings = {};
        /*默认类型  默认的Y轴滑动 如果不是y的话就是以x轴开始滑动*/
        that.settings.swipeType = args.swipeType?args.swipeType:'y';
        /*默认的缓冲滑动距离*/
        that.settings.swipeDistance = args.swipeDistance>=0?args.swipeDistance:150;
        /*初始化滑动*/
        that._scroll();
    },
    /*对外开放的设置定位的方法*/
    setTranslate:function(translate){
        this.currPosition = translate;
        this._addTransition();
        this._changeTranslate(this.currPosition);
    },
    _addTransition:function(){
        this.childDom.style.transition = "all .2s ease";
        this.childDom.style.webkitTransition = "all .2s ease";/*兼容 老版本webkit内核浏览器*/
    },
    _removeTransition:function(){
        this.childDom.style.transition = "none";
        this.childDom.style.webkitTransition = "none";/*兼容 老版本webkit内核浏览器*/
    },
    _changeTranslate:function(translate){
        if(this.settings.swipeType == 'y'){
            this.childDom.style.transform = "translateY("+translate+"px)";
            this.childDom.style.webkitTransform = "translateY("+translate+"px)";
        }else{
            this.childDom.style.transform = "translateX("+translate+"px)";
            this.childDom.style.webkitTransform = "translateX("+translate+"px)";
        }
    },
    _scroll:function(){
        /*局部变量来接受当前的this*/
        var that = this;
        /*滑动的类型*/
        var type = that.settings.swipeType == 'y'?true:false;
        /*父容器的高度或宽度*/
        var parentHeight = type?that.parentDom.offsetHeight:that.parentDom.offsetWidth;
        /*子容器的高度或宽度*/
        var childHeight = type?that.childDom.offsetHeight:that.childDom.offsetWidth;

        /*子容器没有父容器大的时候*/
        if(childHeight < parentHeight){
            if(type){
                that.childDom.style.height = parentHeight + 'px';
                childHeight = parentHeight;
            }else{
                that.childDom.style.width = parentHeight + 'px';
                childHeight = parentHeight;
            }
        }

        /*缓冲距离*/
        var distance = that.settings.swipeDistance;
        /*区间*/
        /*左侧盒子定位的区间*/
        that.maxPosition = 0;
        that.minPosition = -(childHeight-parentHeight);
        /*设置滑动的当前位置*/
        that.currPosition = 0;
        that.startPosition = 0;
        that.endPosition = 0;
        that.movePosition = 0;
        /*1.滑动*/
        that.childDom.addEventListener('touchstart',function(e){
            /*初始的Y的坐标*/
            that.startPosition = type?e.touches[0].clientY: e.touches[0].clientX;
        },false);
        that.childDom.addEventListener('touchmove',function(e){
            e.preventDefault();
            /*不停的做滑动的时候记录的endY的值*/
            that.endPosition = type?e.touches[0].clientY: e.touches[0].clientX;
            that.movePosition = that.startPosition - that.endPosition;/*计算了移动的距离*/

            /*2.滑动区间*/
            /*就是滑动区间*/
            if((that.currPosition-that.movePosition)<(that.maxPosition+distance)
                &&
                (that.currPosition-that.movePosition)>(that.minPosition -distance)){
                that._removeTransition();
                that._changeTranslate(that.currPosition-that.movePosition);
            }
        },false);
        window.addEventListener('touchend',function(e){
            /*在限制滑动区间之后 重新计算当前定位*/
            /*判断是否在我们的合理定位区间内*/
            /*先向下滑动 */
            if((that.currPosition-that.movePosition) > that.maxPosition){
                that.currPosition = that.maxPosition;
                that._addTransition();
                that._changeTranslate(that.currPosition);
            }
            /*想上滑动的时候*/
            else if((that.currPosition-that.movePosition) < that.minPosition){
                that.currPosition = that.minPosition;
                that._addTransition();
                that._changeTranslate(that.currPosition);
            }
            /*正常的情况*/
        else{
                that.currPosition = that.currPosition-that.movePosition;
            }
            that._reset();
        },false);

    },
    _reset:function(){
        var that = this;
        that.startPosition = 0;
        that.endPosition = 0;
        that.movePosition = 0;
    }
};