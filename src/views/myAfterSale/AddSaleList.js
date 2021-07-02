import React, { Component } from 'react';
import UploadImg from '../../components/UploadImg'
import { PermissionModel } from '../../components/PermissionModel';
import moment from 'moment'
import {
    Form,
    Input,
    Button,
    DatePicker,
    Select
} from 'antd';
const { Option } = Select;
const role_type = JSON.parse(localStorage.getItem('userInfo')) === null ? '' : JSON.parse(localStorage.getItem('userInfo')).type
class AddSaleList extends Component {
    state = {
        isModalVisible: false,
        subData: [],
        proGroup: []
    }
    handleSubmit = () => {
        if (role_type !== 1) {
            return PermissionModel('新增')
        }
        let that = this
        console.log(that.imgChild);

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

        that.props.form.validateFieldsAndScroll((err, values) => {
            values.productImage = fileList.toString()
            if (err) return err
            for (const key in values) {
                if (key === 'saleDate') {
                    values[key] = moment(values[key]).format("YYYY-MM-DD")
                }
            }
            that.$axios.post('/addAfterSale', { ...values }).then(res => {
                if (res.code === 200) {
                    this.imgChild.clearImages()
                    that.props.form.resetFields();
                } else {
                    console.log(res.msg);
                }
            })

        });

    };
    getFileList = (ref) => {
        this.imgChild = ref
    }
    render() {
        const { productImages } = this.state
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                sm: { span: 6 }
            },
            wrapperCol: {
                sm: { span: 12 }
            }
        };
        const dateFormat = 'YYYY-MM-DD';
        const warehouseGroup = [
            { value: '1', name: '陈总仓' },
            { value: '2', name: '谢总仓' },
            { value: '3', name: '至美通' },
            { value: '4', name: '易仓' },
            { value: '5', name: '云仓' },
        ]
        return (
            <div style={{ width: '80%', margin: '40px auto', textAlign: 'center' }
            }>
                <Form {...formItemLayout} onSubmit={this.handleSubmit} style={{ width: '900px', margin: '40px auto' }}>
                    <Form.Item label="选择账号">
                        {getFieldDecorator('account', {
                            rules: [
                            ]
                        })(<Select style={{ width: "60%" }}>
                            <Option value={1}>亚马逊大号</Option>
                            <Option value={2}>亚马逊小号</Option>
                            <Option value={3}>varfier大号</Option>
                            <Option value={4}>varfier小号</Option>
                        </Select>)}
                    </Form.Item>
                    <Form.Item label="平台售后日期">
                        {getFieldDecorator('saleDate', {
                            rules: [
                            ]
                        })(<DatePicker format={dateFormat} style={{ width: "60%" }} />)}
                    </Form.Item>
                    <Form.Item label="货物发出仓">
                        {getFieldDecorator('sendWarehouse', {
                            rules: [
                            ]
                        })(<Select style={{ width: "60%" }}>
                            {warehouseGroup.map(item => {
                                return <Option value={item.value} key={item.value}>{item.name}</Option>
                            })}
                        </Select>)}
                    </Form.Item>
                    <Form.Item label="货物退回仓">
                        {getFieldDecorator('backWarehouse', {
                            rules: [
                            ]
                        })(<Select style={{ width: "60%" }}>
                            {warehouseGroup.map(item => {
                                return <Option value={item.value} key={item.value}>{item.name}</Option>
                            })}
                        </Select>)}
                    </Form.Item>
                    <Form.Item label="订单号">
                        {getFieldDecorator('orderNumber', {
                            rules: [
                                {
                                    required: true,
                                    message: '订单号必填',
                                }
                            ]
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="产品SKU">
                        {getFieldDecorator('sku', {
                            rules: [
                                {
                                    required: true,
                                    message: '产品SKU必填',
                                }
                            ]
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="产品退回数量">
                        {getFieldDecorator('backNumber', {
                            rules: [
                                {
                                    required: true,
                                    message: '产品退回数量必填',
                                }
                            ]
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="退货物流单号">
                        {getFieldDecorator('flowOrderNumber', {
                            rules: [
                                {
                                    required: true,
                                    message: '退货物流单号必填',
                                }
                            ]
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="备注">
                        {getFieldDecorator('remark', {
                            rules: [
                                {
                                }
                            ]
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="产品图片">
                        {getFieldDecorator('productImage', {
                            rules: [
                            ]
                        })(<UploadImg onRef={this.getFileList} mainImg={productImages} />)}
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form>
            </div >
        );
    }
}

export default Form.create()(AddSaleList);