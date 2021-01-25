import React from 'react'
import { Paper } from '@material-ui/core'

import './AboutPanel.css'
import { callIPC } from '../../native-support/message-queue'
import { BRG_MSG_OPEN_LINK } from '../../native-support/message-constants'

import pJson from '../../../package.json'

const HOME_LINK = 'https://xixi.ph'
const GOOGLE_LINK = 'https://www.google.com'

export const AboutPanel = () => {
    // 发消息给 GUI 主进程
    const openLink = (link: string) => {
        return () => callIPC(BRG_MSG_OPEN_LINK, { arg: link })
    }
    return (
        <div className='about-panel'>
            <div style={{ position: 'fixed', background: '#3F51B5', height: '180px', width: '100%', top: 0, left: 0, zIndex: 0 }} />
            <Paper className='about-wrapper'>
                <p style={{ fontWeight: 'bold' }}>XiXi加速器 V{pJson.version}</p>
                <div className='credits' >
                    <p onClick={openLink(HOME_LINK)}>官网主页</p>
                </div>
                <div className='credits' >
                    <p onClick={openLink(GOOGLE_LINK)}>访问google</p>
                </div>
            </Paper>
        </div>
    )
}
