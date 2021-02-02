import React, { useState, useEffect } from 'react'
import { requestTraffic } from '../../apis'
import ic_upload from '../../assets/icon-upload.png'
import ic_download from '../../assets/icon-download.png'

import './SpeedOMeter.css'

interface Traffic {
    up: number
    down: number
}

export function SpeedOMeter() {
    const [ traffic, setTraffic ] = useState({ up: 0, down: 0 })

    useEffect(() => {
        requestTraffic((chunk) => {
            if (chunk == null || chunk.length === 0) {
                return
            }
            try {
                const t: Traffic = JSON.parse(chunk)
                setTraffic(t)
            } catch (e) {
                // eat it
            }
        })
    }, [])
    return (
        <div style={{ padding: '16px' }}>
            <div className='speed-o-meter-text'>
                <img src={ic_upload} className='speed-o-meter-icon' />
                <p>{parseSpeed(traffic.up || 0)}</p>
            </div>
            <div className='speed-o-meter-text'>
                <img src={ic_download} className='speed-o-meter-icon' />
                <p>{parseSpeed(traffic.down)}</p>
            </div>
        </div>
    )
}

// 单位转换
function parseSpeed(input: number): string {
    let speed = Number((input || 0) / 1024)
    let suffix = 'K'
    if (speed >= 1024) {
        speed = speed / 1024
        suffix = 'M'
    }
    return `${speed.toFixed(2)}${suffix}`
}
