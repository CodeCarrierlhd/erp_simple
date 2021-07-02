import React, { Component } from 'react'
import { connect } from 'react-redux';
import { setFormData } from '@/redux/actions/formData';
import { Form, Input, Button } from 'antd';


class SubForm extends Component {
    componentDidMount() {
        this.props.onRef(this)
    }
    handleChildSubmit = () => {
        let that = this
        return that.props.form.validateFieldsAndScroll(values =>
            // that.props.setFormData(Object.assign({}, values));
            values
        )
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                sm: { span: 6 }
            },
            wrapperCol: {
                sm: { span: 9 }
            }
        };
        return (
            <div>
                {this.props.proValue === 2 ? <Button type="primary" size='large'>添加子项</Button> : <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item label="长度">
                        {getFieldDecorator('length', {
                            rules: [
                                {
                                    required: true,
                                    message: '长度必填',
                                }
                            ]
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="宽度">
                        {getFieldDecorator('width', {
                            rules: [
                                {
                                    required: true,
                                    message: '宽度必填',
                                }
                            ]
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="高度">
                        {getFieldDecorator('height', {
                            rules: [
                                {
                                    required: true,
                                    message: '高度必填',
                                }
                            ]
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="重量">
                        {getFieldDecorator('weight', {
                            rules: [
                                {
                                    required: true,
                                    message: '重量必填',
                                }
                            ]
                        })(<Input />)}
                    </Form.Item>
                </Form>}
            </div>
        )
    }
}
const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
    setFormData: data => {
        dispatch(setFormData(data));
    }
});
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(SubForm));
