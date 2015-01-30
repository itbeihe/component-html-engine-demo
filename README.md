# component-html-engine-demo

一说前端工程，不可避免会跟模块化，组件话搭上关系。最近在重构公司一个项目的前端部分，对前端的工程化也有一些心得。

html在组件话过程中是个特殊的东西，这篇文章就记录下，组件话时候对html处理的一些心得。

#### 组件html和javascript前后端分离维护

那时还是一名前端小菜，html代码是写在后端模板上的，前端写完demo，后端工程师还要把demo转到后端模板上。组件的html变动在一个前后端分离的公司，是一件比较恶心的事情。

于是越来越多的前端开始尽可能的把html写入到js文件中。

### html写在js中

```
var TabBox = function(){
};

TabBox.prototype = {
	constructor:TabBox,
	init:function(target){
		this.html = '<div class="tabbox">'+
					'<ul class="tab-nav">'+
						'<li></li>'+
						'<li></li>'+
					'</ul>'+
					'<div class="content"></div>'+
					'<div class="content"></div>'+
				'</div>';
		target.innerHtml = this.html;
	}
}
```
组件html更新的时候终于不用麻烦后端同学了，发布上线也更快了。解决了合作问题。但新的问题来了。
js拼写html字符串太操蛋了。。。注重格式的同学拼起来上面的html字符串就是折磨人（IDEA系的同学比其余编辑器同学尚且舒服些)，无法emmet编写，没有代码格式支持，不手工排版就是一场穿，手工排版又恶心，量一大一不小心就闭合错误。

又过了一段时间，随着nodejs的出现和流行，前端工程师手中出现了一把大锤，传说级别的大锤。前段攻城狮们颇有一种“nodejs在手，天下我有”的气魄，各种前端工具频繁出现，uglifyjs，jshint，gurnt，bower，gulp 等等。随之而来的就是前端工程化。工具在手，组件的处理，我们又可以进一步了。

### 前端组件html模板话
我们的目标是什么呢？方便的写html。这里就要把html的编写从js里剥离出来。
我把例子放到github上了，参照着看更容易理解
既然组件话了，我们首先对组件有个约定，首先存放在什么文件夹下，命名规范，书写规范。
比如这样的结构。
```
src
|---- ccomponent
        |---- tabbox
                |---- main.js
                |---- main.tpl
                |---- main.css
                |---- img         //图片目录
```
我们定义了ccomponent 为自有组件目录，每个组件，都可包含js，tpl模板，css文件和其余静态资源。现在问题来了，如何把tpl转变成js呢？
这时候该构建工具和他的小伙伴出场了。实现目的的方案有多种，这里我介绍下我们实现的方案。
依赖工具：
1.gulp             // 流处理构建工具
2.[gulp-tpl2mod](https://github.com/supersheep/gulp-tpl2mod)   // 模板文件转js插件
3.requirejs      // amd加载器(非必须，可以使全局空间更干净)
原理：
先使用gulp-tpl2mod把模板转换成js字符串，然后包装成一个模块，再main.js中引用这个模块就行了。

main.tpl内容
```
<div class="tabbox">
    <ul class="tab-nav">
        <li></li>
        <li></li>
    </ul>
    <div class="content"></div>
    <div class="content"></div>
</div>
```
tpl2mod 配置
```
gulp.task('tpl',function(){
    var componentName = "TabBox";        // 这里名字肯定有个生成规范的，demo我偷懒了。懒得扫描目录做拼合了。～ ～
    gulp.src('src/ccomponent/'+componentName+'/*.tpl').pipe(tpl2mod({
        prefix: 'define("'+ componentName +'.tpl",function(){return ',
        suffix: '});'
    }))
    .pipe(rename(componentName+'.tpl.js'))
    .pipe(gulp.dest('src/ccomponent/'+componentName+'/'))
});
```
处理后就变成了
```
define("TabBox.tpl",function(){return '<div class="tabbox"><ul class="tab-nav"><li></li><li></li></ul><div class="content"></div><div class="content"></div></div>'});
```
main.js中我们就可以这么引用这个模板了。
```
define('TabBox',['TabBox.tpl'],function(tpl){
    console.log(tpl);
});
```
tpl文件不仅仅用来写html，还可以引入ejs，mustache等模板引擎。

### 尾巴
到这功能基本基本够用了，组件的html不涉及后端，自己写起来也不那么痛苦。组件中的html还是容易剥离的，业务上的html就难剥离了，把业务工程师改成全栈工程师就不用太在乎这问题了。

