import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { useEffect, useState } from "react";
import { getLeads, createLead, updateLead } from "../api/LeadApi";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard({ logout }) {
  const [leads, setLeads] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [editLead, setEditLead] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    status: "new",
    source: "website",
    otherSource: "",
  });

  const loadLeads = async () => {
    try {
      const data = await getLeads();
      setLeads(data || []);
    } catch (err) {
      console.log(err);
      setLeads([]);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const newLead = {
      name: `${form.firstName} ${form.lastName}`,
      email: form.email,
      status: form.status,
      source: form.source === "other" ? form.otherSource : form.source,
    };

    await createLead(newLead);

    setForm({
      firstName: "",
      lastName: "",
      email: "",
      status: "new",
      source: "website",
      otherSource: "",
    });

    setShowModal(false);
    loadLeads();
  };

  const changeStatus = async (id, status) => {
    await updateLead(id, { status });
    loadLeads();
  };

  const deleteLead = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/leads/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.log("Delete failed");
        return;
      }

      loadLeads();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredLeads = (leads || []).filter((l) => {
    const s = search.toLowerCase();
    return (
      l?.name?.toLowerCase().includes(s) ||
      l?.email?.toLowerCase().includes(s) ||
      l?.status?.toLowerCase().includes(s)
    );
  });

  const safe = leads || [];

  const newCount = safe.filter(l => l.status === "new").length;
  const contactedCount = safe.filter(l => l.status === "contacted").length;
  const convertedCount = safe.filter(l => l.status === "converted").length;

  const pieData = {
    labels: ["New", "Contacted", "Converted"],
    datasets: [
      {
        data: [newCount, contactedCount, convertedCount],
        backgroundColor: ["#ff3b30", "#ff7a00", "#ffb347"],
      },
    ],
  };

  const getStatusStyle = (status) => ({
    padding: "5px 10px",
    borderRadius: 4,
    color: "white",
    fontSize: 12,
    background:
      status === "new"
        ? "#ff3b30"
        : status === "contacted"
        ? "#ff7a00"
        : "#ffb347",
  });

return (
  <div style={styles.page}>

    {/* HEADER */}
    <div style={styles.header}>
      <h1 style={styles.title}>Mini CRM Dashboard</h1>

      <div style={{ display: "flex", gap: 10 }}>
        <button style={styles.addBtn} onClick={() => setShowModal(true)}>
          + Add Lead
        </button>

        <button style={styles.logoutBtn} onClick={logout}>
          Logout
        </button>
      </div>
    </div>

    {/* SEARCH */}
    <input
      placeholder="Search by name, email or status..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={styles.search}
    />

    {/* ANALYTICS */}
    <div style={styles.analytics}>
      <div style={styles.stats}>
        <div style={styles.card}><h2>{newCount}</h2><p>New</p></div>
        <div style={styles.card}><h2>{contactedCount}</h2><p>Contacted</p></div>
        <div style={styles.card}><h2>{convertedCount}</h2><p>Converted</p></div>
      </div>

      <div style={styles.chartBox}>
        <Pie data={pieData} />
      </div>
    </div>

    {/* TABLE */}
    <div style={styles.tableBox}>
   <div style={{ overflowX: "auto" }}>
    <table style={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Source</th>
            <th>Delete</th>
            <th>Edit</th>
          </tr>
        </thead>

        <tbody>
          {filteredLeads.map((lead) => (
            <tr key={lead._id}>
              <td>{lead.name}</td>
              <td>{lead.email}</td>

              <td>
                <span style={getStatusStyle(lead.status)}>
                  {lead.status}
                </span>
              </td>

              <td>{lead.source}</td>

              <td>
                <button
                  onClick={() => deleteLead(lead._id)}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
              </td>

              <td>
                <button
                  onClick={() => setEditLead(lead)}
                  style={styles.editBtn}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>

    {/* ADD MODAL */}
    {showModal && (
      <div style={styles.modal}>
        <div style={styles.modalBox}>
          <h3>Add Lead</h3>

          <input name="firstName" placeholder="First Name" onChange={handleChange} style={styles.input} />
          <input name="lastName" placeholder="Last Name" onChange={handleChange} style={styles.input} />
          <input name="email" placeholder="Email" onChange={handleChange} style={styles.input} />

          <select name="status" onChange={handleChange} style={styles.input}>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
          </select>

          <select name="source" onChange={handleChange} style={styles.input}>
            <option value="website">Website</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="other">Other</option>
          </select>

          {form.source === "other" && (
            <input
              name="otherSource"
              placeholder="Enter source"
              onChange={handleChange}
              style={styles.input}
            />
          )}

          <button onClick={handleSubmit} style={styles.saveBtn}>
            Save Lead
          </button>

          <button onClick={() => setShowModal(false)} style={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </div>
    )}

    {/* EDIT MODAL */}
    {editLead && (
      <div style={styles.modal}>
        <div style={styles.modalBox}>
          <h3>Edit Lead</h3>

          <input
            value={editLead.name}
            onChange={(e) =>
              setEditLead({ ...editLead, name: e.target.value })
            }
            style={styles.input}
          />

          <input
            value={editLead.email}
            onChange={(e) =>
              setEditLead({ ...editLead, email: e.target.value })
            }
            style={styles.input}
          />

          <select
            value={editLead.status}
            onChange={(e) =>
              setEditLead({ ...editLead, status: e.target.value })
            }
            style={styles.input}
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
          </select>

          <button
            onClick={async () => {
              await updateLead(editLead._id, editLead);
              setEditLead(null);
              loadLeads();
            }}
            style={styles.saveBtn}
          >
            Save Changes
          </button>

          <button
            onClick={() => setEditLead(null)}
            style={styles.cancelBtn}
          >
            Cancel
          </button>
        </div>
      </div>
    )}

  </div>
);/* ================= STYLES ================= */
}
const styles = {
 page: {
  minHeight: "100vh",
  background: "#f4f6f8",
  padding: 20,
  fontFamily: "Arial",
  color: "#1a1a1a",
},

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  title: {
    color: "#ff3b30",
    fontWeight: "bold",
  },

  addBtn: {
    background: "linear-gradient(135deg,#ff3b30,#ff7a00)",
    color: "white",
    border: "none",
    padding: "9px 14px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "bold",
  },

  logoutBtn: {
    background: "#111",
    color: "white",
    border: "none",
    padding: "9px 14px",
    borderRadius: 6,
    cursor: "pointer",
  },

  search: {
    width: "100%",
    padding: 10,
    marginBottom: 20,
    border: "1px solid #ddd",
    borderRadius: 6,
  },

  analytics: {
  display: "flex",
  gap: 20,
  flexWrap: "wrap",
},

  stats: {
  display: "flex",
  gap: 10,
  flex: 1,
  flexWrap: "wrap",
},

  card: {
    flex: 1,
    background: "#fff3f0",
    padding: 15,
    textAlign: "center",
    borderRadius: 6,
  },

  chartBox: {
    width: 220,
    background: "#fff3f0",
    padding: 10,
    borderRadius: 6,
  },

  tableBox: {
    background: "white",
    border: "1px solid #eee",
    borderRadius: 6,
    overflow: "hidden",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  deleteBtn: {
    background: "#ff3b30",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: 4,
    cursor: "pointer",
  },

  editBtn: {
    background: "#007bff",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: 4,
    cursor: "pointer",
  },

  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    background: "white",
    padding: 20,
    width: 320,
    borderRadius: 6,
  },

  input: {
    width: "100%",
    padding: 10,
    marginBottom: 8,
    border: "1px solid #ddd",
    borderRadius: 4,
  },

  saveBtn: {
    width: "100%",
    padding: 10,
    background: "#ff3b30",
    color: "white",
    border: "none",
    borderRadius: 4,
  },

  cancelBtn: {
    width: "100%",
    padding: 10,
    marginTop: 5,
    border: "1px solid #ddd",
    background: "#f5f5f5",
    borderRadius: 4,
  },
};