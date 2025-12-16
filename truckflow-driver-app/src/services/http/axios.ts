import axios from "axios";

const http = axios.create(
    { baseURL: 'http://192.168.1.249:56611/v1/',
      headers: {'X-Custom-Header': 'foobar'}
    });

export async function httpGet<T>(url: string) {
  const response = await http.get<T>(url);
  return response.data;
}


export default http;




