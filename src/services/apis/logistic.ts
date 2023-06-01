import { request } from '@umijs/max';
import React from 'react';

export const shippingCompanyEnum = {
  yuntu: {
    text: '云途物流',
  },
  ubi: {
    text: 'UBI',
  },
};

export type ChannelType = {
  recId: React.Key;
  name: string;
  code: string;
  company: string;
  cutOffTime: string;
  costTime: string;
};

export type ShippingConfigType = {
  id: React.Key;
  country?: string;
  volWeightRate?: number;
  shippingTime?: string;
  left?: string;
  right?: string;
  shippingFee?: string;
  extraFee?: string;
  rowSpan?: number;
};

export async function getChannelList(
  params: {
    company?: string;
    code?: string;
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  console.log(params, options);
  //防止传空字符串，antd protable控件的查询form，text在输入文本后再叉掉会传空字符串
  if (params.code === '') {
    params.code = undefined;
  }
  const response = await request<ChannelType>('/api/logistic/getChannelList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
  return response;
}

export async function addChannel(channel: ChannelType) {
  const response = await request('/api/logistic/addChannel', {
    method: 'POST',
    data: channel,
  });
  return response;
}

export async function deleteChannel(channel: ChannelType) {
  const response = await request('/api/logistic/deleteChannel/' + channel.recId, {
    method: 'DELETE',
  });
  return response;
}

export async function updateChannel(channel: ChannelType) {
  const response = await request('/api/logistic/updateChannel', {
    method: 'PUT',
    data: channel,
  });
  return response;
}

/** 获取配置详情 */
export async function getShippingConfig(
  params: {
    channelId: string;
  },
  options?: { [key: string]: any },
) {
  const response = await request<API.FeeCountryConfigType>(
    '/api/logistic/getChannelDetail/' + params.channelId,
    {
      method: 'GET',
      ...(options || {}),
    },
  );

  if (response.code === 200) {
    const r: ShippingConfigType[] = [];
    let lastId: React.Key = -1;
    for (let d of response.data) {
      for (let i of d.items) {
        r.push({
          country: d.country,
          shippingTime: d.shippingTime,
          volWeightRate: 8000,
          ...i,
          id: d.id + '_' + i.id,
          rowSpan: d.id === lastId ? 0 : d.items.length,
        });
        lastId = d.id;
      }
    }

    //todo: 暂时在这里转换响应结构，后面需要统一拦截器处理
    let respData = {
      data: r,
      // success 请返回 true，
      // 不然 table 会停止解析数据，即使有数据
      success: true,
      // 不传会使用 data 的长度，如果是分页一定要传
      total: r.length,
    };
    return respData;
  } else {
    return {
      success: false,
      message: response.message,
    };
  }
}
