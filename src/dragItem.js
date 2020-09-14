/*
 * @Description: 
 * @Version: 
 * @Author: Yanzengyong
 * @Date: 2020-09-04 22:55:05
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-09-14 17:42:27
 */
import React from 'react'
import './newDrag.css'

class DragItem extends React.Component {
  render() {
    const { info, connectDragSource } = this.props
    const { title } = info

    return connectDragSource && connectDragSource(
      <li className='componentItem'>
        {title || '我没有获取到title值'}
      </li>
    )
  }
}

export default DragItem
