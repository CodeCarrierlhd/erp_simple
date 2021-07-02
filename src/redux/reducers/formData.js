import * as actionTypes from '../constants/index';
const formData = (state = {}, action) => {
	switch (action.type) {
		case actionTypes.SET_FORMDATA:
			return action.data;
		default:
			return state;
	}
};

export default formData;
