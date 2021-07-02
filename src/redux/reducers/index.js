import { combineReducers } from 'redux';
import userInfo from './userInfo';
import formData from './formData';
import tagList from './tagList';
import { breadCrumb, tags, theme, collapse } from './setting';
export default combineReducers({ userInfo, formData, tagList, breadCrumb, tags, theme, collapse });
