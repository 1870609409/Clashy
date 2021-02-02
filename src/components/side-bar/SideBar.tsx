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

export const SideBar = connect(mapStateToProps, mapDispatchToProps)(_SideBar)
