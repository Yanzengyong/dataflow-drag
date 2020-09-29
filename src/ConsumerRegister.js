/*
 * @Descripttion: 
 * @version: 
 * @Author: Yanzengyong
 * @Date: 2020-09-04 14:47:16
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-09-28 14:45:44
 */
import React from 'react'
import { Consumer } from './contextType'

const ConsumerRegister = (Component, ItemNode) => {
  return (props) => {
    return (
      <Consumer>
        {
          (vlaue) => (
            <Component 
              {...props} 
              {...vlaue} 
              DropItemNode={ItemNode}
            />
          )
        }
      </Consumer>
    )
  }
}

export default ConsumerRegister
