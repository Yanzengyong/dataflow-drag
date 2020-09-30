/*
 * @Descripttion: 
 * @version: 
 * @Author: Yanzengyong
 * @Date: 2020-09-02 10:11:15
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-09-30 09:54:37
 */
import React from 'react'
import { Provider } from './ContextType'
import './index.css'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { jsPlumb } from 'jsplumb'


class NodeList extends React.Component{
  static displayName = 'NodeList'
  
  render () {
    const {
      backgroundstyle,
      ...restProps
    } = this.props
    return (
      <div style={{ position: 'relative' }} {...restProps} >
        <div 
          style={{
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            background: backgroundstyle,
            position: 'absolute',
            zIndex: -1
          }}
        />
        {this.props.children}
      </div>
    )
  }
} 

class DropBox extends React.Component{
  static displayName = 'DropBox'
  render () {
    return (
      <div {...this.props} >
        {this.props.children}
      </div>
    )
  }
}


class FlowContainerClass extends React.Component {
  
  state = {
    lastDropNode: {},
    currentStatusDropItem: {},
    connectionList: [],
    nodeList: []
  }

  // 移动结束
  moveEnd = true
  
  // 断开连接为执行的连接数组
  connectionDetachedUnexecutedList = []

  componentDidMount() {
    this.JsPlumbInitHandle()
    this.hoverOverlayHandle()

  }

  // hover效果功能
  hoverOverlayHandle = () => {
    this.JsPlumbInstance.bind('mouseover', (conn) => {
      const overlay = conn.getOverlay("custom-delete")
      if (overlay) {
        overlay.show()
      }

    })

    this.JsPlumbInstance.bind('mouseout', (conn) => {
      const overlay = conn.getOverlay("custom-delete")
      if (overlay) {
        overlay.hide()
      }

    })
  }


  // 初始化jsplumb
  JsPlumbInitHandle = () => {
    // 初始化一个实例
    this.JsPlumbInstance = jsPlumb.getInstance(this.props.config)
    this.JsPlumbInstance.importDefaults({
      MaxConnections: -1
    })
    // 设置拖拽容器
    this.JsPlumbInstance.setContainer('drag_box')
    
    // 监听链接事件
    this.JsPlumbInstance.bind('connection', (conn) => {
      const sourcePosition_x = conn.source.offsetLeft
      const sourcePosition_y = conn.source.offsetTop
      const targetPosition_x = conn.target.offsetLeft
      const targetPosition_y = conn.target.offsetTop
      const connectionId = conn.connection.id
      if (!this.moveEnd) {
        return
      }
      /**
       * 需要判断连接是否存在、是否连接的是自己
       * 如果存在连接就删除重复
       * 如果连接是自己则删除这次连接
       */
      const sourceId = conn.sourceId
      const targetId = conn.targetId
      if (sourceId === targetId) {
        this.JsPlumbInstance.deleteConnection(conn.connection)
        return
      }
      const { connectionList } = this.state

      const isHave = connectionList.findIndex((item) => item.sourceId === sourceId && item.targetId === targetId)
      if (isHave !== -1) {
        this.JsPlumbInstance.deleteConnection(conn.connection)
        return
      }

      this.setState((prevState) => {
        return {
          connectionList: [...prevState.connectionList, {
            sourceId: conn.sourceId,
            targetId: conn.targetId,
            sourcePosition: {
              x: sourcePosition_x,
              y: sourcePosition_y
            },
            targetPosition: {
              x: targetPosition_x,
              y: targetPosition_y
            },
            connectionId: connectionId,
            anchor: [
              conn.sourceEndpoint.anchor.type,
              conn.targetEndpoint.anchor.type,
            ]
          }]
        }
      }, () => {
        console.log('新增了一个连接，最新数组为', conn.connection.id, this.state.connectionList)
        // 存储关联
        this.saveStateConnectionList()
      })

    })
    
    // 监听链接断开事件
    this.JsPlumbInstance.bind('connectionDetached', (conn) => {
      // 将监听到的连接加入待办列表（这么做是为了解决同时发生n个连接断开的情况）
      this.connectionDetachedUnexecutedList.push(conn)

      const { connectionList } = this.state

      const afterDeleteConnectionList = connectionList.filter((item) => {
        const needUnmount = this.connectionDetachedUnexecutedList.some((it) => it.connection.id === item.connectionId)
        return !needUnmount
      })

      this.setState({
        connectionList: afterDeleteConnectionList
      }, () => {
        console.log('连接断开了，最新数组为：', this.state.connectionList)
        // 存储关联
        this.saveStateConnectionList()
      })

    })
    
    // 监听移动事件
    this.JsPlumbInstance.bind('connectionMoved', (conn) => {
   
      const { connectionList } = this.state
      const connectionId = conn.connection.id
      const afterDeleteConnectionList = connectionList.filter((item) => item.connectionId !== connectionId)
      this.moveEnd = false
      this.setState({
        connectionList: afterDeleteConnectionList
      }, () => {
        console.log('我移动了连接，移动后', conn.connection.id, this.state.connectionList)
        this.moveEnd = true
      })
    })
    

    // 判断是否存在数据，如果已经存在数据就渲染已经存在的数据
    const localNodeList = window.sessionStorage.getItem('flowNodeList') ? JSON.parse(window.sessionStorage.getItem('flowNodeList')) : [] 
    const flowConnectionLsit = window.sessionStorage.getItem('flowConnectionLsit') ? JSON.parse(window.sessionStorage.getItem('flowConnectionLsit')) : []
    
    if (localNodeList.length > 0) {

      this.setState({
        nodeList: localNodeList
      }, () => {
        if (flowConnectionLsit.length > 0) {
          console.log(this.props)
          const { config } = this.props
          const CustomInfo = config.ConnectionOverlays.find((item) => item[0] === 'Custom')
          const CustomId = CustomInfo ? CustomInfo[1].id : ''

          flowConnectionLsit.forEach((item) => {
            const connection = this.JsPlumbInstance.connect({
              source: item.sourceId, 
              target: item.targetId,
              anchors: item.anchor,
            })

            const overlay = connection.getOverlay(CustomId)
            if (overlay) {
              overlay.hide()
            }

          })

        }
      })

    }

  }

  addItemToDropBox = (node) => {
    this.setState((prevState) => {
      return {
        lastDropNode: node,
        nodeList: [...prevState.nodeList, node]
      }
    }, () => {
      console.log('我是最新的nodeList', this.state.nodeList)
      // 进行存储
      this.saveStateNodeList()
    })
  }

  // 处理状态
  reviseStatusHandle = (statusDropId, status) => {

    const {
      nodeList,
      connectionList
    } = this.state

    // 当前需要修改状态的dropItem
    const currentStatusDropItem = nodeList.find((item) => item.dropId === statusDropId)

    // 查找该dropId的目标dropId，即当前dropNode的tragetId
    const currentConnection = connectionList.find((item) => item.sourceId === statusDropId)
    console.log(connectionList, statusDropId, currentConnection)

    // 重新设置nodelist和修改了状态的dropItem
    this.setState({
      nodeList: nodeList.map((item) => {
        if (item.dropId === statusDropId) {
          return {
            ...item,
            status
          }
        } else {
          return item
        }
      }),
      currentStatusDropItem: {
        ...currentStatusDropItem,
        status
      }
    }, () => {
      // 进行存储
      this.saveStateNodeList()
      console.log('state设置完后', currentConnection)
    })
    return currentConnection
  }


  deleteDropItemHandle = (dropId, dragInfo) => {
    console.log('我被删除了', dropId, dragInfo)
    const { nodeList } = this.state
    const afterDeleteNodeList = nodeList.filter((item) => item.dropId !== dropId)
    this.setState({
      nodeList: afterDeleteNodeList
    }, () => {
      this.JsPlumbInstance.remove(dropId)
      // 进行存储
      this.saveStateNodeList()
    })
  }

  deleteConnectHandle = (overlay) => {
    let hasOverlay = !!overlay
    if (hasOverlay) {
      this.JsPlumbInstance.bind('click', (conn, originalEvent) => {

        if (!hasOverlay) {
          return
        }

        if (window.prompt('确定删除所点击的连接吗？ 输入1确定') === '1') {
          this.JsPlumbInstance.deleteConnection(conn)
        }
        
        hasOverlay = false
      })
    }
  }

  // 节点在容器中的change事件
  onNodeDragChange = (record) => {

    const { nodeList } = this.state
    const setPositionNodeList = nodeList.map((item) => {
      if (item.dropId === record.dropId) {
        return {
          ...item,
          position: {
            x: record.finalPos[0],
            y: record.finalPos[1]
          }
        }
      } else {
        return item
      }
    })

    this.setState({
      nodeList: setPositionNodeList
    }, () => {
      // 进行存储
      this.saveStateNodeList()
    })
  }

  // 会话存储nodelist
  saveStateNodeList = () => {
    console.log('我是会话存储nodelist', this.state.nodeList, JSON.stringify(this.state.nodeList))
    // 进行存储
    window.sessionStorage.setItem('flowNodeList', JSON.stringify(this.state.nodeList))

  }

  // 会话存储connectionlist
  saveStateConnectionList = () => {
    window.sessionStorage.setItem('flowConnectionLsit', JSON.stringify(this.state.connectionList))
  }
  
  render() {

    const {
      lastDropNode,
      currentStatusDropItem,
      nodeList
    } = this.state


    return (
      <Provider value={{
        nodeList: nodeList,
        lastDropNode: lastDropNode,
        currentStatusDropItem: currentStatusDropItem,
        addItemToDropBox: this.addItemToDropBox,
        deleteDropItemHandle: this.deleteDropItemHandle,
        onNodeDragChange: this.onNodeDragChange,
      }}>
        <div className='drag_container'>
          {
            React.Children.map(this.props.children, (item) => {

              if (item.type.displayName === 'NodeList') {
                // 拖拽组件列表
                return (
                  React.cloneElement(item, {
                    className: item.props.className ?? 'drag_sidebar'
                  })
                )
              } else {
                return (
                  React.cloneElement(item, {
                    className: item.props.className ?? 'drag_box',
                    id: 'drag_box',
                  }, React.Children.map(item.props.children, (child) => {
                    return React.cloneElement(child, {
                      JsPlumbInstance: this.JsPlumbInstance
                    })
                  }))
                )
              }
            })
          }
        </div>
      </Provider>
    )
  }
}

const FlowContainer = DragDropContext(HTML5Backend)(FlowContainerClass)

export {
  FlowContainer,
  NodeList,
  DropBox
}

