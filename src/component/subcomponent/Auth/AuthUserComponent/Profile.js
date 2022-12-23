import React, {useEffect, useState} from 'react';
import axios from 'axios';
import SettingsIcon from '@mui/icons-material/Settings';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import PeopleIcon from '@mui/icons-material/People';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {useFetcher} from 'react-router-dom';
import GlobalStyles from '@mui/material/GlobalStyles'
// import {makeStyles} from '@mui/styles';
import {useSelector, useDispatch} from 'react-redux';
import {ContainerFeedback} from '../../utils/otherComponent';
import {profile, setProf, setOnline, userOnline} from './../../../funcredux/profile_redux';
import {Typography, Box, IconButton, Avatar, Skeleton, Chip, Divider, Button, Snackbar} from '@mui/material';
import {verUserURL,imageUserURL,addUserOnlineURL,deleteUserOnlineURL} from './../../../constant/constantDataURL';

const useStyle = GlobalStyles({
  root:{
    background: '#009999',
    width: '100%',
    display:'flex',
    flexWrap:'wrap',
    alignItems:'flex-start',
    justifyContent:'center',
  },
  avatar: {
    width: '8rem',
    height: '8rem',
    fontSize: '4rem',
    background: '#006666',
    marginTop: '20px',
    marginBottom: '20px',
  },
  chip:{
    color: '#ffff',
    marginRight: '5px',
    fontSize:'1.3rem',
    borderRadius:'1rem',
    padding:'.8rem',
    '& .MuiChip-label':{
      fontSize:'1rem',
    },
  },
  font: {
    fontFamily: 'Candara',
    color: '#e6e6e6',
    paddingBottom: '20px',
    fontSize:'1.3rem',
  },
  font1: {
    color: '#ffff',
    marginTop: '20px',
    fontSize:'1.5rem',
  },
  subfont:{
    color: '#cccccc',
    fontSize:'1rem',
  },
  button: {
    background:'rgba(0,0,0,0.2)',
    borderRadius: 0,
    width:'100%',
    height:'5rem',
    fontSize:'1.2rem',
    textTransform:'capitalize',
    '&:hover':{
        background:'rgba(0,0,0,0.5)'
    },
  },
  buttonReturn: {
    color:'white',
    fontSize:'1rem',
    '& .MuiButton-startIcon':{
      '& > *:first-of-type':{
        fontSize:'1.3rem',
      }
    }
  },
  skeleton1: {
    width: '15%',
    height: '2rem',
    borderRadius: '20px',
    marginRight: '10px',
  },
  skeleton2: {
    width: '2rem',
    height: '2rem',
    marginRight: '10px',
  },
  skeleton3: {
    marginTop: '20px',
    width: '90%',
    height: '2rem',
    borderRadius: '20px',
  },
  skeleton4: {
    marginTop: '30px',
    marginBottom: '30px',
    width: '8rem',
    height: '8rem',
  },
  skeleton5: {
    width: '90%',
    height: '2rem',
    borderRadius: '20px',
    marginBottom: '10px',
  },
});

export default function Profile(props) {
  const {container,path} = props;
  const [error, setError] = useState();
  const [respon, setRespon] = useState();
  const style = useStyle();
  const history = useFetcher();
  const dispatch = useDispatch();
  const userProfile = useSelector(profile);
  const isOnline = useSelector(userOnline);

  useEffect(() => {
    axios.get(verUserURL,{
      withCredentials:true,
    }).then(res => {if (res.data){
      dispatch(setProf({...userProfile,
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        imageUrl: res.data.image_url}))
      setRespon(true);
      if(window.navigator.onLine){
        if(!isOnline){
          var id = new FormData();
          id.append('id',res.data.id)
          axios.post(addUserOnlineURL,id,{
            withCredentials:true,
          }).then(resp => dispatch(setOnline(true)))
          .catch(err => {
            if(err.response){
              setError(err.response.data.message)
            }else {
              setError(err.message)
            }
          })
        }
      }
      else{
        axios.delete(deleteUserOnlineURL,{
          withCredentials:true,
          params:{
            id: res.data.id,
          },
        }).then(resp => dispatch(setOnline(false)))
        .catch(err => {
          if(err.response){
            setError(err.response.data.message)
          }else {
            setError(err.message)
          }
        })
      }
      if(container === "library"){
        if(res.data.role !== 'SELLER') {
          history.push("/login")
        }
      }
      else if (container === "user") {
        if(!['ADMINISTRATIF','MANAGER'].includes(res.data.role)) {
          history.push("/login")
        }
      }
    }
    else {
      setError("You`re offline, connect it to internet, and try again");
    }}).catch(err => {if(userProfile){
      if(err.response){
        setError(err.response.data.message)
      }else {
        setError(err.message)
      }
    } if(container){history.push("/login")}})
  },[]);
  const preload = (
    <>
      <Box display='flex' alignItems='center' justifyContent='flex-end' style={{paddingTop:'10px', width:'100%'}}>
        <Skeleton className={style.skeleton1} variant='rectangular'/>
        <Skeleton className={style.skeleton1} variant='rectangular'/>
        <Skeleton className={style.skeleton2} variant='circular'/>
      </Box>
      <Skeleton className={style.skeleton3} variant='rectangular'/>
      <Skeleton className={style.skeleton4} variant='circular'/>
      <Skeleton className={style.skeleton5} variant='rectangular'/>
      <Skeleton className={style.skeleton5} style={{paddingBottom:'20px'}} variant='rectangular'/>
    </>
  );
  const log = (
    <Button variant='contained' className={style.button} onClick={() => history.push('/login')}>Login / SignUp</Button>
  )
  return(
      <>
        {
          (respon)? (
            <>
              <Box display='flex' alignItems='center' justifyContent='flex-end' width='100%' padding='10px'>
                {(path)?
                  <>
                    <Box display='flex' sx={{flexGrow:1}}>
                    <Button className={style.buttonReturn} href={path}
                      startIcon={<ArrowBackIosIcon/>}>Return</Button>
                    </Box>
                  </>:<></>
                }
                {
                  (userProfile.role === 'MANAGER' || userProfile.role === 'ADMINISTRATIF')?
                  (<Chip className={style.chip} icon={<PeopleIcon style={{color:'#ffff',fontSize:'inherit'}}/>} label="Users" onClick={() => history.push("/hstdyw-admin")}/>):<></>
                }
                {(userProfile.role === 'SELLER')?
                  <Chip className={style.chip} icon={<LocalLibraryIcon style={{color:'#ffff',fontSize:'inherit'}}/>} label="My Library" onClick={() => history.push("/my-library")}/>:<></>
                }
                <IconButton style={{color:'#ffff', marginRight: '5px'}} fontSize='small' onClick={() => history.push("/setting")}><SettingsIcon sx={{fontSize:'1.5rem'}}/></IconButton>
              </Box>
              <Typography className={style.font1} variant='h5' width='100%' textAlign='center'><b>{userProfile.name}</b></Typography>
              <Avatar className={style.avatar} src={(userProfile.imageUrl)?
                ((userProfile.imageUrl.substring(0,4) === 'http')?userProfile.imageUrl:`${imageUserURL}${userProfile.imageUrl}`) :  "sGd4TFc/"} alt={userProfile.name}/>
              <Typography className={style.font} variant='h6' width='100%' textAlign='center'>
                {userProfile.email}<br/>
                <Divider style={{background:'#ffff'}} light variant='middle'/>
                <span className={style.subfont}><i>{userProfile.role}</i></span>
              </Typography>
            </>
          ):(
          <>
            {preload}
            {log}
          </>)
          }
          <Snackbar anchorOrigin={{vertical:'top',horizontal:'center'}} open={Boolean(error)} onClose={() => setError(null)}
            autoHideDuration={4000} sx={{zIndex: (theme) => theme.zIndex.drawer + 5}}>
            <ContainerFeedback severity='error' onClose={() => setError(null)}>
              {error}
            </ContainerFeedback>
          </Snackbar>
      </>
  );
}