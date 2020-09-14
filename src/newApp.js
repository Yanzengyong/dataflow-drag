/*
 * @Descripttion: 
 * @version: 
 * @Author: Yanzengyong
 * @Date: 2020-09-02 10:11:15
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-09-14 17:35:23
 */
import React from 'react'
import { DragGroup, ConsumerDragItem } from './drag'
import { Provider } from './contextType'
import './newDrag.css'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { DropBoxFn } from './drop'
import { jsPlumb } from 'jsplumb'

const DropBoxBox = DropBoxFn('box')
const DropBoxYzy = DropBoxFn('yzy')
class NewApp extends React.Component {
  
  state = {
    lastDropNode: {},
    DragList_A: [
      {type: 'box', id: 'box-type-fn1', title: '我是功能1的组件'},
      {type: 'box', id: 'box-type-fn2', title: '我是功能2的组件'},
      {type: 'box', id: 'box-type-fn3', title: '我是功能3的组件'}
    ],
    DragList_B: [
      {type: 'yzy', id: 'yzy-type-fn1', title: '我是Y功能组件1'},
      {type: 'yzy', id: 'yzy-type-fn2', title: '我是Y功能组件2'},
      {type: 'yzy', id: 'yzy-type-fn3', title: '我是Y功能组件3'}
    ],
    dropBoxBoxRange: {},
    dropBoxYzyRange: {},
    currentStatusDropItem: {},
    connectionList: [],
    nodeList: []
  }

  moveEnd = true

  // jsplumb配置
  CreateInstanceConfig = {
    isSource: true,
    isTarget: true,
    connector: 'Flowchart',
    endpoint: 'Dot',
    paintStyle: {
      stroke: 'yellowgreen', 
      strokeWidth: 1,
      fill: '#fff',
      radius: 4, // 蓝色圆点调试大小
    },
    hoverPaintStyle: { 
      fill: 'yellowgreen'
    },
    connectorStyle: {
      stroke: '#49b4f3',
      strokeWidth: 2,
    },
    connectorHoverStyle: {
      stroke: '#f3992a',
      strokeWidth: 4,
    },
    connectorOverlays: [
      ['Arrow', {
        width: 10,
        length: 10,
        location: 1
      }],
      ["Custom", {
        create: () => {
          const ElementDiv = document.createElement("div")

          ElementDiv.classList.add('connectDelete')
          ElementDiv.innerText = 'X'
          
          return ElementDiv
        },
        location: 0.5,
        id: "custom-delete",
        events:{
          click: (labelOverlay, originalEvent) => { 
            this.deleteConnectHandle(labelOverlay)
          }
        }
      }],
    ]
  }

  // 初始化创建连接时的配置
  ConnectorConfig = {
    isSource: true,
    isTarget: true,
    connector: 'Flowchart',
    endpoint: 'Dot',
    endpointStyle: {
      stroke: 'yellowgreen', 
      strokeWidth: 1,
      fill: '#fff',
      radius: 4, // 蓝色圆点调试大小
    },
    endpointHoverStyle: { 
      fill: 'yellowgreen', 
    },
    paintStyle: {
      stroke: '#49b4f3',
      strokeWidth: 2,
    },
    hoverPaintStyle: { 
      stroke: '#f3992a',
      strokeWidth: 4,
    },
    overlays: [
      ['Arrow', {
        width: 10,
        length: 10,
        location: 1
      }],
      ["Custom", {
        create: () => {
          const ElementDiv = document.createElement("div")

          ElementDiv.classList.add('connectDelete')
          ElementDiv.innerText = 'X'
          
          return ElementDiv
        },
        location: 0.5,
        id: "custom-delete",
        events:{
          click: (labelOverlay, originalEvent) => { 
            this.deleteConnectHandle(labelOverlay)
          }
        }
      }],
    ]
  }

  componentDidMount() {
    this.JsPlumbInitHandle()
    this.setDropBoxRange()
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

  // 设置放置盒子的边界
  setDropBoxRange = () => {
    const dropBoxBoxDiv = document.querySelector(`#dropBox-box`)
    const dropBoxYzyDiv = document.querySelector(`#dropBox-yzy`)
    const dropBoxBoxX = dropBoxBoxDiv.offsetWidth
    const dropBoxBoxY = dropBoxBoxDiv.offsetHeight
    const dropYzyBoxX = dropBoxYzyDiv.offsetWidth
    const dropYzyBoxY = dropBoxYzyDiv.offsetHeight

    this.setState({
      dropBoxBoxRange: {
        minX: 260,
        maxX: dropBoxBoxX + 260 - 100,
        minY: 0,
        maxY: dropBoxBoxY
      },
      dropBoxYzyRange: {
        minX: 260 + dropBoxBoxX,
        maxX: dropBoxBoxX + dropYzyBoxX + 260 - 100,
        minY: 0,
        maxY: dropYzyBoxY
      }
    })
  }

  // 初始化jsplumb
  JsPlumbInitHandle = () => {
    // 初始化一个实例
    this.JsPlumbInstance = jsPlumb.getInstance()
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

      const { connectionList } = this.state
      const connectionId = conn.connection.id
      const afterDeleteConnectionList = connectionList.filter((item) => item.connectionId !== connectionId)
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
          
          flowConnectionLsit.forEach((item) => {
            const connection = this.JsPlumbInstance.connect({
              source: item.sourceId, 
              target: item.targetId,
              anchors: item.anchor,
            }, this.ConnectorConfig)

            const overlay = connection.getOverlay("custom-delete")

            overlay.hide()

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
      nodeList
    } = this.state
    // 当前需要修改状态的dropItem
    const currentStatusDropItem = nodeList.find((item) => item.dropId === statusDropId)

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
    })

  }

  // 单个dropItem执行函数
  onExecuteHandle = (dropId, dragInfo) => {
    console.log('我点击了执行按钮', dropId, dragInfo)
    
    setTimeout(() => {
      this.reviseStatusHandle(dropId, 'loading')
    }, 3000)
    setTimeout(() => {
      this.reviseStatusHandle(dropId, 'success')
    }, 6000)
    setTimeout(() => {
      this.reviseStatusHandle(dropId, 'error')
    }, 9000)
  }

  onSettingHandle = (dropId, dragInfo) => {
    console.log('我点击了设置按钮', dropId, dragInfo)
  }

  dropItemClickHandle = (dropId, dragInfo) => {
    console.log('我点击了被放置的节点', dropId, dragInfo)
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
    // 进行存储
    window.sessionStorage.setItem('flowNodeList', JSON.stringify(this.state.nodeList))
  }

  // 会话存储connectionlist
  saveStateConnectionList = () => {
    window.sessionStorage.setItem('flowConnectionLsit', JSON.stringify(this.state.connectionList))
  }
  
  render() {
    const {
      DragList_A,
      DragList_B,
      dropBoxBoxRange,
      dropBoxYzyRange,
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
        onExecuteHandle: this.onExecuteHandle,
        onSettingHandle: this.onSettingHandle,
        dropItemClickHandle: this.dropItemClickHandle,
        deleteDropItemHandle: this.deleteDropItemHandle,
        onNodeDragChange: this.onNodeDragChange
      }}>
        <div className='drag_container'>
          <div className='drag_sidebar'>
            <DragGroup title='我是box类型的组件'>
              {
                DragList_A.map((item) => {
                  return (
                    <ConsumerDragItem key={item.id} type={item.type} info={item}/>
                  )
                })
              }
            </DragGroup>
            <DragGroup title='我是Yzy类型的组件'>
              {
                DragList_B.map((item) => {
                  return (
                    <ConsumerDragItem key={item.id} type={item.type} info={item}/>
                  )
                })
              }
            </DragGroup>
          </div>

          <div className='drag_box' id='drag_box'>

            <DropBoxBox 
              JsPlumbInstance={this.JsPlumbInstance}
              config={this.CreateInstanceConfig}
              id='dropBox-box'
              range={dropBoxBoxRange} 
              type='box' 
              title='我是box类型的接收区'
            />
            <DropBoxYzy 
              JsPlumbInstance={this.JsPlumbInstance}
              config={this.CreateInstanceConfig}
              id='dropBox-yzy' 
              range={dropBoxYzyRange} 
              type='yzy' 
              title='我是yzy类型的接收区'
            />
    
          </div>
        </div>
      </Provider>
    )
  }
}

export default DragDropContext(HTML5Backend)(NewApp)
