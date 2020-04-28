import React from 'react';
import styles from './Page.module.scss'
import Message from 'components/Message/Message';
import classnames from 'classnames';

const PageContainer = ({children, hasTopBar = true, hasBottomBar = false, isCentered = false, className}) => {
    return (
        <div className={classnames(styles.Page, {
            [styles.withTopBar]: hasTopBar,
            [styles.withBottomBar]: hasBottomBar,
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

export default Page;
