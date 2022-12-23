import React, {useState, useEffect} from 'react';
import axios from 'axios';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import StarsIcon from '@mui/icons-material/Stars';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookIcon from '@mui/icons-material/Book';
import {profile} from '../../funcredux/profile_redux';
import GlobalStyles from '@mui/material/GlobalStyles'
// import {makeStyles} from '@mui/styles';
import {createTheme} from '@mui/material/styles';
import {useSelector, useDispatch} from 'react-redux';
import {Container, ContainerFeedback} from '../utils/otherComponent';
import {Box, Typography, Button, Tabs, Tab, useMediaQuery, Snackbar} from '@mui/material';
import {mainBookURL, getMyBookURL, getRecomendBookURL, getFavoriteBookURL} from '../../constant/constantDataURL';
import {favoriteBooks, recommendBooks, myBooks, trigger, setBookFav, setBookRek, setBookSeller, bookFavPage, myBookPage,
  setBookFavPage, setMyBookPage, countDataAppearsDefault, setBooks, setAllBookPage, setTrigger} from '../../funcredux/book_redux';

const theme = createTheme();
const useStyle = GlobalStyles({
  root:{
    background: '#009999',
    display: 'none',
    marginTop: '20px',
    maxWidth:'100%',
    width:'100%',
    color:'#ffff',
    [theme.breakpoints.up('md')]:{
      display: 'block',
    },
  },
  mobile: {
    maxWidth:'100%',
    width:'100%',
    display:'flex',
    justifyContent:'center',
  },
  text: {
    color: '#ffff',
    marginBottom:'10px',
    fontSize:'1.4rem',
    fontWeight:700,
    fontFamily: 'Segoe UI',
  },
  tabs: {
    color:'#ffff',
    fontSize:'1rem',
  }
})

export default function BookChoice() {
  const [respon, setRespon] = useState();
  const [error, setError] = useState();
  const [page, setPage] = useState(3);
  const [pageMyBook, setPageMyBook] = useState(1);
  const [pageFavBook, setPageFavBook] = useState(1);
  const style = useStyle();
  const favBuku = useSelector(favoriteBooks);
  const recBuku = useSelector(recommendBooks);
  const myBuku = useSelector(myBooks);
  const prof = useSelector(profile);
  const initCountDataAppears = useSelector(countDataAppearsDefault);
  const myBukuAllPage = useSelector(myBookPage);
  const favBukuAllPage = useSelector(bookFavPage);
  const triggerMainConMobile = useSelector(trigger);
  const sm = useMediaQuery('(min-width:600px)');
  const md = useMediaQuery('(min-width:900px)');
  const dispatch = useDispatch();
  useEffect(()=>{
    if(prof && prof.role !== 'ANON'){
      axios.get(getMyBookURL,{
        withCredentials:true,
        params:{
          page: 0,
          size: initCountDataAppears.book
        }
      }).then(res => {
      if(res.data && res.data.data.length > 0){
        dispatch(setBookSeller(res.data.data));
        dispatch(setMyBookPage(res.data.sizeAllPage));
      }else{
        setRespon("My Book is empty")
      }}).catch(err => {
        if(err.response){
          if(err.response.data.status !== 403){
            setError(err.response.data.message)
          }
        }else {
          setError(err.message)
        }
      })
      axios.get(getFavoriteBookURL,{
        withCredentials:true,
        params:{
          page: 0,
          size: initCountDataAppears.book
        }
      }).then(res => {
        if(res.data && res.data.data.length > 0){
          dispatch(setBookFav(res.data.data));
          dispatch(setBookFavPage(res.data.sizeAllPage));
        }else{
          setRespon("Favorite Book is empty")
        }}).catch(err => {
        if(err.response){
          setError(err.response.data.message)
        }else {
          setError(err.message)
        }
      })
    }
    axios.get(getRecomendBookURL,{
      withCredentials:true,
    }).then(res => {
      if(res.data && res.data.length > 0){
        dispatch(setBookRek(res.data));
      }else{
        setRespon("Recommended Book is empty")
      }
    })
    .catch(err => {
      if(err.response){
        setError(err.response.data.message)
      }else {
        setError(err.message)
      }
    })
  },[prof])
  const handleChangeMyBook = (event,newValue) => {
    setPageMyBook(newValue);
    axios.get(getMyBookURL,{
      withCredentials:true,
      params:{
        page: newValue-1,
        size: initCountDataAppears.book
      }
    }).then(res => {
      if(res.data && res.data.data.length > 0){
        dispatch(setBookSeller(res.data.data));
        dispatch(setMyBookPage(res.data.sizeAllPage));
      }else{
        setRespon("My Book is empty")
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
  const handleChangeFavBook = (event,newValue) => {
    setPageFavBook(newValue);
    axios.get(getFavoriteBookURL,{
      withCredentials:true,
      params:{
        page: newValue-1,
        size: initCountDataAppears.book
      }
    }).then(res => {
      if(res.data && res.data.data.length > 0){
        dispatch(setBookFav(res.data.data));
        dispatch(setBookFavPage(res.data.sizeAllPage));
      }else{
        setRespon("Favorite Book is empty")
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
  const handleChangePage = (event,newValue) => {
    setPage(newValue)
  }
  const handleClickTabsBook = (url, isPagination, dataIndex) => (e) => {
    dispatch(setTrigger(dataIndex))
    axios.get(url, {
      withCredentials:true,
      params: (isPagination)?{
        page: 0,
        size: initCountDataAppears.book
      }:null
    }).then(res => {
      if(isPagination){
        if(res.data && res.data.data.length > 0){
          dispatch(setBooks(res.data.data))
          dispatch(setAllBookPage(res.data.sizeAllPage))
        }else{
          switch (dataIndex) {
            case -2:
              setRespon("Recommended Book is empty");
              break;
            case -3:
              setRespon("Favorite Book is empty");
              break;
            case -4:
              setRespon("My Book is empty");
              break;
            default: setRespon("Book is empty");
          }
        }
      }
      else{
        if(res.data && res.data.length > 0) {
          dispatch(setBooks(res.data))
          dispatch(setAllBookPage(1))
        }else{
          switch (dataIndex) {
            case -2:
              setRespon("Recommended Book is empty");
              break;
            case -3:
              setRespon("Favorite Book is empty");
              break;
            case -4:
              setRespon("My Book is empty");
              break;
            default: setRespon("Book is empty");
          }
        }
      }
    }).catch(err => {
      if(err.response){
        setError(err.response.data.message)
      }else {
        setError(err.message)
      }
      dispatch(setBooks([]));
      dispatch(setAllBookPage(0));});
  }
  const containerBook = (item,index) => {
    return <Box key={"choice"+index}>
      <Typography className={style.text}>{item.title}</Typography>
      <Box>
      {(index <= 0)?
        <Container id={'book-choice-'+item.title} data={item.data} page={item.page} onPageChange={item.handlePage} itemSpacing={2}
          sx={{width:'100%', overflow:'auto',marginBottom:'20px'}} countPage={item.maxPage}
          pattern="row" sizeLoadingData={10}/>:
        (prof)?
        <Container id={'book-choice2-'+item.title} data={item.data} page={item.page} onPageChange={item.handlePage} itemSpacing={2}
          sx={{width:'100%', overflow:'auto',marginBottom:'20px'}} countPage={item.maxPage}
          pattern="row" sizeLoadingData={initCountDataAppears.book}/>:
        <Box sx={{padding:'10px',marginLeft:'30px',marginRight:'30px',borderRadius:'10px',background:'rgba(0,0,0,.1)',
          fontSize:'1rem'}}>
            <Typography sx={{textAlign:'center',fontSize:'inherit'}}>To view "{item.title}", You must login before see inside this</Typography>
            <Box display='flex' justifyContent='center' alignItems='center'>
              <Button variant='contained' sx={{marginTop:'10px'}} href='/login'>Login</Button>
            </Box>
        </Box>
      }
      </Box>
    </Box>
  }
  const callbackContainer = React.useCallback((item,index)=> containerBook(item,index),[prof])
  return(
    <>
      <Box className={style.root}>
        {[{title:'Recommended Books', data:recBuku, page: 1, handlePage: null, maxPage: 1},
          {title:'Favorite Books', data:favBuku, page: pageFavBook, handlePage: handleChangeFavBook, maxPage: favBukuAllPage},
          {title:'My Books', data:myBuku, page: pageMyBook, handlePage: handleChangeMyBook, maxPage: myBukuAllPage}].map((item,i) => {
            if(prof){
              if(item.title === 'My Books' && (prof.role === 'ADMINISTRATIF' || prof.role === 'MANAGER' || prof.role === 'USER')){
                return null
              }
              else if (prof.role === 'ANON' && (item.title === 'My Books' || item.title === 'Favorite Books')) {
                return(<Typography sx={{textAlign:'center',padding:'10px',marginLeft:'30px',marginRight:'30px', marginTop:'15px',
                borderRadius:'10px',background:'rgba(0,0,0,.1)',fontSize:'1rem'}}>Please Verify Your Email</Typography>)
              }
              else{return callbackContainer(item,i)}
            }
            else{return callbackContainer(item,i)}
          })}
      </Box>
      {(md)?null:
        <Tabs className={style.mobile} variant={(sm)?'fullWidth':'scrollable'} scrollButtons='auto' value={(triggerMainConMobile > 0)?3:page}
          onChange={handleChangePage} textColor='inherit' indicatorColor="secondary">
          {
              [{icon:<StarsIcon className={style.tabs}/>,label:'Rekomend Book', url: getRecomendBookURL, pagination:false,refData: -2},
              {icon:<FavoriteIcon className={style.tabs}/>,label:'Favorite Book', url: getFavoriteBookURL, pagination:true,refData: -3},
              {icon:<BookIcon className={style.tabs}/>,label:'My Book', url: getMyBookURL, pagination:true, refData: -4},
              {icon:<LibraryBooksIcon className={style.tabs}/>,label:'All Book', url: mainBookURL, pagination:true, refData: -1}].map((item,i) => {
                if(prof){
                  if(prof.role === 'ANON' && (item.label === 'Favorite Book' || item.label === 'My Book')){
                    return <Tab key={i} className={style.tabs} disabled icon={item.icon} label={item.label}/>
                  }
                  else if (item.label === 'My Book' && (prof.role === 'ADMINISTRATIF' || prof.role === 'MANAGER' || prof.role === 'USER')) {
                    return <Tab key={i} className={style.tabs} disabled icon={item.icon} label={item.label}/>
                  }
                  else {
                    return <Tab key={i} className={style.tabs} icon={item.icon} label={item.label} onClick={handleClickTabsBook(item.url,item.pagination,item.refData)}/>
                  }
                }else {
                  if(item.label === 'Favorite Book' || item.label === 'My Book'){
                    return <Tab key={i} className={style.tabs} disabled icon={item.icon} label={item.label}/>
                  }else{
                    return <Tab key={i} className={style.tabs} icon={item.icon} label={item.label} onClick={handleClickTabsBook(item.url,item.pagination,item.refData)}/>
                  }
                }
              })
          }
        </Tabs>
      }
      <Snackbar anchorOrigin={{vertical:'top',horizontal:'center'}} open={Boolean((respon)?respon:error)} onClose={() => (respon)?setRespon(null):setError(null)}
        autoHideDuration={4000} sx={{zIndex: (theme) => theme.zIndex.drawer + 5}}>
        <ContainerFeedback severity='error' onClose={() => (respon)?setRespon(null):setError(null)}>
          {(respon)?respon:error}
        </ContainerFeedback>
      </Snackbar>
    </>
  );
}