/*
 * @Descripttion: 
 * @version: 
 * @Author: Yanzengyong
 * @Date: 2020-09-04 14:30:40
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-09-04 18:06:04
 */
import React from 'react'
import { DragSource } from 'react-dnd'


const DragGroup = ({ children, typeTitle, type }) => {
  return (
    <div>
      {typeTitle ? (<h3>{type}</h3>) : null}
      <ul className='drag_sidebar_item'>
        {
          React.Children.map(children, (child) => (
            React.cloneElement(child, { type })
          ))
        }
      </ul>
    </div>
  )
}



const DragItem = ({ type, ...rest }) => {
  // return (() => (

  //     <li {...rest}>
  //       fadsfasdf
  //     </li>

  // ))()
  console.log(DragSource)
  // DragSource(
  //   type,
  //   {
  //     /**
  //      * 开始拖拽时触发当前函数
  //      * @param {*} props 组件的 props
  //      */
  //     beginDrag(props, monitor, component) {
  //       // 返回的对象可以在 monitor.getItem() 中获取到
  //       return {
  //         name: props.name,
          
  //       }
  //     },
    
  //     /**
  //      * 拖拽结束时触发当前函数
  //      * @param {*} props 当前组件的 props
  //      * @param {*} monitor DragSourceMonitor 对象
  //      */
  //     endDrag(props, monitor) {
  //       props.setCurrentNode(props)
  
  //       // 当前拖拽的 item 组件
  //       const item = monitor.getItem();
  
  //       // 拖拽元素放下时，drop 结果
  //       const dropResult = monitor.getDropResult();
  
  //     },
  //   },
  //   (connect, monitor) => ({
  //     // 包裹住 DOM 节点，使其可以进行拖拽操作
  //     connectDragSource: connect.dragSource(),
  //     // 是否处于拖拽状态
  //     isDragging: monitor.isDragging()
  //   })
  // )( ({ title, ...rest }) => {
  //   return (
  //     <li {...rest}>
  //       {title}
  //     </li>
  //   )
  // })
  
  return (
    <li {...rest}>
      ddddd
    </li>
  )
  
}



export {
  DragGroup,
  DragItem
}