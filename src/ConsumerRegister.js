/*
 * @Descripttion: 
 * @version: 
 * @Author: Yanzengyong
 * @Date: 2020-09-04 14:47:16
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-09-07 10:27:11
 */
import React from 'react'
import { Consumer } from './contextType'

const ConsumerRegister = (Component) => {
  return (props) => {
    return (
      <Consumer>
        {
          (vlaue) => (<Component {...props} {...vlaue} />)
        }
      </Consumer>
    )
  }
}

export default ConsumerRegister
