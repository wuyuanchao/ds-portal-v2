import {
  deleteGoodsChannel,
  editOrUpdateGoodsChannel,
  getGoodsChannels,
} from '@/services/apis/goods';
import { CountryOptions, getCompanyChannels, shippingCompanyEnum } from '@/services/apis/logistic';
import { ActionType, ModalForm, ProForm, ProFormText, ProTable } from '@ant-design/pro-components';
import { Button, Cascader, Form, message, Select } from 'antd';
import React, { useRef, useState } from 'react';

interface Option {
  value?: string | number | null;
  label: React.ReactNode;
  children?: Option[];
  isLeaf?: boolean;
}

const optionLists: Option[] = Object.keys(shippingCompanyEnum).map((key) => {
  return {
    value: key,
    label: shippingCompanyEnum[key].text,
    isLeaf: false,
  };
});

export type GoodsChannelTableParams = {
  goodsId: number;
};
const GoodsChannelTable: React.FC<GoodsChannelTableParams> = ({ goodsId }) => {
  const actionRef = useRef<ActionType>();
  const [options, setOptions] = useState<Option[]>(optionLists);

  const handleUpdateOrEdit = async (goodsChannel: API.GoodsChannelType) => {
    await editOrUpdateGoodsChannel(goodsChannel);
    actionRef.current?.reload();
    message.success('设置成功');
    return true;
  };

  const loadData = (selectedOptions: Option[]) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    console.log(targetOption);
    getCompanyChannels(targetOption.value as string).then((x) => {
      console.log(x.data);
      targetOption.children = x.data.map((item) => {
        console.log(item.name);
        return { label: item.name + '(' + item.code + ')', value: item.code };
      });
      setOptions([...options]);
    });
  };

  const columns = [
    {
      title: '国家',
      dataIndex: 'countryCode',
    },
    {
      title: '渠道代码',
      dataIndex: 'channelCode',
    },
    {
      title: '操作',
      key: 'option',
      render: (_, record: API.GoodsChannelType) => [
        <a
          key="delete"
          onClick={async (e) => {
            e.preventDefault();
            const resp = await deleteGoodsChannel(record);
            if (resp.code === 200) {
              message.success('删除成功');
              actionRef.current?.reloadAndRest?.();
            } else {
              message.error(resp.message);
            }
          }}
        >
          移除
        </a>,
      ],
    },
  ];

  return (
    <ProTable<API.GoodsChannelType>
      request={() => getGoodsChannels(goodsId)}
      rowKey="recId"
      columns={columns}
      search={false}
      actionRef={actionRef}
      toolBarRender={() => {
        return [
          <ModalForm
            title="配置渠道"
            initialValues={{ goodsId: goodsId }}
            key="editOrUpdateGoodsChannel"
            onFinish={async (values: API.GoodsChannelType) => {
              const params = { ...values, channelCode: values.selectedChannel[1] };
              await handleUpdateOrEdit(params);
              actionRef.current?.reloadAndRest?.();
              return true;
            }}
            width={'600px'}
            trigger={<Button type="primary">配置渠道</Button>}
          >
            <ProForm.Group>
              <ProFormText name="goodsId" hidden disabled />
              <Form.Item
                label="国家"
                name="countryCode"
                rules={[{ required: true, message: '请选择国家' }]}
              >
                <Select
                  placeholder="Select a country"
                  style={{ width: 150 }}
                  options={CountryOptions}
                />
              </Form.Item>
              <Form.Item name="selectedChannel" label="渠道代码">
                <Cascader options={options} loadData={loadData} placeholder="Please select" />
              </Form.Item>
            </ProForm.Group>
          </ModalForm>,
        ];
      }}
    />
  );
};

export default GoodsChannelTable;
