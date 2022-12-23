import React,{useState,useEffect} from 'react';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import axios from 'axios';
import UserInfo,{roleColor} from './User';
import {styled} from '@mui/material/styles';
import {OnDeleteComponent, PasswordContainer, Search} from '../utils/otherComponent';
import {upgradeAdminURL,getReportURL,verifyPasswordURL} from './../../constant/constantDataURL';
import {Paper, Table, TableContainer, TableHead, TableBody, TableCell, TableRow, IconButton,
  TablePagination, Box, Typography, useMediaQuery,Button, TextField,Drawer, Stack} from '@mui/material';

const Cell = styled(TableCell)(({theme}) => ({
  fontSize: '1rem',
}))

export default function UserBuilder(props) {
  const{setError, type, setRespon, role, urlMainData} = props;
  const[users, setUsers] = useState([]);
  const[disabled, setDisabled] = useState(false);
  const[rowsPerPage, setRowsPerPage] = useState({value:10});
  const[searchValue, setSearchValue] = useState("");
  const[allDataCountsSearch, setAllDataCountsSearch] = useState(0);
  const[openCustomReport, setOpenCustomReport] = useState(false)
  const[valueCustomReport, setValueCustomReport] = useState({start:'',end:''})
  const[page, setPage] = useState(0);
  const[verify, setVerify] = useState(false);
  const[password, setPassword] = useState('');
  const[admin, setAdmin] = useState();
  const[info, setInfo] = useState();
  const sm = useMediaQuery('(min-width:500px)');
  const handleClickSearch = () => {
    if((type==='admin'&&role==='MANAGER')||(type==='user'&&(role==='MANAGER'||role==='ADMINISTRATIF'))){
      axios.get(urlMainData,{
        withCredentials:true,
        params:{
          words: searchValue,
          page: 0,
          size: rowsPerPage.value,
        }
      }).then(res => {
        if(res.data !== null){
          setUsers(res.data.data);
          setAllDataCountsSearch(res.data.sizeAllData);
        }
        else{
          setError("there is an incorrect response from server, please try again");
        }
      })
      .catch(err => {
        if(err.response){
          setError(err.response.data.message)
        }else {
          setError(err.message)
        }
      })
    }
  }
  useEffect(()=>{
    handleClickSearch()
  },[])

  const handleChangePageSearch = (dataSize,n) => {
    setPage(n)
    axios.get(urlMainData, {
      withCredentials:true,
      params:{
        words: searchValue,
        page: n,
        size: (dataSize.dt)?dataSize.dt:rowsPerPage.value,
      }
    }).then(res => {if(res.data !== null){
      setUsers(res.data.data);
      setAllDataCountsSearch(res.data.sizeAllData);
    }})
    .catch(err => {
      if(err.response){
        setError(err.response.data.message)
      }else {
        setError(err.message)
      }
    })
  }
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage({...rowsPerPage, value:parseInt(e.target.value,10)})
    setPage(0)
    handleChangePageSearch({dt:parseInt(e.target.value,10)},0)
  }
  const addOrRemoveAdmin = () => {
    return new Promise(function(success, error) {
      setDisabled(true);
      var form = new FormData();
      form.append('password',password)
      axios.post(verifyPasswordURL,form,{
        withCredentials:true,
        headers:{
          'Content-Type':'multipart/form-data',
        }
      }).then(res => success(res.data))
      .catch(err => {
        if(err.response){
          error(err.response.data.message)
        }else {
          error(err.message)
        }})
      })
  }

  const handleAddAdmin = (email) => (e) => {
    var form = new FormData();
    form.append('email',email)
    form.append('delete',false)
    addOrRemoveAdmin().then(res =>
      axios.post(upgradeAdminURL,form,{
        withCredentials:true,
        headers:{
          'Content-Type':'multipart/form-data',
        }
      }).then(res => {setDisabled(false);setRespon('Success to promoted new Admin !!!, please refresh this page');setAdmin(null);
        setInfo(null);setVerify(false);setPassword('');}).catch(err => {
          if(err.response){
            setError(err.response.data.message)
          }else {
            setError(err.message)
          }
          setDisabled(false);setAdmin(null);setInfo(null);setVerify(false);setPassword('');}))
    .catch(err => {setError(err);setDisabled(false);setAdmin(null);setInfo(null);setVerify(false);setPassword('');})
  }
  const handleDeleteAdmin = (email) => (e) => {
    var form = new FormData();
    form.append('email',email)
    form.append('delete',true)
    addOrRemoveAdmin().then(res =>
      axios.post(upgradeAdminURL,form,{
        withCredentials:true,
        headers:{
          'Content-Type':'multipart/form-data',
        }
      }).then(res => {setDisabled(false);setRespon('Success to demoted Admin !!!, please refresh this page');setAdmin(null);
        setInfo(null);setVerify(false);setPassword('');}).catch(err => {
          if(err.response){
            setError(err.response.data.message)
          }else {
            setError(err.message)
          }
          setDisabled(false);setAdmin(null);setInfo(null);setVerify(false);setPassword('');}))
    .catch(err => {setError(err);setDisabled(false);setAdmin(null);setInfo(null);setVerify(false);setPassword('');})
  }
  const onReport = (start,end) => {
    if(start && end){
      var data = new FormData();
      var saver = require('file-saver')
      data.append('start',start);
      data.append('end',end);
      axios.post(getReportURL, data,{
        withCredentials:true,
        headers:{
          'Content-Type':'multipart/form-data',
        }
      }).then(res => {if(res.data != null){saver.saveAs(`data:application/vnd.ms-excel;base64,${res.data}`,`${start}-${end}.xlsx`)}})
      .catch(err => {
        if(err.response){
          setError(err.response.data.message)
        }else {
          setError(err.message)
        }
      })
    }
    else{
      setError('please input all field !!!');
    }
  }
  const onKeyDown = (e) => {
    if(e.keyCode === 13){
      onReport(valueCustomReport.start,valueCustomReport.end);
    }
  }
  return(
    <>
      <Paper sx={{padding:'5px', paddingTop:'20px', display:'flex', justifyContent:'center', flexWrap:'wrap'}}>
        <Box width='100%' marginLeft='10px'>
          <Search id={"filter-search-user-"+type} value={searchValue} onChange={e => setSearchValue(e.target.value)}
            placeholder='Search...' onDelete={() => setSearchValue("")} btnFilterStyle={{display:'none'}}
            onClickSearch={handleClickSearch}/>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {['ID','Username','Email','Role','Status',''].map((title,i) => (
                  <Cell key={"header"+type+i} align='center'>
                    {title}
                  </Cell>
                ))
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {(users && users.length)?
                (users.map((data, index) => (
                  <TableRow key={"row"+type+index} hover onClick={() => {setInfo(data);document.body.style='touch-action:none;';}}>
                    {
                      [page*rowsPerPage.value+index+1,data.name,data.email,data.role,data.status].map((item,i) =>(
                        <Cell key={"cell"+type+i} align='center'>
                          {(i < 4)?((i > 2)?
                              <Box display='flex' justifyContent='center' alignItems='center'>
                                <Typography sx={{color:'white',borderRadius:'.3rem',padding:'.2rem',backgroundColor:roleColor.filter(color => color.id === item)[0].value}}>{item}</Typography>
                              </Box>:item
                            ):((item)?
                              <Box justifyContent='center' alignItems='center' display='flex'>
                                <Brightness1Icon sx={{color:'lime', marginRight:'10px'}}/> Online
                              </Box> : <Box justifyContent='center' alignItems='center' display='flex'>
                                <Brightness1Icon sx={{marginRight:'10px'}}/> Offline</Box>)
                          }
                        </Cell>
                      ))
                    }
                    <Cell>
                    {(type==='user'&&data.role!=='SELLER')?
                      <IconButton onClick={e => {e.stopPropagation();setAdmin({name:data.name,email:data.email,type:type});}}><AddBoxIcon color='success'/></IconButton>
                        :<></>
                    }
                    {(type==='admin')?
                      <IconButton onClick={e => {e.stopPropagation();setAdmin({name:data.name,email:data.email,type:type});}}><RemoveCircleIcon color='error'/></IconButton>
                        :<></>
                    }
                    </Cell>
                  </TableRow>
                ))):(
                  <></>
                )
              }
            </TableBody>
          </Table>
        </TableContainer>
        <Box width='100%'>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={allDataCountsSearch}
          rowsPerPage={rowsPerPage.value}
          page={page}
          onPageChange={handleChangePageSearch}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        </Box>
        <Button sx={{margin:'10px'}} variant='contained'
          onClick={() => onReport(new Date(Date.now()-(1000*60*60*24*365)).toLocaleString("en-US"),new Date().toLocaleString("en-US"))}>Annual Report</Button>
        <Button sx={{margin:'10px'}} variant='contained' color='success'
          onClick={() => onReport(new Date(Date.now()-(1000*60*60*24*30)).toLocaleString("en-US"),new Date().toLocaleString("en-US"))}>Mothly Report</Button>
        <Button sx={{margin:'10px'}} variant='contained' color='warning' onClick={() => setOpenCustomReport(true)}>Custom Report</Button>
      </Paper>
      <Drawer
        anchor='bottom'
        open={openCustomReport}
        sx={{background:'transparent'}}
        PaperProps={{style:{borderRadius:'10px 10px 0px 0px'}}}
        onClose={() => setOpenCustomReport(false)}
      >
        <Stack direction={(sm)?'row':'column'} spacing={2} sx={{paddingTop:'1rem',paddingBottom:'1rem'}} justifyContent='center' alignItems='center' onClick={e => e.preventDefault()}>
          <TextField size='small' label='start date' onChange={e => setValueCustomReport({...valueCustomReport, start:e.target.value})}
            placeholder='M/d/yyyy' onKeyDown={onKeyDown}/>
          <TextField size='small' label='end date' onChange={e => setValueCustomReport({...valueCustomReport, end:e.target.value})}
            placeholder='M/d/yyyy' onKeyDown={onKeyDown}/>
          <Button variant='contained' color='warning' onClick={() => onReport(valueCustomReport.start,valueCustomReport.end)}>Get Report</Button>
        </Stack>
      </Drawer>
      <PasswordContainer isVerify={verify} setVerify={setVerify} password={password} setPassword={setPassword}
        onDelete={admin?(admin.type==='user'?handleAddAdmin(admin.email):handleDeleteAdmin(admin.email)):null} disabled={disabled}/>
      <UserInfo data={info} setData={setInfo} setError={setError} role={role} setRespon={setRespon}/>
      <OnDeleteComponent onDelete={() => setVerify(true)}
        title={admin?(admin.type==='user'?'Add to administration ?':'Remove from administration ?'):null}
        content={admin?(admin.type==='user'?`Are you sure to add ${admin.name} to become administration ?`
          :`Are you sure to remove ${admin.name} from administration ?`):null}
        onClose={() => setAdmin(null)} open={admin} buttonTitle={admin?(admin.type==='user'?'Add':'Remove'):null}/>
    </>
  )
}