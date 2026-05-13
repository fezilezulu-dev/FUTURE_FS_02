const BASE_URL = `${import.meta.env.VITE_API_URL}/api/leads`;

const getToken = () => localStorage.getItem("token");

export const getLeads = async () => {
  const res = await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await res.json();

  return Array.isArray(data) ? data : [];
};

export const createLead = async (lead) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(lead),
  });
  return res.json();
};

export const updateLead = async (id, data) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};