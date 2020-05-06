import React from 'react';
import PropTypes from 'prop-types';
import LottieAnimation from 'components/LottieAnimation/LottieAnimation';
import styles from './Message.module.scss'
import { T_CHILDREN } from 'types';

const MessageContent = ({type, animationName, height, width, loop, children}) => {
    return (
        <div>
            {
                animationName ?
                <LottieAnimation animationName={animationName} height={height} width={width} loop={loop}/> : null
            }
            <div className={styles[type]} align='center'>{children}</div>
        </div>
    )
};

class Message extends React.Component {
    static Error = (options) => MessageContent(options);
    static Loading = (options) => MessageContent(options);
    static Info = (options) => MessageContent(options);

    render() {
        return (
            <MessageContent>{this.props.children}</MessageContent>
        )
    }
}

Message.defaultProps = {
    type: 'default',
    animationName: '',
};

Message.Error.defaultProps = {
    type: 'error',
    width: 50,
    height: 50,
    animationName: 'error',
    loop: true
};

Message.Loading.defaultProps = {
    type: 'default',
    width: 200,
    height: 50,
    animationName: 'progress-bar',
    loop: true
};

Message.Info.defaultProps = {
    type: 'info',
    width: 100,
    height: 100,
    animationName: 'information',
    loop: true
};

Message.propTypes = {
    type: PropTypes.string,
    animationName: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    loop: PropTypes.bool,
    children: T_CHILDREN,
};

export default Message;
