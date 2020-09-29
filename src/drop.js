/*
 * @Descripttion: 
 * @version: 
 * @Author: Yanzengyong
 * @Date: 2020-09-01 16:51:42
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-09-29 14:47:16
 */
import React from 'react'
import { DropTarget } from 'react-dnd'
import './newDrag.css'
import ConsumerRegister from './ConsumerRegister'


const dropItemDecorator = (Comp) => {
  return (props) => {
    const { 
			position,
			dropId,
    } = props

		const y = position && position.y ? position.y : 0
    const x = position && position.x ? position.x : 0
    
    return (
      <div 
        key={dropId}
        id={dropId} 
        style={{ position: "absolute", top: y, left: x }}
      >
        <Comp {...props} />
      </div>
		)
  }
}

class DefaultDropContainer extends React.Component{

	state = {
		boxList: []
  }
  

	static getDerivedStateFromProps(props, state) {
    // 解构props
    const { currentStatusDropItem, nodeList } = props

    // 解构当前传入的存在状态的dropItem
    const { dropId: statusDropId, dropType: statusDropType } = currentStatusDropItem
    
    // 该组件容器初始化定义的type
    const boxType = props.type

    // 判断statusDropItem是否已经存在组件中的boxlist
    const statusDropIsHave = state.boxList.findIndex((item) => item.dropId === statusDropId)

    // 上一次的statusDropItem
    const prevStatusDrop = state.boxList.find((item) => item.dropId === statusDropId)

    // 上一次的statusDropItem的stauts值
    const prevStatusDropValue = prevStatusDrop ? prevStatusDrop.status : null
    
    // 最新的statusDropItem的stauts值
    const statusDropValue = currentStatusDropItem ?
    currentStatusDropItem.status : null

    /**
     * 新增dropItem 
     * 方法：在所有的nodelist中筛选出该组件类型的列表
     * 结果：
     * boxList修改为过滤了dropType后的nodeList
     */
    const currentTypeNodeList = nodeList.filter((item) => item.dropType === boxType)
    if (currentTypeNodeList.length !== state.boxList.length) {
      return {
        boxList: currentTypeNodeList
      }
    }

    /**
     * 为已经存在的dropItem添加状态
     * 判断：
     * 1.该dropId是否存在于boxlist中,需存在
     * 2.该容器类型和传入的类型是否一样
     * 3.上一次传入的状态和最新状态是否一样
     * 结果：
     * boxList修改为过滤了dropType后的nodeList
     */
    if (statusDropIsHave !== -1 && boxType === statusDropType && prevStatusDropValue !== statusDropValue) {

      return {
        boxList: currentTypeNodeList
      }
      
    }

		return null
  }
  
  componentDidMount() {

  }
  
  componentDidUpdate(prevProps, PrevState) {
    const { boxList } = this.state

		if (boxList.length > 0) {
			const newNode = boxList.filter((item) => {
				if (PrevState.boxList.length === 0 || !PrevState.boxList.some((ite) => ite.dropId === item.dropId)) {
					return item
				}
      })
      // console.log('newNode===', newNode)

			if (newNode && newNode.length > 0) {
        newNode.forEach((item) => {
          this.createJsplumbNode(item)
        })
			}
		}

  }
  
  // 创建jsplumb节点
  createJsplumbNode = (node) => {

    const { JsPlumbInstance, id } = this.props
    // 创建节点
    JsPlumbInstance.addEndpoint(node.dropId, {
      anchors: 'Top',
      isSource: true,
      isTarget: true,
    })
    JsPlumbInstance.addEndpoint(node.dropId, {
      anchor: 'Right',
      isSource: true,
      isTarget: true,
    })
    JsPlumbInstance.addEndpoint(node.dropId, {
      anchor: 'Bottom',
      isSource: true,
      isTarget: true,
    })
    JsPlumbInstance.addEndpoint(node.dropId, {
      anchor: 'Left',
      isSource: true,
      isTarget: true,
    })

    // 移动固定在该盒子区域
    JsPlumbInstance.draggable(node.dropId, {
      containment: id,
      grid: [1, 1],
      stop: (e) => { // 监听移动
        const { onNodeDragChange } = this.props
        onNodeDragChange({
          ...e,
          dropId: node.dropId
        })
      }
    })
  }

  render() {

    const { id, title, dropBoxClassName, connectDropTarget, DropItemNode } = this.props

    const { boxList } = this.state
    
    console.log(boxList, this.props)
		return connectDropTarget && connectDropTarget(
			<div className={dropBoxClassName ? dropBoxClassName : 'dropBox_container_new'} >
				<div className='dropBox_new' id={id} >
          <div className='dropBoxTitle'>{title}</div>
          {
            boxList.map((item) => (
              dropItemDecorator(DropItemNode)({
                ...this.props,
                 ...item
              })
            ))
          }
				</div>
			</div>
		)
  }
}

const DropBoxFn = (type, DropItemFn) => {

  return ConsumerRegister(
    DropTarget(
      type,
      {
        // 当有对应的 drag source 放在当前组件区域时，会返回一个对象，可以在 monitor.getDropResult() 中获取到
        drop: (props, monitor, component) => {
          console.log('我是放下时候的props', monitor.getItem())
          const { range } = props
          const { minX, minY } = range ?? {}
          const getSourceClientOffset = monitor.getSourceClientOffset()
          const ItemInfo = monitor.getItem()

          const position = {
            x: getSourceClientOffset.x - minX,
            y: getSourceClientOffset.y - minY,
          }
          const DefaultStatus = ItemInfo.info ? ItemInfo.info.status ?? '' : ''
          return {
            dropType: props.type,
            position: position,
            dragType: ItemInfo.type,
            dropId: ItemInfo.dropId,
            dragInfo: ItemInfo.info,
            status: DefaultStatus
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
    )(DefaultDropContainer),
    DropItemFn
  )
}

export {
  DropBoxFn,
}
