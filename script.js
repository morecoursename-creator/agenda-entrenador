/* ===============================
   DATOS Y CONFIGURACIÓN
================================ */

let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

const availableHours = [
    "05:00", "06:00", "07:00",
    "08:00", "09:00", "10:00",
    "11:00", "12:00", "13:00",
    "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00",
    "21:00", 
];

let selectedHour = null;

/* ===============================
   AGENDAR CITA
================================ */

function addAppointment() {
    const name = document.getElementById("name").value.trim();
    const date = document.getElementById("date").value;
    const time = selectedHour;

    if (!name || !date || !time) {
        showToast("Completa todos los campos");
        return;
    }

    // Verificar si el horario ya está ocupado
    const exists = appointments.some(
        a => a.date === date && a.time === time
    );

    if (exists) {
        showToast("Ese horario ya está ocupado");
        return;
    }

    appointments.push({ name, date, time });
    saveAppointments();
    renderAppointments();
    clearInputs();
    showToast("Cita agendada ✔");
}

/* ===============================
   MOSTRAR CITAS
================================ */

function renderAppointments() {
    const list = document.getElementById("appointmentsList");
    list.innerHTML = "";

    appointments.forEach((a, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div>
                <strong>${a.name}</strong><br>
                📅 ${a.date} ⏰ ${a.time}
            </div>
           <button class="delete-btn" onclick="deleteAppointment(${index})" title="Eliminar cita">
    🗑️
</button>

        `;
        list.appendChild(li);
    });
}

/* ===============================
   ELIMINAR CITA
================================ */

function deleteAppointment(index) {
    appointments.splice(index, 1);
    saveAppointments();
    renderAppointments();
    renderHours();
    showToast("Cita eliminada ❌");
}

/* ===============================
   HORARIOS VISUALES
================================ */

function renderHours() {
    const container = document.getElementById("hoursContainer");
    container.innerHTML = "";
    selectedHour = null;

    const selectedDate = document.getElementById("date").value;
    if (!selectedDate) return;

    availableHours.forEach(hour => {
        const btn = document.createElement("button");
        btn.className = "hour-btn";
        btn.innerText = hour;

        const occupied = appointments.some(
            a => a.date === selectedDate && a.time === hour
        );

        if (occupied) {
            btn.classList.add("disabled");
            btn.disabled = true;
        }

        btn.onclick = () => {
            document
                .querySelectorAll(".hour-btn")
                .forEach(b => b.classList.remove("selected"));

            btn.classList.add("selected");
            selectedHour = hour;
        };

        container.appendChild(btn);
    });
}

/* ===============================
   UTILIDADES
================================ */

function saveAppointments() {
    localStorage.setItem("appointments", JSON.stringify(appointments));
}

function clearInputs() {
    document.getElementById("name").value = "";
    document.getElementById("date").value = "";
    document.getElementById("hoursContainer").innerHTML = "";
    selectedHour = null;
}

/* ===============================
   MODO CLARO / OSCURO
================================ */

function toggleTheme() {
    document.body.classList.toggle("light");
}

/* ===============================
   ALERTA BONITA (TOAST)
================================ */

function showToast(message) {
    const toast = document.createElement("div");
    toast.innerText = message;

    toast.style.position = "fixed";
    toast.style.bottom = "30px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "#00ffcc";
    toast.style.color = "#0f2027";
    toast.style.padding = "12px 25px";
    toast.style.borderRadius = "30px";
    toast.style.boxShadow = "0 0 15px rgba(0,0,0,.3)";
    toast.style.zIndex = "1000";
    toast.style.fontWeight = "bold";

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2000);
}

/* ===============================
   EVENTOS INICIALES
================================ */

document.getElementById("date").addEventListener("change", renderHours);

renderAppointments();


