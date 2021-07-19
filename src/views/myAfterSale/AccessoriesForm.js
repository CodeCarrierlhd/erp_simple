import React, { Component } from 'react';
import moment from 'moment'
import {
    Form,
    Input,
    Button,
    DatePicker,
    Select,
    Divider
} from 'antd';
const { Option } = Select;

class AccessoriesForm extends Component {
    state = {
        historyArr: []
    }
    componentDidMount() {
        this.getHistoryListByAfterSaleIdId()
    }
    handleSubmit = () => {
        let that = this
        that.props.form.validateFieldsAndScroll((err, values) => {
            if (err) return err
            for (const key in values) {
                if (key === 'changeDate') {
                    values[key] = moment(values[key]).format("YYYY-MM-DD")
                }
            }
            values.afterSaleId = that.props.afterSaleId
            that.$axios.post('/addAfterSaleHistory', { ...values }).then(res => {
                if (res.code === 200) {
                    that.getHistoryListByAfterSaleIdId()
                    that.props.form.resetFields();
                } else {
                    console.log(res.msg);
                }
            })

        });

    };
    getHistoryListByAfterSaleIdId = () => {
        this.$axios.get('/saleHistoryList/' + this.props.afterSaleId).then(res => {
            console.log(res);
            if (res.code === 200) {
                this.setState({
                    historyArr: res.data
                })
            } else {
                console.log(res.msg);
            }
        })
    }
    handleShowName = (keyNumber) => {
        let text = ''
        switch (keyNumber) {
            case 1:
                text = '亚马逊大号';
                break;
            case 2:
                text = '亚马逊小号';
                break;
            case 3:
                text = 'varfier大号';
                break;
            case 4:
                text = 'varfier小号';
                break;
            default:
                text = '';
        }
        return text
    }
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
        const { historyArr } = this.state
        const dateFormat = 'YYYY-MM-DD';
        return (
            <div>
                <Form {...formItemLayout} onSubmit={this.handleSubmit} style={{ textAlign: 'center' }}>
                    <Form.Item label="更换账号">
                        {getFieldDecorator('changeAccount', {
                            rules: [
                            ]
                        })(<Select style={{ width: "60%" }}>
                            <Option value={1}>亚马逊大号</Option>
                            <Option value={2}>亚马逊小号</Option>
                            <Option value={3}>varfier大号</Option>
                            <Option value={4}>varfier小号</Option>
                        </Select>)}
                    </Form.Item>
                    <Form.Item label="更换订单号">
                        {getFieldDecorator('newOrderNumber', {
                            rules: [
                                {
                                    required: true,
                                    message: '新订单号必填',
                                }
                            ]
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="更换部位">
                        {getFieldDecorator('changePart', {
                            rules: [
                                {
                                    required: true,
                                    message: '更换部位必填',
                                }
                            ]
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="操作日期">
                        {getFieldDecorator('changeDate', {
                            rules: [
                            ]
                        })(<DatePicker format={dateFormat} style={{ width: "60%" }} />)}
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        保存
                    </Button>
                </Form>
                <Divider />
                <div>
                    <h1>售后历史记录</h1>
                    {
                        historyArr.map((item,index) => {
                            return (
                                <ul style={{ border: '1px solid #ccc', listStyle: 'none' }} key={item.newOrderNumber+''+index}>
                                    <li>
                                        <span>日期：</span>
                                        <span>{moment(item.changeDate).format("YYYY-MM-DD")}</span>
                                    </li>
                                    <li>
                                        <span>更换订单号：</span>
                                        <span>{item.newOrderNumber}</span>
                                    </li>
                                    <li>
                                        <span>更换部位：</span>
                                        <span>{item.changePart}</span>
                                    </li>
                                    <li>
                                        <span>所属平台：</span>
                                        <span>{this.handleShowName(item.changeAccount)}</span>
                                    </li>
                                </ul>
                            )
                        })
                    }
                </div>
            </div>
        );
    }
}


export default Form.create()(AccessoriesForm);