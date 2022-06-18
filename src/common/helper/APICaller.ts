import axios, { type AxiosRequestConfig, AxiosError } from 'axios';

export async function GET(url: string, options?: AxiosRequestConfig) {
  try {
    const res = await axios.get(url, options);
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response.data.message);
    }
  }
}

export async function POST(
  url: string,
  body?: Record<string, any> | null,
  options?: AxiosRequestConfig,
) {
  try {
    const res = await axios.post(url, body, options);
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response.data.message);
    }
  }
}

export async function PUT(
  url: string,
  body?: Record<string, any> | null,
  options?: AxiosRequestConfig,
) {
  try {
    const res = await axios.put(url, body, options);
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response.data.message);
    }
  }
}

export async function DELETE(url: string, options?: AxiosRequestConfig) {
  try {
    const res = await axios.delete(url, options);
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response.data.message);
    }
  }
}
