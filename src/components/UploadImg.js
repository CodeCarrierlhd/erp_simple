import React, { Component } from 'react';
import { Modal, Upload } from 'antd';


function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

class UploadImg extends Component {
    constructor(props) {
        super(props)
        console.log(props);

        this.state = {
            // imgs: props.childData.mainImg,
            previewVisible: false,
            previewImage: '',
            previewTitle: '',
            fileList: [
            ],
        }
    }

    componentDidMount() {
        this.props.onRef(this)
        this.handleImg()
    }
    componentDidUpdate(prevProps) {
        console.log(prevProps, this.props, 'uploadImg');
        //通过prevProps和更新后的state做前后对比，得到同getDerivedStateFromProps的效果
        if (prevProps.mainImg !== this.props.mainImg) {
            //这里是你要做的操作
            this.handleImg()
        }

    }

    handleImg = () => {
        let newFileList = []
        if (this.props.mainImg) {
            let oldfileList = this.props.mainImg.split(',')
            for (let index = 0; index < oldfileList.length; index++) {
                const element = oldfileList[index];
                newFileList.push({
                    uid: Math.random(),
                    status: 'done',
                    url: process.env.REACT_APP_URL + '/imgs/' + element,
                })

            }
        }
        this.setState({
            fileList: newFileList
        })
    }
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    handleChange = ({ fileList }) => {
        this.setState({ fileList })
    };
    clearImages = () => {
        this.setState({
            fileList: []
        })
    }
    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <div>
                <Upload
                    name="image"
                    action={process.env.REACT_APP_URL + "/uploadImg"}
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 22 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

export default UploadImg;