import React from 'react';
import styles from './Page.module.scss'
import Message from 'components/Message/Message';
import classnames from 'classnames';
import { T_CHILDREN } from 'app-prop-types';
import PropTypes from 'prop-types';
import TopBar from 'components/TopBar/TopBar';
import { ROUTES } from 'app/constants';

const PageContainer = ({children, addTopBarPadding = true, addBottomBarPadding = false, isCentered = false, className}) => {
    return (
        <div className={classnames(styles.Page, {
            [styles.topBarPadding]: addTopBarPadding,
            [styles.bottomBarPadding]: addBottomBarPadding,
            [styles.centered]: isCentered,
            [className]: !!className
        })}>{children}</div>
    );
};

class Page extends React.Component {
    static Error = ({children, ...props}) =>
        (
            <PageContainer addTopBarPadding={false} isCentered={true} {...props}>
                <TopBar backPath={ROUTES.HOME}/>
                <div>
                    <Message.Error>{children}</Message.Error>
                </div>
            </PageContainer>
        );

    render() {
        return (
            <PageContainer  {...this.props}>{this.props.children}</PageContainer>
        )
    }
}

Page.propTypes = {
    children: T_CHILDREN.isRequired,
    addTopBarPadding: PropTypes.bool,
    addBottomBarPadding: PropTypes.bool,
    isCentered: PropTypes.bool,
    className: PropTypes.string,
};

export default Page;
