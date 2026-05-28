// Tus credenciales reales de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBRd3SzTPFqalFWrM_mqOmPiPXc1sncHSY",
  authDomain: "consultorio-ucc.firebaseapp.com",
  projectId: "consultorio-ucc",
  storageBucket: "consultorio-ucc.firebasestorage.app",
  messagingSenderId: "382287100053",
  appId: "1:382287100053:web:615ecbbd1aa69caf70839c",
  measurementId: "G-ESZ01025TC"
};

// Inicializar Firebase de forma correcta y compatible
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 1. ESCUCHAR EL BOTÓN DE GUARDAR
document.getElementById('formPrincipal').addEventListener('submit', function(e) {
    e.preventDefault();

    const fichaPaciente = Object.fromEntries(new FormData(e.target).entries());
    fichaPaciente.guardadoEl = new Date();
    
    const dni = document.getElementById('documento').value;
    if (!dni) return alert("⚠️ Es obligatorio ingresar el N° de Documento del paciente.");

    db.collection("historias_clinicas").doc(dni).set(fichaPaciente)
        .then(() => {
            alert("✅ ¡Perfecto! Historia clínica guardada con éxito en la nube.");
            document.getElementById('formPrincipal').reset();
        })
        .catch(error => alert("❌ Error al guardar en Firebase: " + error.message));
});

// 2. ESCUCHAR EL BOTÓN BUSCAR
document.getElementById('btn-buscar').addEventListener('click', () => {
    const dniBuscar = document.getElementById('txt-buscar-dni').value;
    if (!dniBuscar) return alert("⚠️ Por favor, ingrese un número de documento para buscar.");

    db.collection("historias_clinicas").doc(dniBuscar).get().then((doc) => {
        if (doc.exists) {
            const datos = doc.data();
            
            Object.keys(datos).forEach(key => {
                const elementos = document.querySelectorAll(`[name="${key}"]`);
                elementos.forEach(el => {
                    if (el.type === 'radio') {
                        if (el.value === datos[key]) el.checked = true;
                    } else if (el.type === 'checkbox') {
                        if (datos[key] === 'si' || datos[key] === el.value) el.checked = true;
                    } else {
                        el.value = datos[key];
                    }
                });
            });
            alert("📥 Ficha cargada con éxito.");
        } else {
            alert("❌ No se encontró ningún paciente con el DNI: " + dniBuscar);
        }
    }).catch(error => alert("❌ Error en la búsqueda: " + error.message));
});