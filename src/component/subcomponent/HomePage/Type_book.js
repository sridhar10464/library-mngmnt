import React,{useState, useEffect} from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import axios from 'axios';
import {createTheme} from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles'
// import {makeStyles} from '@mui/styles';
import {useDispatch, useSelector} from 'react-redux';
import {ContainerFeedback} from '../utils/otherComponent';
import {getTypeURL,getBooksByTypeURL,mainBookURL} from '../../constant/constantDataURL';
import {Tab, Tabs, Skeleton, Box, useMediaQuery, Button, Typography, Snackbar} from '@mui/material';
import {bookThemes, countDataAppearsDefault, trigger, setBookTheme, setBooks, setAllBookPage, setTrigger} from '../../funcredux/book_redux';

const theme = createTheme();
const useStyle = GlobalStyles({
  buttonPage:{
    color:'white',
    textAlign:'center',
    width:'inherit',
    fontSize:'2.5rem',
    [theme.breakpoints.up('md')]:{
      width:'100%',
    },
  },
  button:{
    '& .MuiButton-startIcon':{
      '& > *:first-of-type':{
        fontSize:'1.5rem',
      },
    },
    fontSize:'1rem',
  },
  tab:{
    fontSize:'1rem',
    padding:'1.4rem'
  },
})
export default function TypeContainer(props) {
  const {...attr} = props;
  const [error, setError] = useState();
  const [maxPageType,setMaxPageType] = useState(0);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const themes = useSelector(bookThemes);
  const triggerMainConMobile = useSelector(trigger);
  const initCountData = useSelector(countDataAppearsDefault);
  const [typeTab, setTypeTab] = useState(false);
  const med = useMediaQuery('(min-width:900px)')
  const style = useStyle();
  const handleChange = (a, n) => {
    setTypeTab(n)
  }
  useEffect(()=>{
    axios.get(getTypeURL,{
      withCredentials:true,
      params:{
        page: 0,
        size: initCountData.type
      }
    }).then(res => {
      if(res.data != null){
        dispatch(setBookTheme(res.data.data))
        setMaxPageType(res.data.sizeAllPage)
      }
    }).catch(err => {
      if(err.response){
        setError(err.response.data.message)
      }else {
        setError(err.message)
      }
    });
  },[]);
  const handleClick = (item) => (e) => {
    dispatch(setTrigger(item))
    axios.get(getBooksByTypeURL,{
      withCredentials:true,
      params:{
        page: 0,
        size: initCountData.book,
        theme: item
      }
    }).then(res => {
      if(res.data != null){
        dispatch(setAllBookPage(res.data.sizeAllPage));
        dispatch(setBooks(res.data.data));
      }
    }).catch(err => {
      if(err.response){
        setError(err.response.data.message)
      }else {
        setError(err.message)
      }
    });
  }
  const handleClickAll = () => {
    dispatch(setTrigger(-1))
    axios.get(mainBookURL,{
      withCredentials:true,
      params:{
        page: 0,
        size: initCountData.book,
      }
    }).then(res => {
      if(res.data != null){
        dispatch(setAllBookPage(res.data.sizeAllPage));
        dispatch(setBooks(res.data.data));
      }
    }).catch(err => {
      if(err.response){
        setError(err.response.data.message)
      }else {
        setError(err.message)
      }
    });
  }
  var getType = (val) => {
    axios.get(getTypeURL,{
      withCredentials:true,
      params:{
        page: val-1,
        size: initCountData.type
      }
    }).then(res => dispatch(setBookTheme(res.data.data)))
    .catch(err => {
      if(err.response){
        setError(err.response.data.message)
      }else {
        setError(err.message)
      }
    });
  }
  const handlePrev = (e) => {
    setPage(page-1)
    getType(page-1)
    setTypeTab(false)
  }
  const handleNext = (e) => {
    setPage(page+1)
    getType(page+1)
    setTypeTab(false)
  }
  return(
    <>
      {(themes.length !== 0)?
        (<Box {...attr}>
          <Button className={style.buttonPage} onClick={handlePrev} disabled={page <= 1}>
            {(med)?<ArrowForwardIcon sx={{fontSize:'inherit',transform:'rotate(-0.25turn)'}}/>:<Typography sx={{fontSize:'.7rem'}}>Prev Page</Typography>}
          </Button>
          {(med)?
            <Button className={style.button} sx={{color:'white',width:'100%'}} startIcon={<CollectionsBookmarkIcon/>} size='medium'
              onClick={handleClickAll}>All Books</Button>:null
          }
          <Tabs id='tabs-type-book' variant={(med)?"fullWidth":'scrollable'} value={(triggerMainConMobile < 0)?false:typeTab} textColor='inherit' indicatorColor="secondary"
            onChange={handleChange} allowScrollButtonsMobile={true} visibleScrollbar={true} orientation={(med)?'vertical':'horizontal'} sx={{maxWidth:'100%',overflow:'auto',color:'#ffff'}}>
            {themes.map((item, i) => {
              return <Tab className={style.tab} key={i} value={page*initCountData.book+i} label={item.name} onClick={handleClick(item.id)}/>
            })}
          </Tabs>
          <Button className={style.buttonPage} onClick={handleNext} disabled={page >= maxPageType}>
            {(med)?<ArrowForwardIcon sx={{fontSize:'inherit',transform:'rotate(0.25turn)'}}/>:<Typography sx={{fontSize:'.7rem'}}>Next Page</Typography>}
          </Button>
        </Box>):(
          <Box {...attr}>
            {
              [1,2,3,4,5,6,7,8,9,10].map((item,i)=> (
                <Skeleton key={i} variant='rectangular' sx={{width:'100%', height:'40px', marginBottom: '3px'}}/>
              ))
            }
          </Box>
        )
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