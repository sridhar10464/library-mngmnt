import React from 'react';
import Book from './Book';
import {imageBookURL} from './../../constant/constantDataURL';
import GlobalStyles from '@mui/material/GlobalStyles'
// import {makeStyles} from '@mui/styles';
import {ContainerFeedback} from '../utils/otherComponent';
import {CardMedia, Card, CardActionArea, Typography, Box, Divider, Skeleton, Backdrop, Snackbar} from '@mui/material';

const useStyle = GlobalStyles({
  root: {
    minWidth: '8rem',
    maxWidth: '8rem',
    height: '10rem',
    maxHeight:'10rem',
    borderRadius: '10px',
  },
  load: {
    width: '8rem',
    minWidth: '8rem',
    height: '10rem',
    borderRadius: '10px',
  },
  id: {
    padding: '3px',
    paddingBottom: '1px',
    paddingLeft: '5px',
    fontSize: '1rem',
    borderRadius: '0px 0px 10px 0px',
    borderBottom: '3px solid #ffcc00',
    background: '#ff8000',
    color:'white',
  },
  text: {
    textAlign:'center',
    width:'7.5rem',
    maxWidth:'7.5rem',
    fontFamily: 'Century Gothic',
    fontSize: '.8rem',
  },
  image:{
    width:'100%',
    height:'6rem',
    boxShadow: '0px -10px 20px -20px #000000 inset',
  }
});

export default function BookView(props) {
  const {id, book, keys, index,...attr} = props;
  const[open, setOpen] = React.useState(false);
  const[error, setError] = React.useState();
  const[respon, setRespon] = React.useState();
  const style = useStyle();
  const openMenu = React.useCallback((e)=> {
      if(!open){
        setOpen(true);document.body.style='overflow-y:hidden;touch-action:none;';
      }else{
        setOpen(false);document.body.style='overflow-y:auto;touch-action:auto;';
      }
    },[open])
  return(
    <>
      {
        (book)? (
          <>
            <Card className={style.root} {...attr}>
              <CardActionArea sx={{height:'100%',display:'flex',justifyContent:'center',alignItems:'flex-start',flexWrap:'wrap'}}
                onClick={openMenu}>
                <Box justifyContent='center' alignItems='flex-start' display='flex' width='100%'>
                  <CardMedia image={`${imageBookURL}${book.image}`} className={style.image}>
                    <Box justifyContent='flex-start' alignItems='center' display='flex'>
                      <Typography className={style.id}>{index}</Typography>
                    </Box>
                  </CardMedia>
                </Box>
                <Divider/>
                <Box display='flex' justifyContent='center' alignItems='center' flexWrap='wrap'>
                  <Typography noWrap={true} className={style.text} sx={{color:'#007acc'}}>{book.title}</Typography>
                  <Divider sx={{width:'90%'}}/>
                  <Typography noWrap={true} className={style.text} sx={{color:'#ff8000'}}>{book.author}</Typography>
                </Box>
              </CardActionArea>
            </Card>
            <Snackbar anchorOrigin={{vertical:'top',horizontal:'center'}} open={Boolean((respon)?respon:error)} onClose={() => (respon)? setRespon(null):setError(null)} autoHideDuration={4000}
              sx={{zIndex: (theme) => theme.zIndex.drawer + 5}}>
              <ContainerFeedback severity={(respon)? 'success':'error'} onClose={() => (respon)? setRespon(null):setError(null)}>
                {(respon)? respon:error}
              </ContainerFeedback>
            </Snackbar>
            <Backdrop sx={{zIndex: (theme) => theme.zIndex.drawer + 1, width:'100vw', height:'100vh'}} open={Boolean(open)}
              onClick={openMenu}>
              <Book id={id+keys} book={book} isOpenFunc={setOpen} setRespon={setRespon} setError={setError}/>
            </Backdrop>
          </>
        ):(
          <Skeleton className={style.load} variant='rectangular' {...attr}/>
        )
      }
    </>
  );
}