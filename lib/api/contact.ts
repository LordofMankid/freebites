import axios from "axios";
import { ContactFormData } from "../util/types";

export const createContact = async (data: ContactFormData) => {
  const updatedData = { ...data, date: new Date(Date.now()) };
  const response = await axios.post("/api/contact", updatedData);
  return response.data;
};
