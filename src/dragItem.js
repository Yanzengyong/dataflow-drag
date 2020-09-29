/*
 * @Description: 
 * @Version: 
 * @Author: Yanzengyong
 * @Date: 2020-09-04 22:55:05
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-09-29 17:25:15
 */
import React from 'react'
import './dragItem.css'

class DragItem extends React.Component {
  render() {
    const { info } = this.props
    const { title } = info

    return (
      <li className='componentItem'>
        {title || '我没有获取到title值'}
      </li>
    )
  }
}

export default DragItem
