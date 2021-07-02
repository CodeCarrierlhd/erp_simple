import React, { Component } from 'react';
import { Form, Input } from 'antd';
import UploadImg from '../../../components/UploadImg'
import UploadFile from '../../../components/UploadFile';
class EditForm extends Component {
    // componentWillReceiveProps(nextProps) {
    //     !nextProps.visible && this.props.form.resetFields();
    // }
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
        this.props.onRef(this)
    }

    // componentDidUpdate(prevProps, nextState) {
    //     console.log(prevProps, this.props, 'eidtForm');

    //     //通过prevProps和更新后的state做前后对比，得到同getDerivedStateFromProps的效果
    //     // if (prevProps.visible !== this.state.visible) {
    //     // //这里是你要做的操作
    //     //     if (this.state.visible) {
    //     //         this.setTIme()
    //     //     }
    //     // }
    // }
    handleSubmit = () => {

        let fileListArr = []
        let filesArr = this.fileChild.state.fileList
        console.log(filesArr);
        filesArr.map(item => {
            if (item.url) {
                fileListArr.push(item.url.split('/imgs/')[1])
            } else {
                fileListArr.push(item.response.filename)
            }
            return fileListArr
        })
        console.log(fileListArr);

        let fileList = []
        let imgs = this.imgChild.state.fileList
        console.log(imgs);
        imgs.map(item => {
            if (item.url) {
                fileList.push(item.url.split('/imgs/')[1])
            } else {
                fileList.push(item.response.filename)
            }
            return fileList
        })
        console.log(fileList);

        let that = this
        that.props.form.validateFieldsAndScroll((err, values) => {
            values.mainImg = fileList.toString()
            values.fileUpload = fileListArr.toString()
            console.log(values);
            if (err) return err
            this.setState({
                newData: values
            })
        });

    };
    getImgList = (ref) => {
        this.imgChild = ref
    }
    getFileList = (ref) => {
        this.fileChild = ref
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
        };

        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item label="MPN">
                    {getFieldDecorator('mpn', {
                        rules: [
                            {
                                required: true,
                                message: 'MPN 必填',
                            }
                        ]
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="产品名称">
                    {getFieldDecorator('productName', {
                        rules: [
                            {
                                required: true,
                                message: '产品名称必填',
                            }
                        ]
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="产品尺寸">
                    {getFieldDecorator('productSize', {
                        rules: [

                        ]
                    })(<Input />)}
                </Form.Item>


                <Form.Item label="目前价格">
                    {getFieldDecorator('nowPrice', {
                        rules: [
                            {
                                required: true,
                                message: '目前价格必填',
                            }
                        ]
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="上传附件">
                        {getFieldDecorator('fileUpload', {
                            rules: [
                            ]
                        })(<UploadFile onRef={this.getFileList} files={this.props.childData === undefined ? '' : this.props.childData.fileUpload} fileName={this.props.childData === undefined ? '' : this.props.childData.mpn}/>)}
                    </Form.Item>
                <Form.Item label="产品主图">
                    {getFieldDecorator('mainImg', {
                        rules: [
                        ]
                    })(<UploadImg mainImg={this.props.childData.mainImg} onRef={this.getImgList} />)}
                </Form.Item>
            </Form>
        );
    }
}
export default Form.create({
    mapPropsToFields(props) {
        console.log(props);

        //接受回来的的props，（editData）是当前的数据
        // console.log(props)       
        //第一种方法，es6循环 拿取键与值
        // {}   [键 ， 值]
        return Object.entries(props.childData).reduce((v0, [k, v]) => {
            // console.log(v0)
            // console.log(k)
            // console.log(v)
            v0[k] = Form.createFormField({
                value: v,
            })
            return v0
        }, {})
    }
})(EditForm);
