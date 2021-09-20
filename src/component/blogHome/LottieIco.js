import Lottie from 'react-lottie'

 const LottieIcon = (props) => {
    const defaultOptions = {
        loop: true,
        autoplay: false, 
        animationData: props.animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
    };

    const defaultOptionsPlay = {
        loop: true,
        autoplay: true, 
        animationData: props.animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
    };
    return (
        <>
        <Lottie
            options={props.Play?defaultOptionsPlay:defaultOptions}
            height={props.height?props.height:30}
            width={props.width?props.width:30}
            style={props.style?props.style:{ margin: "0 0 0 0" }}
            isStopped={props.stop}
            isPaused={props.pause} />
        </>
    )
}

export default LottieIcon