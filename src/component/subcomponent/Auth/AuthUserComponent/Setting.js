import React,{useState,useEffect, useCallback} from 'react';
import axios from 'axios';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {styled} from '@mui/material/styles';
import {useFetcher} from 'react-router-dom';
import {profile, setProf} from './../../../funcredux/profile_redux';
import {setBookFav,setBookSeller} from './../../../funcredux/book_redux';
import {useSelector, useDispatch} from 'react-redux';
import {OnDeleteComponent, PasswordContainer, ContainerFeedback, getBase64, UploadImage} from '../../utils/otherComponent';
import {logOutURL, verUserURL, imageUserURL,upgradeUserURL,verifyPasswordURL,modifyUserURL,changePasswordURL,deleteUserOnlineURL} from './../../../constant/constantDataURL';
import {Typography, Stack, Box, Button, Drawer, Accordion, AccordionSummary, AccordionDetails, Snackbar, InputAdornment
  ,ButtonGroup, IconButton, Paper, Divider, TextField, Avatar, Table, TableBody, TableRow, TableCell,useMediaQuery} from '@mui/material';

const AccordionButton = styled(Button)({
  borderRadius:0,
  color:'#000000',
  backgroundColor:'rgba(0,0,0,.125)',
  borderColor:'transparent',
  '&:hover':{
    backgroundColor:'rgba(0,0,0,.3)'
  }
})

const MobileButton = styled(Button)({
  borderRadius:0,
  color:'#ffff',
  padding:'5rem',
  paddingTop:'1rem',
  paddingBottom:'1rem',
  fontSize:'1.1rem',
  backgroundColor:'#9999ff',
  borderColor:'transparent',
  '&:focus':{
    backgroundColor:'#0066cc',
  },
  '&:active':{
    backgroundColor:'#0066cc',
  }
})

const CustomTextField = styled(TextField)((props)=>({
  '& label':{
    color:'rgba(0, 0, 0, 0.2)',
    transition: (theme) => theme.transitions.create('color'),
    fontSize:'1rem',
  },
  '& label.Mui-focused':{
    color:'#000000',
  },
  '& .MuiInput-underline:after':{
    borderBottomColor:'#000000',
  },
  '& input':{
    width:'100%',
    fontSize:'1rem',
  },
  '& .MuiFormHelperText-root':{
    fontSize:'1rem',
  },
  '& .MuiInputBase-root': {
    color:'#000000',
    borderRadius:0,
    '& fieldset':{
      border:'none',
      borderBottom:'1px solid #000000',
      height:'inherit',
    },
    '&:hover fieldset':{
      border:'none',
      borderBottom:'2px solid #000000',
    },
    '&.Mui-focused fieldset': {
      borderBottom:'2px solid skyblue',
    },
  },
}))

function InfoPanel(props) {
  const {role, onUpgrade, id} = props;
  const color = [{role:'ANON',bg:'#33cccc',fg:'#0066ff'},{role:'USER',bg:'#ffb84d',fg:'#ff6600'}]
  var setColor = (role)?color.find((a)=>a.role===role):null
  const title = [{role:'ANON',title:"Verify Your Email"},{role:'USER',title:"Your Account Needs to be Upgraded"}]
  var setTitle = (role)?title.find((a)=>a.role===role):null
  const desc = [{role:'ANON',desc:"Please verify your email to become our members and you can download all books in here whatever you want"},
    {role:'USER',desc:"Upgrade your account to open new feature 'My Library' in your profile box, with this feature you can add or modify your own books"}]
  var setDesc = (role)?desc.find((a)=>a.role===role):null
  return(
    <>
      {(role)? (['ANON','USER'].includes(role))?
        <Paper id={id} sx={{backgroundColor:(setColor)?setColor.bg:'inherit',
          color:(setColor)?setColor.fg:'inherit', padding:'10px'}}>
          <Box display='block'>
            <Typography variant='h5' sx={{textAlign:'center',fontWeight:700,fontSize:'1.8rem'}}>{(setTitle)?setTitle.title:''}</Typography>
            <Divider/>
            <Typography sx={{marginTop:'10px',marginBottom:'10px',textAlign:'center'}}>{(setDesc)?setDesc.desc:''}</Typography>
            <Box display='flex' justifyContent='center'>
            {(role === 'USER')?
                <Button onClick={() => (onUpgrade)?onUpgrade(true):null}>Click here to upgrade your account</Button>:<></>
            }
            </Box>
          </Box>
        </Paper>:<></>:<></>
      }
    </>
  )
}
export default function Setting() {
  const sm = useMediaQuery('(max-width:600px)');
  const history = useFetcher();
  const dispatch = useDispatch();
  const prof = useSelector(profile);
  const [open, setOpen] = useState(false);
  const [imgOpen, setImgOpen] = useState(false);
  const [error, setError] = useState();
  const [preventClick, setPreventClick] = useState(false);
  const [upgrade,setUpgrade]=useState();
  const [img, setImg] = useState({data:null});
  const [imgFile, setImgFile] = useState();
  const [verify,setVerify]=useState(false);
  const [newPassword, setNewPassword] = useState({
    oldPassword:'',
    newPassword:''
  });
  const [password, setPassword] = useState();
  const [edit, setEdit] = useState();
  const [respon, setRespon] = useState();
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const handleChange = (ref) => (e) => {
    setData({...data, [ref]:e.target.value})
  }
  const handleLogout = () => {
    let id = prof.id
    axios.post(logOutURL,null,{
      withCredentials:true,
    }).then((a) => {dispatch(setProf(null));dispatch(setBookFav([]));dispatch(setBookSeller([]));
      axios.delete(deleteUserOnlineURL,{
        withCredentials:true,
        params:{
          id: id,
        },
      }).then(() => history.push("/?logout=1"))
      .catch(err => {
        if(err.response){
          setError(err.response.data.message)
        }else {
          setError(err.message)
        }
        history.push("/?logout=1");})}).catch(err => {
          if(err.response){
            setError(err.response.data.message)
          }else {
            setError(err.message)
          }
        })
    setOpen(false)
  }
  const getprof = useCallback((newItem)=>
    dispatch(setProf({
      id: newItem.id,
      name: newItem.name,
      email: newItem.email,
      role: newItem.role,
      imageUrl: newItem.image_url})),[dispatch])
  useEffect(()=>{
    axios.get(verUserURL,{
      withCredentials:true,
    }).then(res => {
      if (res.data){
        getprof(res.data);
        setData({name: res.data.name,
        email: res.data.email,
        password: null});
      }
    }).catch(err => {
      if(err.response){
        setError(err.response.data.message)
      }else {
        setError(err.message)
      }
      history.push('/login');})
  },[])
  const defaultVer = (
    <Paper sx={{width:'30%',maxWidth:'30%', display:{xs:'none', md:'block'}}}>
      <Stack>
        <Box display='flex' alignItems='center'>
          <IconButton sx={{color:'#000000', fontSize:'2.5rem', borderRadius:0, padding:'5px', paddingTop:'2rem', paddingBottom:'2rem'}} onClick={() => history.push('/')}>
            <ArrowBackIosNewIcon sx={{fontSize:'inherit'}}/>
            <SettingsIcon sx={{fontSize:'inherit'}}/>
          </IconButton>
          <Typography variant='h1' sx={{fontSize:'2.5rem',marginLeft:'5px'}}>Settings</Typography>
        </Box>
        <Accordion square>
          <AccordionSummary expandIcon={null} sx={{width:'100%','&:hover':{backgroundColor:'#e6e6e6'}}}>
            <Box display='flex' justifyContent='center' alignItems='center'>
              <ManageAccountsIcon sx={{fontSize:'4rem'}}/>
              <Typography sx={{fontSize:'2rem', marginLeft:'10px'}}>My Account</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{width:'100%',padding:0}}>
            <ButtonGroup
              orientation="vertical"
              variant="contained"
              color='inherit'
              sx={{width:'100%'}}
              >
                <AccordionButton href="#generalInfo">General Info</AccordionButton>
                {(prof && prof.role === 'USER')?
                  <AccordionButton href="#upg_acc_container">Upgrade Account</AccordionButton>:null
                }
            </ButtonGroup>
          </AccordionDetails>
        </Accordion>
        <Button variant='contained' color='error' sx={{textTransform:'capitalize',width:'100%',
          justifyContent:'flex-start',borderRadius:0, fontSize:'2rem','& .MuiButton-startIcon':{
            '& > *:first-of-type':{
              fontSize:'4rem',
            }
          }}} onClick={handleLogout} startIcon={<LogoutIcon/>}>
            LogOut
        </Button>
      </Stack>
    </Paper>
  )
  const mobileVer = (
    <>
      <Box sx={{display:{xs:'flex', md:'none'}, marginBottom:'1rem'}} alignItems='center'>
        <IconButton onClick={()=>setOpen(true)}><MenuIcon sx={{fontSize:'3rem'}}/></IconButton>
        <Typography variant='h1' sx={{fontSize:'3rem',marginLeft:'10px'}}>Settings</Typography>
      </Box>
      <Drawer anchor='left' open={Boolean(open)} onClose={() => setOpen(false)}>
        <Stack>
          <Box display='flex' alignItems='center' sx={{padding:'5px'}}>
            <Button onClick={()=>setOpen(false)} startIcon={<ArrowBackIosNewIcon/>}
             sx={{borderRadius:'5px',color:'black',fontSize:'2rem', textTransform:'capitalize',marginLeft:'5px',
             '& .MuiButton-startIcon':{'& > *:first-of-type':{fontSize:'2rem'}}}}>Settings</Button>
          </Box>
          <MobileButton variant='contained' href="/" onClick={()=>setOpen(false)}>Return Home</MobileButton>
          <MobileButton variant='contained' href="#generalInfo" onClick={()=>setOpen(false)}>General Info</MobileButton>
          {(prof && prof.role === "USER")?
            <MobileButton variant='contained' href="#upg_acc_container" onClick={()=>setOpen(false)}>Upgrade Account</MobileButton>:
            <></>
          }
          <MobileButton variant='contained' onClick={handleLogout}>LogOut</MobileButton>
        </Stack>
      </Drawer>
    </>
  )
  const handleUpgrade = () => {
    setPreventClick(true);
    var form = new FormData();
    form.append('password',password)
    axios.post(verifyPasswordURL,form,{
      withCredentials:true,
      headers:{
        'Content-Type':'multipart/form-data',
      }
    }).then(res => {
        axios.post(upgradeUserURL, null,{
          withCredentials:true,
        }).then(resp => {
              setUpgrade(false);setVerify(false);setPreventClick(false);setRespon('Upgrade Account Success !!!, please refresh this page');setPassword('');
            }).catch(err => {
              if(err.response){
                setError(err.response.data.message)
              }else {
                setError(err.message)
              }
              setUpgrade(false);setVerify(false);})
        }).catch(err => {
          if(err.response){
            setError(err.response.data.message)
          }else {
            setError(err.message)
          }
          setUpgrade(false);setVerify(false);setPreventClick(false);setPassword('');})
  }
  const handleImage = (e) => {
    var files = e.target.files[0];
    if(files){
      getBase64(files).then(imgRes => {setImg({...img, data:imgRes});setImgOpen(true);})
    }
  }
  const handleModif = () => {
    setPreventClick(true);
    var modifyForm = new FormData();
    modifyForm.append('name',(data.name)?data.name:prof.name)
    modifyForm.append('email',(data.email)?data.email:prof.email)
    modifyForm.append('image',imgFile)
    axios.put(modifyUserURL,modifyForm,{
      withCredentials:true,
    }).then(res => {if(res.data != null){
        getprof(res.data);
        setRespon('Modify Account Success !!!, please refresh this page');
        setPreventClick(false);
    }}).catch(err => {
      if(err.response){
        setError(err.response.data.message)
      }else {
        setError(err.message)
      }
      setPreventClick(false);})
  }

  const handleChangePassword = () => {
    setPreventClick(true)
    var changePass = new FormData();
    changePass.append('oldPassword',newPassword.oldPassword);
    changePass.append('newPassword',newPassword.newPassword);
    axios.post(changePasswordURL, changePass, {
      withCredentials:true,
      headers:{
        'Content-Type':'multipart/form-data',
      }
    }).then(a => {setRespon('Your Password has been Changed');
      setPreventClick(false);
      setNewPassword({newPassword:'', oldPassword:''})
    }).catch(err => {setError('Wrong Password');setPreventClick(false);})
  }
  return (
    <>
      <Stack direction={{xs:'column', md:'row'}} sx={{padding:'.5rem', display:'flex', flexWrap:{xs:'wrap', md:'nowrap'}}}>
        {defaultVer}
        {mobileVer}
        <Paper sx={{width:{xs:'100%',md:'70%'}, paddingTop:'2rem', paddingBottom:'2rem'}}>
          <Stack spacing={3} sx={{padding:'5px'}}>
            <Box id='generalInfo'>
              <Typography variant='h1' sx={{fontSize:'3rem',marginLeft:'10px',marginBottom:'.5rem', textAlign:'center'}}>General Info</Typography>
              <Divider/>
            </Box>
            <Box display='flex' justifyContent='center' alignItems='center' flexWrap='wrap'>
              <label htmlFor='fotouser-setting'>
                <Avatar component='span' sx={{width:'7rem',height:'7rem', fontSize:'3.2rem', marginTop:'20px'}}
                  src={(img.data)? img.data : (prof && prof.imageUrl)?
                    ((prof.imageUrl.substring(0,4)==='http')?prof.imageUrl:`${imageUserURL}${prof.imageUrl}`) : "sGd4TFc/"} alt={(prof)?prof.name:''}/>
              </label>
              <input id='fotouser-setting' type='file' accept="image/*"
                disabled={(prof && prof.imageUrl)? ((prof.imageUrl.substring(0,4)==='http')?true:false):false} onChange={handleImage} style={{display:'none'}}/>
              <Typography sx={{width:'100%',textAlign:'center',color:'#bfbfbf',fontSize:'1rem'}}>
                {(prof && prof.imageUrl)?((prof.imageUrl.substring(0,4)==='http')?
                  '':'(click avatar to change your image)'):'(click avatar to change your image)'
                }
              </Typography>
            </Box>
            <Table sx={{display:'flex',justifyContent:'center'}}>
              <TableBody>
                {(prof)?
                    [{title:'Username', data:data.name, ref:'name',helpText:'(Click Edit Icon to change)'},
                    {title:'Email', data:data.email, ref:'email',helpText:'(Click Edit Icon to change)'},
                    {title:'Your Role', data: prof.role, ref:'role',helpText:''}].map(item => (
                      <TableRow key={item.title} sx={{display:(sm)?'block':'table-row'}}>
                        <TableCell align='left' sx={{border:'none',display:((sm && item.ref === 'role') || !sm)?'table-cell':'none',verticalAlign: 'middle'}}>
                          <Typography sx={{fontSize:'1.3rem'}}>{item.title}</Typography></TableCell>
                        {(item.ref !== 'role')?
                          <TableCell align='left' sx={{border:'none'}}>
                            <CustomTextField variant='outlined'
                              size='small' value={item.data} onChange={handleChange(item.ref)} helperText={item.helpText} label={(sm)?item.title:null}
                              InputProps={{
                                readOnly: (edit !== item.title)?true:false,
                                endAdornment:(
                                  <InputAdornment position='end'>
                                    <IconButton sx={{color:'skyblue'}}
                                      onClick={() => setEdit(item.title)}>
                                      <EditIcon color='inherit' sx={{fontSize:'2rem'}}/>
                                    </IconButton>
                                  </InputAdornment>
                                )
                              }}/>
                          </TableCell>:
                          <TableCell align='left' sx={{border:'none'}}>
                            <Typography sx={{textAlign:'center',fontSize:'1rem',borderRadius:'10px',padding:'10px',backgroundColor:'green',
                              color:'white',fontWeight:900}}>{item.data}</Typography>
                          </TableCell>
                        }
                      </TableRow>
                    )):<></>
                }
              </TableBody>
            </Table>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{fontSize:'1.2rem'}}>Change Your Password ? </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <CustomTextField type='text' variant='outlined' value={newPassword.oldPassword}
                    onChange={e => setNewPassword({...newPassword, oldPassword:e.target.value})} label='Old Password'/>
                  <CustomTextField type='password' variant='outlined' value={newPassword.newPassword}
                    onChange={e => setNewPassword({...newPassword, newPassword:e.target.value})} label='New Password'/>
                  <Button variant="contained" disabled={preventClick} onClick={handleChangePassword}>Change Password</Button>
                </Stack>
              </AccordionDetails>
            </Accordion>
            {(prof)?
              <>
                <InfoPanel id='upg_acc_container' role={prof.role} onUpgrade={setUpgrade}/>
                {(img.data || data.name !== prof.name || data.email !== prof.email)?
                  <Box display='flex'>
                    <Button disabled={preventClick} onClick={handleModif}>Save Changes</Button>
                    <Button onClick={() => {
                      setData({...data, name:(prof)?prof.name:'', email:(prof)?prof.email:''});
                      setImg({...img, data:null});
                      setEdit(null)}}>Cancel</Button>
                  </Box>:<></>
                }
              </>:<></>
            }
          </Stack>
        </Paper>
      </Stack>
      <UploadImage id='user-upload-img' open={imgOpen} setOpen={setImgOpen} img={img} setImg={setImg} imgStore={setImgFile}/>
      <OnDeleteComponent onDelete={() => setVerify(true)} title='Upgrade Your Account ?'
        content='Are you sure to upgrade your account to become Seller ?'
        onClose={() => setUpgrade(false)} open={upgrade} buttonTitle='Upgrade'/>
      <PasswordContainer isVerify={verify} setVerify={setVerify} isPassword={password} setPassword={setPassword}
        onDelete={handleUpgrade} buttonTitle='Verify' disabled={preventClick}/>
      <Snackbar anchorOrigin={{vertical:'top',horizontal:'center'}} onClose={() => {setError(null);setRespon(null)}} open={Boolean((respon)?respon:error)} autoHideDuration={6000}>
        <ContainerFeedback severity={(respon)? 'success':'error'} onClose={() => {setError(null);setRespon(null)}}>
          {(respon)? respon:error}
        </ContainerFeedback>
      </Snackbar>
    </>
  );
}