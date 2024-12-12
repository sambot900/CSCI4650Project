import { Inter } from 'next/font/google'
import {useEffect, useState} from "react";
import {ColumnsType} from "antd/es/table";
import {Button, Form, Input, message, Modal, Space, Table} from "antd";
import { faker } from '@faker-js/faker';
import {User} from ".prisma/client";
const inter = Inter({ subsets: ['latin'] })

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 },
};

const tailLayout = {
	wrapperCol: { offset: 8, span: 12 },
};

export default function Home() {
	const [users, setUsers] = useState<User[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [form] = Form.useForm();

	const onFinish = async (values: any) => {
		console.log(values);
		setIsModalOpen(false);
		fetch('/api/create_user', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(values)
		}).then(async response => {
			if (response.status === 200) {
				const user = await response.json();
				message.success('Created song record' + user.song);
				setUsers([...users, user]);
			} else message.error(
				`Failed to create user:\n ${JSON.stringify(await response.json())}`
			);
		}).catch(res=>{message.error(res)})
	};

	const onDelete = async (user: any) => {
		const {id} = user;
		setIsModalOpen(false);
		fetch('/api/delete_user', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({id})
		}).then(async response => {
			if (response.status === 200) {
				await response.json();
				message.success('Deleted song record ' + user.song);
				setUsers(users.filter(u=> u.id !== id ));
			} else message.error(
				`Failed to delete user:\n ${user.song}`
			);
		}).catch(res=>{message.error(res)})
	};

	const columns: ColumnsType<User> = [
		{
		      title: 'ID',
		      dataIndex: 'id',
		      key: 'id',
		      render: (text) => <a>{text}</a>,
		    },
		{
			title: 'Song',
			dataIndex: 'song',
			key: 'song',
			render: (text) => <a>{text}</a>,
		},
		{
			title: 'Artist',
			dataIndex: 'artist',
			key: 'artist',
			render: (text) => <a>{text}</a>,
		},
		{
			title: 'Album',
			dataIndex: 'album',
			key: 'album',
		},
		{
			title: 'Year',
			dataIndex: 'year',
			key: 'year',
		},
		{
			title: 'Genre',
			dataIndex: 'genre',
			key: 'genre',
		},
		{
			title: 'Duration',
			dataIndex: 'duration',
			key: 'duration',
		},
		{
			title: 'Action',
			key: 'action',
			render: (_, record) => (
				<Space size="middle">
					<a onClick={()=>onDelete(record)}>Delete</a>
				</Space>
			),
		},
	];

	const onReset = () => {
		form.resetFields();
	};

	const onFill = () => {
		const songName = faker.music.songName();
		const artist = faker.music.songName();
		const album = faker.music.songName();
		const genre = faker.music.songName();
		//const year = "1985"
		//const duration = "1:23"
		
		
		

		form.setFieldsValue({
			Song: songName,
			Artist: artist,
			Album: album,
			Genre: genre,
			
		});

		
	};

	const showModal = () => {
		setIsModalOpen(true);
		form.resetFields();
	};

	const handleCancel = () => {
		setIsModalOpen(false);
		form.resetFields();
	};

	useEffect(()=>{
		fetch('api/all_user', {method: "GET"})
			.then(res => {
				res.json().then(
					(json=> {setUsers(json)})
				)
			})
	}, []);

	if (!users) return "Give me a second";

	return (
		<div style={{ backgroundColor: '#333', minHeight: '100vh' }}>
			<header style={{ backgroundColor: 'gray', padding: '10px', display: 'flex', alignItems: 'center' }}>
				<img src="https://cdn.pixabay.com/photo/2017/08/02/09/42/music-2570451_1280.jpg" alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
				<h1 style={{ margin: 0, color: 'white' }}>Song Share</h1>
			</header>
			
			<Button type="primary" onClick={showModal}>
				Add Song
			</Button>
			<Modal title="Basic Modal" onCancel={handleCancel}
				open={isModalOpen} footer={null}  width={800}>
				<Form
					{...layout}
					form={form}
					name="control-hooks"
					onFinish={onFinish}
					style={{ maxWidth: 600 }}
				>
					<Form.Item name="song" label="Song" rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name="artist" label="Artist" rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name="album" label="Album" rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name="year" label="Year" rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name="genre" label="Genre" rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name="duration" label="Duration" rules={[{ required: true }]}>
						<Input />
					</Form.Item>

					<Form.Item {...tailLayout} >
						<Button type="primary" htmlType="submit">
							Submit
						</Button>
						<Button htmlType="button" onClick={onReset}>
							Reset
						</Button>
						<Button  htmlType="button" onClick={handleCancel}>
							Cancel
						</Button>
					</Form.Item>
				</Form>
			</Modal>
			<Table columns={columns} dataSource={users} />

			<footer style={{ backgroundColor: 'gray', padding: '10px', marginTop: '20px', textAlign: 'center', color: 'white' }}>
				All rights reserved 2024
			</footer>
		</div>
	);
}
