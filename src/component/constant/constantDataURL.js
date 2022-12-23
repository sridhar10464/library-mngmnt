//mainURL
export const mainURL= "http://localhost:8895";
export const redirectEks = "?redirect_uri=";

//user
export const verUserURL = mainURL+"/user/get";
export const signUpURL = mainURL+"/user/signup";
export const logInURL = mainURL+"/user/login";
export const pathOauthURL = mainURL+"/login/auth";
export const pathOauthURLRedirect = redirectEks + "http://localhost:3000/login";
// export const getUsersURL = mainURL+"/user/getalluser";
// export const getAdminURL = mainURL+"/user/getalladmin";
export const searchUserURL = mainURL+"/user/search";
export const searchUserAdminURL = mainURL+"/user/search/manager";
export const deleteUserOnlineURL = mainURL+"/user/delete/useronline";
export const addUserOnlineURL = mainURL + "/user/adduseronline";
export const deleteUserURL = mainURL+"/user/delete";
export const deleteAdminURL = mainURL+"/user/delete/admin";
export const verifyPasswordURL = mainURL+"/user/password";
export const changePasswordURL = mainURL+"/user/password/change";
export const getReportURL = mainURL+"/user/getReport";
export const logOutURL = mainURL+"/user/logout";
export const upgradeAdminURL = mainURL+"/user/modify/admin";
export const upgradeUserURL = mainURL+"/user/modify/seller";
export const modifyUserURL = mainURL+"/user/modify";

//verify User
export const valDefaultURL = mainURL+"/user/verify";
export const valOauthURL = mainURL+"/user/verify-oauth";

//book
export const mainBookURL = mainURL+"/book/books";
export const searchBookURL = mainURL+"/book/searchBookResult";
export const searchBookSuggestionURL = mainURL+"/book/searchBook";
export const searchMyBookURL = mainURL+"/book/search-MyBookResult";
export const searchMyBookSuggestionURL = mainURL+"/book/search-MyBook";
export const searchTitleBookURL = mainURL+"/book/title"
export const searchAuthorBookURL = mainURL+"/book/author";
export const searchPublisherBookURL = mainURL+"/book/publisher";
export const filterBookURL = mainURL+"/book/filterBookResult";
export const modifyBookURL = mainURL+"/book/modifybook/modify";
export const modifyBookFavURL = mainURL+"/book/modifybook/fav";
export const getMyBookURL = mainURL+"/book/myBook";
export const getOneMyBookURL = mainURL+"/book/myBook-one";
export const getRecomendBookURL = mainURL+"/book/bookRekommend";
export const getFavoriteBookURL = mainURL+"/book/bookFavorite";
export const addBookURL = mainURL+"/book/addbook";
export const modifBookURL = mainURL+"/book/modifybook";
export const deleteBookURL = mainURL+"/book/delete";

//type Book
export const searchThemeBookURL = mainURL+"/book/types";
export const getTypeURL = mainURL+"/book/alltype";
export const getBooksByTypeURL = mainURL + "/book/getbooksbytype";

//fileandimage
export const imageBookURL = mainURL+"/book/image/";
export const fileBookURL = mainURL+"/book/file/";
export const imageUserURL = mainURL+"/user/image/";