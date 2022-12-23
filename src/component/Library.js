import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Profile from './subcomponent/Auth/AuthUserComponent/Profile';
import BookBuilder from './subcomponent/Book/Book_Builder';
import DashboardIcon from '@mui/icons-material/Dashboard';
import {useSelector} from 'react-redux';
import {useFetcher} from 'react-router-dom';
import {profile} from './funcredux/profile_redux';
import {countDataAppearsDefault} from './funcredux/book_redux';
import {searchMyBookSuggestionURL,searchMyBookURL} from './constant/constantDataURL';
import {Box, Tabs, Tab, useMediaQuery, Snackbar} from '@mui/material';
import Portal from '@mui/material/Portal';
import {Container, ContainerFeedback, Search} from './subcomponent/utils/otherComponent';

export default function MyLibrary(props) {
  const [error, setError]=useState();
  const [respon, setRespon]=useState();
  const [link, setLink] = useState(1);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [bookData, setBookData] = useState();
  const history = useFetcher();
  const [bookDataAllPage, setBookDataAllPage] = useState(1);
  const [bookDataSuggestion, setBookDataSuggestion] = useState([]);

  const user = useSelector(profile);
  const initSizeData = useSelector(countDataAppearsDefault);
  const med = useMediaQuery('(min-width:900px)');

  useEffect(()=>{
    if(user) {
      if(user.role === "SELLER"){
        axios.get(searchMyBookURL,{
          withCredentials:true,
          params:{
            words: "",
            page:0,
            size:initSizeData.book
          }
        }).then(res => {
          if(res.data && res.data.data.length > 0){
            setBookData(res.data.data);
            setBookDataAllPage(res.data.sizeAllPage);
          }else{setRespon("Book is Empty")}})
          .catch(err => {
            if(err.response){
              setError(err.response.data.message)
            }else {
              setError(err.message)
            }
          })
      }else {
        history.push("/login")
      }
    }
  },[user.history.initSizeData.book])

  const handleChange = (e,n) => {
    setLink(n)
  }
  const handlePage = (e,n) => {
    axios.get(searchMyBookURL,{
      withCredentials:true,
      params:{
        words: search,
        page: n-1,
        size: initSizeData.book,
      }
    }).then(res => {
      if(res.data && res.data.data.length > 0){
        setBookData(res.data.data);
        setBookDataAllPage(res.data.sizeAllPage);
      }else{
        setRespon("Book is Empty")
      }
      }).catch(err => {
      if(err.response){
        setError(err.response.data.message)
      }else {
        setError(err.message)
      }
    })
    setPage(n);
  }
  const handleAll = (e) => {
    setPage(1)
    axios.get(searchMyBookURL,{
      withCredentials:true,
      params:{
        words: "",
        page: 0,
        size: initSizeData.book,
      }
    }).then(res => {
      if(res.data && res.data.data.length > 0){
        setBookData(res.data.data);
        setBookDataAllPage(res.data.sizeAllPage);
      }else{setRespon("Book is Empty")}
    }).catch(err => {
      if(err.response){
        setError(err.response.data.message)
      }else {
        setError(err.message)
      }
    })
  }
  const handleClickSearch = () => {
    setPage(1);
    setOpen(false);
    axios(searchMyBookURL, {
      method:'get',
      withCredentials:true,
      params: {
        words: search,
        page: 0,
        size: initSizeData.book,
      },
    }).then(res => {
      if(res.data != null){
          setBookData(res.data.data);
          setBookDataAllPage(res.data.sizeAllPage);
      }}).catch(err => {
        if(err.response){
          setError(err.response.data.message)
        }else {
          setError(err.message)
        }
    })
  }
  let timeout = null
  const handleInputValueSearch = async(e) => {
    setSearch(e.target.value);
    clearTimeout(timeout);
    setLoading(true);
    if(!open){
      setOpen(true);
    }
    timeout = setTimeout(function () {
      inputValueSearch(e);
    }, 1000);
  }
  const inputValueSearch = (e) => {
    axios.get(searchMyBookSuggestionURL, {
      withCredentials:true,
      params: {
        words: e.target.value,
      },
    }).then(res => {
      if(res.data !== null){
        setBookDataSuggestion(res.data);
      }
    })
    .catch(err => {
      if(err.response){
        setError(err.response.data.message);
      }else {
        setError(err.message);
      }setOpen(false)});
      setLoading(false);
  }
  return(
    <>
      <Box display='flex' flexWrap={{xs:'wrap', md:'nowrap'}} sx={{background: '#009999', minHeight:'100vh',paddingTop: '10px'}}>
        <Box sx={{width:{xs:'100%', md:'40%',lg:'30%'}, maxHeight:'100vh'}} justifyContent='center' alignItems='flex-start' display='flex' flexWrap='wrap'>
          <Profile container="library" path='/'/>
          <Tabs variant="fullWidth" value={link} textColor='inherit' indicatorColor="secondary"
            onChange={handleChange} orientation={(med)?'vertical':'horizontal'} sx={{width:'100%',maxWidth:'100%', color:'#ffff', overflow:'auto'}}>
            {
              ["Book Builder","Book Storage"].map((title,i)=>(
                <Tab key={'MyLibrary'+i} sx={{paddingTop:'1.3rem',paddingBottom:'1.3rem'}} id={`tab-mylibrary-${i}`} aria-controls={`panel-mylibrary-${i}`} value={i}
                  label={title}/>
              ))
            }
          </Tabs>
          {/*footer app*/}
        </Box>
        <Box sx={{width:{xs:'100%', md:'60%',lg:'70%'}}}>
          <Panel index={0} value={link}>
            <>
              <Box sx={{margin:'10px'}}>
                <BookBuilder mainProps={props} onLinkMainTab={setLink}/>
              </Box>
            </>
          </Panel>
          <Panel index={1} value={link}>
            <Box width='100%' sx={{margin:'10px'}}>
              <Search id="search-main-book-library" onChange={handleInputValueSearch} value={search}
                onCloseMenu={() => {setOpen(false);setBookDataSuggestion([])}} onClickItemSearch={(item) => setSearch(item)}
                data={bookDataSuggestion} loading={loading} sx={{color:'white',width:'15rem'}} menuOpen={open}
                onMenuOpen={setOpen} onDelete={() => setSearch('')} onClickSearch={handleClickSearch}
                deleteButtonStyle={{color:'white'}} placeholder='Search...' filterIcon={<DashboardIcon sx={{fontSize:'inherit'}}/>}
                onFilter={handleAll}/>
              <Box paddingTop='20px'>
                <Container id='user-book-cont' data={bookData} page={page} onPageChange={handlePage} itemSpacing={1}
                  sx={{width:'100%', maxWidth:'100%', overflow:'auto',marginBottom:'20px'}} countPage={bookDataAllPage}
                  sizeLoadingData={initSizeData.book}/>
              </Box>
            </Box>
          </Panel>
        </Box>
      </Box>
      <Portal>
        <Snackbar anchorOrigin={{vertical:'top',horizontal:'center'}} autoHideDuration={6000} onClose={() => {setError(null);setRespon(null);}}
          open={Boolean((respon)?respon:error)} sx={{zIndex: (theme) => theme.zIndex.drawer + 5}}>
          <ContainerFeedback severity={(respon)?'success':'error'} onClose={() => {setError(null);setRespon(null);}}>
            {(respon)?respon:error}
          </ContainerFeedback>
        </Snackbar>
      </Portal>
    </>
  );
};

function Panel(props) {
  const {index, value, children}=props;
  return(
    <div id={`panel-mylibrary-${index}`} aria-labelledby={`tab-mylibrary-${index}`} hidden={value!==index}>
      {children}
    </div>
  );
}