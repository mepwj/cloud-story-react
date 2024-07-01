// src/api/axios.ts
import axios from "axios";

const instance = axios.create({
  baseURL: "http://3.38.152.113/api",  // 절대 경로로 수정
});

export default instance;
