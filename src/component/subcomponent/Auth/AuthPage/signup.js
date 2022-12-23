import React,{useState} from 'react';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import {signUpURL} from './../../../constant/constantDataURL';
import {useFetcher} from 'react-router-dom';
import {getBase64, UploadImage} from '../../utils/otherComponent';
import {Paper, Box, Stack, Typography, Button, TextField, InputAdornment, Divider, Avatar, Alert, Snackbar} from '@mui/material';

export default function SignUp() {
  const [data, setData]=useState({
    name:'',
    password:'',
    email:'',
    verPassword:''
  });
  const [img, setImg] = useState({data:null})
  const [imgFile, setImgFile] = useState()
  const [open, setOpen] = useState(false)
  const [error, setError]=useState()
  const [verPass, setVerPass] = useState();
  const [preventClick, setPreventClick] = useState(false);
  const history = useFetcher();
  const handlesignUpURL = () => {
    setPreventClick(true)
    let user = new FormData()
    user.append('name',data.name)
    user.append('password',data.password)
    user.append('email',data.email)
    user.append('image',imgFile)
    axios.post(signUpURL, user,{
      withCredentials:true,
    }).then(res => {if(res.data !== null) {
      history.push("/?verify=1")
    }})
    .catch(err => {
      if(err.response){
        setError(err.response.data.message)
      }else {
        setError(err.message)
      }
      setPreventClick(false);})
  }
  const handleVerPass= (e) => {
    if(data.password && e.target.value===data.password){
      setVerPass(false);
    }
    else{
      setVerPass(true);
    }
    setData({...data, verPassword: e.target.value})
  }
  const handleImage= (e) => {
    var files = e.target.files[0];
    if(files){
      getBase64(files).then(imgRes => {setImg({...img,data:imgRes});setOpen(true);})
    }
  }
  const handleKeyDown = (e) => {
    if(e.keyCode === 13){
      if(data.name && data.password && data.email && data.verPassword === data.password){
        handlesignUpURL();
      }
      else{
        setError('please add all field')
      }
    }
  }
  return(
    <Box justifyContent='center' alignItems='center' display='flex' sx={{height:'100vh'}} flexWrap='wrap'>
      <Box>
        <Paper elevation={7} sx={{borderRadius:'20px', minWidth:'250px', maxWidth:'100%', padding:'15px'}}>
          <Typography sx={{fontFamily:'Century Gothic', textAlign:'center', fontWeight:800, color: '#1a8cff',
            fontSize:'2rem'}}>Sign Up</Typography>
          <Divider/>
          <Box justifyContent='center' alignItems='center' display='flex' sx={{marginTop:'20px'}}>
            <label htmlFor='fotouser'>
              <input id='fotouser' type='file' accept="image/*" onChange={handleImage} style={{display:'none'}}/>
              <Button sx={{backgroundColor:'#f2f2f2', borderRadius:'50%', width:'7rem',
                height:'7rem', '&:hover':{backgroundColor:'#d9d9d9'}}} component='span'>{
                (img.data)? <Avatar src={img.data} sx={{width:(th) => th.spacing(10), height:(th) => th.spacing(10)}}/>:<AddPhotoAlternateIcon/>
              }</Button>
            </label>
          </Box>
          <Stack direction='column' spacing={2} sx={{marginTop:'20px'}}>
            <TextField placeholder='Username' variant='outlined' onKeyDown={handleKeyDown} value={data.name} onChange={e => setData({...data, name: e.target.value})}
              InputProps={{
                startAdornment:
                  (<InputAdornment position='start'>
                    <PersonIcon/>
                  </InputAdornment>)
            }}/>
            <TextField placeholder='Email' variant='outlined' onKeyDown={handleKeyDown} value={data.email} onChange={e => setData({...data, email: e.target.value})}
              InputProps={{
                startAdornment:
                  <InputAdornment position='start'>
                    <AlternateEmailIcon/>
                  </InputAdornment>
            }} type='email'/>
            <TextField placeholder='Password' variant='outlined' onKeyDown={handleKeyDown} value={data.password} onChange={e => setData({...data, password: e.target.value})}
              InputProps={{
                startAdornment:
                  <InputAdornment position='start'>
                    <LockIcon/>
                  </InputAdornment>
            }} type='password'/>
            <TextField placeholder='Verify Password' onKeyDown={handleKeyDown} variant='outlined' value={data.verPassword} onChange={handleVerPass} error={verPass}
              InputProps={{
                startAdornment:
                  <InputAdornment position='start'>
                    <LockOpenIcon/>
                  </InputAdornment>
            }} type='password' helperText={verPass? "Incorrect entry":""}/>
            <Box justifyContent='center' alignItems='center' display='flex'>
              <Button variant='contained' onClick={handlesignUpURL} disabled={preventClick || verPass || !data.verPassword || !data.name || !data.email || !data.password}>SignUp</Button>
            </Box>
          </Stack>
        </Paper>
      </Box>
      <UploadImage open={open} setOpen={setOpen} img={img} setImg={setImg} imgStore={setImgFile}/>
      <Snackbar anchorOrigin={{vertical:'top',horizontal:'center'}} open={Boolean(error)} onClose={() => setError(null)} autoHideDuration={6000}>
        <Alert variant="filled" severity="error" onClose={() => setError(null)} sx={{alignItems:'center'}}>
          Error:<br/>{error}
        </Alert>
      </Snackbar>
    </Box>
  );
};