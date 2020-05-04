import React from 'react';
import styles from './Page.module.scss'
import Message from 'components/Message/Message';
import classnames from 'classnames';
import { T_CHILDREN } from 'types';
import PropTypes from 'prop-types';

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
            <PageContainer {...props}>
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
