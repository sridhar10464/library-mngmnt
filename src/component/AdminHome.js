import React,{useState} from 'react';
import Profile from './subcomponent/Auth/AuthUserComponent/Profile';
import UserBuilder from './subcomponent/User/User_Builder';
import {useSelector} from 'react-redux';
import {profile} from './funcredux/profile_redux';
import {searchUserURL, searchUserAdminURL} from './constant/constantDataURL';
import {Box, Tabs, Tab, useMediaQuery, Snackbar} from '@mui/material';
import {ContainerFeedback} from './subcomponent/utils/otherComponent';

export default function UserContainer() {
  const [error, setError] = useState();
  const [respon, setRespon] = useState();
  const [link, setLink] = useState(0);
  const prof = useSelector(profile);
  const med = useMediaQuery('(min-width:900px)')
  const handleChange = (e,n) => {
    setLink(n)
  }
  return (
    <>
      <Box justifyContent='center' display='flex' flexWrap='wrap' sx={{background: '#009999', minHeight:'100vh'}}>
        <Box sx={{width:{xs:'100%', md:'30%'}}} justifyContent='center' alignItems='flex-start' display='flex' flexWrap='wrap'>
          <Profile container="user" path='/'/>
          <Tabs variant="fullWidth" value={link} textColor='inherit' indicatorColor="secondary"
            onChange={handleChange} orientation={(med)?'vertical':'horizontal'} sx={{width:'100%',maxWidth:'100%', color:'#ffff', overflow:'auto'}}>
            {
              ["User","Admin"].map((title,i)=>(
                <Tab id={`tab-user-${i}`} key={"tabAdmin"+i} aria-controls={`panel-user-${i}`} value={i}
                  label={title} sx={{display:(i === 1 && ((prof)?prof.role!=='MANAGER':false)?'none':'flex'),fontSize:'1rem'}}/>
              ))
            }
          </Tabs>
        </Box>
        <Box sx={{width:{xs:'100%', md:'70%'}, maxWidth:'95%', marginTop:'20px'}}>
          {(prof && (prof.role === 'ADMINISTRATIF' || prof.role === 'MANAGER'))?
            <>
              <Panel index={0} value={link}>
                <UserBuilder type='user' setError={setError} setRespon={setRespon} role={prof.role} urlMainData={searchUserURL}/>
              </Panel>
              <Panel index={1} value={link}>
                <UserBuilder type='admin' setError={setError} setRespon={setRespon} role={prof.role} urlMainData={searchUserAdminURL}/>
              </Panel>
            </>:<></>
          }
        </Box>
      </Box>
      <Snackbar anchorOrigin={{vertical:'top',horizontal:'center'}} open={Boolean((respon)?respon:error)} onClose={() => {setError(null);setRespon(null)}} autoHideDuration={6000}>
        <ContainerFeedback severity={(respon)?'success':'error'} onClose={() => {setError(null);setRespon(null)}}>
          {(respon)?respon:error}
        </ContainerFeedback>
      </Snackbar>
    </>
  )
}

function Panel(props) {
  const {index, value, children}=props;
  return(
    <div id={`panel-user-${index}`} aria-labelledby={`tab-user-${index}`} hidden={value!==index}>
      {children}
    </div>
  );
}