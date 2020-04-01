import React from 'react';
import styles from './Page.module.scss'
import Message from 'components/Message/Message';

const PageContainer = ({children, allCentered = false}) => {
    return (
        <div className={`${styles.Page} ${allCentered ? styles.centered : ''}`}>{children}</div>
    );
};

class Page extends React.Component {
    static Error = ({children}) =>
        (
            <PageContainer allCentered={true}>
                <div>
                    <Message.Error>{children}</Message.Error>
                </div>
            </PageContainer>
        );

    render() {
        return (
            <PageContainer>{this.props.children}</PageContainer>
        )
    }
}

export default Page;
