import React,{useState} from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import TableCell,{tableCellClasses} from '@mui/material/TableCell';
import axios from 'axios';
import {styled} from '@mui/material/styles';
import {OnDeleteComponent, PasswordContainer} from '../utils/otherComponent';
import {deleteUserURL,deleteAdminURL,verifyPasswordURL, imageUserURL} from './../../constant/constantDataURL'
import {Dialog, DialogContent, Stack, Avatar, Box, Table, TableBody, TableRow, IconButton, Link, Typography} from '@mui/material';

const Cell = styled(TableCell)(({theme}) => ({
  [`&.${tableCellClasses.body}`]:{
    fontSize:'1rem',
    borderBottom: 'none',
  },
}))

export const roleColor = [{id:'ANON',value:'#a6a6a6'},{id:'USER',value:'#ff6600'},{id:'SELLER',value:'green'}
                          ,{id:'ADMINISTRATIF',value:'#0066ff'}]

export default function UserInfo(props) {
  const{data, setData, role, setError, setRespon} = props;
  const[disable, setDisable] = useState(false);
  const[state, setState] = useState();
  const[verify, setVerify] = useState(false);
  const[password, setPassword] = useState('');
  var onSuccess = "Delete user Success !!!";
  const color = roleColor;
  const handleDelete = () => {
    setDisable(true);
    var form = new FormData();
    form.append('password',password)
    axios.post(verifyPasswordURL,form,{
      withCredentials:true,
      headers:{
        'Content-Type':'multipart/form-data',
      }
    }).then(res => {
      if(role==="ADMINISTRATIF"||role==="MANAGER"){
        axios.delete(deleteUserURL,{
          withCredentials:true,
          params:{
            email: data.email
          }
        }).then(resp => {setDisable(false);setData(null);setVerify(false);setRespon(onSuccess);document.body.style='touch-action:auto;';}).catch(err => {
          if(err.response){
            setError(err.response.data.message)
          }else {
            setError(err.message)
          }
          setDisable(false);setData(null);setVerify(false);document.body.style='touch-action:auto;';})
      }
      else if (role==="MANAGER") {
        axios.delete(deleteAdminURL,{
          withCredentials:true,
          params:{
            email: data.email
          }
        }).then(resp => {setDisable(false);setData(null);setVerify(false);setRespon(onSuccess);document.body.style='touch-action:auto;';}).catch(err => {
          if(err.response){
            setError(err.response.data.message)
          }else {
            setError(err.message)
          }
          setDisable(false);setData(null);setVerify(false);document.body.style='touch-action:auto;';})
      }
    }).catch(err => {
      if(err.response){
        setError(err.response.data.message)
      }else {
        setError(err.message)
      }
      setDisable(false);setData(null);setVerify(false);document.body.style='touch-action:auto;'})
  }
  const handlePass = () => {
    setVerify(true);
    setState(false);
  }
  return (
    <>
      {(data)?
        (<Dialog open={Boolean(data)} onClose={() => {setData(null);document.body.style='touch-action:auto;';}} sx={{zIndex:(theme)=>theme.zIndex.drawer + 4}}>
          <DialogContent>
            <Stack spacing={2}>
              <Box justifyContent='center' alignItems='center' display='flex'>
                <Avatar sx={{width:'7rem',height:'7rem'}}
                  src={(data.image_url)?((data.image_url.substring(0,4) === 'http')?data.image_url:`${imageUserURL}${data.image_url}`):'data:image/jpg;base64,sadgyuasg'} alt={data.name}/>
              </Box>
              <Box sx={{maxWidth:'100%',overflow:'auto'}}>
                <Table>
                  <TableBody>
                    {[{id:'USER ID',value:data.id},{id:'USERNAME',value:data.name},
                      {id:'EMAIL',value:data.email},{id:'ROLE',value:data.role}].map((item, i) => (
                        <TableRow key={"user"+i}>
                          <Cell align='left'>
                            <b>{item.id}</b>
                          </Cell>
                          <Cell align='right'>
                            {(item.id === 'EMAIL')?(<Link href={`mailTo:${item.value}`}>{item.value}</Link>):
                              ((item.id === 'ROLE')?
                                <Box display='flex' justifyContent='flex-end'>
                                  <Typography sx={{color:'white',borderRadius:'.3rem',padding:'.2rem',backgroundColor:color.filter(data => data.id === item.value)[0].value}}>
                                    {item.value}
                                  </Typography>
                                </Box>:item.value)}
                          </Cell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </Box>
              <Box display='flex' justifyContent='flex-end'>
                <IconButton onClick={() => setState(true)} sx={{borderRadius:'10px', color:'#ffff',
                  backgroundColor:'#e60000', '&:hover':{backgroundColor:'#990000'}}}>
                  <DeleteIcon color='inherit'/></IconButton>
                <div style={{flexGrow:1}}/>
                <IconButton onClick={() => {setData(null);document.body.style='touch-action:auto;';}}
                  sx={{borderRadius:'10px', color:'#ffff', backgroundColor:'#ff9933', '&:hover':{backgroundColor:'#ff6600'}}}>
                  <CloseIcon color='inherit'/></IconButton>
              </Box>
            </Stack>
          </DialogContent>
        </Dialog>):(<></>)
      }
      <OnDeleteComponent onDelete={handlePass} title='Delete this User ?'
        content='Are you sure to delete this user, it cannot be undone after you delete it'
        onClose={() => setState(false)} open={state}/>
      <PasswordContainer isVerify={verify} setVerify={setVerify} password={password} setPassword={setPassword}
        onDelete={handleDelete} disabled={disable}/>
    </>
  )
}