import React from 'react'
import { connect } from 'react-redux'
import './SideBar.css'
import { switchAppTab } from '../../store/actions/app-actions'
import { APP_TABS, APP_TABS_CN } from '../../configs/constants'
import { RootState } from '../../store/reducers'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import { SpeedOMeter } from '../speed-o-meter'
import { ListItemIcon, ListItemText } from '@material-ui/core'

interface Props {
    currentTab: string,
    switchTab: (tab: string) => void
}

// 这是左侧列表
const _SideBar = ({ currentTab, switchTab }: Props) => {
    const onMenuItemClick = (key: string) => {
        return switchTab(key)
    }
    return (
        <div className={'SideBar'}>
            <div style={{ height: '84px' }} />
            <SpeedOMeter />
            <List style={{ flex: 1 }}>
                {APP_TABS.map((each, idx) => {
                    const checked = each === currentTab
                    let style: { [key: string]: any } = { fontSize: '1.4rem', height: '4rem', lineHeight: '4rem' }
                    if (checked) {
                        style.backgroundColor = 'white'
                        style.color = '#408DD9'
                    }
                    // 显示中文， key 为英文
                    const eachCN = APP_TABS_CN[idx];

                    return <ListItem
                        button
                        alignItems='center'
                        key={each}
                        style={style}
                        onClick={onMenuItemClick.bind(null, each)}
                    >
                        <ListItemText primary={eachCN} />
                    </ListItem>
                })}
            </List>
        </div>
    )
}

// 建立外部的state 对象(RootState), 到当前UI内部的 Props 的映射关系
// state 对象位于 /store/reducers 的index.ts 中，里边包含所有的状态信息对象
// connect方法接受两个参数：mapStateToProps和mapDispatchToProps
// 前者负责输入逻辑，即将state映射到 UI 组件的参数（props） => 实现外部修改 state 内容, 来改变UI的效果
// 后者负责输出逻辑，即将用户对 UI 组件的操作映射成 Action => 实现点击按钮，对外抛出 action 事件，来触发 
const mapStateToProps = (state: RootState) => {
    return {
        currentTab: state.app.get('currentTab')
    }
}

const mapDispatchToProps = (dispatch: (arg: any) => void) => {
    return {
        switchTab: (tab: string) => dispatch(switchAppTab(tab))
    }
}

// mapStateToProps, mapDispatchToProps -> connect 的这两个参数，对应  _SideBar 的两个参数
// const _SideBar = ({ currentTab, switchTab }: Props)
export const SideBar = connect(mapStateToProps, mapDispatchToProps)(_SideBar)
