import axios from "axios";

const http = axios.create(
    { baseURL: 'https://localhost:56610/v1/',
      headers: {'X-Custom-Header': 'foobar'}
    });

export async function httpGet<T>(url: string) {
  const response = await http.get<T>(url);
  return response.data;
}


export default http;




