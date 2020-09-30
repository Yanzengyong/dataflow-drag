<!--
 * @Description: 
 * @Version: 
 * @Author: Yanzengyong
 * @Date: 2020-09-04 22:55:05
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-09-30 11:37:49
-->
# 基于jsplumb和react-dnd的流程拖拽组件

> 目前为1.0版本，未发布npm；后续也会进行更多功能的补充，建议fork或clone使用

### 当前已有功能

- [x] 分区拖拽
- [x] 点击执行进行状态更改
- [x] 连线hover删除
- [x] 记住节点及关系

## 预览

[预览地址](http://167.179.81.55/dragflow)

![avatar](https://raw.githubusercontent.com/Yanzengyong/dataflow-drag/master/public/example.png)

## 使用

### 例子

```jsx

// index.js

import React from 'react'
import {
  FlowContainer,
  NodeList,
  DropBox,
  DropBoxFn,
  DragGroup, 
  DragItem
} from './DragFlow'

import DropItem from './dropItem' // 自定义放置组件
import DragItemComponent from './dragItem' // 自定义拖拽组件

import './index.css'
/**
 * DropBoxFn(type, Component)
 * @param type 放置区域的type
 * @param Component 放置区域的自定义节点
 */
const DropItemBox = DropBoxFn('A', DropItem)
const DropItemYzy = DropBoxFn('B', DropItem)

class FlowExample extends React.Component {
  flowRef = React.createRef();
  state = {
    dropBoxBoxRange: {
      minX: 200,
      maxX: 800,
      minY: 0,
      maxY: 900
    },
    DragList: [
      { type: 'A', id: 'box-type-fn1', title: 'A功能组件1', status: 'normal' }
      { type: 'A', id: 'box-type-fn2', title: 'A功能组件2', status: 'normal' }
    ]
  }

  // jsplumb配置
  CreateInstanceConfig = {
    Connector: 'Flowchart',
    Endpoint: 'Dot',
    EndpointStyle: {
      stroke: 'yellowgreen', 
      strokeWidth: 1,
      fill: '#fff',
      radius: 4
    },
    ConnectionOverlays: [
      ['Arrow', {
        width: 10,
        length: 10,
        location: 1
      }],
      ["Custom", {
        create: () => {
          const ElementDiv=document.createElement("div")
          console.log(ElementDiv)
          ElementDiv.classList.add('connectDelete')

          ElementDiv.innerText = 'X'
          return ElementDiv
        },
        location: 0.5,
        id: "custom-delete",
        events:{
          click: (labelOverlay, originalEvent) => { 
            const { current } = this.flowRef
            const { ref } = current
            ref.current.deleteConnectHandle(labelOverlay)
          }
        }
      }],
    ]
  }

  render () {
    const {
      DragList_A,
      dropBoxBoxRange,
    } = this.state

    return (
      <FlowContainer
        ref={this.flowRef}
        config={this.CreateInstanceConfig}
      >
        <NodeList 
          className='dragNodeListBox'
          backgroundstyle='#e8fdff'
        >
            {
              DragList_A.map((item) => {
                return (
                  <DragItem 
                    dragItemNode={DragItemComponent}
                    key={item.id} 
                    type={item.type} 
                    info={item}
                  />
                )
              })
            }
        </NodeList>
        <DropBox className='dropBox'>
          <DropItemBox 
            dropBoxClassName='dropBoxContainer'
            onExecuteHandle={this.onExecuteHandle}
            onSettingHandle={this.onSettingHandle}
            id='dropBox-box'
            type='A' 
            range={dropBoxBoxRange} 
          />
      </FlowContainer>
    )
  }
}

```

```css
/* index.css */
.dragNodeListBox{
  width: 200px;
  height: 100%;
  box-sizing: border-box;
  padding: 20px 16px;
}
.dropBox{
  width: calc(100% - 200px);
  height: 100%;
  background-color:#c8eef7;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.dropBoxContainer{
  width: 50%;
  height: 100%;
  border: 1px dashed #fff;
}
.connectDelete{
  width: 16px;
  height: 16px;
  background-color: red;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #fff;
  cursor: pointer;
}
```

### 参数


> FlowContainer 必须组件，包裹其他功能组件

| 参数名称    | 参数描述                                                  | 参数类型 | 默认值 |
| ---------- | ------------------------------------------------------- | -------- | ------ |
| ref        | 通过ref获取公共功能，例如删除连接，顺序执行                    | Object    | -   |
| config     | drop组件配置，包括连线颜色、锚点等                           | Object    | -   |

<br />

> NodeList 非必须组件，但必须与DragItem搭配使用

| 参数名称    | 参数描述                                                  | 参数类型 | 默认值 |
| ---------- | ------------------------------------------------------- | -------- | ------ |
| className  | className                                                | Sring    | -     |
| backgroundstyle | 侧边栏背景值，等于background                            | Sring    | -     |


<br />

> DragGroup 非必须组件，与NodeList和DragItem搭配使用，关系是NodeList > DragGroup > DragItem

| 参数名称    | 参数描述                                                  | 参数类型 | 默认值 |
| ---------- | ------------------------------------------------------- | -------- | ------ |
| title      | 名称                                                     | Sring  | -  |


<br />

> DragItem 必须组件

| 参数名称    | 参数描述                                                  | 参数类型 | 默认值 |
| ---------- | ------------------------------------------------------- | -------- | ------ |
| dragItemNode  | 自定义拖拽组件                                          | ReactNode | -   |
| type  | 拖拽组件type，需和drop的type值对应                                | Sring | -   |
| info  | 拖拽组件信息，可自定义，但必须包含id和title                         | Object | -   |


<br />

> DropBox 必须组件，与DropBoxFn的返回值搭配使用

| 参数名称    | 参数描述                                                  | 参数类型 | 默认值 |
| ---------- | ------------------------------------------------------- | -------- | ------ |
| className  | className                                                | Sring    | -     |

<br />

> DropBoxFn 必须组件，DropBoxFn的返回值即为需要写入render的组件
**DropBoxFn需要传入两个值，第一个值为与DragItem对应type值，只有值相同才可以被放置；第二个值为自定义的放置节点**

| 参数名称    | 参数描述                                                  | 参数类型 | 默认值 |
| ---------- | ------------------------------------------------------- | -------- | ------ |
| dropBoxClassName | 放置区域的className                                 | Sring   | -      |
| id  | 必须值，具体值可以自定义，用于设置放置后节点可以移动的范围               | String   | -      |
| type | 必须值，需要和DropBoxFn的第一个值一致                              | String    | -     |
| title  |  放置区域的名称                                                | String    | -     |
| showTitle |  是否显示放置区域                                           | Boolean    | -    |
| range |  区域的视口的范围值                                             | Object    | -    |
| ...customProps |  DropBoxFn第二个值（组件）的props会被继承，这里可以根据自定义的组件传入所需的值 | -   | -    |


