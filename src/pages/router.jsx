import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import QueryProvider from '../contexts/QueryProvider';
import Home from './Home';

// react-router v5: Switch/Route/children, never v6 APIs. Most specific routes first.
// https://v5.reactrouter.com/web/guides/quick-start

const RouterPage = (props) => (
    <QueryProvider>
        <Router basename={props.pageInfo.basePath}>
            <Switch>
                <Route path='/'>
                    <Home {...props} />
                </Route>
            </Switch>
        </Router>
    </QueryProvider>
);

export default RouterPage;
