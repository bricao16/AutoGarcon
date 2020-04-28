import React, {Fragment} from 'react';

class AppFooter extends React.Component {
    render() {


        return (
            <Fragment>
                <div className="app-footer">
                    <div className="app-footer__inner">
                        <div className="app-footer-left">
                            <ul className="nav">
                                <li className="nav-item">
                                    <p> Powered by AutoGarcon</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Fragment>
        )}
}

export default AppFooter;