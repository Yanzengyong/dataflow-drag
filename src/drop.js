/*
 * @Descripttion: 
 * @version: 
 * @Author: Yanzengyong
 * @Date: 2020-09-01 16:51:42
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-09-09 23:27:23
 */
import React from 'react'
import { DropTarget } from 'react-dnd'
import './newDrag.css'
import DropItem from './dropItem'
import ConsumerRegister from './ConsumerRegister'


class DefaultDropContainer extends React.Component{

	state = {
		boxList: []
  }
  

	static getDerivedStateFromProps(props, state) {
    // 解构props
    const { currentStatusDropItem, lastDropNode, nodeList } = props
    console.log(nodeList, lastDropNode)
    // 解构最后一次放下的dropItem
    const { dropId: lastDropId,  dropType: lastDropType } = lastDropNode
    // 解构当前传入的存在状态的dropItem
    const { dropId: statusDropId, dropType: statusDropType } = currentStatusDropItem
    // 该组件容器初始化定义的type
    const boxType = props.type
    // 判断lastDropItem是否已经存在组件中的boxlist
    const lastDropIsHave = state.boxList.findIndex((item) => item.dropId === lastDropId)
    // 判断statusDropItem是否已经存在组件中的boxlist
    const statusDropIsHave = state.boxList.findIndex((item) => item.dropId === statusDropId)
    // 上一次的statusDropItem
    const prevStatusDrop = state.boxList.find((item) => item.dropId === statusDropId)
    // 上一次的statusDropItem的stauts值
    const prevStatusDropValue = prevStatusDrop ? prevStatusDrop.status : null
    // 最新的statusDropItem的stauts值
    const statusDropValue = currentStatusDropItem ?
    currentStatusDropItem.status : null
    // 新增dropItem 判断：不存在该dropId
    // if (lastDropIsHave === -1 && boxType === lastDropType) { 
    //   return {
    //     boxList: [
    //       ...state.boxList,
    //       {...props.lastDropNode}
    //     ]
    //   }
    // } 
    // 在所有的nodelist中筛选出该组件类型的列表
    const newBoxList = nodeList.filter((item) => item.dropType === boxType)
    if (newBoxList.length !== state.boxList.length) {
      return {
        boxList: newBoxList
      }
    }

    /**
     * 为已经存在的dropItem添加状态
     * 判断：
     * 1.该dropId是否存在于boxlist中,需存在
     * 2.该容器类型和传入的类型是否一样
     * 3.上一次传入的状态和最新状态是否一样
     * 
     */
    if (statusDropIsHave !== -1 && boxType === statusDropType && prevStatusDropValue !== statusDropValue) {

      const newBoxList = state.boxList.map((item) => {
        if (item.dropId === currentStatusDropItem.dropId) {
          return {
            ...item,
            status: currentStatusDropItem.status
          }
        } else {
          return item
        }
      })

      return {
        boxList: newBoxList
      }
      
    }

		return null
  }
  
  componentDidMount() {
    const { deleteConnectHandle } = this.props

		this.common = {
			isSource: true,
			isTarget: true,
      connector: 'Flowchart',
      endpoint: 'Dot',
      paintStyle: {
        stroke: 'yellowgreen', 
        strokeWidth: 1,
        fill: '#fff',
        radius: 4, // 蓝色圆点调试大小
      },
      hoverPaintStyle: { 
        fill: 'yellowgreen'
      },
      connectorStyle: {
        stroke: '#49b4f3',
        strokeWidth: 2,
      },
      connectorHoverStyle: {
        stroke: '#f3992a',
        strokeWidth: 4,
      },
      connectorOverlays: [
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
              deleteConnectHandle(labelOverlay)
            }
          }
        }],
      ]
    }
  
  }
  
  componentDidUpdate(prevProps, PrevState) {
    const { boxList } = this.state

		if (boxList.length > 0) {
			const newNode = boxList.find((item) => {
				if (PrevState.boxList.length === 0 || !PrevState.boxList.some((ite) => ite.dropId === item.dropId)) {
					return item
				}
      })
      console.log('newNode===', newNode)

			if (newNode) {
        this.createJsplumbNode(newNode)
			}
		}

  }
  
  // 创建jsplumb节点
  createJsplumbNode = (node) => {
    const { JsPlumbInstance, id } = this.props
    // 创建节点
    JsPlumbInstance.addEndpoint(node.dropId, {
      anchors: 'Top'
    }, this.common)
    JsPlumbInstance.addEndpoint(node.dropId, {
      anchor: 'Right'
    }, this.common)
    JsPlumbInstance.addEndpoint(node.dropId, {
      anchor: 'Bottom'
    }, this.common)
    JsPlumbInstance.addEndpoint(node.dropId, {
      anchor: 'Left'
    }, this.common)

    // 移动固定在该盒子区域
    JsPlumbInstance.draggable(node.dropId, {
      containment: id
    })
  }

  render() {

    const { id, title, canDrop, isOver, connectDropTarget } = this.props
		const isActive = canDrop && isOver
    const { boxList } = this.state

		return connectDropTarget && connectDropTarget(
			<div className='dropBox_container_new'>
				<div className='dropBox_new' id={id} style={isActive ? {backgroundColor: '#ccc'} : null}>
					{isActive ? '可以放置' : title}
          {
            boxList.map((item) => (
              <DropItem key={item.dropId} {...item} {...this.props}/>
            ))
          }
				</div>
			</div>
		)
  }
}

const DropBoxFn = (type) => {

  return ConsumerRegister(
    DropTarget(
      type,
      {
        // 当有对应的 drag source 放在当前组件区域时，会返回一个对象，可以在 monitor.getDropResult() 中获取到
        drop: (props, monitor, component) => {
          const { range } = props
          const { minX, minY } = range ?? {}
          const getSourceClientOffset = monitor.getSourceClientOffset()
          const ItemInfo = monitor.getItem()

          const position = {
            x: getSourceClientOffset.x - minX,
            y: getSourceClientOffset.y - minY,
          }
   
          return {
            dropType: props.type,
            position: position,
            dragType: ItemInfo.type,
            dropId: ItemInfo.dropId,
            dragInfo: ItemInfo.info
          }
        },
        canDrop: (props, monitor, component) => {
          const getSourceClientOffset = monitor.getSourceClientOffset()
          
          const { range } = props
          const { minX, maxX, minY, maxY} = range ?? {}

          // 做判断，当x、y符合时return true
          if (getSourceClientOffset.x > minX && getSourceClientOffset.x < maxX &&
          getSourceClientOffset.y > minY &&
          getSourceClientOffset.y < maxY) {

            return true
          } else {
            return false
          }

        }
      },
      (connect, monitor) => { 
        return {
          // 包裹住 DOM 节点，使其可以接收对应的拖拽组件
          connectDropTarget: connect.dropTarget(),
          // drag source是否在 drop target 区域
          // isOver: monitor.isOver(),
          // 是否可以被放置
          canDrop: monitor.canDrop()
        }
      }
    )(DefaultDropContainer)
  )
}

export {
  DropBoxFn,
}
