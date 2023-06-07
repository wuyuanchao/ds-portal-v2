import { Footer } from '@/components';
import { Helmet } from '@@/exports';
import ProCard from '@ant-design/pro-card';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Divider, Form, Select, Typography } from 'antd';
import React from 'react';
import { useParams } from 'umi';

const { Title, Paragraph, Text, Link } = Typography;

const countryEnum = {
  china: '中国',
  usa: '美国',
};

const Quote = () => {
  const [current, setCurrent] = React.useState<API.Goods>();

  const goodsSn = useParams<{ sn: string }>().sn;

  React.useEffect(() => {
    setCurrent({
      goodsId: 1,
      goodsSn: 'asdf',
      goodsType: 1,
      goodsName: '测试商品',
      depot: '测试仓库',
      remark: '测试备注',
      goodsTags: ['red'],
    });
  }, []);

  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });
  const enumMapping = {
    Option1: 'Option 1',
    Option2: 'Option 2',
    Option3: 'Option 3',
  };
  return (
    <PageContainer className={containerClassName}>
      <Helmet>
        <title>
          {'报价单'}- {goodsSn}
        </title>
      </Helmet>
      <ProCard title={goodsSn} extra="2023年6月6日" split={'vertical'} bordered headerBordered>
        <ProCard colSpan="30%">
          <img
            alt="example"
            style={{ borderRadius: '10%', width: '360px', height: '360px' }}
            src="https://xiuxiupro-material-center.meitudata.com/poster/8c98b88845630b4afc694e90ca81daa2.png"
          />
        </ProCard>
        <ProCard title="流量占用情况">
          <Paragraph>
            <ul>
              <li>
                <Link href="/docs/spec/proximity">Principles</Link>
              </li>
              <li>
                <Link href="/docs/spec/overview">Patterns</Link>
              </li>
              <li>
                <Link href="/docs/resources">Resource Download</Link>
              </li>
            </ul>
          </Paragraph>
          <Divider dashed />
          <ProDescriptions
            title={
              <Form>
                <Form.Item label="Country" name="country">
                  <Select
                    placeholder="Select a country"
                    defaultValue="US"
                    style={{ width: 150 }}
                    options={[
                      {
                        value: 'US',
                        label: 'US',
                      },
                      {
                        value: 'CN',
                        label: 'CN',
                      },
                      {
                        value: 'JP',
                        label: 'JP',
                      },
                    ]}
                  />
                </Form.Item>
              </Form>
            }
          >
            <ProDescriptions.Item label="Vendor">Zesty</ProDescriptions.Item>
            <ProDescriptions.Item label="Stock Availability">RTS</ProDescriptions.Item>
            <ProDescriptions.Item label="Referece link">http://www.zesty.com</ProDescriptions.Item>
            <ProDescriptions.Item label="Cost">8$ US</ProDescriptions.Item>
          </ProDescriptions>
        </ProCard>
      </ProCard>
      <Footer />
    </PageContainer>
  );
};

export default Quote;
