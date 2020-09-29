/*
 * @Description: 
 * @Version: 
 * @Author: Yanzengyong
 * @Date: 2020-09-06 21:37:06
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-09-29 17:07:33
 */
import React from 'react'
import IconLabel from './Components/IconLabel'
import './dropItem.css'


class DropItem extends React.Component {

  // 状态节点函数
  renderStatusReactNode = (status) => {
    if (status) {
      if (status === 'warning'){
        return (
          <IconLabel 
            className='warning_icon' 
            icon='iconwarningStatus' 
          />
        )
      } else if (status === 'loading') {
        return (
          <IconLabel 
            className='loading_icon' 
            icon='iconloadingStatus' 
          />
        )
      } else if (status === 'success') {
        return (
          <IconLabel 
            className='success_icon' 
            icon='iconsuccessStatus' 
          />
        )
      } else {
        return (
          <IconLabel 
            className='default_icon' 
            icon='icondefalutStatus' 
          />
        )
      }
    } else {
      return (
        <IconLabel 
          className='default_icon' 
          icon='icondefalutStatus' 
        />
      )
    }
  }

	render() {
		const { 
			dropId,
      dragInfo,
      onExecuteHandle,
      onSettingHandle,
      deleteDropItemHandle,
      status
    } = this.props
    
    const {
      title
    } = dragInfo ?? {}

		return (
      <div className="dropItem_container">
        <div className="dropItem_status">
          {this.renderStatusReactNode(status)}
        </div>
        <div className="dropItem_title" title={title} >{title}</div>
        <div className="dropItem_tool">
          <IconLabel 
            onClick={
              (e) => {
                e.stopPropagation()
                onExecuteHandle(dropId, dragInfo)
              }
            }
            className='execute_icon' 
            icon='iconexecute' 
          />
          <IconLabel 
            onClick={
              (e) => {
                e.stopPropagation()
                onSettingHandle(dropId, dragInfo)
              }
            }
            className='setting_icon' 
            icon='iconsetting' 
          />
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
		)
	}
}

export default DropItem
