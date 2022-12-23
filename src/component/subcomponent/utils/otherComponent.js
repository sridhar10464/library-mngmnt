import React, {forwardRef, useState, useEffect} from 'react';
import axios from 'axios';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import BookView from '../Book/Book_view';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import Croppie from 'croppie';
import {useSelector} from 'react-redux';
import {styled,createTheme} from '@mui/material/styles';
import {countDataAppearsDefault} from '../../funcredux/book_redux';
import {Alert, useMediaQuery, Box, TextField, IconButton, Button, Stack, Card, CardMedia, CardActionArea, Typography, Pagination, Menu,
  MenuItem, Dialog, DialogActions, DialogContent,DialogContentText, DialogTitle, Backdrop, Chip, CircularProgress, InputAdornment} from '@mui/material';
import {imageBookURL,searchPublisherBookURL,searchThemeBookURL} from '../../constant/constantDataURL';

export const ContainerFeedback = forwardRef(function ContainerFeedback(props, ref) {
  return <Alert elevation={5} ref={ref} variant='filled' sx={{fontSize:'.8rem', '& .MuiAlert-icon':{fontSize:'1rem'}}} {...props}/>
})
const theme = createTheme();
export const CustomTextField = styled(TextField)({
  '& label':{
    color:'rgba(0, 0, 0, 0.2)',
    transition: theme.transitions.create('color'),
  },
  '& label.Mui-focused':{
    color:'#ffff',
  },
  '& .MuiInput-underline:after':{
    borderBottomColor:'#ffff',
  },
  '& input':{
    padding:'.5rem',
  },
  '& .MuiOutlinedInput-root': {
    color:'inherit',
    '& fieldset':{
      border:'2px solid rgba(0, 0, 0, 0.2)',
      height:'inherit',
      borderBottom:'2px solid inherit',
    },
    '&:hover fieldset':{
      border:'2px solid rgba(0, 0, 0, 0.2)',
      borderBottom:'4px solid #0066cc',
    },
    '&.Mui-focused fieldset': {
      border:'2px solid rgba(0, 0, 0, 0.2)',
      borderBottom:'4px solid lime',
    },
  },
})
export function Search(props) {
  const {id, loading, onClickSearch, onClickItemSearch, onDelete, data, labelData, onCloseMenu, deleteButtonStyle,
    onFilter, menuOpen, onMenuOpen, filterIcon, searchIcon, btnSearchStyle, btnFilterStyle, ...attr} = props;
  const [focus, setFocus] = useState(false);
  const field = React.useRef();
  const handleOnKeyDown = (e) => {
    if(e.keyCode === 13){
      onClickSearch();
      setFocus(false);
      onCloseMenu();
    }else if (e.keyCode === 40 || e.keyCode === 9) {
      if(!focus){
        setFocus(true);
      }
    }
  }
  return(
    <>
      <CustomTextField
        ref={field}
        autoComplete='off'
        onKeyDown={handleOnKeyDown}
        InputProps={{
          endAdornment:(
            <InputAdornment position='end'>
              <IconButton onClick={onDelete} sx={{...deleteButtonStyle,opacity:(attr['value']!=="")?1:0}}><CloseIcon size='1rem'/></IconButton>
            </InputAdornment>
          )
        }}
        {...attr}
      />
      <Menu
        id={'Menu'+attr['id']}
        autoFocus={focus}
        disableAutoFocus={!focus}
        anchorEl={(field.current)?field.current:null}
        sx={{'.MuiMenu-paper':{width:(field.current)?field.current.offsetWidth:null,maxHeight:'30vh', overflow:'auto'}}}
        open={menuOpen}
        onClose={onCloseMenu}
      >
        {(loading)?<MenuItem key={"Menu-Search-loading"+attr['id']}><CircularProgress size='1rem'/>  Loading</MenuItem>:
          ((data && data.length > 0)?data.map((item, i)=>{
            return <MenuItem key={"Menu-Search"+attr['id']+i}
              onClick={()=>{onClickItemSearch(item);setFocus(false);onCloseMenu()}}>{(labelData)?item[labelData]:item}</MenuItem>
        }):<MenuItem key={"Menu-Search-nodata"+attr['id']}>No Data</MenuItem>)}
      </Menu>
      <IconButton onClick={onClickSearch} sx={{fontSize:'1.5rem',color:'#ffff', background:'#004d4d',
        marginLeft:'7px', '&:hover':{background:'#004d4d'}, padding:'.5rem', ...btnSearchStyle}}>{searchIcon}</IconButton>
      <IconButton onClick={onFilter} sx={{fontSize:'1.5rem', color:'#ffff',
        background:'#004d4d', marginLeft:'7px', '&:hover':{background:'#004d4d'}, padding:'.5rem', ...btnFilterStyle}}>{filterIcon}</IconButton>
    </>
  )
}
Search.defaultProps={
  loading:false,
  filterIcon:<FilterAltIcon sx={{fontSize: 'inherit'}}/>,
  searchIcon:<SearchIcon sx={{fontSize:'inherit'}}/>,
  onClickSearch: function () {},
  onCloseMenu: function () {},
  menuOpen: false,
}
export function Container(props) {
  const {id, sizeLoadingData, data, page, onPageChange, countPage, pattern, itemSpacing, sxRoot, ...attr} = props;
  const character = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var keys = '';
  for(var ind = 0;ind < 5;ind++){
    keys += character.charAt(Math.floor(Math.random()*character.length));
  }
  const initStateSize = useSelector(countDataAppearsDefault);
  const md = useMediaQuery('(min-width:900px)');
  const clone = []
  for(var s = 0; s < sizeLoadingData; s++){
    clone.push(<BookView key={"loading"+s} book={null} sx={{marginBottom:'.5rem', marginRight:'.5rem'}}/>)
  }
  const comp = React.useCallback(()=>{
    return ((data.length > 0)?
        (data.map((data,i) =>
            <BookView key={"wider"+keys+i} keys={keys} id={id+i} book={data} index={(page-1)*initStateSize.book+(i+1)}
              sx={{margin: (theme) => theme.spacing(itemSpacing)}}/>)
        ):(<>{clone}</>))
  },[data])
  return(
    <Box display='flex' justifyContent='center' alignItems='center' flexWrap='wrap' sx={{width:'100%',...sxRoot}}>
      {(pattern === 'wider')?
        <>
          <Box display='flex' justifyContent='center' alignItems='center' flexWrap='wrap' {...attr}>
            {comp()}
          </Box>
          <Pagination size={(md)? 'medium':'small'} sx={{'& .MuiPagination-ul':{'& .MuiPaginationItem-root':{color:'#bfbfbf',padding:'.4rem',fontSize:'1rem'}
            ,'& .Mui-selected':{color:'white'}}}} count={countPage} page={page} onChange={onPageChange} color="primary"/>
        </>:
        <>
          <Box display='flex' justifyContent='flex-start' alignItems='center' direction={pattern} {...attr}>
            {comp()}
          </Box>
          <Pagination size={(md)? 'medium':'small'} sx={{'& .MuiPagination-ul':{'& .MuiPaginationItem-root':{color:'#bfbfbf',padding:'.4rem',fontSize:'1rem'}
            ,'& .Mui-selected':{color:'white'}}}} count={countPage} page={page} onChange={onPageChange} color="primary"/>
        </>
      }
    </Box>
  );
}
Container.defaultProps = {
  pattern: 'wider',
  data:[],
  keys:'',
}

export function OnDeleteComponent(props) {
  const {onDelete, title, content, onClose, open, buttonTitle, disabled} = props;
  return(
    <Dialog open={Boolean(open)} onClose={onClose} sx={{zIndex: (theme) => theme.zIndex.drawer + 5}}>
      <DialogTitle sx={{fontSize:'1.2rem'}}>
        {title}
      </DialogTitle>
      <DialogContent sx={{display:'flex', justifyContent:'center',alignItems:'center'}}>
        <WarningIcon sx={{fontSize:'80px', marginRight:'10px', color:'#ffcc00'}}/>
        <DialogContentText sx={{fontSize:'1rem'}}>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button sx={{fontSize:'1rem'}} disabled={disabled} onClick={onDelete}>{buttonTitle}</Button>
        <Button sx={{fontSize:'1rem'}} onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}
OnDeleteComponent.defaultProps = {
  disabled : false,
  buttonTitle : 'Delete'
}

export const PasswordContainer = (props) => {
  const{isVerify, setVerify, password, setPassword, onDelete, buttonTitle, disabled} = props;
  return(
    <Dialog open={isVerify} onClose={(e) => {e.stopPropagation();setVerify(false);setPassword('');}} sx={{zIndex:(theme) => theme.zIndex.drawer + 6}}>
      <DialogTitle sx={{fontSize:'1.2rem'}}>Confirm is that you</DialogTitle>
      <DialogContent sx={{display:'flex',justifyContent:'center'}}>
        <TextField InputProps={{style:{fontSize:'.8rem'}}} InputLabelProps={{style:{fontSize:'.8rem'}}} variant='filled' type='password' value={password}
          onClick={e => e.stopPropagation()} onChange={(e) => {e.stopPropagation();setPassword(e.target.value);}} onKeyDown={(e) => {e.stopPropagation();if(e.keyCode === 13){onDelete(e);}}} label='Input Password'/>
      </DialogContent>
      <DialogActions>
        <Button sx={{fontSize:'1rem'}} disabled={disabled} onClick={onDelete}>{buttonTitle}</Button>
        <Button sx={{fontSize:'1rem'}} onClick={(e)=> {e.stopPropagation();setPassword('');setVerify(false);}}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}
PasswordContainer.defaultProps = {
  disabled : false,
  buttonTitle : 'Delete'
}

export function UploadImage(props) {
  const {id, open,setOpen,img, setImg, imgStore, type, viewport, boundary} = props
  const [image, setImage] = useState();
  const handleSetImage = () => {
    if(image){
      image.result({type:'blob',circle:(type === 'square')?false:true}).then(file => imgStore(file))
      image.result({type:'base64',circle:(type === 'square')?false:true}).then(data => setImg({...img,data:data}))
    }
    setOpen(false);
  }
  useEffect(()=>{
    if(image){
      if(img.data){
        image.bind({
          url: img.data
        })
      }
    }
    else{
      setImage(new Croppie(document.getElementById(id),{
        boundary:{
          width: boundary.width,
          height: boundary.height,
        },
        viewport:{
          width:viewport.width,
          height:viewport.height,
          type:type,
        }
      }))
    }
  },[img])
  return(
    <Backdrop open={Boolean(open)} sx={{zIndex:(theme)=> theme.zIndex.drawer + 9}}>
      <Stack>
        <Box>
          <Box id={id}></Box>
        </Box>
        <Stack sx={{marginTop:'20px'}}direction='row' spacing={2} justifyContent='center' alignItems='center'>
          <Button variant='contained' sx={{fontSize:'1rem'}} onClick={handleSetImage}>Set Image</Button>
          <Button variant='contained' sx={{fontSize:'1rem'}} onClick={() => {setOpen(false);setImg({...img,data:null});}}>Cancel</Button>
        </Stack>
      </Stack>
    </Backdrop>
  );
}
UploadImage.defaultProps = {
  type : 'circle',
  viewport : {width:200, height:200},
  boundary : {width:'100vw', height:'80vh'}
}


export function getBase64(file) {
  // const resize = (img) => {
  //   var canvas = document.createElement('canvas');
  //   var width = img.width;
  //   var height = img.height;
  //   if(width > height){
  //     if (width > 800){
  //       height = Math.round(height *= 800 / width);
  //       width = 800;
  //     }
  //   } else {
  //     if (height > 600) {
  //       width = Math.round(width *= 600 / height);
  //       height = 600;
  //     }
  //   }
  //   canvas.width = width;
  //   canvas.height = height;
  //   var data = canvas.getContext('2d');
  //   data.drawImage(img,0,0,width,height);
  //   return canvas.toDataURL('image/jpeg',1);
  // }
  return new Promise(function(success, error) {
    var read = new FileReader();
    read.readAsDataURL(file);
    read.onload = function (e) {
      success(e.target.result)
      // var image = new Image();
      // image.src = url;
      //
      // image.onload = function () {
      //   callback({...prevData, image:resize(image)});
      // }
    }
    read.onerror = function (s) {
      error(s);
    }
  })
}

export function UploadFunc(props) {
  const {id, setImage, image, imageInit, setImgInit, setError, fileInit, setFileInit, file, setFile, isImg, imgCallback, sx} = props
  const onDrop = (e) => {
      e.stopPropagation();
      e.preventDefault();
      let files = e.dataTransfer.files;
      if(files && files[0]){
        setFile(files[0]);
      }
  }
  const onDrag = (e) => {
    e.stopPropagation();
    e.preventDefault();
  }
  const onImg = (e) => {
    var files = e.target.files[0];
    if(files) {
      getBase64(files).then(res => {setImgInit(null);setImage({...image, data: res});imgCallback(true);}).catch(err => setError(err.message));
    }
  }
  const onFile = (e) => {
    var files = e.target.files[0];
    if(files){
      setFile(files);
    }
  }
  const uploadPdf = (
    <>
      {(file || fileInit)?(
        <Card sx={{padding:'10px'}}>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <PictureAsPdfIcon color='error'/>
            <Typography sx={{flexGrow:1, marginLeft:'5px'}}>{(file)?file.name:((fileInit)?fileInit:null)}</Typography>
            <IconButton onClick={() => {setFile(null);setFileInit(null)}}><CloseIcon/></IconButton>
          </Box>
        </Card>
        ):(
          <Card sx={{background:'transparent'}}>
            <Box component='div' onDrop={onDrop} onDragOver={onDrag} onDragEnter={onDrag}>
              <label htmlFor={'file-book-modify'+id}>
                <CardActionArea component='span'>
                  <Box justifyContent='center' alignItems='center' display='flex' flexWrap='wrap' sx={{...sx}}>
                    <FileUploadIcon sx={{color:'#ffff'}}/>
                    <Typography sx={{width:'100%',textAlign:'center',fontWeight:600,
                      fontFamily:'Consolas',fontSize:'1.1rem',color:'#e6e6e6'}}>Click</Typography>
                    <Typography sx={{width:'100%',textAlign:'center',fontWeight:600,
                      fontFamily:'Consolas',fontSize:'1.1rem',color:'#e6e6e6'}}>Or</Typography>
                    <Typography sx={{width:'100%',textAlign:'center',fontWeight:600,
                      fontFamily:'Consolas',fontSize:'1.1rem',color:'#e6e6e6'}}>Drag Pdf file to this area</Typography>
                  </Box>
                </CardActionArea>
              </label>
            </Box>
            <input id={'file-book-modify'+id}
                type='file'
                onChange={onFile}
                accept='.pdf'
                style={{display:'none'}}/>
          </Card>
        )
      }
    </>
  )
  const uploadImage = React.useCallback(() => (
    <Card sx={{background:'transparent'}}>
      <label htmlFor={'gambar-book-modify'+id}>
        <CardActionArea component='span' onClick={e => e.stopPropagation()}>
          <CardMedia image={(image && image.data)?image.data: ((imageInit)?`${imageBookURL}${imageInit}`:null)}>
            <Box display='flex' justifyContent='center' alignItems='center' flexWrap='wrap' sx={{backgroundColor:((image && image.data) || imageInit)?'rgba(0,0,0,.5)':'rgba(0,0,0,0)',height:'6rem',...sx}}>
              <AddPhotoAlternateIcon sx={{color:'#ffff'}}/>
              <Typography sx={{width:'100%',textAlign:'center',fontWeight:600,
                fontFamily:'Consolas',fontSize:'1.1rem',color:'#e6e6e6'}}>Click to add image</Typography>
            </Box>
          </CardMedia>
        </CardActionArea>
      </label>
      <input id={'gambar-book-modify'+id}
          type='file'
          onChange={onImg}
          accept='image/*'
          style={{display:'none'}}/>
    </Card>
  ),[image,imageInit])
  return(
    <>
      {(isImg)?
        (
          <>{uploadImage()}</>
        ):(
          <>{uploadPdf}</>
        )
      }
    </>
  )
}

export function ModifyBook(props) {
  const {rootProps, onRootLink, onMainLink, onError, onSuccess, prof, imgFile, imgView, setImgView,
    imgCallback, url, responText, labelButton, modify, ...attr} = props;
  const[fileInit, setFileInit] = useState(null);
  const[imgInit, setImgInit] = useState(null);
  const[themeData,setThemeData] = useState([]);
  const[newThemeData,setNewThemeData] = useState([]);
  const[theme,setTheme] = useState({id:null,name:''});
  const[themeDataSuggestion,setThemeDataSuggestion] = useState([]);
  const[loadingTheme,setLoadingTheme] = useState(false);
  const[openTheme, setOpenTheme] = useState(false);
  const[publisher, setPublisher] = useState({id:null,name:''});
  const[publisherDataSuggestion,setPublisherDataSuggestion] = useState([]);
  const[loadingPublisher,setLoadingPublisher] = useState(false);
  const[openPublisher, setOpenPublisher] = useState(false);
  const[pdfFile, setPdfFile] = useState()
  const[preventClick, setPreventClick] = useState(false)
  const[data, setData] = useState({id:'',title:'',description:''})
  useEffect(()=>{
    if(modify && onRootLink && onMainLink && rootProps){
      let url = new URLSearchParams(decodeURI(rootProps.location.search));
      if(url && url.get('id') && url.get('title') && url.get('description') && url.get('publisher') && url.get('theme')){
        setData({id:url.get('id'),title:url.get('title'),description:url.get('description')});
        setPublisher(JSON.parse(url.get('publisher')))
        setThemeData(JSON.parse(url.get('theme')))
        setImgView({...imgView,data:null});
        setImgInit(url.get('image'))
        setFileInit(url.get('file'))
        onRootLink(0);
        onMainLink(1);
      }
    }
  },[])
  const onUpload = () => {
    if(data.title && publisher.name && data.description && (themeData.length > 0 || newThemeData.length > 0) && prof.id && ((pdfFile && imgFile) || modify)){
      setPreventClick(true)
      var user = new FormData();
      if(data.id){
          user.append('idBook',data.id);
      }
      user.append('title',data.title);
      if(publisher.id === null){
          user.append('newPublisher',publisher.name);
      }else {
          user.append('publisher',publisher.id);
      }
      user.append('description',data.description);
      if(themeData.length !== 0){
          user.append('theme',themeData.map(a => a.id));
      }
      if(newThemeData.length !== 0){
          user.append('newTheme',newThemeData.map(a => a.name));
      }
      user.append('favorite',true);
      user.append('file',pdfFile);
      user.append('image',imgFile);
      if(modify){
        axios.put(url,user,{
          withCredentials:true,
        }).then(a => {setPreventClick(false);window.location.href='/my-library';})
        .catch(err => {
          if(err.response){
            onError(err.response.data.message)
          }else {
            onError(err.message)
          }
          setPreventClick(false);})
      }
      else{
        axios.post(url,user,{
          withCredentials:true,
        }).then(a => {setPreventClick(false);onSuccess(responText);})
        .catch(err => {
          if(err.response){
            onError(err.response.data.message)
          }else {
            onError(err.message)
          }
          setPreventClick(false);})
      }
    }
    else {
      onError('all field must be filled (including image and file)');
    }
  }
  const handleKeyDown = (e) => {
    if(e.keyCode === 13){
      onUpload();
    }
  }
  const onClickItemTheme = (item) => {
    if(item.id === null){
      setNewThemeData([...newThemeData, item])
    }
    else{
      setThemeData([...themeData, item])
    }
    setTheme({id: null, name:''})
  }
  const onDeleteThemeData = (name, data, setData) => {
    setData(data.filter(s => s.name !== name))
  }

  const idFuncFilterElement =  [setPublisher,setTheme]
  const openFilterElement =  [openPublisher, openTheme]
  const openFuncFilterElement =  [setOpenPublisher, setOpenTheme]
  const loadingFilterElement =  [setLoadingPublisher, setLoadingTheme]
  const dataFilterElement =  [setPublisherDataSuggestion, setThemeDataSuggestion]
  const urlFilterElement = [searchPublisherBookURL, searchThemeBookURL]
  let timeout = null
  const handleInputValue = async(id,vl) => {
    idFuncFilterElement[id]({id:null, name: vl});
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
        onError(err.response.data.message);
      }else {
        onError(err.message);
      }openFuncFilterElement[id](false)});
      loadingFilterElement[id](false);
  }
  return(
      <Stack {...attr}>
        <Stack spacing={3} direction={{xs:'column',md:'row'}}>
          <Stack spacing={2} sx={{width:{xs:'100%', md:'80%'}}}>
            <CustomTextField size='small' type='text' onKeyDown={handleKeyDown} name='title' value={data.title}
            onChange={(a) => setData({...data, title: a.target.value})} label='Book Title' sx={{color:'white'}}
            InputLabelProps={{style:{fontSize: '1rem',}}} InputProps={{style:{fontSize: '1rem',}}}/>
            <Search id={"modify-publisher"+attr['id']} size='small' value={publisher.name} onChange={e => handleInputValue(0,e.target.value)}
              placeholder='Publisher...' data={publisherDataSuggestion} labelData='name' onClickItemSearch={(item) => setPublisher(item)}
              loading={loadingPublisher} label='Book Publisher' menuOpen={openPublisher} onMenuOpen={setOpenPublisher}
              btnFilterStyle={{display:'none'}} onDelete={() => setPublisher({id:null,name:''})} onClickSearch={onUpload}
              btnSearchStyle={{display:'none'}} onCloseMenu={() => {setOpenPublisher(false);setPublisherDataSuggestion([])}}
              deleteButtonStyle={{color:'white'}} sx={{color:'white'}}/>
          </Stack>
          <UploadFunc id={attr['id']} sx={{border:'4px solid rgba(89, 89, 89, .3)',
            borderStyle: 'dashed'}} setImage={setImgView} image={imgView} setError={onError}
            isImg={true} imgCallback={imgCallback} imageInit={(imgInit)?imgInit:null} setImgInit={setImgInit}/>
        </Stack>
        <CustomTextField value={data.description} sx={{color:'white'}} multiline rows={4} label='Description from your book'
          onChange={(a) => setData({...data, description: a.target.value})} helperText={"Use special character that start with: 'p->....<-p' to make new paragraph,"+
          " '-=>.._,_.._,_..<=-' to make list and per list item separated by '_,_', '!--....--!' to make special sentence."}
          FormHelperTextProps={{style:{color:'white',fontSize:'.8rem'}}} InputLabelProps={{style:{fontSize: '1rem',}}} InputProps={{style:{fontSize: '1rem',}}}/>
          <Search id={"modify-theme"+attr['id']} size='small' value={theme.name} onChange={e => handleInputValue(1,e.target.value)}
            placeholder='Theme Book...' data={themeDataSuggestion} labelData='name' onClickItemSearch={(item) => onClickItemTheme(item)}
            loading={loadingTheme} label='Book Theme' menuOpen={openTheme} onMenuOpen={setOpenTheme} btnFilterStyle={{display:'none'}}
            onDelete={() => setTheme({id:null,name:''})} onClickSearch={onUpload} btnSearchStyle={{display:'none'}}
            onCloseMenu={() => {setOpenTheme(false);setThemeDataSuggestion([])}} deleteButtonStyle={{color:'white'}} sx={{color:'white'}}/>
        <Stack direction='row' spacing={1} display='flex' flexWrap='wrap'>
        {
            (themeData.length > 0)?
            themeData.map((a,i) => (
              <Chip sx={{color:'white',fontSize:'1rem',marginBottom:'10px','& .MuiChip-deleteIcon':{fontSize:'1.4rem'}}}
                key={i} label={a.name} onDelete={() => onDeleteThemeData(a.name,themeData,setThemeData)}/>
            )):null}
        {
            (newThemeData.length > 0)?
            newThemeData.map((a,i) => (
              <Chip sx={{color:'white',fontSize:'1rem',marginBottom:'10px','& .MuiChip-deleteIcon':{fontSize:'1.4rem'}}}
                key={i} label={a.name} onDelete={() => onDeleteThemeData(a.name,newThemeData,setNewThemeData)}/>
            )):null}
        </Stack>
        <UploadFunc id={attr['id']} sx={{border:'4px solid rgba(89, 89, 89, .3)', paddingTop:'20px', paddingBottom:'20px',
          borderStyle: 'dashed', background: 'rgba(255, 255, 255, .2)'}} file={pdfFile} setFile={setPdfFile}
          isImg={false} fileInit={fileInit} setFileInit={setFileInit} setError={onError}/>
        <Box justifyContent='center' alignItems='center' display='flex'>
          <Button variant='contained' sx={{background:'#0099cc'}} onClick={onUpload}
            disabled={preventClick} startIcon={(preventClick)?<CircularProgress size='1rem' color="primary"/>:null}>{(labelButton)?labelButton:'Add Books'}</Button>
          {(data.id)?
            <Button variant='contained' color='error' sx={{marginLeft:'10px'}}
              onClick={e => {window.location.reload();}}>Cancel</Button>
              :null
          }
        </Box>
      </Stack>
  )
}