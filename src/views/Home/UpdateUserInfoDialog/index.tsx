import { Button, Form, Input, InputNumber, Modal, Radio } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import {
  IUserDialogMethodProps,
  IUserDialogOptions,
  IUserDialogRef,
  IUserInfo,
} from '../../../constants/type';

const dialogModeTitleMap: any = {
  create: '新增用户',
  edit: '编辑用户',
  show: '查看用户',
};

const initValue: IUserInfo = {
  key: '',
  name: '',
  sex: '',
  age: '',
  createdAt: '',
};
const UpdateUserInfoDialog = forwardRef<IUserDialogRef>((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState('');
  const [key, setKey] = useState('');
  const [options, setOptions] = useState<IUserDialogOptions>({});
  const [form] = Form.useForm();
  useImperativeHandle(ref, () => ({
    create: ({ options = {} }: IUserDialogMethodProps) => {
      form.setFieldsValue(initValue);
      setVisible(true);
      setOptions(options);
      setMode('create');
    },
    edit: ({ options = {}, record = initValue }: IUserDialogMethodProps) => {
      form.setFieldsValue(record);
      setKey(record.key);
      setVisible(true);
      setOptions(options);
      setMode('edit');
    },
    show: ({ record: initValue }: IUserDialogMethodProps) => {
      form.setFieldsValue(initValue);
      setVisible(true);
      setMode('show');
    },
  }));

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    const res = await form.validateFields();
    if (!options?.onOk) {
      return;
    }
    const dataKey = mode === 'edit' ? { key } : {};
    options.onOk({ ...res, ...dataKey });
    setVisible(false);
  };
  return (
    <Modal
      title={dialogModeTitleMap[mode]}
      open={visible}
      centered
      onCancel={handleCancel}
      footer={
        mode !== 'show'
          ? [
              <Button onClick={handleCancel}>取消</Button>,
              <Button type="primary" onClick={handleSubmit}>
                提交
              </Button>,
            ]
          : null
      }>
      <Form form={form} labelCol={{ flex: '80px' }} wrapperCol={{ flex: 1 }}>
        <Form.Item
          label="姓名"
          name="name"
          required
          rules={[
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject(new Error('请输入姓名'));
                }
                return Promise.resolve();
              },
            },
          ]}>
          <Input disabled={mode === 'show'} />
        </Form.Item>
        <Form.Item
          label="性别"
          name="sex"
          required
          rules={[
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject(new Error('请选择性别'));
                }
                return Promise.resolve();
              },
            },
          ]}>
          <Radio.Group disabled={mode === 'show'}>
            <Radio value={1}>男</Radio>
            <Radio value={2}>女</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="年龄"
          name="age"
          required
          rules={[
            {
              validator: (_, value) => {
                if (!value && value !== 0) {
                  return Promise.reject(new Error('请输入年龄'));
                }
                if (!(value >= 1 && value <= 110)) {
                  return Promise.reject(new Error('年龄应该在1~110岁之间'));
                }
                return Promise.resolve();
              },
            },
          ]}>
          <InputNumber disabled={mode === 'show'} />
        </Form.Item>
        {mode !== 'create' && (
          <Form.Item label="创建时间" name="createdAt">
            <Input disabled />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
});

export default UpdateUserInfoDialog;
