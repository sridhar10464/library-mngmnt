import React, {useState,useEffect} from 'react';
import axios from 'axios';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import {profile} from './../../funcredux/profile_redux';
import GlobalStyles from '@mui/material/GlobalStyles';
// import {globalStyles} from '@mui/styles';
import {useDispatch, useSelector} from 'react-redux';
import {favoriteBooks,recommendBooks,books,myBooks,setBookFav,setBooks,setBookRek,setBookSeller} from './../../funcredux/book_redux';
import {OnDeleteComponent, PasswordContainer} from '../utils/otherComponent';
import {modifyBookFavURL, imageBookURL, deleteBookURL, fileBookURL, verifyPasswordURL} from './../../constant/constantDataURL';
import {Box, Paper, CardMedia, Typography, Divider, Stack, IconButton, Button, Chip, CircularProgress, useMediaQuery} from '@mui/material';
import './../../css/Book-style.css';

const useStyle = GlobalStyles({
    text: {
      fontWeight: 700,
      fontFamily: 'Verdana',
      color: '#000000',
      fontSize:'1rem',
      width:'100%',
    },
    textSec: {
      fontFamily: 'Verdana',
      color: '#4d4d4d',
      marginLeft:'5px',
      width:'100%',
      fontSize:'1rem',
    },
    chip:{
      fontFamily:'Segoe UI',
      display:'flex',
      fontWeight:700,
      borderRadius:'1rem',
      padding:'1rem',
      fontSize:'1rem',
    },
    buttonDownload:{
      fontSize:'1rem',
      marginRight:'20px',
    },
    buttonFavorite:{
      fontSize:'2.5rem',
    },
    iconButtonBookDefault:{
      fontSize:'1.5rem',
    }
});

export default function Book(props) {
  const{id, book, setRespon, setError, isOpenFunc} = props;
  const prof = useSelector(profile);
  const favBook = useSelector(favoriteBooks);
  const recBook = useSelector(recommendBooks);
  const mainBook = useSelector(books);
  const userBook = useSelector(myBooks);
  const dispatch = useDispatch();
  useEffect(() => {
    funDesc();
  },[funDesc])
  const[data,setData] = useState(book);
  const[preventClick, setPreventClick] = useState(false)
  const[preventFav, setPreventFav] = useState(false);
  const[deletes, setDeletes] = useState();
  const med = useMediaQuery('(min-width:900px)')
  const colorData = [{back:'#b3ffb3',clr:'#009933'},{back:'#ccf5ff',clr:'#0066ff'},{back:'#ffe0b3',clr:'#ff6600'},
    {back:'#e6ccff',clr:'#c61aff'},{back:'#e6e6ff',clr:'#6600ff'}];
  const {format} = require('date-fns');
  const handleFav = async(e) => {
    setPreventFav(true)
    var form = new FormData();
    form.append('idBook', data.id)
    form.append('idu', (prof)? prof.id:0)
    form.append('deleteMode', data.favorite)
    axios.put(modifyBookFavURL, form, {
      withCredentials:true,
      headers:{
        'Content-Type':'multipart/form-data',
      },
    }).then(res => {
      setPreventFav(false);
      var mainBooksFav = mainBook.map(item => item.id).indexOf(data.id);
      var recBookFind = recBook.map(item => item.id).indexOf(data.id);
      var myBookFind = (userBook.length > 0)? userBook.map(item => item.id).indexOf(data.id):-1;
      var mBook = null;
      var rBook = null;
      var uBook = null;
      if(data.favorite){
        if(favBook.length > 0){
          dispatch(setBookFav([...favBook.filter(item => item.id !== data.id)]));
          mBook = [...mainBook];
          mBook[mainBooksFav] = {...data,favorite:false};
          dispatch(setBooks([...mBook]))
          if(recBookFind >= 0){
            rBook = [...recBook];
            rBook[recBookFind] = {...data,favorite:false};
            dispatch(setBookRek([...rBook]))
          }
          if(myBookFind >= 0){
            uBook = [...userBook];
            uBook[myBookFind] = {...data,favorite:false};
            dispatch(setBookSeller([...uBook]))
          }
        }
      }else {
        dispatch(setBookFav([...favBook,{...data,favorite:true}]));
        mBook = [...mainBook];
        mBook[mainBooksFav] = {...data,favorite:true};
        dispatch(setBooks([...mBook]))
        if(recBookFind >= 0){
          rBook = [...recBook];
          rBook[recBookFind] = {...data,favorite:true};
          dispatch(setBookRek([...rBook]))
        }
        if(myBookFind >= 0){
          uBook = [...userBook];
          uBook[myBookFind] = {...data,favorite:true};
          dispatch(setBookSeller([...uBook]))
        }
      }
    }).catch(err=>{
      if(err.response){
        setError(err.response.data.message)
      }else {
        setError(err.message)
      }
      setData({...data, favorite: !data.favorite});setPreventFav(false)})
      setData({...data, favorite: !data.favorite});
      document.body.style='overflow-y:auto;touch-action:auto;';
  }
  const handleDownload = (e) => {
    setPreventClick(true)
    var FileSaver = require('file-saver');
    var attr = new FormData();
    attr.append('idBook',data.id)
    axios.post(fileBookURL+data.file, attr,{
      withCredentials:true,
    }).then(res => {
        if(res.data){
          var eks = "data:application/pdf;base64,";
          setPreventClick(false);
          FileSaver.saveAs(`${eks}${res.data}`,`${data.title}.pdf`);
        }
      }).catch(err => {
        if(err.response){
          setError(err.response.data.message)
        }else {
          setError(err.message)
        }
        setPreventClick(false);})
  }
  const funDesc = React.useCallback((data) => {
    var list1 = data.description.replace(/-=>/g,"<br/><ol><li class='li'>");
    var list2 = list1.replace(/<=-/g,"</li></ol>");
    var list3 = list2.replace(/_,_/g,"</li><li class='li'>");
    var list4 = list3.replace(/!--/g,"<span class='span'>");
    var list5 = list4.replace(/--!/g,"</span>");
    var list6 = list5.replace(/<-p/gi,"</p>");
    var list7 = list6.replace(/p->/gi,"<br/><p class='p'>");
    var newDesc = document.createElement('div');
    newDesc.className = 'p';
    newDesc.innerHTML= list7;
    document.getElementById(id).appendChild(newDesc);
  },[data])
  const style = useStyle();
  const getURIParam = () =>{
    return encodeURI(`id=${data.id}&title=${data.title}&publisher=${JSON.stringify(data.publisher)}
      &description=${data.description}&theme=${JSON.stringify(data.theme)}&image=${data.image}&file=${data.title}`)
  }
  return(
    <>
      <Paper sx={{minWidth:'250px', maxWidth:'1200px', overflow:(med)?'visible':'auto', maxHeight:(med)?'100vh':'95vh', zIndex: (theme) => theme.zIndex.drawer + 2, padding:'10px'}}
        onClick={(e) => e.stopPropagation()}>
        <Stack divider={<Divider orientation="vertical" flexItem />} spacing={{xs:0, md:1}} direction={{xs: 'column', md:'row'}} sx={{width:'100%'}}>
          <Box justifyContent='center' alignItems='center' display='flex'>
            <CardMedia image={`${imageBookURL}${data.image}`}
              sx={{width:'200px', minHeight: '200px'}}/>
          </Box>
          <Box style={{padding:'5px'}}>
            <Box justifyContent={{md: 'flex-end', xs: 'center'}} width='100%' alignItems='center' display='flex'>
              {(prof && data.status)?
                   (<>
                      <IconButton className={style.iconButtonBookDefault} onClick={() => setDeletes(prof.id)} sx={{position: 'relative', top:{md:'-1.6rem', xs:0}, left:{md:'1.6rem', xs:0},
                        background:'#ffa366', color:'#ff1a1a', marginRight:'10px', '&:hover':{background:'#ff1a1a', color:'#ffff'}}}><DeleteIcon sx={{fontSize:'inherit'}}/></IconButton>
                      <IconButton className={style.iconButtonBookDefault} href={`/my-library?${getURIParam()}`}
                       sx={{position: 'relative', top:{md:'-1.6rem', xs:0}, left:{md:'1.6rem', xs:0}, background:'#ffa366', color:'#e65c00',
                       marginRight:'10px', '&:hover':{background:'#e65c00', color:'#ffff'}}}><ModeEditIcon sx={{fontSize:'inherit'}}/></IconButton>
                    </>
                  ):null
              }
              <IconButton className={style.iconButtonBookDefault} onClick={e => {isOpenFunc(null);document.body.style='overflow-y:auto;touch-action:auto;';}} sx={{position: 'relative', top:{md:'-1.6rem', xs:0}, left:{md:'1.6rem', xs:0},
                background:'#ff1a1a', color:'white', '&:hover':{background:'#e60000', color:'#ffff'}}}><CloseIcon sx={{fontSize:'inherit'}}/></IconButton>
            </Box>
            <Box style={{overflow:'auto', marginTop:'10px',marginBottom:'10px'}} sx={{width:'100%', maxWidth:'100%'}}>
              <table style={{width:'99%'}}>
                <tbody>
                  <tr>
                    <td><Typography noWrap className={style.text}>Id</Typography></td>
                    <td><Typography noWrap className={style.textSec}>{data.id}</Typography></td>
                    <td><Typography noWrap className={style.text}>Publisher</Typography></td>
                    <td><Typography noWrap className={style.textSec}>{data.publisher.name}</Typography></td>
                  </tr>
                  <tr>
                    <td><Typography noWrap className={style.text}>Title</Typography></td>
                    <td><Typography noWrap className={style.textSec}>{data.title}</Typography></td>
                    <td><Typography noWrap className={style.text}>Publish</Typography></td>
                    <td><Typography noWrap className={style.textSec}>{(data.publishDate)? format(new Date(data.publishDate), 'dd MMM yyyy'): data.publishDate}</Typography></td>
                  </tr>
                  <tr>
                    <td><Typography noWrap className={style.text}>Author</Typography></td>
                    <td><Typography noWrap className={style.textSec}>{data.author}</Typography></td>
                  </tr>
                </tbody>
              </table>
            </Box>
            <Box>
              <Typography noWrap className={style.text}>Theme</Typography>
              <Stack spacing={1} direction='row' sx={{marginTop:'10px', marginBottom:'10px', maxWidth:'100%', overflow:'auto'}}>
                {
                  (data.theme)? (
                    data.theme.map((item,i) => {
                      var color = (/[A-E]/.exec(item.name.charAt(0)) !== null)?colorData[0]:(/[F-J]/.exec(item.name.charAt(0)) !== null)?colorData[1]:
                        (/[K-O]/.exec(item.name.charAt(0)) !== null)?colorData[2]:(/[P-T]/.exec(item.name.charAt(0)) !== null)?colorData[3]:colorData[4]
                      return <Chip key={'chipBook'+i} className={style.chip} style={{background:color.back,color:color.clr}} label={item.name}/>
                    })
                  ) : null
                }
              </Stack>
            </Box>
              <Box id={id} sx={{overflow:'auto',maxHeight:(med)?'30vh':'40vh'}}></Box>
              <Box justifyContent='center' alignItems='center' display='flex' sx={{marginTop:'20px'}}>
              <Button variant='contained' className={style.buttonDownload} onClick={handleDownload}
              disabled={(prof&&prof.role!=='ANON'&&!preventClick)? false:true}
              startIcon={(!preventClick)?null:<CircularProgress size='1rem' color="primary"/>}>Download</Button>
              <IconButton className={style.buttonFavorite} onClick={handleFav} disabled={(prof&&prof.role!=='ANON'&&!preventFav)? false:true}>
                {(data.favorite)? <FavoriteIcon sx={{color:'red',fontSize:'inherit'}}/> : <FavoriteBorderIcon sx={{fontSize:'inherit'}}/>}</IconButton>
            </Box>
          </Box>
        </Stack>
      </Paper>
      <OnDelete open={deletes} idBook={data.id} onClose={setDeletes} onCloseRoot={isOpenFunc} onError={setError} onRespon={setRespon}/>
    </>
  );
}
Book.defaultProps = {
  isModifyFunc : function () {},
}

function OnDelete(props) {
  const{open, idBook, onClose, onError, onRespon, onCloseRoot} = props;
  const[preventClick, setPreventClick] = useState(false);
  const[verify, setVerify] = useState(false);
  const[password, setPassword] = useState('');
  const handleClose = (e) => {
    e.stopPropagation();
    onClose(false);
  };
  const handleDelete = (e) => {
    e.stopPropagation();
    setPreventClick(true);
    var form = new FormData();
    form.append('password',password)
    axios.post(verifyPasswordURL,form,{
      withCredentials:true,
      headers:{
        'Content-Type':'multipart/form-data',
      }
    }).then(res =>
    axios.delete(deleteBookURL,{
      withCredentials:true,
      params:{
        idBook:idBook,
      }
    }).then(() => {onClose(false);onRespon('Delete Book Success, please refresh this page !!!');setPreventClick(false);onCloseRoot(true);
        setVerify(false);setPassword('');})
    .catch(err => {
      if(err.response){
        onError(err.response.data.message)
      }else {
        onError(err.message)
      }
      onClose(false);setPreventClick(false);onCloseRoot(true);setVerify(false);setPassword('');}))
    .catch(err => {if(err.response){
      onError(err.response.data.message)
    }else {
      onError(err.message)
    }
    onClose(false);setPreventClick(false);onCloseRoot(true);setVerify(false);setPassword('');
    })
  }
  return (
    <>
      <OnDeleteComponent onDelete={(e) => {e.stopPropagation();setVerify(true);}} title='Delete this Book ?'
        content='Are you sure to delete this book, it cannot be undone after you delete it'
        onClose={handleClose} disabled={preventClick} open={open}/>
      <PasswordContainer isVerify={verify} setVerify={setVerify} password={password} setPassword={setPassword}
        onDelete={handleDelete} disabled={preventClick}/>
    </>
  )
}