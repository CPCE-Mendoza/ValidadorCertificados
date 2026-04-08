// ==========================================
// LÓGICA DEL VALIDADOR FRONTEND
// ==========================================


const URL_API_GOOGLE = 'https://script.google.com/macros/s/AKfycbyMDcN5PnIQKLGOQimQgIgjGLdlpJNkbzYEDJdkJ9CKhRUNaZ3akGn4z6hbATZDtUef/exec';

document.addEventListener("DOMContentLoaded", () => {
    // 1. Obtener el ID de la URL (Ej: cpcemendoza.org/validar?id=A1B2C3D4)
    const urlParams = new URLSearchParams(window.location.search);
    const idCertificado = urlParams.get('id');

    const loadingScreen = document.getElementById('loadingScreen');
    const errorScreen = document.getElementById('errorScreen');
    const resultadoContainer = document.getElementById('resultadoContainer');

    // Si no hay ID en la URL, mostramos error
    if (!idCertificado) {
        mostrarError("No se proporcionó un código de verificación en el enlace.");
        return;
    }

    // 2. Consultar a la API de Google Apps Script
    // Usamos fetch para llamar al Backend que armamos
    fetch(`${URL_API_GOOGLE}?id=${idCertificado}`)
        .then(response => {
            if (!response.ok) throw new Error("Error en la conexión con el servidor");
            return response.json();
        })
        .then(data => {
            // Ocultamos el spinner de carga
            loadingScreen.style.display = 'none';

            if (data.valido) {
                // CERTIFICADO VÁLIDO (Pintamos la pantalla verde)
                pintarResultadoExitoso(data.datos, idCertificado);
            } else {
                // CERTIFICADO INVÁLIDO (Pintamos la pantalla roja)
                pintarResultadoInvalido(idCertificado);
            }
        })
        .catch(error => {
            console.error("Error Fetch:", error);
            mostrarError("Ocurrió un problema de red. Por favor, verifique su conexión a internet e intente de nuevo.");
        });

    // ==========================================
    // FUNCIONES DE RENDERIZADO VISUAL
    // ==========================================

    function mostrarError(mensaje) {
        loadingScreen.style.display = 'none';
        errorScreen.style.display = 'block';
        document.getElementById('errorMsg').textContent = mensaje;
    }

    function pintarResultadoExitoso(datos, id) {
        resultadoContainer.innerHTML = `
            <section class="screen">
                <div class="screen__header text-center">
                    <div class="big-icon">✅</div>
                    <div class="step-badge step-badge--success">Documento Auténtico</div>
                    <h2 class="screen__title">Certificado Válido</h2>
                    <p class="screen__desc">Este documento ha sido emitido oficialmente y se encuentra en los registros del CPCE Mendoza.</p>
                </div>
                
                <div class="result-box">
                    <div class="data-row">
                        <span class="data-label">Participante</span>
                        <span class="data-value">${datos.nombre}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">DNI / CUIT</span>
                        <span class="data-value">${datos.dni}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Capacitación</span>
                        <span class="data-value">${datos.curso}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Carga Horaria</span>
                        <span class="data-value">${datos.horas} hs.</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Fecha de Emisión</span>
                        <span class="data-value">${datos.fecha}</span>
                    </div>
                </div>
                
                <p class="text-center mt-4" style="font-size: 12px; color: var(--text-subtle);">
                    ID de Validación: <strong>${id}</strong>
                </p>
                <a href="https://cpcemza.org.ar/capacitaciones.php" target="_blank" class="btn btn--primary btn--full mt-4">Ver oferta de capacitaciones</a>
            </section>
        `;
        resultadoContainer.style.display = 'block';
    }

    function pintarResultadoInvalido(id) {
        resultadoContainer.innerHTML = `
            <section class="screen">
                <div class="screen__header text-center">
                    <div class="big-icon">❌</div>
                    <div class="step-badge step-badge--error">Registro No Encontrado</div>
                    <h2 class="screen__title" style="color: var(--error);">Certificado Inválido</h2>
                    <p class="screen__desc">El código de validación <strong>${id}</strong> no existe en nuestros registros oficiales o ha sido revocado.</p>
                </div>
                
                <div class="result-box text-center" style="background: #fdf5f5; border-color: #f5baba;">
                    <p style="font-size: 14px; color: var(--text-dark); margin-bottom: 12px;">
                        Si cree que esto es un error, por favor comuníquese con el área de capacitación del Consejo.
                    </p>
                    <a href="https://wa.link/xd7xt8" target="_blank" class="btn btn--secondary btn--full" style="background: white; color: var(--error); border-color: var(--error);">
                        Contactar Soporte
                    </a>
                </div>
            </section>
        `;
        resultadoContainer.style.display = 'block';
    }
});
