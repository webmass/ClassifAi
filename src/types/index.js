import PropTypes from 'prop-types';

export const T_CHILDREN = PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
]);

export const T_CATEGORY = PropTypes.string;

export const T_CATEGORIES = PropTypes.arrayOf(T_CATEGORY);

export const T_MODEL_ITEM = PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    categories: T_CATEGORIES.isRequired,
    isCommunityModel: PropTypes.bool,
    nbTrainings: PropTypes.number,
});

export const T_MODELS = PropTypes.arrayOf(T_MODEL_ITEM);

export const T_LOTTIE_ANIMATION = {
    animationName: PropTypes.string.isRequired,
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    loop: PropTypes.bool,
    autoplay: PropTypes.bool,
    onComplete: PropTypes.func,
    rendererSettings: PropTypes.object,
};

export const T_ANIMATION = PropTypes.shape(T_LOTTIE_ANIMATION);
