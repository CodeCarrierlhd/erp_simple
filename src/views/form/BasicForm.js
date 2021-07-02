import React from 'react';
import SubForm from './SubForm';
import { connect } from 'react-redux';
import { setFormData } from '@/redux/actions/formData';

import { Form, Input, Switch, Select, Radio } from 'antd';
const { Option } = Select;

class BasicForm extends React.Component {
	state = {
		soldSeparatelyStatu: true,
		productTypeId: ''
	};
	componentDidMount() {
		this.props.onRef(this)
	}
	handleSubmit = () => {
		let that = this

		that.props.form.validateFieldsAndScroll((err, values) => {
			if (err) { return err } else {
				that.child.handleChildSubmit().then(result => {
					// console.log(result, values);
					that.props.setFormData(Object.assign(result, values));
				})
			}
		});

	};

	handleChange = (value) => {
		console.log(`selected ${value}`);
	};
	onSwitchChange = (checked) => {
		console.log(`switch to ${checked}`);
	}
	onChange = e => {
		this.setState({
			productTypeId: e.target.value
		})
	};
	handleGetMsg = (value) => {
		console.log(value)
	}
	getFormValue = (ref) => {
		this.child = ref
	}


	render() {
		const { getFieldDecorator } = this.props.form;
		const colorGroup = [
			{ value: 'Natural', text: 'Natural' },
			{ value: 'Beige', text: 'Beige' },
			{ value: 'Black', text: 'Black' },
			{ value: 'Blue', text: 'Blue' },
			{ value: 'Bronze', text: 'Bronze' },
			{ value: 'Brown', text: 'Brown' },
			{ value: 'Burgundy', text: 'Burgundy' },
			{ value: 'Camel', text: 'Camel' },
			{ value: 'Cappuccino', text: 'Cappuccino' },
			{ value: 'Champagne', text: 'Champagne' },
			{ value: 'Cherry', text: 'Cherry' },
			{ value: 'Chestnut', text: 'Chestnut' },
			{ value: 'Coffee', text: 'Coffee' },
			{ value: 'Coral', text: 'Coral' },
			{ value: 'Crimson', text: 'Crimson' },
			{ value: 'Dark Brown', text: 'Dark Brown' },
			{ value: 'Dark Gray', text: 'Dark Gray' },
			{ value: 'Espresso', text: 'Espresso' },
			{ value: 'Gold', text: 'Gold' },
			{ value: 'Gray', text: 'Gray' },
			{ value: 'Green', text: 'Green' },
			{ value: 'Ivory', text: 'Ivory' },
			{ value: 'Light Brown', text: 'Light Brown' },
			{ value: 'Magenta', text: 'Magenta' },
			{ value: 'Mahogany', text: 'Mahogany' },
			{ value: 'Multicolor', text: 'Multicolor' },
			{ value: 'Navy', text: 'Navy' },
			{ value: 'Orange', text: 'Orange' },
			{ value: 'Pink', text: 'Pink' },
			{ value: 'Purple', text: 'Purple' },
			{ value: 'Rainbow', text: 'Rainbow' },
			{ value: 'Red', text: 'Red' },
			{ value: 'Rose Gold', text: 'Rose Gold' },
			{ value: 'Silver', text: 'Silver' },
			{ value: 'Teal', text: 'Teal' },
			{ value: 'Walnut', text: 'Walnut' },
			{ value: 'White', text: 'White' },
			{ value: 'Yellow', text: 'Yellow' },
			{ value: 'Transparent', text: 'Transparent' },
			{ value: 'Colorful', text: 'Colorful' },
			{ value: 'Oak', text: 'Oak' },
			{ value: 'LIGHT GREY', text: 'LIGHT GREY' },
			{ value: 'DARK GREY', text: 'DARK GREY' },
			{ value: 'Ginger', text: 'Ginger' },
			{ value: 'Golden Black', text: 'Golden Black' },
			{ value: 'Antique White', text: 'Antique White' },
			{ value: 'Antique Blue', text: 'Antique Blue' },
			{ value: 'Antique Gray', text: 'Antique Gray' },
			{ value: 'Emerald', text: 'Emerald' },
			{ value: 'Sage', text: 'Sage' },
			{ value: 'Rustic Brown', text: 'Rustic Brown' },
			{ value: 'Deep Rustic Brown', text: 'Deep Rustic Brown' },
			{ value: 'Pella oak', text: 'Pella oak' },
			{ value: 'Avocado', text: 'Avocado' },
			{ value: 'Mallard Teal', text: 'Mallard Teal' },
			{ value: 'Brick', text: 'Brick' },
			{ value: 'Deep Burgundy', text: 'Deep Burgundy' },
			{ value: 'Off White', text: 'Off White' },
			{ value: 'Rosewood', text: 'Rosewood' },
			{ value: 'Mint Green', text: 'Mint Green' },
			{ value: 'Cream', text: 'Cream' },
			{ value: 'Grey', text: 'Grey' },
			{ value: 'Grass Green', text: 'Grass Green' },
			{ value: 'Fuchsia', text: 'Fuchsia' },
			{ value: 'Auburn', text: 'Auburn' },
			{ value: 'Brown Mix', text: 'Brown Mix' },
			{ value: 'Grey Mix', text: 'Grey Mix' },
			{ value: 'tan', text: 'tan' },
			{ value: 'White Washed', text: 'White Washed' },
			{ value: 'Antique Navy', text: 'Antique Navy' },
			{ value: 'Chrome', text: 'Chrome' },
			{ value: 'Brushed Chrome', text: 'Brushed Chrome' },
			{ value: 'Brushed Nickel', text: 'Brushed Nickel' },
			{ value: 'Matte Black', text: 'Matte Black' },
			{ value: 'Old Pine', text: 'Old Pine' },
			{ value: 'Gray Wash', text: 'Gray Wash' },
			{ value: 'marble', text: 'marble' },
			{ value: 'Light Coffee', text: 'Light Coffee' },
			{ value: 'Tiger', text: 'Tiger' },
			{ value: 'Teak', text: 'Teak' },
			{ value: 'Matte White', text: 'Matte White' },
			{ value: 'Light Blue', text: 'Light Blue' },
			{ value: 'Retro Green', text: 'Retro Green' },
			{ value: 'Plaid', text: 'Plaid' },
			{ value: 'khaki', text: 'khaki' },
			{ value: 'Tan', text: 'Tan' },
			{ value: 'taupe', text: 'taupe' },
			{ value: 'navy blue', text: 'navy blue' },
			{ value: 'Red striped', text: 'Red striped' },
			{ value: 'Blue striped', text: 'Blue striped' },
			{ value: 'Lime White', text: 'Lime White' },
			{ value: 'Light Green', text: 'Light Green' },
			{ value: 'Greige', text: 'Greige' },
			{ value: 'Cream White', text: 'Cream White' },
			{ value: 'Charcoal grey', text: 'Charcoal grey' },
			{ value: 'Black Brown', text: 'Black Brown' },
			{ value: 'Black White', text: 'Black White' },
			{ value: 'Golden White', text: 'Golden White' }
		]
		const materialGroup = [
			{ value: 'Acrylic', text: 'Acrylic' },
			{ value: 'Aluminium', text: 'Aluminium' },
			{ value: 'Bamboo', text: 'Bamboo' },
			{ value: 'Bonded Leather', text: 'Bonded Leather' },
			{ value: 'Bone', text: 'Bone' },
			{ value: 'Canvas', text: 'Canvas' },
			{ value: 'Ceramic', text: 'Ceramic' },
			{ value: 'Chenille', text: 'Chenille' },
			{ value: 'Chrome', text: 'Chrome' },
			{ value: 'Clay', text: 'Clay' },
			{ value: 'Corduroy', text: 'Corduroy' },
			{ value: 'Cotton', text: 'Cotton' },
			{ value: 'Fabric', text: 'Fabric' },
			{ value: 'Fiberglass', text: 'Fiberglass' },
			{ value: 'Glass', text: 'Glass' },
			{ value: 'Leather', text: 'Leather' },
			{ value: 'Linen', text: 'Linen' },
			{ value: 'Metal', text: 'Metal' },
			{ value: 'Microfiber', text: 'Microfiber' },
			{ value: 'Nubuck', text: 'Nubuck' },
			{ value: 'Nylon Mesh', text: 'Nylon Mesh' },
			{ value: 'PC', text: 'PC' },
			{ value: 'Plastic', text: 'Plastic' },
			{ value: 'Plush', text: 'Plush' },
			{ value: 'Polyester', text: 'Polyester' },
			{ value: 'Polypropylene', text: 'Polypropylene' },
			{ value: 'Polyurethane', text: 'Polyurethane' },
			{ value: 'Rattan', text: 'Rattan' },
			{ value: 'Stainless Steel', text: 'Stainless Steel' },
			{ value: 'Stone', text: 'Stone' },
			{ value: 'Suede', text: 'Suede' },
			{ value: 'Upholstered', text: 'Upholstered' },
			{ value: 'Velvet', text: 'Velvet' },
			{ value: 'Vinyl', text: 'Vinyl' },
			{ value: 'Wicker', text: 'Wicker' },
			{ value: 'Wood', text: 'Wood' },
			{ value: 'Wool', text: 'Wool' },
			{ value: 'Particle Board', text: 'Particle Board' },
			{ value: 'MDF', text: 'MDF' },
			{ value: 'Pine', text: 'Pine' },
			{ value: 'Carbon steel', text: 'Carbon steel' },
			{ value: 'PU', text: 'PU' },
			{ value: 'Foam', text: 'Foam' },
			{ value: 'Bronzing cloth', text: 'Bronzing cloth' },
			{ value: 'marble', text: 'marble' },
			{ value: 'zinc', text: 'zinc' },
			{ value: 'genuine leather', text: 'genuine leather' },
			{ value: 'brass', text: 'brass' },
			{ value: 'Solid Surface', text: 'Solid Surface' },
			{ value: 'ABS', text: 'ABS' },
			{ value: 'PET', text: 'PET' },
			{ value: 'ABS+PC', text: 'ABS+PC' },
			{ value: 'Steel', text: 'Steel' },
			{ value: 'Metal Wood', text: 'Metal Wood' },
		]
		const formItemLayout = {
			labelCol: {
				sm: { span: 6 }
			},
			wrapperCol: {
				sm: { span: 9 }
			}
		};
		const { productTypeId, soldSeparatelyStatu } = this.state
		return (
			<div className="shadow-radius">
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
					<Form.Item label="分开售卖">
						{getFieldDecorator('soldSeparately', {
							rules: [
							]
						})(<Switch checked={soldSeparatelyStatu} onChange={this.onSwitchChange} />)}
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
					<Form.Item label="主色">
						{getFieldDecorator('mainColor', {
							rules: [
								{
									required: true,
									message: '主色必填',
								}
							]
						})(<Select onChange={this.handleChange}>
							{colorGroup.map((item, index) =>
								<Option value={item.value} key={index}>{item.value}</Option>
							)}
						</Select>)}
					</Form.Item>
					<Form.Item label="主要成分">
						{getFieldDecorator('mainMaterial', {
							rules: [
								{
									required: true,
									message: '主要成分必填',
								}
							]
						})(<Select onChange={this.handleChange}>
							{materialGroup.map((item, index) =>
								<Option value={item.value} key={index}>{item.value}</Option>
							)}
						</Select>)}
					</Form.Item>
					<Form.Item label="产品尺寸">
						{getFieldDecorator('size', {
							rules: [

							]
						})(<Input />)}
					</Form.Item>
					<Form.Item label="提供手册">
						{getFieldDecorator('manual', {
							rules: [
								{
									required: true,
								}
							]
						})(<Select onChange={this.handleChange}>
							<Option value="1">是</Option>
							<Option value="0">否</Option>
						</Select>)}
					</Form.Item>
					<Form.Item label="产品类别">
						{getFieldDecorator('productTypeId', {
							rules: [
								{
									required: true,
								}
							]
						})(<Radio.Group onChange={this.onChange}>
							<Radio value={1}>一般项目</Radio>
							<Radio value={2}>组合项目</Radio>
							<Radio value={3}>更换配件</Radio>
						</Radio.Group>
						)}
						{productTypeId === '' ? '' : <SubForm proValue={productTypeId} onRef={this.getFormValue} />}
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
					<Form.Item label="显示价格">
						{getFieldDecorator('showPrice', {
							rules: [
								{
									required: true,
								}
							]
						})(<Select onChange={this.handleChange}>
							<Option value="1">Visible</Option>
							<Option value="0">Invisible</Option>
						</Select>)}
					</Form.Item>
				</Form>
			</div>
		);
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
)(Form.create()(BasicForm));
