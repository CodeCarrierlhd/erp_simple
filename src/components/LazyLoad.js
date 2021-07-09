import React from 'react'
import { Modal } from 'antd';


import './lazyload.css'
// threshold
const threshold = [0.01]
class LazyLoad extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            io: null,
            refs: null,
            images: null,
            loading: true,
            previewVisible: false,
            previewImage: ''
        }
        this.handleonload = this.handleonload.bind(this)
    }
    handleCancel = () => this.setState({ previewVisible: false });
    showImg = (src) => {
        console.log(src);

        this.setState({
            previewVisible: true,
            previewImage: src
        })
    };
    UNSAFE_componentWillMount() {
        let { ImgClassName, src, alt, ImgStyle } = this.props.state
        ImgClassName = ImgClassName ? ImgClassName : 'lazyload-img'
        alt = alt ? alt : '图片加载中。。。'
        let images = []
        let refs = []
        const ref = React.createRef()
        refs.push(ref)
        images.push(
            <div className='imgParent' key={src+Math.random()}>
                <div key={src} style={{ display: 'flex', alignItems: 'center' }} >
                    <img className={ImgClassName} ref={ref} data-src={src} alt={alt} style={{ ...ImgStyle }} />
                    {/* <Button type="primary"   >
                    预览
                </Button> */}

                </div>
                <div className='rightBtn' onClick={() => this.showImg(src)}>
                    <div className="add">
                        <p className='straightLine'></p>
                        <p className='horizontalLine'></p>
                    </div>
                </div>
            </div>

        )
        this.setState({
            refs,
            images
        })
    }
    componentDidMount() {
        const io = new IntersectionObserver(entries => {
            entries.forEach(item => {
                if (item.intersectionRatio <= 0) return
                const { src } = this.props.state
                const { target } = item
                let image = new Image()
                image.src = src
                image.onload = () => {
                    this.setState({ loading: false })
                    target.src = target.dataset.src
                }
            })
        }, {
            threshold
        })
        this.setState({ io })
    }
    handleonload() {
        const { io, refs } = this.state
        refs.forEach(item => {
            io.observe(item.current)
        })
    }
    render() {
        let { BoxClassName, width, height, BoxStyle } = this.props.state
        BoxClassName = BoxClassName ? BoxClassName : 'lazyload-img-box'
        const { images, previewImage, previewVisible } = this.state
        return (
            <div className={BoxClassName} style={{ width, height, ...BoxStyle }}>
                {images}
                {/* <Image onError={this.handleonload} src='' alt='antd-lazyload' style={{display: 'none'}}/> */}
                <img onError={this.handleonload} src='' alt='暂无图片。。。' style={{ display: 'none' }} />
                {previewImage === undefined ? '' : <Modal
                    visible={previewVisible}
                    title='图片预览'
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="图片加载中,请稍后。。。" style={{ width: '100%' }} src={previewImage} />
                </Modal>}
            </div>
        )
    }
}
export default LazyLoad
