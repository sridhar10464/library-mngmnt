import React,{useState, useEffect} from 'react';
import axios from 'axios';
import LoginIcon from '@mui/icons-material/Login';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {useFetcher} from 'react-router-dom';
import GlobalStyles from '@mui/material/GlobalStyles'
// import {makeStyles} from '@mui/styles';
import {logInURL,pathOauthURL,pathOauthURLRedirect} from '../../../constant/constantDataURL';
import {Box,Typography,Button,Paper,Divider,TextField, Stack, InputAdornment, IconButton, Link, Alert,Snackbar} from '@mui/material';
const useStyle = GlobalStyles({
  textField:{
    '& label':{
      background:'white',
    },
    '& .MuiOutlinedInput-root': {
      color:'inherit',
      '& fieldset':{
        height:'inherit',
      },
    },
  },
  sizeDefaultButton:{
    fontSize:'1rem',
    '& .MuiButton-startIcon':{
      '& > *:first-of-type':{
        fontSize:'1.5rem',
      },
    },
  },
})

export default function Login(props) {
  const [view, setView] = useState(false);
  const [value, setValue] = useState({email:'',pass:''});
  const [error, setError] = useState();
  const [preventClick, setPreventClick] = useState(false);
  const history = useFetcher();
  const style = useStyle();
  useEffect(()=>{
    var param = new URLSearchParams(props.location.search);
    if(param){
      let au = param.get('auth');
      let err = param.get('err');
      if(au && err){
        setError(au);
      }
    }
  },[])
  const handleDefault = () => {
    setPreventClick(true)
    var user = new FormData();
    user.append('email',value.email);
    user.append('password',value.pass);
    axios.post(logInURL ,user,{
      withCredentials:true,
      headers:{
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => {if(res.data !== null){
      history.push('/');
    }})
    .catch(err => {
      if(err.response){
        setError(err.response.data.message)
      }else {
        setError(err.message)
      }
      setPreventClick(false);});
  }
  const handleKeyDown = (e) => {
    if(e.keyCode === 13){
      if(value.email && value.pass){
        handleDefault();
      }
      else{
        setError('please add all field')
      }
    }
  }
  return(
    <Box justifyContent='center' alignItems='center' display='flex' flexWrap='wrap' sx={{width:'100vw',height:'100vh'}}>
      <Box justifyContent='center' alignItems='center' display='flex' flexWrap='wrap'>
        <Box maxWidth="90vw">
          <Paper elevation={7} sx={{padding:'15px', minWidth:'250px', maxWidth:{xs:'100%',md:'30vw'}, borderRadius:'20px', marginBottom:'15px'}}>
            <Typography sx={{fontFamily:'Century Gothic', textAlign:'center', fontWeight:800, color: '#1a8cff',
              fontSize:'2rem'}}>Login</Typography>
            <Divider/>
            <Stack direction='column' spacing={2} sx={{marginTop:'20px'}}>
              <TextField className={style.textField} variant='outlined' label='Email' type='email' onKeyDown={handleKeyDown}
                value={value.email} onChange={e => setValue({...value, email: e.target.value})}/>
              <TextField
                type={(view)? 'text':'password'}
                value={value.pass}
                className={style.textField}
                onChange={e => setValue({...value, pass: e.target.value})}
                onKeyDown={handleKeyDown}
                InputProps={{
                  endAdornment:(
                    <InputAdornment position='end'>
                      <IconButton edge="end" sx={{fontSize:'1.5rem'}} onClick={() => setView(!view)}>{(view)? <Visibility fontSize='inherit'/>:<VisibilityOff fontSize='inherit'/>}</IconButton>
                    </InputAdornment>
                  )
                }}
                label='Password'
              />
              <Button variant='contained' className={style.sizeDefaultButton} startIcon={<LoginIcon/>} disabled={preventClick} onClick={handleDefault}>Login</Button>
            </Stack>
            <Divider sx={{marginTop:'20px',marginBottom:'20px'}}>OR</Divider>
            <Stack direction='column' spacing={2}>
              <Button variant='contained' className={style.sizeDefaultButton} sx={{background:'#00cc99', width:'100%', textTransform:'capitalize', '&:hover':{background:'#00b359'}}} startIcon={<GoogleIcon/>}
                href={pathOauthURL+"/google"+pathOauthURLRedirect}>Login with Google</Button>
              <Button variant='contained' className={style.sizeDefaultButton} sx={{ background:'#6666ff', width:'100%', textTransform:'capitalize'}} disabled={true} startIcon={<FacebookIcon/>}
                href={pathOauthURL+"/facebook"+pathOauthURLRedirect}>Login with Facebook</Button>
            </Stack>
          </Paper>
          <Link href='/signup' underline='none'>
            <Typography sx={{textAlign:'center',fontSize:'1rem',maxWidth:{xs:'100%',md:'30vw'}}}>You haven't registered yet, let's hurry up and register</Typography>
          </Link>
        </Box>
      </Box>
      <Snackbar anchorOrigin={{vertical:'top',horizontal:'center'}} open={Boolean(error)} onClose={() => setError(null)} autoHideDuration={6000}>
        <Alert variant="filled" severity="error" onClose={() => setError(null)} sx={{alignItems:'center'}}>
          Error:<br/>{error}
        </Alert>
      </Snackbar>
    </Box>
  );
}