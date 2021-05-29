import axios from "axios";

const buildClient = () => {
  return axios.create({
    baseUrl: window.Config.API_URL,
  });
};
 
export default buildClient;