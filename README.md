# Tswipe

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
自己封装的移动端滑动插件，虽然没有像开源的插件那么牛，不过毕竟是原生自己写的.在小项目下还是可以用的。

详情请查看tswipeDemo.html

