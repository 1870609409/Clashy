import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { createStyles, FormControl, IconButton, InputAdornment, InputLabel, makeStyles, OutlinedInput, Theme } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import clsx from 'clsx';
import { connect, Provider } from 'react-redux';
import { TDispatch } from '../../utils';
import { AccountState } from '../../store/reducers/server-reducer';
import { login } from '../../store/actions';
import { store } from '../../store';
import { RootState } from '../../store/reducers';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    margin: {
      margin: theme.spacing(1),
    },
    withoutLabel: {
      marginTop: theme.spacing(3),
    },
    textField: {
      width: '25ch',
    },
  }),
);

interface State {
  account: string;
  password: string;
  showPassword: boolean;
}

interface Props {
    loginSuccess: any,
    error: any,
    loginHandler: (email: string, password: string) => void
}

const _Login = ({ loginSuccess, error, loginHandler }: Props) => {

  const checkLoginStatus = () => {
    if (loginSuccess) {
      // 显示主界面
      const root = document.getElementById('root');
      if (root) {
        root.style.display = "block";
      }

      // 隐藏登录界面
      const login = document.getElementById('login');
      if (login) {
        login.style.display = "none";
      }
    }
  }
  
  checkLoginStatus();

  const [open, setOpen] = React.useState(true);
  const classes = useStyles();
  const [values, setValues] = React.useState<State>({
    account: '',
    password: '',
    showPassword: false,
  });

  const handleClose = () => {
    // 点背景不关闭
    // setOpen(false);
  };

  const handleLogin = () => {
    console.log("点到了登录");
    // const retInfo = await requestLogin(values.account, values.password);
    // console.log("数据返回:", retInfo);    
    loginHandler(values.account, values.password);

    // 显示转圈圈

    // setOpen(false);

    // // 发送http 消息，消息回来之后，才能进入主界面

  };


  const handleRegister = () => {
    // 弹出注册界面
    setOpen(false);
  };

  const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  // 可以直接在这里边写登录界面；
  // 然后点按钮弹出 注册的 dialog来
  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle
        id="form-dialog-title">XiXi加速器</DialogTitle>
      <DialogContent>
        <div>
          错误:{error}
        </div>
        <div>
          <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
            <InputLabel htmlFor="component-outlined">邮箱</InputLabel>
            <OutlinedInput
              id="component-outlined"
              type="email"
              value={values.account}
              onChange={handleChange('account')}
              label="邮箱"
              fullWidth
            />
          </FormControl>
        </div>
        <div>
          <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">密码</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={values.showPassword ? 'text' : 'password'}
              value={values.password}
              onChange={handleChange('password')}
              label="密码"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              fullWidth
            />
          </FormControl>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleLogin} color="primary">
          登录
          </Button>
        <Button onClick={handleRegister} color="primary">
          注册
          </Button>
      </DialogActions>
    </Dialog>
  );
}


// 建立外部的state 对象(RootState), 到当前UI内部的 Props 的映射关系
// state 对象位于 /store/reducers 的index.ts 中，里边包含所有的状态信息对象
// connect方法接受两个参数：mapStateToProps和mapDispatchToProps
// 前者负责输入逻辑，即将state映射到 UI 组件的参数（props） => 实现外部修改 state 内容, 来改变UI的效果
// 后者负责输出逻辑，即将用户对 UI 组件的操作映射成 Action => 实现点击按钮，对外抛出 action 事件，来触发 
const mapStateToProps = (state: RootState) => {
    return {
        loginSuccess: state.account.get('loginSuccess'),
        error: state.account.get('error'),
    }
}

const mapDispatchToProps = (dispatch: (arg: any) => void) => {
    return {
        loginHandler: (email: string, password: string) => dispatch(login(email, password))
    }
}

// mapStateToProps, mapDispatchToProps -> connect 的这两个参数，对应  _SideBar 的两个参数
// const _SideBar = ({ currentTab, switchTab }: Props)
// 当 server-saga.ts 捕获到登录事件的时候，会先发http消息，拿到结果后，会put结果，修改 state 内变量的值
// 这里 msg 发生变化时， _Login 就会重新走一遍, 从而实现刷新界面的效果
export const Login = connect(mapStateToProps, mapDispatchToProps)(_Login)

// 转成 类组件，可以直接 render 到 DOM 元素下
class LoginUI extends React.Component {
    render() {
        return <Provider store={store}>
                  <Login />
                </Provider>
    }
}

export default LoginUI


