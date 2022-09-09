import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './components/Home';
import Customers from './components/Customers';
import Orders from './components/Orders';
import Inventory from './components/Inventory';

const App = () => {
	return (
		<Router>
			<div>
				<Nav />
				<Switch>
					<Route exact path="/">
						<Home />
					</Route>
					<Route exact path="/customers">
						<Customers />
					</Route>

					<Route exact path="/orders">
						<Orders />
					</Route>
					<Route exact path="/inventory">
						<Inventory />
					</Route>
				</Switch>
			</div>
		</Router>
	);
};

export default App;
