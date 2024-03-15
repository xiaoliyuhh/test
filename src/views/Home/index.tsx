import { useRef, useState } from 'react';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Row,
  Select,
  Table,
  TableColumnsType,
  message,
} from 'antd';
import { IUserDialogRef, IUserInfo } from '../../constants/type';
import UpdateUserInfoDialog from './UpdateUserInfoDialog';
import 'dayjs/locale/zh-cn';
import style from './index.module.scss';

const initDataSource = [
  {
    key: '1',
    name: '张三',
    sex: 1,
    age: 18,
    createdAt: new Date('2024-3-14 12:44:09').toLocaleString(),
  },
  {
    key: '2',
    name: '李四',
    sex: 2,
    age: 20,
    createdAt: new Date('2024-3-15 09:08:08').toLocaleString(),
  },
];

const { RangePicker } = DatePicker;

const Home = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dataSource, setDataSource] = useState<IUserInfo[]>(initDataSource);
  const ref = useRef<IUserDialogRef>(null);
  const [form] = Form.useForm();

  const getUniqueKey = () => {
    // 生成随机且唯一的key
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}}`;
  };

  const handleCreate = () => {
    ref.current?.create({
      options: {
        onOk: (newValue: IUserInfo) => {
          setDataSource([
            ...dataSource,
            {
              ...newValue,
              key: getUniqueKey(),
              createdAt: new Date().toLocaleString(),
            },
          ]);
          message.success('新增成功！');
        },
      },
    });
  };

  const handleEdit = (record: IUserInfo) => {
    ref.current?.edit({
      record,
      options: {
        onOk: (newValue: IUserInfo) => {
          const newData = dataSource.map(item => {
            if (item.key === newValue.key) {
              return newValue;
            }
            return item;
          });
          setDataSource(newData);
          message.success('更新成功！');
        },
      },
    });
  };

  const handleDelete = (record: IUserInfo) => {
    const newData = dataSource.filter(item => item.key !== record.key);
    setDataSource(newData);
    message.success('删除成功！');
  };

  const handleView = (record: IUserInfo) => {
    ref.current?.show({ record });
  };

  const defaultCell = (v: string) => {
    if (typeof v === 'undefined' || v === '') {
      return '-';
    }
    return v;
  };

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  const columns: TableColumnsType<IUserInfo> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (v: string) => defaultCell(v),
    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      render: (v: number) => {
        if (!v) {
          return '-';
        }
        if (v === 1) {
          return '男';
        }
        return '女';
      },
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      render: (v: string) => defaultCell(v),
      sorter: (a: IUserInfo, b: IUserInfo) => {
        if (a.age === '' || b.age === '') {
          return 0;
        }
        return a.age - b.age;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      defaultSortOrder: 'ascend',
      render: (v: string) => defaultCell(v),
      sorter: (a: IUserInfo, b: IUserInfo) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: '操作',
      width: 180,
      render: (record: IUserInfo) => {
        return (
          <div className={style.options}>
            <a onClick={() => handleView(record)}>详情</a>
            <a onClick={() => handleEdit(record)}>编辑</a>
            <Popconfirm
              title="删除用户"
              description="确定删除该用户吗?"
              onConfirm={() => handleDelete(record)}
              okText="确定"
              cancelText="取消">
              <a>删除</a>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const handleSearch = () => {
    form.validateFields().then(res => {
      if (!res.name && !res.sex && !res.age && !res.createdAt) {
        return;
      }
      let newData = [];
      // 筛选性别
      if (res.sex) {
        newData = dataSource.filter(item => item.sex === res.sex);
      } else {
        newData = [...dataSource];
      }
      // 筛选年龄
      if (res.age) {
        newData = newData.filter(item => {
          if (item.age === res.age) {
            return true;
          }
          return false;
        });
      }
      // 筛选姓名
      if (res.name) {
        newData = newData.filter(item => {
          if (item.name.indexOf(res.name) !== -1) {
            return true;
          }
          return false;
        });
      }

      // 筛选创建时间
      if (res.createdAt) {
        newData = newData.filter(item => {
          const time = new Date(item.createdAt).getTime();
          if (
            time > res.createdAt[0].valueOf() &&
            time < res.createdAt[1].valueOf()
          ) {
            return true;
          }
          return false;
        });
      }
      setDataSource(newData);
    });
  };

  const handleReset = () => {
    form.resetFields();
    form.setFieldsValue({ name: '', age: '', sex: '' });
    setDataSource(initDataSource);
  };

  const getSearchOption = () => {
    return (
      <>
        <Button type="primary" onClick={handleSearch}>
          查询
        </Button>
        <Button className={style.searchBtn} onClick={handleReset}>
          重置
        </Button>
        <a className={style.searchBtn} onClick={toggleCollapsed}>
          {isCollapsed ? '收起' : '展开'}
        </a>
      </>
    );
  };

  return (
    <div className={style.page}>
      <div className={style.title}>用户管理系统</div>
      <Card className={style.search}>
        <Form form={form} labelCol={{ flex: '80px' }} wrapperCol={{ flex: 1 }}>
          <Row>
            <Col span={8}>
              <Form.Item label="姓名" name="name">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="性别" name="sex">
                <Select
                  options={[
                    { value: 1, label: '男' },
                    { value: 2, label: '女' },
                  ]}
                />
              </Form.Item>
            </Col>
            {!isCollapsed ? (
              <Col span={8} className={style.searchOption}>
                {getSearchOption()}
              </Col>
            ) : (
              <Col span={8}>
                <Form.Item label="年龄" name="age">
                  <InputNumber />
                </Form.Item>
              </Col>
            )}
          </Row>
          {isCollapsed && (
            <Row>
              <Col span={8}>
                <Form.Item label="创建时间" name="createdAt">
                  <RangePicker className={style.datePicker} showTime />
                </Form.Item>
              </Col>
              <Col span={8} />
              <Col span={8} className={style.searchOption}>
                {getSearchOption()}
              </Col>
            </Row>
          )}
        </Form>
      </Card>
      <Card className={style.content}>
        <div className={style.create}>
          <Button type="primary" onClick={handleCreate}>
            新增
          </Button>
        </div>
        <Table dataSource={dataSource} columns={columns} />
      </Card>
      <UpdateUserInfoDialog ref={ref} />
    </div>
  );
};

export default Home;
