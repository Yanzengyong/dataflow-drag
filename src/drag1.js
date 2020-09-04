/*
 * @Descripttion: 
 * @version: 
 * @Author: Yanzengyong
 * @Date: 2020-09-01 14:48:31
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-09-04 09:27:50
 */
import React from 'react'
import { DragSource } from 'react-dnd'
import './drag.css'

class DragComponent extends React.Component {

  componentDidMount() {

  }
  render() {
    const { connectDragSource, name, id } = this.props
    return connectDragSource && connectDragSource(
      <div className='dragsource_box'>{name}</div>
    )
  }
} 

export default DragSource(
  'box-2',
  {
    /**
     * 开始拖拽时触发当前函数
     * @param {*} props 组件的 props
     */
    beginDrag(props, monitor, component) {
      const initClientOffset = monitor.getInitialClientOffset()
      console.log('initClientOffset========', initClientOffset)
      const initSourceClientOffset = monitor.getInitialSourceClientOffset()
      console.log('initSourceClientOffset===========', initSourceClientOffset)
      const getClientOffset = monitor.getClientOffset()
      console.log('getClientOffset============', getClientOffset)
      const getSourceClientOffset = monitor.getSourceClientOffset()
      console.log('getSourceClientOffset=========', getSourceClientOffset)
      const getDifferenceFromInitialOffset = monitor.getDifferenceFromInitialOffset()
      console.log('getDifferenceFromInitialOffset===========', getDifferenceFromInitialOffset)
      // props.setCurrentNode(props)
      // 返回的对象可以在 monitor.getItem() 中获取到
      return {
        name: props.name,
        
      }
    },
  
    /**
     * 拖拽结束时触发当前函数
     * @param {*} props 当前组件的 props
     * @param {*} monitor DragSourceMonitor 对象
     */
    endDrag(props, monitor) {
      props.setCurrentNode(props)
      const getSourceClientOffset = monitor.getSourceClientOffset()
      console.log('getSourceClientOffset=========', getSourceClientOffset)
      const getDifferenceFromInitialOffset = monitor.getDifferenceFromInitialOffset()
      console.log('getDifferenceFromInitialOffset===========', getDifferenceFromInitialOffset)
      // props.endDrag('')

      // 当前拖拽的 item 组件
      const item = monitor.getItem();

      // 拖拽元素放下时，drop 结果
      const dropResult = monitor.getDropResult();
      // console.log(dropResult)

    },
  },
	(connect, monitor) => ({
		// 包裹住 DOM 节点，使其可以进行拖拽操作
		connectDragSource: connect.dragSource(),
		// 是否处于拖拽状态
		isDragging: monitor.isDragging()
	})
)(DragComponent)