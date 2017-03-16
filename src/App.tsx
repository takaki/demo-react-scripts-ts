import * as React from 'react';
import './App.css';
import {Record} from 'immutable';
import {createAction, handleActions, Action} from 'redux-actions';
import {createStore} from 'redux';
import {connect, Provider, Dispatch} from 'react-redux';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

class Counter extends Record({counter: 0}) {
    counter: number;

    modify(diff: number) {
        return new Counter(this.set('counter', this.counter + diff));
    }
}

interface AppProps {
    data: Counter;
    updateModel: (d: Counter) => void;
}

class App extends React.Component<AppProps, undefined> {
    render() {
        return (
            <MuiThemeProvider>
                <div className="App">
                    <h1>{this.props.data.counter}</h1>
                    <FloatingActionButton onClick={() => this.props.updateModel(this.props.data.modify(1))}>
                        <ContentAdd/>
                    </FloatingActionButton>
                    <FloatingActionButton
                        secondary={true}
                        onClick={() => this.props.updateModel(this.props.data.modify(-1))}
                    >
                        <ContentRemove/>
                    </FloatingActionButton>
                </div>
            </MuiThemeProvider>
        );
    }
}

const initialState = new Counter();

const updateModel = createAction<Counter>('UPDATE_MODEL');
const reducer = handleActions<Counter>(
    {
        ['UPDATE_MODEL']: (state: Counter, action: Action<Counter>) => action.payload
    },
    initialState
);

const store = createStore(reducer);

function mapStateToProps(state: Counter) {
    return {data: state};
}

function mapDispatchToProps(dispatch: Dispatch<Counter>) {
    return {
        updateModel: function (m: Counter) {
            dispatch(updateModel(m));
        }
    };

}

export default class RApp extends React.Component<undefined, undefined> {
    render() {
        const DApp = connect(mapStateToProps, mapDispatchToProps)(App);
        return (
            <Provider store={store}>
                <DApp />
            </Provider>);
    }
}
