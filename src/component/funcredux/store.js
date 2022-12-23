import {configureStore} from '@reduxjs/toolkit';
import profileReducer from './profile_redux';
import bookReducer from './book_redux';

export default configureStore({
  reducer:{
    profile: profileReducer,
    book: bookReducer,
  },
})