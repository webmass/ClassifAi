import React, {useState, useEffect, useRef} from 'react';
import Lottie from 'react-lottie';
import { T_LOTTIE_ANIMATION } from 'app-prop-types';

const LottieAnimation = ({
    animationName, height, width, loop, autoplay, onComplete, rendererSettings
}) => {
    const [animationData, setAnimationData] = useState(null);
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;
        const loadAnimationData = async () => {
            const animationData = await import(`../../assets/animations/${animationName}`);
            if (!isMountedRef.current) return;
            setAnimationData(animationData.default);
        };
        loadAnimationData();
        return () => isMountedRef.current = false;
    }, [animationName, height, width, loop, autoplay, onComplete, rendererSettings]);

    return (
        <div style={{width, height, display: 'inline-block'}}>
            {
                animationData
                    ? (
                        <Lottie
                            height={height}
                            width={width}
                            options={{
                                loop,
                                autoplay,
                                animationData,
                                rendererSettings,
                            }}
                            eventListeners={[
                                {
                                    eventName: 'complete',
                                    callback: onComplete,
                                },
                            ]}
                        />
                    )
                    : null
            }
        </div>
    );
};

LottieAnimation.defaultProps = {
    onComplete: () => {},
    animationName: '',
    height: '100%',
    width: '100%',
    autoplay: true,
    loop: false,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

LottieAnimation.propTypes = T_LOTTIE_ANIMATION;

export default LottieAnimation;
