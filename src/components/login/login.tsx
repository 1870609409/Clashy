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
export default function LoginDialog() {
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
    setOpen(false);

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
        id="form-dialog-title"
        root: {

        }
        >XiXi加速器</DialogTitle>
        <DialogContent>
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
