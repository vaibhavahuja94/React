import animationData from './copy.json'
import editAnimationData from './edit.json'
import loadingAnimationData from './loadingV2.json'
import Visiblity from './visibility-V3.json'
import MenuIcon from './menuV2.json'
import HomeIcon from './home.json'
import plusIcon from './plusToX.json'

export const loadDefaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimationData,
};

export const menuDefaultOptions = {
    loop: true,
    autoplay: false,
    animationData: MenuIcon,
};

export const homeDefaultOptions = {
    loop: true,
    autoplay: false,
    animationData: HomeIcon,
};

export const plusDefaultOptions = {
    loop: true,
    autoplay: false,
    animationData: plusIcon,
};

export const copyDefaultOptions = {
    loop: true,
    autoplay: false,
    animationData: animationData,
};

export const visiblityOptions = {
    loop: true,
    autoplay: false,
    animationData: Visiblity,
};

export const editDefaultOptions = {
    loop: true,
    autoplay: false ,
    animationData: editAnimationData,
};