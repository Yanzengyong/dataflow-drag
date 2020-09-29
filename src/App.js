/*
 * @Description: 
 * @Version: 
 * @Author: Yanzengyong
 * @Date: 2020-09-24 10:24:26
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-09-29 17:34:01
 */
import React from 'react'
import {
  FlowContainer,
  NodeList,
  DropBox
} from './DragFlow'
import { DropBoxFn } from './DragFlow/drop'
import { DragGroup, DragItem } from './DragFlow/drag'
import DropItem from './dropItem'
import ComponentItem from './dragItem'
import './app.css'

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
    dropBoxBoxRange: {},
    dropBoxYzyRange: {},
    DragList_A: [
      { type: 'A', id: 'box-type-fn1', title: '我是A功能组件1', status: 'normal' },
      { type: 'A', id: 'box-type-fn2', title: '我是A功能组件2', status: 'normal' },
      { type: 'A', id: 'box-type-fn3', title: '我是A功能组件3', status: 'normal' }
    ],
    DragList_B: [
      {type: 'B', id: 'yzy-type-fn1', title: '我是B功能组件1'},
      {type: 'B', id: 'yzy-type-fn2', title: '我是B功能组件2'},
      {type: 'B', id: 'yzy-type-fn3', title: '我是B功能组件3'}
    ],
  }

  // jsplumb配置
  CreateInstanceConfig = {
    Connector: 'Flowchart',
    ConnectorStyle: {
      stroke: '#49b4f3',
      strokeWidth: 2,
    },
    ConnectorHoverStyle: {
      stroke: '#f3992a',
      strokeWidth: 4,
    },
    Endpoint: 'Dot',
    EndpointStyle: {
      stroke: 'yellowgreen', 
      strokeWidth: 1,
      fill: '#fff',
      radius: 4, // 蓝色圆点调试大小
    },
    PaintStyle: {
      stroke: '#49b4f3',
      strokeWidth: 1.5,
    },
    HoverPaintStyle: { 
      stroke: '#f3992a',
      strokeWidth: 1.5,
    },

    ConnectionOverlays: [
      ['Arrow', {
        width: 10,
        length: 10,
        location: 1
      }],
      ["Custom", {
        create: () => {
          const ElementImg = document.createElement("img")

          ElementImg.classList.add('line_close_icon')

          ElementImg.setAttribute('src','images/close.png')

          return ElementImg

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

  componentDidMount() {
    this.setDropBoxRange()
  }

  // 设置放置盒子的边界
  setDropBoxRange = () => {
    const dropBoxBoxDiv = document.querySelector(`#dropBox-box`)
    const dropBoxYzyDiv = document.querySelector(`#dropBox-yzy`)
 
    const dropBoxBoxX = dropBoxBoxDiv.offsetWidth
    const dropBoxBoxY = dropBoxBoxDiv.offsetHeight
    const dropYzyBoxX = dropBoxYzyDiv.offsetWidth
    const dropYzyBoxY = dropBoxYzyDiv.offsetHeight
    /**
     * x方向的最小值为dragnodelist的盒子宽度
     * x方向的最大值为dragnodelist的盒子宽度 + dropbox的盒子宽度 - dropItem的宽度
     * 
     */
    this.setState({
      dropBoxBoxRange: {
        minX: 200,
        maxX: dropBoxBoxX + 200 - 160,
        minY: 0,
        maxY: dropBoxBoxY
      },
      dropBoxYzyRange: {
        minX: 200 + dropBoxBoxX,
        maxX: dropBoxBoxX + dropYzyBoxX + 200 - 160,
        minY: 0,
        maxY: dropYzyBoxY
      }
    })
  }
  
  onSettingHandle = (dropId, dragInfo) => {
    console.log('我点击了设置按钮', dropId, dragInfo)
    alert('我点击了设置')
  }

  onExecuteHandle = (dropId, dragInfo) => {
    console.log('我点击了执行按钮', dropId, dragInfo)
    const { current } = this.flowRef
    const { ref } = current
    
    setTimeout(() => {
      ref.current.reviseStatusHandle(dropId, 'loading')
    }, 1000)
    setTimeout(() => {
      const currentConnection = ref.current.reviseStatusHandle(dropId, 'success')

      if (currentConnection && currentConnection.targetId) {
        this.onExecuteHandle(currentConnection.targetId)
      }
    }, 6000)

  }

  render () {
    const {
      DragList_A,
      DragList_B,
      dropBoxBoxRange,
      dropBoxYzyRange
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
          <DragGroup title='我是A类型的组件'>
            {
              DragList_A.map((item) => {
                return (
                  <DragItem 
                    dragItemNode={ComponentItem}
                    key={item.id} 
                    type={item.type} 
                    info={item}
                  />
                )
              })
            }
          </DragGroup>
          <DragGroup title='我是B类型的组件'>
            {
              DragList_B.map((item) => {
                return (
                  <DragItem 
                    dragItemNode={ComponentItem}
                    key={item.id} 
                    type={item.type} 
                    info={item}
                  />
                )
              })
            }
          </DragGroup>
        </NodeList>
        <DropBox className='dropBox'>
          <DropItemBox 
            dropBoxClassName='dropBoxContainer'
            onExecuteHandle={this.onExecuteHandle}
            onSettingHandle={this.onSettingHandle}
            id='dropBox-box'
            type='A' 
            title='我是A类型的接收区'
            range={dropBoxBoxRange} 
          />
          <DropItemYzy 
            dropBoxClassName='dropBoxContainer'
            onExecuteHandle={this.onExecuteHandle}
            onSettingHandle={this.onSettingHandle}
            id='dropBox-yzy' 
            type='B' 
            title='我是B类型的接收区'
            range={dropBoxYzyRange} 
          />
        </DropBox>
      </FlowContainer>
    )
  }
}

export default FlowExample
