# echarts-china-map-demo

> 版权声明：本文为博主原创文章，未经博主允许不得转载。 文章底部留言可联系作者。

# 一、背景

我们可以看到有些场景需要用地图来展示数据，做地理区域数据的可视化，比如想看全国人口分布情况等。那具体怎么实现呢，我们可以利用[echarts](https://echarts.apache.org/zh/index.html)来进行实现。

# 二、地图实现

主要参考官方示例地图[2021 年美国人口统计](https://echarts.apache.org/examples/zh/editor.html?c=map-usa)这个示例进行开发。

## 1.安装 echarts

```js
npm install echarts --save
```

## 2.引入 echarts

引入 echarts 后，基于准备好的 dom，初始化 echarts 实例。

```js
import * as echarts from 'echarts';

export default function App() {
  const ref = useRef(null);
  let mapInstance = null;

  const renderChart = () => {
    ...
    // 基于准备好的dom，初始化echarts实例
    mapInstance = echarts.init(ref.current);
    mapInstance.setOption({
        ...
    })
    ...
  };

  useEffect(() => {
    renderChart();
  }, []);

  ...

  return (
    <div>
      <div style={{ width: "100%", height: "100vh" }} ref={ref}></div>
    </div>
  );
}
```

## 3.使用 echarts.registerMap 注册可用地图

通过官方示例[2021 年美国人口统计](https://echarts.apache.org/examples/zh/editor.html?c=map-usa)发现使用 [echarts.registerMap](https://echarts.apache.org/zh/api.html#echarts.registerMap)方法，查看 API 发现 这个方法是用来注册可用的地图，只在  [geo](https://echarts.apache.org/zh/option.html#geo)  组件或者  [map](https://echarts.apache.org/zh/option.html#series-map)  图表类型中才能使用。我们这里使用的是[map](https://echarts.apache.org/zh/option.html#series-map)图表类型。

**并且还需要注意文档中说明的一点：**

> registerMap 和 getMap 方法需要在引入地图组件后才能使用
> 为了减少最小打包的体积，我们从核心模块中移除了地图数据管理的方法`getMap`和`registerMap`。
> 如果你是[按需引入](https://echarts.apache.org/handbook/zh/basics/import/#%E6%8C%89%E9%9C%80%E5%BC%95%E5%85%A5-echarts-%E5%9B%BE%E8%A1%A8%E5%92%8C%E7%BB%84%E4%BB%B6) ECharts 组件的话，需要保证先引入了`GeoComponent`或者`MapChart`之后，才能使用`registerMap`注册地图数据。

```js
import * as echarts from "echarts/core";
import { MapChart } from "echarts/charts";

echarts.use([MapChart]);

// 必须在使用 use 方法注册了 MapChart 后才能使用 registerMap 注册地图
echarts.registerMap("world", worldJSON);
```

> 如果你是使用`import * as echarts from 'echarts'`全量引入，这次改动不会对你产生任何影响。

### 1）echarts.registerMap 方法参数介绍

使用[echarts.registerMap](https://echarts.apache.org/zh/api.html#echarts.registerMap)方法，首先看一下它需要传的参数有哪些：

![echarts.registerMap参数.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2051c4f94edd4344adc8addd91404a4f~tplv-k3u1fbpfcp-watermark.image?)

这里我们使用的是`geoJSON`。

### 2）下载`geoJSON`地图数据

现在`echarts`库不再自带地图，所以地图的数据需要我们自己下载。我这里提供两个渠道：

- [echarts-map-data 库](https://github.com/cj0x39e/echarts-map-data)，包含包含 JS 与 GeoJSON 格式的地图数据，但是这个库已经不维护了所以还是推荐下面这个
- 推荐使用[阿里云 DataV](https://datav.aliyun.com/portal/school/atlas/area_selector) 的工具下载相关地图数据，我使用的就是这个。
- 也可以使用[geojson.io](http://geojson.io/)直接自己绘制需要的地图获取`geoJSON`数据，自由度更大

通过是 [阿里云 DataV](https://datav.aliyun.com/portal/school/atlas/area_selector) 下载了中国地图的`geoJSON`数据存放到本地。

### 3）注册地图

- `mapName` 这里命名为 `china`
- `opt` 参数是个对象，我们使用 `geoJSON`，把下载到本地`geoJson`数据引入

```js
import { geoJson } from "./geojson";

...
// 注册
echarts.registerMap("china", { geoJSON: geoJson });
```

到此一个中国地图其实就可以简单的做一个呈现了。

![地图实现效果.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2516b9a1bd0412c9e354849f99891d2~tplv-k3u1fbpfcp-watermark.image?)

但具体在初始化得到 echarts 示例后所使用[echartsInstance.setOption](https://echarts.apache.org/zh/api.html#echartsInstance.setOption)方法具体有哪些内容，下面我们来继续讲解。

## 4.echartsInstance.setOption 的使用

首先看 API 中关于参数的一些调用示例：

![echartsInstance.setOption参数.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b363f0138b694f77a12d094dc364209d~tplv-k3u1fbpfcp-watermark.image?)

**这里主要使用到的是这个：[setOption 的配置项手册](https://echarts.apache.org/zh/option.html#title)**

![图形界面对应setOption的配置项.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79126717e94f4038a031a6528ae8f924~tplv-k3u1fbpfcp-watermark.image?)

上图标记的是我们当前地图中主要使用的 setOption 的配置项。

### 1）[title](https://echarts.apache.org/zh/option.html#title) 标题组件

这里主要对于主标题(`text`)进行设置和样式位置的修改。
还可以进行副标题(`subtext`)的设置

```js
title: {
    // 标题组件
    text: "数据地图", // 主标题文本
    // subtext: '数据来源于 xx平台', // 副标题文本
    // sublink: 'http://xxx.html', // 副标题文本超链接
    left: "right", // title 组件离容器左侧的距离,如果值为`'left'`, `'center'`, `'right'`，组件会根据相应的位置自动对齐。
    textStyle: {
        color: "#000" // 主标题文字的颜色
    }
}
```

### 2）[visualMap](https://echarts.apache.org/zh/option.html#visualMap) 视觉映射组件

`visualMap`  是视觉映射组件。可以定义为  [分段型（visualMapPiecewise）](https://echarts.apache.org/zh/option.html#visualMap-piecewise)  或  [连续型（visualMapContinuous）](https://echarts.apache.org/zh/option.html#visualMap-continuous)，通过  `type`  来区分。这里我们使用的是连续型(`type: 'continuous'`)

下面根据渐变提供了两种渐变色 `color` 数组，可以根据喜欢选取。

```js
visualMap: {
    // 视觉映射组件
    type: "continuous", // 连续型
    left: "right", // visualMap 组件离容器左侧的距离,值为`'left'`, `'center'`, `'right'`，组件会根据相应的位置自动对齐。
    min: 0,        // 指定允许的最小值
    max: max,      // 指定允许的最大值,这里进行动态设置
    inRange: {     // 定义 **在选中范围中** 的视觉元素
        // 图元的颜色
        // 这里以这数组所填写的颜色点作为基准，形成一种『渐变』的色带，数据映射到这个色带上
        color: [ // 橘色效果
            "#fff",
            "#fedeb5",
            "#f96a35",
            "#c3380e",
            "#942005"
        ]
       // color: [ // 蓝色效果
       //     '#e5f7ff',
       //     '#096dd9',
       // ]
    },
    text: [`最大值：${max}`, 0],  // 两端的文本,如 `['High', 'Low']`
    textStyle: {
        color: "#000" // visualMap 文字的颜色。
    }
},
```

### 3）[toolbox](https://echarts.apache.org/zh/option.html#toolbox) 工具栏

内置有[导出图片](https://echarts.apache.org/zh/option.html#toolbox.feature.saveAsImage)，[数据视图](https://echarts.apache.org/zh/option.html#toolbox.feature.dataView)，[动态类型切换](https://echarts.apache.org/zh/option.html#toolbox.feature.magicType)，[数据区域缩放](https://echarts.apache.org/zh/option.html#toolbox.feature.dataZoom)，[重置](https://echarts.apache.org/zh/option.html#toolbox.feature.reset)五个工具。如下图所示部分功能：

![工具栏.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26747bd131ee46cfab660823dc9c99a6~tplv-k3u1fbpfcp-watermark.image?)

```js
toolbox: {
    // 工具导航
    show: true, // 是否显示工具栏组件。
    //orient: 'vertical', // 工具栏 icon 的布局朝向。
    left: "left",         // 工具栏组件离容器左侧的距离
    top: "top",           // 工具栏组件离容器上侧的距离
    feature: {   // 各工具配置项
        // dataView: { readOnly: false }, // 数据视图工具，可以展现当前图表所用的数据，编辑后可以动态更新。
        restore: {},     // 配置项还原
        saveAsImage: {}  // 保存为图片
    }
},
```

### 4）[tooltip](https://echarts.apache.org/zh/option.html#tooltip)提示框组件

提示框组件可以设置在多种地方，这里是设置在全局。鼠标悬浮到地图上显示的提示框就是通过这个属性进行设置的。

- `trigger` 触发类型，有三种：
  - `item` 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
  - `axis` 坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用
  - `none` 什么都不触发。

```js
tooltip: {
    // 提示框
    trigger: "item", // 触发类型
    showDelay: 0, // 浮层显示的延迟，单位为 ms，默认没有延迟，也不建议设置。
    transitionDuration: 0.2, // 提示框浮层的移动动画过渡时间，单位是 s，设置为 0 的时候会紧跟着鼠标移动。
    formatter: function (params) { // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
        let { data = {} } = params; // 第一个参数 `params` 是 formatter 需要的数据集
        let { value = 0 } = data;  // 传入的数据值
        // params.name 数据名，类目名
        return `${params.name}<br/>个数: ${value}`;
    }
},
```

### 5）[series-map](https://echarts.apache.org/zh/option.html#series-map) 地图

地图主要用于地理区域数据的可视化，配合  [visualMap](https://echarts.apache.org/zh/option.html#visualMap)  组件用于展示不同区域的人口分布密度等数据。

```js
series: {
    // 地图,可以是数组，多个
    type: "map",
    map: "china", // 使用 registerMap 注册的地图名称
    label: { // 图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等。
        show: true, //显示省市名称
        position: [1, 100], // 相对的百分比
        fontSize: 12,
        offset: [2, 0], // 是否对文字进行偏移。默认不偏移。例如：`[30, 40]` 表示文字在横向上偏移 `30`，纵向上偏移 `40`。
        align: "left" // 文字水平对齐方式，默认自动。
    },
    itemStyle: { // 地图区域的多边形 图形样式
        areaColor: "#fff" // 地图图形颜色
    },
    roam: true, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 `'scale'` 或者 `'move'`。设置成 `true` 为都开启
    zoom: 1.2, // 当前视角的缩放比例
    scaleLimit: { // 滚轮缩放的极限控制，默认的缩放为`1`
        max: 2, // 最大的缩放值
        min: 1  // 最小的缩放值
    },
    top: "10%" // 距离顶部距离
}
```

#### **这里主要对参数 `data`和 `nameMap` 做个说明：**

##### 1. [data](https://echarts.apache.org/zh/option.html#series-map.data) 地图系列中的数据内容数组，具体使用如下图：

    我们可以直接给`data`赋值我们获取的地图数据。当然也可以通过[dataset](https://echarts.apache.org/zh/option.html#dataset)来设置，效果是一样的。

```js
series: {
    ...
    data: [
      { name: "内蒙古", value: 1000 },
      { name: "北京", value: 700 },
      { name: "河北", value: 30 },
      { name: "江苏", value: 400 },
      { name: "西藏", value: 200 }
    ]
 }
```

效果图：

![data设置效果图.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db16bb360f0a429c9e963c7631509f72~tplv-k3u1fbpfcp-watermark.image?)

##### 2. [nameMap](https://echarts.apache.org/zh/option.html#series-map.nameMap) 自定义地区的名称映射

```js
series: {
    ...
    nameMap:{
        '北京':'Beijing',
        '内蒙古':'NeiMengGu',
    },
 }
```

设置 **北京和内蒙古** 后的效果图如下：
![nameMap效果图.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c9fd65dd2a44f76ab90467303209394~tplv-k3u1fbpfcp-watermark.image?)

**注意：**
这里的 “北京”、“内蒙古” 是关联的 GeoJSON 数据的要素中 `name` 字段进行映射的。
如果写成 “北京市” 这样就映射失败了。

![geojson数据部分显示.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fba5e88cecda423b96cc63130b0cacbc~tplv-k3u1fbpfcp-watermark.image?)

##### 3. [nameProperty](https://echarts.apache.org/zh/option.html#series-map.nameProperty)

`nameProperty`从  `v4.8.0`  开始支持, 默认是  `'name'`，针对 GeoJSON 要素的自定义属性名称，作为主键用于关联数据点和 GeoJSON 地理要素。例如：

我把 `nameProperty` 设置为 `'adcode'`，是省市的 code。地图显示的省市名称都变成 code 值了

```json
// GeoJSON数据
{
    "type":"Feature",
    "properties":{
        "adcode": 110000,
        "name": "北京"
    },
    "geometry": { ... }
}
```

我用 `nameMap` 对省市名称和 `adcode` 值做了个映射。数据点中的 `name：北京`的数据就又可以显示在图表上了。

```js
series: {
    ...
    nameMap:{
        110000: "北京",
        130000: "河北",
        150000: "内蒙古"
    },
    nameProperty:'adcode',
    data: [
        { name: "内蒙古", value: 1000 },
        { name: "北京", value: 700 },
        { name: "河北", value: 30 },
    ],
 }
```

效果图如下：

![效果图.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33a8fc745a4b486cbbbbeef7e4c4bfcc~tplv-k3u1fbpfcp-watermark.image?)

### 6）[dataset](https://echarts.apache.org/zh/option.html#dataset) 数据集组件

`数据集`（`dataset`）组件用于单独的数据集声明，从而数据可以单独管理，被多个组件复用，并且可以自由指定数据到视觉的映射。这在不少场景下能带来使用上的方便。

关于  `dataset`  的详情，请参见[教程](https://echarts.apache.org/handbook/zh/concepts/dataset)。

```js
dataset: {
    source: data // 原始数据
},
```

## 三、地图代码优化

上面把地图实现之后，这一步对于一些地方做一些优化

### 1. 实现一个 renderMap 函数

通过 `echarts.getInstanceByDom` 获取 dom 容器上的实例。如果已经有了就不需要再重新执行 `echarts.init` 进行初始化了，可以直接使用已经初始化好的 echarts 实例。

```js
...
const ref = useRef(null);
let mapInstance = null;

const renderMap = () => {
    const renderedMapInstance = echarts.getInstanceByDom(ref.current);
    if (renderedMapInstance) {
      mapInstance = renderedMapInstance;
    } else {
      mapInstance = echarts.init(ref.current);
    }
    mapInstance.setOption(
      ...
    );
};
...

return (
    <div>
        <div style={{ width: "100%", height: "99vh" }} ref={ref}></div>
    </div>
);
```

### 2.利用`echartsInstance.resize`改变图表尺寸

我们当改变窗口大小的时候想让图表也自适应改变大小，可以利用[echartsInstance.resize](https://echarts.apache.org/zh/api.html#echartsInstance.resize)
改变图表尺寸，在容器大小发生改变时需要手动调用。

```js
...
useEffect(() => {
    window.onresize = function () {
      // 调用 echarts实例上 resize 方法
      mapInstance.resize();
    };
    return () => {
      // 销毁实例，销毁后实例无法再被使用。
      mapInstance && mapInstance.dispose();
    };
}, []);
...
```

[以上代码 demo 请点击查看](https://codesandbox.io/s/zhong-guo-di-tu-fen-bu-shu-ju-xian-shi-gzpbm)

# 参考文献

- [echarts-map-data 库](https://github.com/cj0x39e/echarts-map-data)
- [阿里云 DataV](http://datav.aliyun.com/portal/school/atlas/area_selector)
- [echarts 官方文档](https://echarts.apache.org/zh/index.html)
