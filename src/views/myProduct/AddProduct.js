import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PermissionModel } from '../../components/PermissionModel';
import BasicForm from './productCompontent/BasicForm';
import TextEditor from './productCompontent/TextEditor'
import ImagePart from './productCompontent/ImagePart';
import './index.css'
import { Steps, Button } from 'antd';
const { Step } = Steps;

const role_type = JSON.parse(localStorage.getItem('userInfo')) === null ? '' : JSON.parse(localStorage.getItem('userInfo')).type
class AddProduct extends Component {
    state = {
        current: 0
    }
    next = () => {
        if (role_type !== 1) {
            return PermissionModel('新增')
        } else {
            let current = this.state.current
            if (current === 0) {
                this.formChild.handleSubmit()
            }
            this.setState({
                current: current + 1
            })
        }


    };
    prev = () => {
        let current = this.state.current
        this.setState({
            current: current - 1
        })
    };
    finish = () => {
        let that = this
        let singleImg = { ...this.imageChild.state }
        let fileList = []
        singleImg.fileList.map(item => {
            return fileList.push(item.response.filename)
        })
        let imageGroup = { mainImg: fileList.toString(), materailImage: singleImg.o_url, manualImage: singleImg.m_url }
        let finalGroup = { ...imageGroup, ...this.props.formData }
        that.$axios.post('/addProduct', { ...finalGroup }).then(res => {
            console.log(res);
            if (res.code === 200) {
                this.setState({
                    current: 0
                })
            } else {
                console.log(res.msg);
            }
        })
    };
    getFormValue = (ref) => {
        this.formChild = ref
    }
    getImages = (ref) => {
        this.imageChild = ref
    }
    render() {
        const steps = [
            {
                title: 'General Information',
                content: <BasicForm onRef={this.getFormValue} />,
            },
            {
                title: 'Product Description',
                content: <TextEditor />,
            },

            {
                title: 'Materials',
                content: <ImagePart onRef={this.getImages} />,
            }
        ];
        let current = this.state.current
        return (
            <div className='steps-main'>
                <Steps current={current}>
                    {steps.map(item => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                <div className="steps-content">{steps[current].content}</div>
                <div className="steps-action">
                    {current > 0 && (
                        <Button style={{ margin: '0 8px' }} onClick={() => this.prev()}>
                            Previous
                        </Button>
                    )}
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={() => this.next()}>
                            Next
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" onClick={() => this.finish()}>
                            Done
                        </Button>
                    )}

                </div>
            </div>
        );
    }
}

const mapStateToProps = state => state;
const mapDispatchToProps = () => ({

});
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddProduct);

// export default addProduct;