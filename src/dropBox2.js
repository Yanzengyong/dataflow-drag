/*
 * @Descripttion: 
 * @version: 
 * @Author: Yanzengyong
 * @Date: 2020-09-01 16:51:42
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-09-04 09:37:28
 */
import React from 'react'
import { DropTarget } from 'react-dnd'
import { Consumer } from './contextType'
import { jsPlumb } from 'jsplumb'
import './drag.css'

class Box extends React.Component {

	componentDidMount() {
		console.log('!!@@~!@@~!@~!@~~')
	}

	render() {
		const { 
			position,
			id,
			name
		} = this.props
		const containerY = document.querySelector('body').offsetHeight
		const containerX = document.querySelector('body').offsetWidth
		const y = position && position.y ? position.y : 0
		const x = position && position.x ? position.x : 0
		const finalY = 500 * (y / containerY)
		const finalX = 500 * (x / containerX)
		const X1 = x - (containerX - 500 - 600)

		console.log(Math.abs(X1))
		return (
			<div onClick={() => this.props.onClick()} id={id} key={id} style={{ position: "absolute", top: y, left: Math.abs(X1), width: 80, height: 40, backgroundColor: '#fff000' }}>{name}</div>
		)
	}
}

const ConsumerFn = (Com) => {
	return (props) => {
		return (
			<Consumer>
				{(value) => (<Com {...value} />)}
			</Consumer>
		)
	}
}

class DropBox extends React.Component{

	state = {
		boxList: []
	}

	static getDerivedStateFromProps(props, state) {
		console.log(props)
		const isActive = props.canDrop && props.isOver;
		const dropId = props.currentNode && props.currentNode.id
		const isHave = state.boxList.findIndex((item) => item.id === dropId)
		console.log('isHave======', isHave)
		if (isHave === -1 && Object.keys(props.currentNode).length > 0) {
			console.log([...state.boxList, { ...props.currentNode, position: props.dropResult && props.dropResult.position }])
			return {
				boxList: [...state.boxList, { ...props.currentNode, position: props.dropResult && props.dropResult.position }]
			}

		}
		return null
	}

	componentDidMount() {

		this.common = {
			isSource: true,
			isTarget: true,
			connector: ['Straight']
		}
		jsPlumb.bind('connection', (data, info) => {
			console.log(data)
			console.log(info)
		})
	}

	componentDidUpdate(prevProps, PrevState) {

		console.log(this.state.boxList)
		console.log(PrevState.boxList)
		if (this.state.boxList.length > 0) {
			const newNode = this.state.boxList.find((item) => {

				if (PrevState.boxList.length === 0 || !PrevState.boxList.some((ite) => ite.id === item.id)) {
					return item
				}
			})

			if (newNode) {
				jsPlumb.addEndpoint(newNode.id, {
					anchors: ['Right']
				}, this.common)
				jsPlumb.draggable(newNode.id, {
					containment: 'dropBox2'
				})
			}
			console.log(jsPlumb)

		}

	}

  render() {

    const { canDrop, isOver, connectDropTarget, dropResult } = this.props;
		const isActive = canDrop && isOver;
		// console.log(dropResult)
		const { boxList } = this.state
		console.log('我是boxList===========', boxList)
		// 使用 connectDropTarget 包裹住 DOM 节点，使其可以接收对应的 drag source 组件
		// connectDropTarget 包裹住的 DOM 节点才能接收 drag source 组件
		return connectDropTarget && connectDropTarget(
			<div className='dropBox_container2'>
				<button onClick={() => {
					console.log('getAllConnections========', jsPlumb.getAllConnections())
					console.log('getCachedData========', jsPlumb.getCachedData())
					console.log('getConnections========', jsPlumb.getConnections())
					console.log('getContainer========', jsPlumb.getContainer())
					console.log('getDefaultConnectionType========', jsPlumb.getDefaultConnectionType())
					console.log('getDefaultEndpointType========', jsPlumb.getDefaultEndpointType())
					console.log('getDefaultScope========', jsPlumb.getDefaultScope())
					console.log('getEndpoint========', jsPlumb.getEndpoint())
					console.log('getFloatingConnectionFor========', jsPlumb.getFloatingConnectionFor())
					console.log('getId========', jsPlumb.getId())
					console.log('getInstance========', jsPlumb.getInstance())
					console.log('getInstanceIndex========', jsPlumb.getInstanceIndex())
					console.log('getListener========', jsPlumb.getListener())
					console.log('getManagedElements========', jsPlumb.getManagedElements())
					console.log('getScope========', jsPlumb.getScope())
					console.log('getSourceScope========', jsPlumb.getSourceScope())
					console.log('getSuspendedAt========', jsPlumb.getSuspendedAt())
					console.log('getTargetScope========', jsPlumb.getTargetScope())
					console.log('getZoom========', jsPlumb.getZoom())
				}}>
					点击获取关系数据
				</button>
				<div className='dropBox' id='dropBox2' style={isActive ? {backgroundColor: '#ccc'} : null}>
					{isActive ? '可以放置' : '我是接受区域'}
					{
						boxList.map((item) => <Box onClick={() => { console.log('fdsfdsafsdafdsfdsafsd');jsPlumb.empty(item.id)}} key={item.id} {...item} />)
					}
				</div>
			</div>
		)
  }
}

export default ConsumerFn(DropTarget(
  'box-2',
  {
    // 当有对应的 drag source 放在当前组件区域时，会返回一个对象，可以在 monitor.getDropResult() 中获取到
    drop: () => ({ name: 'Dustbin' })
  },
	(connect, monitor) => ({
		// 包裹住 DOM 节点，使其可以接收对应的拖拽组件
		connectDropTarget: connect.dropTarget(),
		// drag source是否在 drop target 区域
		isOver: monitor.isOver(),
		// 是否可以被放置
		canDrop: monitor.canDrop()
	})
)(DropBox))