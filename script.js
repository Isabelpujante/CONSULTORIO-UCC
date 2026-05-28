// ==========================================
// CONFIGURACIÓN DE TU GOOGLE FIREBASE:
// ==========================================
const firebaseConfig = {
    apiKey: "TU_API_KEY_REAL",
    authDomain: "TU_PROYECTO.firebaseapp.com",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_BUCKET.appspot.com",
    messagingSenderId: "TU_MESSAGING_ID",
    appId: "TU_APP_ID"
};
// ==========================================

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 1. ESCUCHAR EL BOTÓN DE GUARDAR
document.getElementById('formPrincipal').addEventListener('submit', function(e) {
    e.preventDefault();

    // Agarra todos los inputs del formulario automáticamente
    const fichaPaciente = Object.fromEntries(new FormData(e.target).entries());
    fichaPaciente.guardadoEl = new Date();
    
    // Validamos el DNI
    const dni = document.getElementById('documento').value;
    if (!dni) return alert("⚠️ Es obligatorio ingresar el N° de Documento del paciente.");

    // Guarda en la nube. Si el DNI ya existía, reescribe los datos actualizándolos
    db.collection("historias_clinicas").doc(dni).set(fichaPaciente)
        .then(() => {
            alert("✅ ¡Perfecto! Historia clínica procesada y guardada con éxito en la nube.");
            document.getElementById('formPrincipal').reset(); // Limpia el formulario
        })
        .catch(error => alert("❌ Error al guardar en Firebase: " + error.message));
});

// 2. ESCUCHAR EL BOTÓN BUSCAR DE LA BARRA SUPERIOR
document.getElementById('btn-buscar').addEventListener('click', () => {
    const dniBuscar = document.getElementById('txt-buscar-dni').value;
    if (!dniBuscar) return alert("⚠️ Por favor, ingrese un número de documento para buscar.");

    db.collection("historias_clinicas").doc(dniBuscar).get().then((doc) => {
        if (doc.exists) {
            const datos = doc.data();
            
            // Recorremos las respuestas traídas de Firebase y rellenamos cada input del formulario
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
            alert("📥 Ficha cargada. Modifique las respuestas necesarias y vuelva a pulsar el botón 'Guardar' al final.");
        } else {
            alert("❌ No se encontró ningún paciente registrado con el DNI: " + dniBuscar);
        }
    }).catch(error => alert("❌ Error en la búsqueda: " + error.message));
});