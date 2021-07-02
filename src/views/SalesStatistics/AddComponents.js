import React, { Component } from 'react';
import moment from 'moment'
import { PermissionModel } from '../../components/PermissionModel';
import {
    Form,
    Input,
    Button,
    DatePicker,
    Select
} from 'antd';
const { Option } = Select;
const role_type = JSON.parse(localStorage.getItem('userInfo')) === null ? '' : JSON.parse(localStorage.getItem('userInfo')).type
class AddComponents extends Component {
    state = {
        isModalVisible: false,
        subData: [],
        proGroup: []
    }
    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this)
        }
    }
    handleSubmit = () => {
        if (role_type !== 1) {
            return PermissionModel('新增')
        }
        let that = this
        that.props.form.validateFieldsAndScroll((err, values) => {
            if (err) return err
            for (const key in values) {
                if (key === 'saleDate') {
                    values[key] = moment(values[key]).format("YYYY-MM-DD")
                }
            }

            if (that.props.childData) {
                that.$axios.put('/updatePartsStatistics', {
                    params: {
                        partsStatisticsId: that.props.childData.id
                    }, ...values
                }).then(res => {
                    console.log(res);
                    if (res.code === 200) {
                        that.props.getAfterSaleList()
                        that.props.form.resetFields();
                    } else {
                        console.log(res.msg);
                    }
                })
            } else {
                that.$axios.post('/addComponents', { ...values }).then(res => {
                    if (res.code === 200) {
                        that.props.form.resetFields();
                    } else {
                        console.log(res.msg);
                    }
                })
            }
        });

    };

    render() {
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
        const changeAccount = [
            { value: 1, name: '亚马逊大号' },
            { value: 2, name: '亚马逊小号' },
            { value: 3, name: 'varfier大号' },
            { value: 4, name: 'varfier小号' }
        ]

        const changeWay = [
            { value: '1', name: '新货拆箱' },
            { value: '2', name: '随柜配件' },
            { value: '3', name: '退货拆箱' }
        ]
        const componentsGroup = [
            { value: '1', name: '玻璃' },
            { value: '2', name: '台面' },
            { value: '3', name: '腿' },
            { value: '4', name: '底部' },
            { value: '5', name: '五金包' },
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
                            {/* <Option value={1}>亚马逊大号</Option>
                            <Option value={2}>亚马逊小号</Option>
                            <Option value={3}>varfier大号</Option>
                            <Option value={4}>varfier小号</Option> */}
                            {changeAccount.map(item => {
                                return <Option value={item.value} key={item.value}>{item.name}</Option>
                            })}
                        </Select>)}
                    </Form.Item>
                    <Form.Item label="订单日期">
                        {getFieldDecorator('saleDate', {
                            rules: [
                            ]
                        })(<DatePicker format={dateFormat} style={{ width: "60%" }} />)}
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
                    <Form.Item label="更换方式">
                        {getFieldDecorator('wayType', {
                            rules: [
                            ]
                        })(<Select style={{ width: "60%" }}>
                            {/* <Option value={1}>亚马逊大号</Option>
                            <Option value={2}>亚马逊小号</Option>
                            <Option value={3}>varfier大号</Option>
                            <Option value={4}>varfier小号</Option> */}
                            {changeWay.map(item => {
                                return <Option value={item.value} key={item.value}>{item.name}</Option>
                            })}
                        </Select>)}
                    </Form.Item>
                    <Form.Item label="更换部位">
                        {getFieldDecorator('wayPart', {
                            rules: [
                            ]
                        })(<Select style={{ width: "60%" }}>
                            {/* <Option value={1}>亚马逊大号</Option>
                            <Option value={2}>亚马逊小号</Option>
                            <Option value={3}>varfier大号</Option>
                            <Option value={4}>varfier小号</Option> */}
                            {componentsGroup.map(item => {
                                return <Option value={item.value} key={item.value}>{item.name}</Option>
                            })}
                        </Select>)}
                    </Form.Item>
                    <Form.Item label="备注">
                        {getFieldDecorator('remark', {
                            rules: [
                                {
                                }
                            ]
                        })(<Input.TextArea />)}
                    </Form.Item>
                    {!this.props.childData ? <Button type="primary" htmlType="submit">
                        Submit
                    </Button> : ''}
                </Form>
            </div >
        );
    }
}


export default Form.create({
    mapPropsToFields(props) {
        if (!props.childData) { return null; } else {
            return Object.entries(props.childData).reduce((v0, [k, v]) => {
                if (k === 'saleDate') {
                    v0[k] = Form.createFormField({
                        value: moment(v),
                    })
                } else {
                    v0[k] = Form.createFormField({
                        value: v,
                    })
                }
                return v0
            }, {})
        }



    }
})(AddComponents);