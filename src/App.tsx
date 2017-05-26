import * as React from 'react';
import './App.css';
import {Record} from 'immutable';
import {Action, createAction, handleActions} from 'redux-actions';
import {createStore} from 'redux';
import {connect, Dispatch, Provider} from 'react-redux';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

class MainState extends Record({counter: 0}) {
    counter: number;

    modify(diff: number) {
        return new MainState(this.set('counter', this.counter + diff));
    }
}

interface MainAppProps {
    mainState: MainState;
    updateState: (d: MainState) => void;
}

class MainApp extends React.Component<MainAppProps, undefined> {
    render() {
        return (
            <MuiThemeProvider>
                <div className="App">
                    <h1>{this.props.mainState.counter}</h1>
                    <FloatingActionButton onClick={() => this.props.updateState(this.props.mainState.modify(1))}>
                        <ContentAdd/>
                    </FloatingActionButton>
                    <FloatingActionButton
                        secondary={true}
                        onClick={() => this.props.updateState(this.props.mainState.modify(-1))}
                    >
                        <ContentRemove/>
                    </FloatingActionButton>
                </div>
            </MuiThemeProvider>
        );
    }
}

class App extends React.Component<{}, null> {
    render() {
        const updateState = createAction<MainState>('UPDATE_MODEL');
        const store = createStore(handleActions<MainState>(
            {['UPDATE_MODEL']: (state: MainState, action: Action<MainState>) => action.payload},
            new MainState()
        ));
        const DApp = connect(
            (state: MainState) => {
                return {mainState: state};
            },
            (dispatch: Dispatch<MainState>) => {
                return {
                    updateState: function (m: MainState) {
                        dispatch(updateState(m));
                    }
                };
            })(MainApp);
        return (
            <Provider store={store}>
                <DApp />
            </Provider>);
    }
}
export default App;
