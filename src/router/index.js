import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Layout from '@/views/layout/Index';
import Login from '@/views/Login';
import ProductNumber from '@/views/noVerificationPage/ProductNumber';
import WareHouserList from '@/views/noVerificationPage/WareHouserList';
import LogisticsInfo from '@/views/noVerificationPage/LogisticsInfo';
import AuthRouter from '@/views/auth/AuthRouter';
const Router = () => {
	return (
		<HashRouter>
			<Switch>
				<Route component={ProductNumber} exact path="/ProductNumber" />
				<Route component={LogisticsInfo} exact path="/LogisticsInfo" />
				<Route component={WareHouserList} exact path="/WareHouserList" />
				<Route component={Login} exact path="/login" />
				<AuthRouter path="/" component={Layout} />
			</Switch>
		</HashRouter>
	);
};

export default Router;
