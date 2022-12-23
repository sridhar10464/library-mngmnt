import React, {useState, useEffect} from 'react';
import TypeContainer from './Type_book';
import axios from 'axios';
import {profile} from './../../funcredux/profile_redux';
import {useDispatch, useSelector} from 'react-redux';
import {Container, ContainerFeedback, Search} from '../utils/otherComponent'
import {books, setBooks, setAllBookPage, setTrigger, countDataAppearsDefault, allBookPage, trigger} from './../../funcredux/book_redux';
import {Box, Typography, Stack, useMediaQuery, Button, Drawer, Chip, Snackbar} from '@mui/material';
import {mainBookURL, searchBookURL, searchBookSuggestionURL, getBooksByTypeURL, getRecomendBookURL, getFavoriteBookURL, getMyBookURL,
  searchTitleBookURL, searchAuthorBookURL, searchPublisherBookURL, searchThemeBookURL, filterBookURL} from './../../constant/constantDataURL';

export default function MainContainer() {
  const [respon, setRespon] = useState();
  const [error, setError] = useState();
  const user = useSelector(profile);
  const triggerType = useSelector(trigger);
  const buku = useSelector(books);
  const initBooksCountPerFetch = useSelector(countDataAppearsDefault);
  const allBukuPage = useSelector(allBookPage);

  const [page,setPage] = useState(1);
  const [preventClick, setPreventClick] = useState(false);
  const [filter, setFilter] = useState(false);

  const [openSearch, setOpenSearch] = useState(false);
  const [openFilterTitle, setOpenFilterTitle] = useState(false);
  const [openFilterAuthor, setOpenFilterAuthor] = useState(false);
  const [openFilterPublisher, setOpenFilterPublisher] = useState(false);
  const [openFilterType, setOpenFilterType] = useState(false);

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingFilterTitle, setLoadingFilterTitle] = useState(false);
  const [loadingFilterAuthor, setLoadingFilterAuthor] = useState(false);
  const [loadingFilterPublisher, setLoadingFilterPublisher] = useState(false);
  const [loadingFilterType, setLoadingFilterType] = useState(false);

  const [dataSuggestionSearch, setDataSuggestionSearch] = useState([]);
  const [dataSuggestionFilterTitle, setDataSuggestionFilterTitle] = useState([]);
  const [dataSuggestionFilterAuthor, setDataSuggestionFilterAuthor] = useState([]);
  const [dataSuggestionFilterPublisher, setDataSuggestionFilterPublisher] = useState([]);
  const [dataSuggestionFilterType, setDataSuggestionFilterType] = useState([]);

  const [value, setValue] = useState({name:""});
  const [title, setTitle] = useState({name:""});
  const [author, setAuthor] = useState({id:null,name:""});
  const [publisher, setPublisher] = useState({id:null,name:""});
  const [type, setType] = useState({id:null,name:""});
  const [types, setTypes] = useState([]);

  var filterData = {title:title.name, idAuthor:author.id, idPublisher:publisher.id, idThemes: `${types.map(themes => themes.id)}`};

  const dataUrlPaginationBook = [filterBookURL,searchBookURL,getMyBookURL,getFavoriteBookURL,getRecomendBookURL,mainBookURL];
  const dispatch = useDispatch();
  const md = useMediaQuery('(min-width:900px)')
  useEffect(()=>{
    axios.get(mainBookURL,{
      withCredentials:true,
      params: {
        page: 0,
        size: initBooksCountPerFetch.book
      }
    }).then(res => {
      if(res.data && res.data.data.length > 0){
        dispatch(setBooks(res.data.data))
        dispatch(setAllBookPage(res.data.sizeAllPage))
      }
      else{
        setRespon("Book is empty")
      }
    }).catch(err => {
      if(err.response){
        setError(err.response.data.message)
      }else {
        setError(err.message)
      }
    });
  },[user])
  const handlePageChange = (event,newValue) => {
    setPage(newValue);
    if(triggerType < 0){
      axios.get(dataUrlPaginationBook[dataUrlPaginationBook.length+triggerType],{
        withCredentials:true,
        params: (triggerType !== -2)?
          ((triggerType === -5)? {size: initBooksCountPerFetch.book, page: newValue-1, words:value.name} :
          ((triggerType === -6)? {size: initBooksCountPerFetch.book, page: newValue-1, ...filterData} :
           {size: initBooksCountPerFetch.book, page: newValue-1})) : null
      }).then(res => {
          if(res.data && res.data.length > 0 && triggerType === -2){
            dispatch(setBooks(res.data))
            dispatch(setAllBookPage(1))
          }
          else if(res.data && res.data.data.length > 0){
            dispatch(setBooks(res.data.data))
            dispatch(setAllBookPage(res.data.sizeAllPage))
          }
          else {
            dispatch(setBooks([]))
            dispatch(setAllBookPage(0))
          }
      }).catch(err => {
        if(err.response){
          setError(err.response.data.message)
        }else {
          setError(err.message)
        }
        dispatch(setBooks([]))
        dispatch(setAllBookPage(0))
      });
    }
    else{
      axios.get(getBooksByTypeURL,{
        withCredentials:true,
        params: {
          page: newValue-1,
          size: initBooksCountPerFetch.book,
          theme: triggerType
        }
      }).then(res => {
        if(res.data && res.data.data.length > 0){
          dispatch(setBooks(res.data.data))
          dispatch(setAllBookPage(res.data.sizeAllPage))
        }
        else{
          setRespon("Book is empty")
        }
      }).catch(err => {
        if(err.response){
          setError(err.response.data.message)
        }else {
          setError(err.message)
        }
      });
    }
  }

  const handleClickSearch = (onOpen) => {
    var param = {words: value.name, page: 0, size: initBooksCountPerFetch.book};
    dispatch(setTrigger(-5))
    setPage(1);
    onOpen(false);
    axios(searchBookURL, {
      method:'get',
      withCredentials:true,
      params: param,
    }).then(res => {
      if(res.data != null){
          dispatch(setBooks(res.data.data));
          dispatch(setAllBookPage(res.data.sizeAllPage));
      }}).catch(err => {
        if(err.response){
          setError(err.response.data.message)
        }else {
          setError(err.message)
        }
    })
  }

  const setTypesSetup = (item) => {
    setType({id:0,name:""});
    setTypes([...types,item]);
  }

  const idFuncFilterElement =  [setValue,setTitle, setAuthor, setPublisher, setType]
  const idFilterElement =  [value, title, author, publisher, type]
  const openFilterElement =  [openSearch, openFilterTitle, openFilterAuthor, openFilterPublisher, openFilterType]
  const openFuncFilterElement =  [setOpenSearch, setOpenFilterTitle, setOpenFilterAuthor, setOpenFilterPublisher, setOpenFilterType]
  const loadingFilterElement =  [setLoadingSearch, setLoadingFilterTitle, setLoadingFilterAuthor, setLoadingFilterPublisher, setLoadingFilterType]
  const dataFilterElement =  [setDataSuggestionSearch, setDataSuggestionFilterTitle, setDataSuggestionFilterAuthor, setDataSuggestionFilterPublisher, setDataSuggestionFilterType]
  const urlFilterElement = [searchBookSuggestionURL,searchTitleBookURL, searchAuthorBookURL, searchPublisherBookURL, searchThemeBookURL]
  let timeout = null
  const handleInputValueSearch = async(id,vl) => {
    idFuncFilterElement[id]({...idFilterElement[id], name: vl});
    clearTimeout(timeout);
    loadingFilterElement[id](true);
    if(!openFilterElement[id]){
      openFuncFilterElement[id](true);
    }
    timeout = setTimeout(function () {
      inputValueSearch(id,vl);
    }, 1000);
  }
  const inputValueSearch = (id,vl) => {
    axios.get(urlFilterElement[id], {
      withCredentials:true,
      params: {
        words: vl,
      },
    }).then(res => {
      if(res.data !== null){
        dataFilterElement[id](res.data);
      }
    })
    .catch(err => {
      if(err.response){
        setError(err.response.data.message);
      }else {
        setError(err.message);
      }openFuncFilterElement[id](false)});
      loadingFilterElement[id](false);
  }

  const filtering = (e) => {
    dispatch(setTrigger(-6));
    setPage(1);
    setPreventClick(true);
    axios.get(filterBookURL, {
      withCredentials:true,
      params: {size: initBooksCountPerFetch.book,page: 0,...filterData},
      headers: {
        'Content-Type':'multipart/form-data',
      }
    }).then(res => {
      if(res.data && res.data.data.length > 0){
        dispatch(setBooks(res.data.data))
        dispatch(setAllBookPage(res.data.sizeAllPage))
      }else{
        setRespon("Book is empty")
      }
      setPreventClick(false);
    })
    .catch(err => {
      if(err.response){
        setError(err.response.data.message)
      }else {
        setError(err.message)
      }
      setPreventClick(false);
    })
    setFilter(false)
  }
  const deleteTypes = (id) => {
    setTypes(types.filter(f => f.id !== id))
  }
  return(
    <>
      <Box width='100%' sx={{background: '#009999',marginTop:'20px'}}>
        <Box>
          <Box display='flex'>
            <Search id="search-main-book" onChange={e => {handleInputValueSearch(0,e.target.value)}} value={value.name}
              onCloseMenu={() => {setOpenSearch(false);setDataSuggestionSearch([])}} onClickItemSearch={(item) => setValue({name:item})}
              data={dataSuggestionSearch} loading={loadingSearch} sx={{color:'white',width:'15rem'}} menuOpen={openSearch}
              onMenuOpen={setOpenSearch} onDelete={() => setValue({...value, name:""})} onClickSearch={handleClickSearch}
              deleteButtonStyle={{color:'white'}} placeholder='Search...' onFilter={e => setFilter(true)} />
          </Box>
        </Box>
        <Box>
          <TypeContainer style={{display:(md)?'none':'flex'}}/>
          <Box display='flex' justifyContent='center' sx={{marginTop:'20px', marginBottom:'20px', marginLeft:'10px',
            width:'95%', maxWidth:'100%'}}>
            <Container id='main-book-cont' data={buku} page={page} onPageChange={handlePageChange} countPage={allBukuPage}
              sx={{width:'100%', maxWidth:'100%',marginBottom:'20px'}} itemSpacing={(md)?2:1}
              sizeLoadingData={initBooksCountPerFetch.book}/>
          </Box>
        </Box>
      </Box>
      <Drawer anchor='right' open={filter} onClose={() => setFilter(false)}>
        <Stack spacing={1} sx={{padding:'10px', maxWidth:'70vw',fontSize:'1.1rem'}}>
          <Typography sx={{fontSize:'inherit'}}>Book Title</Typography>
          <Search id="filter-title" value={title.name} onChange={e => handleInputValueSearch(1,e.target.value)} data={dataSuggestionFilterTitle}
            onClickItemSearch={(item) => setTitle({...title, name:item})} loading={loadingFilterTitle} placeholder='Title...' menuOpen={openFilterTitle}
            onMenuOpen={setOpenFilterTitle} onDelete={() => setTitle({...title, name:""})} btnSearchStyle={{display:'none'}} btnFilterStyle={{display:'none'}}
            onCloseMenu={() => {setOpenFilterTitle(false);setDataSuggestionFilterTitle([])}}/>
          <Typography sx={{fontSize:'inherit'}}>Book Author</Typography>
          <Search id="filter-author" value={author.name} onChange={e => handleInputValueSearch(2,e.target.value)} data={dataSuggestionFilterAuthor}
            onClickItemSearch={(item) => setAuthor(item)} loading={loadingFilterAuthor} placeholder='Author...' menuOpen={openFilterAuthor}
            onMenuOpen={setOpenFilterAuthor} onDelete={() => setAuthor({id:null, name:""})} btnSearchStyle={{display:'none'}} btnFilterStyle={{display:'none'}}
            onCloseMenu={() => {setOpenFilterAuthor(false);setDataSuggestionFilterAuthor([])}} labelData='name'/>
          <Typography sx={{fontSize:'inherit'}}>Book Publisher</Typography>
          <Search id="filter-publisher" value={publisher.name} onChange={e => handleInputValueSearch(3,e.target.value)}
            onClickItemSearch={(item) => setPublisher(item)} data={dataSuggestionFilterPublisher} loading={loadingFilterPublisher} placeholder='Publisher...'
            menuOpen={openFilterPublisher} onMenuOpen={setOpenFilterPublisher} onDelete={() => setPublisher({id:null, name:""})}
            onCloseMenu={() => {setOpenFilterPublisher(false);setDataSuggestionFilterPublisher([])}} labelData='name'
            btnSearchStyle={{display:'none'}} btnFilterStyle={{display:'none'}}/>
          <Typography sx={{fontSize:'inherit'}}>Book Types</Typography>
          <Search id="filter-publisher" value={type.name} onClickItemSearch={(item) => setTypesSetup(item)}
            onChange={e => handleInputValueSearch(4,e.target.value)} data={dataSuggestionFilterType} loading={loadingFilterType} placeholder='Theme...'
            menuOpen={openFilterType} onMenuOpen={setOpenFilterType} onDelete={() => setType({id:null, name:""})}
            onCloseMenu={() => {setOpenFilterType(false);setDataSuggestionFilterType([])}} labelData='name'
            btnSearchStyle={{display:'none'}} btnFilterStyle={{display:'none'}}/>
          <Box display='flex' flexWrap='wrap' sx={{width:'100%'}}>
          {(types.length > 0)?
            types.map((data,i) => (
              <Chip key={"chipFilter"+i} onDelete={() => deleteTypes(data.id)} label={data.name}
                sx={{marginBottom:'.5rem', marginRight:'.3rem',fontSize:'1rem','& .MuiChip-deleteIcon':{
                  fontSize:'1.4rem'}}}/>
            )):<></>
          }
          </Box>
          <Button disabled={preventClick} variant='contained' onClick={filtering} sx={{marginTop:'20px'}}>Filter</Button>
        </Stack>
      </Drawer>
      <Snackbar anchorOrigin={{vertical:'top',horizontal:'center'}} open={Boolean((respon)?respon:error)} onClose={() => (respon)?setRespon(null):setError(null)}
        autoHideDuration={4000} sx={{zIndex: (theme) => theme.zIndex.drawer + 5}}>
        <ContainerFeedback severity='error' onClose={() => (respon)?setRespon(null):setError(null)}>
          {(respon)?respon:error}
        </ContainerFeedback>
      </Snackbar>
    </>
  );
}