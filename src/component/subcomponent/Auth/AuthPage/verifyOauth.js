import React,{useEffect, useState} from 'react';
import axios from 'axios';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {useFetcher} from 'react-router-dom';
import {valOauthURL} from '../../../constant/constantDataURL';
import {Box, Typography, Stack} from '@mui/material';
import './../../../css/loadVer.css';

export default function VerOAuth(props) {
  const [error, setError] = useState();
  const [respon, setRespon] = useState('Please wait until verification complete...');
  const history = useFetcher();
  useEffect(()=>{
    let param = new URLSearchParams(props.location.search);
    if(param){
      var accessId = param.get('Access');
      var name = param.get('Usr');
      var email = param.get('lk');
      var data = new FormData();
      data.append('email',email);
      data.append('username',name);
      data.append('id',accessId);
      axios.post(valOauthURL,data,{
        withCredentials:true,
        headers:{
          'Content-Type':'multipart/form-data',
        },
      }).then(res => {if (res.data !== null){
        setRespon('Verification Success, redirecting to home page...')
        history.push("/")
      }}).catch(err => {
        if(err.response){
          setError(err.response.data.message)
        }else {
          setError(err.message)
        }
      });
    }
  },[])
  return(
    <Box justifyContent='center' alignItems='center' display='flex' flexWrap='wrap' sx={{height:'100vh'}}>
      {(!error)? (
          <Stack spacing={2} direction='row' justifyContent='center' alignItems='center' display='flex' flexWrap='wrap'>
            <Box class="ball"/>
            <Box class="ball2"/>
            <Box class="ball3"/>
            <Typography sx={{width:'100%', textAlign:'center', color:'#ff6600', textShadow: '1px 1px #ff9933'
              , fontSize:'2rem', fontFamily: 'Candara', fontWeight:600}}>{respon}</Typography>
          </Stack>):(
            <Box sx={{background:'#ff9900', border:'5px solid #ff6600', borderRadius:'20px'}}>
              <Box justifyContent='center' alignItems='center' display='flex'><ErrorOutlineIcon
                sx={{width:'5rem', height:'5rem', color:'#ff3300', marginTop:'20px'}}/></Box>
              <Typography sx={{padding:'8px', color:'#ff3300', fontWeight:600, marginTop:'10px', marginBottom:'20px',
                fontFamily:'Candara', fontSize:'2rem'}}>Verification Failed, Please try again</Typography>
            </Box>
          )
      }
    </Box>
  );
}