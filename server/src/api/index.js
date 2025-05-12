// utils/api.jsx

import axios from "axios";
import conf from "../conf.js";

const HUBSPOT_API_KEY = conf.HUBSPOT_API_KEY;
const HUBSPOT_BASE_URL =
  "https://api.hubapi.com/crm/v3/objects/contacts/search";

const axiosInstance = axios.create({
  baseURL: HUBSPOT_BASE_URL,
  headers: {
    Authorization: `Bearer ${HUBSPOT_API_KEY}`,
    "Content-Type": "application/json",
  },
});

/**
 * Sends a contact search request to HubSpot API.
 * @param {Object} payload - HubSpot search request body.
 * @returns {Array} - Raw results from HubSpot.
 */
export const fetchContactsFromHubSpot = async (payload) => {
  const response = await axiosInstance.post("", payload);
  return response.data.results;
};


