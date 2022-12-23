
import React, {useEffect, useState} from 'react';
import Profile from './subcomponent/Auth/AuthUserComponent/Profile';
import BookChoice from './subcomponent/HomePage/Book_Choices';
import TypeContainer from './subcomponent/HomePage/Type_book';
import MainContainer from './subcomponent/HomePage/Main_Book_Container';
import {Box,Snackbar} from '@mui/material';
import {ContainerFeedback} from './subcomponent/utils/otherComponent';

export default function Home(props) {
  const [respon, setRespon] = useState();
  useEffect(()=>{
    let param = new URLSearchParams(props.location.search);
    if(param){
      let ver = param.get('verify')
      let logout = param.get('logout')
      if(ver==='1'){setRespon("Please check your email to verify account")}
      if(logout==='1'){setRespon("Logout Successfully !!!")}
    }
  },[])
  return(
    <>
      <Box sx={{background: '#009999',minHeight: '100vh'}}>
        <Box sx={{display:'flex', flexWrap:{xs:'wrap', md:'nowrap'}}}>
          <Box width={{xs: '100%', md: '30%'}} maxWidth={{xs: '100vw', md: '30%'}} sx={{display:'flex', flexWrap:'wrap', alignItems:'flex-start', justifyContent:'center',marginTop:'10px'}}>
            <Profile/>
          </Box>
          <Box width={{xs: '100%', md: '70%'}} maxWidth={{xs: '100vw', md: '70%'}}>
            <BookChoice/>
          </Box>
        </Box>
        <Box sx={{display:'flex', flexWrap:{xs:'wrap', md:'nowrap'}, padding:'10px'}}>
          <Box width={{xs: '100%', md: '30%'}} maxWidth={{xs: '100vw', md: '30%'}} display={{xs:'none', md:'block'}}>
            <TypeContainer/>
          </Box>
          <Box width={{xs: '100%', md: '70%'}} maxWidth={{xs: '100vw', md: '70%'}}>
            <MainContainer/>
          </Box>
        </Box>
      </Box>
      <Snackbar anchorOrigin={{vertical:'top',horizontal:'center'}} open={Boolean(respon)} onClose={() => setRespon(null)}
        autoHideDuration={4000} sx={{zIndex: (theme) => theme.zIndex.drawer + 5}}>
        <ContainerFeedback severity='error' onClose={() => setRespon(null)}>
          {respon}
        </ContainerFeedback>
      </Snackbar>
    </>
  );
}