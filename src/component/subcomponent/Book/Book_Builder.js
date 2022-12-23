import React, {useState} from 'react';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import {profile} from './../../funcredux/profile_redux';
import {addBookURL, modifyBookURL, getOneMyBookURL} from './../../constant/constantDataURL';
import {useSelector} from 'react-redux';
import {bookThemes} from './../../funcredux/book_redux';
import {ModifyBook, ContainerFeedback, UploadImage, Search} from '../utils/otherComponent';
import {Typography, Box, Stack, Tab, Tabs, Snackbar, Button, useMediaQuery} from '@mui/material'

export default function BookBuilder(props) {
  const {mainProps,onLinkMainTab} = props;
  const themes = useSelector(bookThemes);
  const [openAdd, setOpenAdd] = useState(false);
  const [imgFileAdd, setImageFileAdd] = useState();
  const [imgAdd, setImgAdd] = useState({data:null});
  const [openModify, setOpenModify] = useState(false);
  const [imgFileModify, setImageFileModify] = useState();
  const [imgModify, setImgModify] = useState({data:null});
  const [changeTabBuilder, setChangeTabBuilder]=useState(0);
  const [title, setTitle] = useState('');
  const [publisher, setPublisher] = useState('');
  const [respon, setRespon] = useState();
  const [error, setError] = useState();
  const prof = useSelector(profile);
  const md = useMediaQuery('(min-width:900px)')
  const modifyBookContainer = React.useCallback(()=>{
    return <ModifyBook id='modify-modify-book' onError={setError} onSuccess={setRespon} themes={themes} prof={prof} imgFile={imgFileModify}
      labelButton='Modify Book' imgView={imgModify} setImgView={setImgModify} imgCallback={setOpenModify} url={modifyBookURL}
      responText='Modify Book Successfully !!!, please refresh this page' spacing={2} rootProps={mainProps} onRootLink={onLinkMainTab}
      onMainLink={setChangeTabBuilder} modify={true} sx={{padding:'20px',paddingTop:'10px',backgroundColor:'#ff6600',
      borderRadius:'20px',boxShadow:'0px -10px 10px -10px black'}}/>
  },[imgModify,imgFileModify])
  const handleClickSearch = () => {
    if(title && publisher){
      axios(getOneMyBookURL, {
        method:'get',
        withCredentials:true,
        params: {title:title,publisher:publisher},
      }).then(res => {
        if(res.data != null){
          let loc = encodeURI(`id=${res.data.id}&title=${res.data.title}&publisher=${JSON.stringify(res.data.publisher)}
            &description=${res.data.description}&theme=${JSON.stringify(res.data.theme)}&image=${res.data.image}&file=${res.data.title}`);
          window.location.href = `/my-library?${loc}`;
        }}).catch(err => {
          if(err.response){
            setError(err.response.data.message)
          }else {
            setError(err.message)
          }
        })
    }else{setError('Must fill all field !!!')}
  }
  return(
    <>
      <Box display='flex' justifyContent='center' alignItems='flex-start' flexWrap='wrap' padding='10px'>
        <Typography sx={{
          color:'#ffff',
          fontFamily:'Bodoni MT',
          width:'100%',
          fontWeight:700,
          marginBottom:'50px',
          fontSize:'3rem'
        }}>Add <span style={{color:'aqua'}}>Your</span> <span style={{color:'#ff944d'}}>Book</span></Typography>
        <Box justifyContent='center' alignItems='center' display='flex' sx={{color:'#ffff', marginLeft:'20px', marginRight:'20px'}}>
          <Tabs variant="fullWidth" value={changeTabBuilder} textColor='inherit' TabIndicatorProps={{style:{border:'none',backgroundColor:'transparent'}}}
            onChange={(e,n)=>setChangeTabBuilder(n)} orientation='horizontal' sx={{maxWidth:'100%',overflow:'auto',color:'#ffff',borderBottom:'none'}}>
            <Tab id='tab-builder-book-0' key='tab-builder-book-key-0' value={0} aria-controls='panel-builder-book-0' sx={{backgroundColor:'#9999ff',borderRadius:'20px 0px 0px 0px', padding:'10px',
              fontSize:'1rem'}} label='Add Your Book'/>
            <Tab id='tab-builder-book-1' key='tab-builder-book-key-1' value={1} aria-controls='panel-builder-book-1' sx={{backgroundColor:'#ffa900',borderRadius:'0px 20px 0px 0px', padding:'10px',
              fontSize:'1rem'}} label='Modify Your Book'/>
          </Tabs>
        </Box>
        <Panel index={0} value={changeTabBuilder}>
          <ModifyBook id='modify-add-book' onError={setError} onSuccess={setRespon} themes={themes} prof={prof} imgFile={imgFileAdd}
            imgView={imgAdd} setImgView={setImgAdd} imgCallback={setOpenAdd} url={addBookURL}
            responText='Adding Book Successfully !!!, please refresh this page' spacing={2}
            sx={{padding:'20px',backgroundColor:'#9999ff',borderRadius:'20px'}}/>
        </Panel>
        <Panel index={1} value={changeTabBuilder} >
          <Box sx={{backgroundColor:'#ffa900',borderRadius:'20px'}}>
            <Stack direction={(md)?'row':'column'} spacing={2} sx={{marginBottom:(theme)=> theme.spacing(2), padding:'20px'}}>
              <Search id={"modify-book-title"} size='small' value={title} onChange={e => setTitle(e.target.value)}
                placeholder='Title...' label='Book Title' btnFilterStyle={{display:'none'}} btnSearchStyle={{display:'none'}}
                onDelete={() => setTitle('')} onClickSearch={handleClickSearch}
                deleteButtonStyle={{color:'white'}} sx={{color:'white'}}/>
              <Search id={"modify-book-publisher"} size='small' value={publisher} onChange={e => setPublisher(e.target.value)}
                placeholder='Publisher...' label='Book Publisher' btnFilterStyle={{display:'none'}} btnSearchStyle={{display:'none'}}
                onDelete={() => setPublisher('')} onClickSearch={handleClickSearch}
                deleteButtonStyle={{color:'white'}} sx={{color:'white'}}/>
              <Button variant='contained' startIcon={<SearchIcon/>} onClick={handleClickSearch} sx={{fontSize:'1rem',
              '& .MuiButton-startIcon':{
                '& > *:first-of-type':{
                  fontSize:'1.5rem',
                },
              }}}>Find</Button>
            </Stack>
            {modifyBookContainer()}
          </Box>
        </Panel>
      </Box>
      <UploadImage id='book-modify-1' open={openAdd} setOpen={setOpenAdd} img={imgAdd} setImg={setImgAdd} imgStore={setImageFileAdd}
        type='square' viewport={{width:150, height:200}}/>
      <UploadImage id='book-modify-2' open={openModify} setOpen={setOpenModify} img={imgModify} setImg={setImgModify} imgStore={setImageFileModify}
        type='square' viewport={{width:150, height:200}}/>
      <Snackbar anchorOrigin={{vertical:'top',horizontal:'center'}} autoHideDuration={4000} onClose={() => {setError(null);setRespon(null);}}
        open={Boolean((respon)?respon:error)} sx={{zIndex: (theme) => theme.zIndex.drawer + 5}}>
        <ContainerFeedback severity={(respon)?'success':'error'} onClose={() => {setError(null);setRespon(null);}}>
          {(respon)?respon:error}
        </ContainerFeedback>
      </Snackbar>
    </>
  )
}
function Panel(props) {
  const {index, value, children}=props;
  return(
    <div id={`panel-builder-book-${index}`} aria-labelledby={`tab-builder-book-${index}`} hidden={value!==index}>
      {children}
    </div>
  );
}