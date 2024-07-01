// src/api/axios.ts
import axios from "axios";

const instance = axios.create({
  baseURL: "3.38.152.113/api",
});

export default instance;

