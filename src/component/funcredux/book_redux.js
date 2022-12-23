import {createSlice} from '@reduxjs/toolkit';

export const bookFunc = createSlice({
  name:'book',
  initialState:{
    books: [],
    bookFav: [],
    bookRek: [],
    bookSeller: [],
    bookTheme: [],
    allBookPage:0,
    bookFavPage:0,
    myBookPage:0,
    trigger:-1,
    initCountDataAppears: {type:10,book:15}
  },
  reducers:{
    setBooks: (s, a) => {s.books = a.payload},
    setTrigger: (s, a) => {s.trigger = a.payload},
    setAllBookPage: (s,a) => {s.allBookPage = a.payload},
    setBookFavPage: (s,a) => {s.bookFavPage = a.payload},
    setMyBookPage: (s,a) => {s.myBookPage = a.payload},
    setBookRek: (s, a) => {s.bookRek = a.payload},
    setBookFav: (s, a) => {s.bookFav = a.payload},
    setBookSeller: (s, a) => {s.bookSeller = a.payload},
    setBookTheme: (s, a) => {s.bookTheme = a.payload},
  },
})

export const {setBooks, setBookFav, setBookRek, setBookSeller, setBookTheme, setAllBookPage, setBookFavPage, setMyBookPage, setTrigger} = bookFunc.actions

export const books = state => state.book.books

export const countDataAppearsDefault = state => state.book.initCountDataAppears

export const trigger = state => state.book.trigger

export const allBookPage = state => state.book.allBookPage
export const bookFavPage = state => state.book.bookFavPage
export const myBookPage = state => state.book.myBookPage

export const bookThemes = state => state.book.bookTheme

export const favoriteBooks = state => state.book.bookFav

export const recommendBooks = state => state.book.bookRek

export const myBooks = state => state.book.bookSeller

export default bookFunc.reducer