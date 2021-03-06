import React, { Component } from 'react'
import { Upload, message, Row, Col, Divider, Modal } from 'antd';
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(
        reader.result
    ));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
}
function getBase64File(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class ImagePart extends Component {
    state = {
        loading: false,
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [],
    };
    componentDidMount() {
        this.props.onRef(this)
    }
    handleMaterialChange = info => {
        console.log(info);
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, otherMaterialimageUrl =>
                this.setState({
                    otherMaterialimageUrl,
                    o_url: info.file.response.filename,
                    loading: false,
                }),
            );
        }
    };
    handleManualChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, manualimageUrl =>
                this.setState({
                    manualimageUrl,
                    m_url: info.file.response.filename,
                    loading: false,
                }),
            );
        }
    };
    handleCancel = () => this.setState({ previewVisible: false });
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64File(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };
    handleChange = ({ fileList }) => this.setState({ fileList });
    render() {
        const { otherMaterialimageUrl, manualimageUrl, previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <div>
                <Divider orientation="left"><h1><b>??????</b></h1></Divider>
                <Row gutter={24}>
                    <Col className="gutter-row" span={4}>
                        <span>???????????????</span>
                    </Col>
                    <Col className="gutter-row" span={20}>
                        <span>??????????????? 27 ??????????????? 7 ???????????????????????????????????????
                        ???????????????
                        1?????????????????????
                        2. ???????????????2000 x 2000 ???????????????????????????????????? 2000 x 2000??????
                        3. ?????????JPG???PNG??????????????????Wayfair?????????PNG????????????????????????20MB?????????????????????????????????
                            ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????</span>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col className="gutter-row" span={4}>
                        <span>???????????????</span>
                    </Col>
                    <Col className="gutter-row" span={20}>
                        <Upload
                            name="image"
                            action={process.env.REACT_APP_URL + "/uploadImg"}
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={this.handlePreview}
                            onChange={this.handleChange}
                        >
                            {fileList.length >= 27 ? null : uploadButton}
                        </Upload>
                        <Modal
                            visible={previewVisible}
                            title={previewTitle}
                            footer={null}
                            onCancel={this.handleCancel}
                        >
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                    </Col>

                </Row>
                <Row gutter={24}>
                    <Col className="gutter-row" span={4}>
                        <span>?????????????????????</span>
                    </Col>
                    <Col className="gutter-row" span={20}>
                        <Upload
                            name="image"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action={process.env.REACT_APP_URL + "/uploadImg"}
                            beforeUpload={beforeUpload}
                            onChange={this.handleMaterialChange}
                        >
                            {otherMaterialimageUrl ? <img src={otherMaterialimageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                        </Upload>
                    </Col>

                </Row>
                <Row gutter={24}>
                    <Col className="gutter-row" span={4}>
                        <span>???????????????</span>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <span>????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????</span>
                    </Col>

                </Row>
                <Row gutter={24}>
                    <Col className="gutter-row" span={4}>

                    </Col>
                    <Col className="gutter-row" span={12}>
                        <Upload
                            name="image"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action={process.env.REACT_APP_URL + "/uploadImg"}
                            beforeUpload={beforeUpload}
                            onChange={this.handleManualChange}
                        >
                            {manualimageUrl ? <img src={manualimageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                        </Upload>
                    </Col>

                </Row>
            </div>
        )
    }
}
