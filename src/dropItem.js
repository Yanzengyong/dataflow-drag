/*
 * @Description: 
 * @Version: 
 * @Author: Yanzengyong
 * @Date: 2020-09-06 21:37:06
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-09-28 14:35:06
 */
import React from 'react'
import './newDrag.css'

class DropItem extends React.Component {

  renderStatus = (status) => {
    const {
      statusReactNode
    } = this.props
    const StatusNodeType = typeof statusReactNode
    if (statusReactNode && StatusNodeType === 'function') {
      return statusReactNode(status)
    } else {
      return ''
    }
  }

	render() {
		const { 
			position,
			dropId,
      dragInfo,
      onExecuteHandle,
      onSettingHandle,
      dropItemClickHandle,
      deleteDropItemHandle,
      status
    } = this.props
    const {
      title
    } = dragInfo ?? {}

		const y = position && position.y ? position.y : 0
		const x = position && position.x ? position.x : 0
    console.log(this.props)
		return (
      <div 
        onClick={
          () => dropItemClickHandle(dropId, dragInfo)
        } 
        className='dropItem' 
        id={dropId} 
        style={{ position: "absolute", top: y, left: x }}
      >
        <div className="dropItem_container">
          <div className="dropItem_status">
            {this.renderStatus(status)}
          </div>
          <div className="dropItem_title" title={title} >{title}</div>
          <div className="dropItem_tool">
            <div onClick={
              (e) => {
                e.stopPropagation()
                onExecuteHandle(dropId, dragInfo)
              }
            } className="dropItem_tool_execute">
              <img src="images/execute.png" alt=""/>
            </div>
            <div onClick={
              (e) => {
                e.stopPropagation()
                onSettingHandle(dropId, dragInfo)
              }
            } className="dropItem_tool_setting">
              <img src="images/setting.png" alt=""/>
            </div>
          </div>

          <div onClick={
            (e) => {
              e.stopPropagation()
              deleteDropItemHandle(dropId, dragInfo)
            }
          } className="dropItem_close">
            <img src="images/close.png" alt=""/>
          </div>
        </div>
      </div>
		)
	}
}

export default DropItem
