import React, { Component } from 'react';
import { Upload, Button } from 'antd';


class UploadFile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fileList: [],
        }
    }

    componentDidMount() {
        this.props.onRef(this)
        console.log(this.props);
        this.handleImg()
    }
    componentDidUpdate(prevProps) {
        console.log(prevProps, this.props, 'uploadFiles');
        //通过prevProps和更新后的state做前后对比，得到同getDerivedStateFromProps的效果
        if (prevProps.files !== this.props.files) {
            //这里是你要做的操作
            this.handleImg()
        }

    }

    handleImg = () => {
        let newFileList = []
        if (this.props.files) {
            console.log(this.props.files);
            let oldfileList = this.props.files.split(',')
            for (let index = 0; index < oldfileList.length; index++) {
                const element = oldfileList[index];
                newFileList.push({
                    uid: Math.random(),
                    status: 'done',
                    name: this.props.fileName ? this.props.fileName : oldfileList[index],
                    url: process.env.REACT_APP_URL + '/imgs/' + element,
                })

            }
        }
        console.log(newFileList);

        this.setState({
            fileList: newFileList
        })
    }

    handleChange = ({ fileList }) => {
        console.log(fileList);
        this.setState({ fileList })
    };
    resetFields = () => {
        this.setState({
            fileList: []
        })
    }
    render() {
        const { fileList } = this.state;
        const uploadButton = (
            <div>
                <Button>上传附件</Button>
            </div>
        );
        return (
            <div>
                <Upload
                    name="file"
                    action={process.env.REACT_APP_URL + "/uploadFile"}
                    data={this.props.fileName ? {filename:this.props.fileName} : {}}
                    fileList={fileList}
                    onChange={this.handleChange}
                >
                    {fileList.length > 0 ? null : uploadButton}
                </Upload>
            </div>
        );
    }
}

export default UploadFile;