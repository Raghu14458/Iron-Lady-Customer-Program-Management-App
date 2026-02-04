function loadCustomers() {
  fetch("/customers")
    .then(res => res.json())
    .then(data => {
      let tbody = document.querySelector("#customerTable tbody");
      tbody.innerHTML = "";
      data.forEach(cust => {
        let programs = cust.enrollments.map(p => `${p.program_name} (${p.status})`).join(", ");
        let progress = cust.enrollments.map(p => `${p.program_name}: ${p.progress_percent}%`).join(", ");
        tbody.innerHTML += `<tr>
          <td>${cust.personal_info.name}</td>
          <td>${cust.personal_info.email}</td>
          <td>${programs}</td>
          <td>${cust.enrollments.map(p=>p.status).join(", ")}</td>
          <td>${progress}</td>
          <td class="actions">
            <button onclick="editCustomer(${cust.id})">Edit</button>
            <button onclick="deleteCustomer(${cust.id})">Delete</button>
          </td>
        </tr>`;
      });
    });
}

function submitCustomer() {
  let id = document.getElementById("custId").value;
  let customer = {
    personal_info: {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      age: parseInt(document.getElementById("age").value),
      gender: document.getElementById("gender").value,
      address: document.getElementById("address").value
    },
    enrollments: [
      {
        program_name: document.getElementById("program_name").value,
        category: document.getElementById("category").value,
        duration_weeks: parseInt(document.getElementById("duration_weeks").value),
        start_date: document.getElementById("start_date").value,
        end_date: document.getElementById("end_date").value,
        status: document.getElementById("status").value,
        progress_percent: parseInt(document.getElementById("progress_percent").value),
        fee_paid: parseInt(document.getElementById("fee_paid").value),
        total_fee: parseInt(document.getElementById("total_fee").value),
        payment_status: document.getElementById("payment_status").value,
        submission_history: [],
        notes: document.getElementById("notes").value
      }
    ]
  };

  if(id) {
    fetch(`/update/${id}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(customer)
    }).then(() => { resetForm(); loadCustomers(); });
  } else {
    fetch("/add", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(customer)
    }).then(() => { resetForm(); loadCustomers(); });
  }
}

function editCustomer(id) {
  fetch("/customers")
    .then(res => res.json())
    .then(data => {
      let cust = data.find(c => c.id === id);
      document.getElementById("custId").value = cust.id;
      document.getElementById("name").value = cust.personal_info.name;
      document.getElementById("email").value = cust.personal_info.email;
      document.getElementById("phone").value = cust.personal_info.phone;
      document.getElementById("age").value = cust.personal_info.age;
      document.getElementById("gender").value = cust.personal_info.gender;
      document.getElementById("address").value = cust.personal_info.address;

      let e = cust.enrollments[0];
      document.getElementById("program_name").value = e.program_name;
      document.getElementById("category").value = e.category;
      document.getElementById("duration_weeks").value = e.duration_weeks;
      document.getElementById("start_date").value = e.start_date;
      document.getElementById("end_date").value = e.end_date;
      document.getElementById("status").value = e.status;
      document.getElementById("progress_percent").value = e.progress_percent;
      document.getElementById("fee_paid").value = e.fee_paid;
      document.getElementById("total_fee").value = e.total_fee;
      document.getElementById("payment_status").value = e.payment_status;
      document.getElementById("notes").value = e.notes;
    });
}

function deleteCustomer(id) {
  fetch(`/delete/${id}`, { method: "DELETE" })
    .then(() => loadCustomers());
}

function resetForm() {
  document.getElementById("custId").value = "";
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("age").value = "";
  document.getElementById("gender").value = "";
  document.getElementById("address").value = "";
  document.getElementById("program_name").value = "Full Stack Developer";
  document.getElementById("category").value = "";
  document.getElementById("duration_weeks").value = "";
  document.getElementById("start_date").value = "";
  document.getElementById("end_date").value = "";
  document.getElementById("status").value = "Active";
  document.getElementById("progress_percent").value = "";
  document.getElementById("fee_paid").value = "";
  document.getElementById("total_fee").value = "";
  document.getElementById("payment_status").value = "Paid";
  document.getElementById("notes").value = "";
}

loadCustomers();
