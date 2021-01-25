import React from 'react'
import { Provider, connect } from 'react-redux'
import { store } from './store'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles } from '@material-ui/core/styles'
import { SideBar, ContentPanel } from './components'
import './App.css'
import { AppBar, Toolbar, Typography } from '@material-ui/core'
import { RootState } from './store/reducers'

import { getIcon } from './utils'

const drawerWidth = 122

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        height: '100%',
        flex: 1
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerWidth,
        border: 'none'
    },
    content: {
        flexGrow: 1,
        flex: 1,
        height: '100%'
    }
}))

interface Props {
    currentTab: string
}

function _ClashyApp({ currentTab }: Props) {
    const classes = useStyles()
    return (
    <div className={classes.root}>
        <Drawer
            className={classes.drawer}
            variant={'persistent'}
            anchor={'left'}
            open={true}
            classes={{
                paper: classes.drawerPaper
            }}
        >
            <SideBar />
        </Drawer>
        <main className={classes.content}>
            <ContentPanel />
        </main>
    </div>
    )
}

const mapState = (state: RootState) => ({
    currentTab: state.app.get('currentTab')
})

const ClashyApp = connect(mapState, null)(_ClashyApp)

class App extends React.Component {
    render() {
        return <Provider store={store}>
                  <ClashyApp />
                </Provider>
    }
}

export default App
