import {createSlice} from '@reduxjs/toolkit';

export const profileFunc = createSlice({
  name: 'profile',
  initialState: {
    profile: null,
    online : false,
  },
  reducers:{
    setProf: (state, value) => {state.profile = value.payload},
    setOnline: (state, value) => {state.online = value.payload},
  }
});

export const {setProf, setOnline} = profileFunc.actions

export const profile = state => state.profile.profile

export const userOnline = state => state.profile.online

export default profileFunc.reducer