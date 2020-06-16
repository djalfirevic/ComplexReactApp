import React, { useReducer, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useImmerReducer } from 'use-immer';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Axios from 'axios';
import { CSSTransition } from 'react-transition-group';

// My Components
import Header from './components/Header';
import HomeGuest from './components/HomeGuest';
import Footer from './components/Footer';
import About from './components/About';
import Terms from './components/Terms';
import Home from './components/Home';
import CreatePost from './components/CreatePost';
import ViewSinglePost from './components/ViewSinglePost';
import FlashMessages from './components/FlashMessages';
import Profile from './components/Profile';
import EditPost from './components/EditPost';
import NotFound from './components/NotFound';
import Search from './components/Search';

import StateContext from './StateContext';
import DispatchContext from './DispatchContext';

Axios.defaults.baseURL = 'http://localhost:8080';

function Main() {
	const initialState = {
		loggedIn: Boolean(localStorage.getItem('complexappToken')),
		flashMessages: [],
		user: {
			token: localStorage.getItem('complexappToken'),
			username: localStorage.getItem('complexappUsername'),
			avatar: localStorage.getItem('complexappAvatar'),
		},
		isSearchOpen: false,
	};

	function ourReducer(draft, action) {
		switch (action.type) {
			case 'login':
				draft.loggedIn = true;
				draft.user = action.data;
				return;
			case 'logout':
				draft.loggedIn = false;
				return;
			case 'flashMessage':
				draft.flashMessages.push(action.value);
				return;
			case 'openSearch':
				draft.isSearchOpen = true;
				return;
			case 'closeSearch':
				draft.isSearchOpen = false;
				return;
		}
	}

	const [state, dispatch] = useImmerReducer(ourReducer, initialState);

	useEffect(() => {
		if (state.loggedIn) {
			localStorage.setItem('complexappToken', state.user.token);
			localStorage.setItem('complexappUsername', state.user.username);
			localStorage.setItem('complexappAvatar', state.user.avatar);
		} else {
			localStorage.removeItem('complexappToken');
			localStorage.removeItem('complexappUsername');
			localStorage.removeItem('complexappAvatar');
		}
	}, [state.loggedIn]);

	return (
		<StateContext.Provider value={state}>
			<DispatchContext.Provider value={dispatch}>
				<BrowserRouter>
					<FlashMessages messages={state.flashMessages} />
					<Header />
					<Switch>
						<Route path="/profile/:username">
							<Profile />
						</Route>
						<Route path="/" exact>
							{state.loggedIn ? <Home /> : <HomeGuest />}
						</Route>
						<Route path="/create-post">
							<CreatePost />
						</Route>
						<Route path="/post/:id" exact>
							<ViewSinglePost />
						</Route>
						<Route path="/post/:id/edit" exact>
							<EditPost />
						</Route>
						<Route path="/about-us">
							<About />
						</Route>
						<Route path="/terms">
							<Terms />
						</Route>
						<Route>
							<NotFound />
						</Route>
					</Switch>
					<CSSTransition
						timeout={330}
						in={state.isSearchOpen}
						classNames="search-overlay"
						unmountOnExit>
						<Search />
					</CSSTransition>
					<Footer />
				</BrowserRouter>
			</DispatchContext.Provider>
		</StateContext.Provider>
	);
}

ReactDOM.render(<Main />, document.querySelector('#app'));

if (module.hot) {
	module.hot.accept();
}
