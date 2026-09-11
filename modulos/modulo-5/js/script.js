const progressBar = document.getElementById("progressBar");


/* =========================================================
   BARRA DE PROGRESO
========================================================= */

function updateProgress() {

    if (!progressBar) return;

    const scrollTop = window.scrollY;

    const documentHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const progress =
        documentHeight > 0
            ? (scrollTop / documentHeight) * 100
            : 0;

    progressBar.style.width =
        `${Math.min(progress, 100)}%`;
}

window.addEventListener("scroll", updateProgress);
window.addEventListener("resize", updateProgress);

updateProgress();


/* =========================================================
   MODALES
========================================================= */

const capabilityCards =
    document.querySelectorAll(".capability-card");

const modals =
    document.querySelectorAll(".modal");


capabilityCards.forEach((card) => {

    card.addEventListener("click", (event) => {

        if (
            event.target.closest(".text-button") ||
            event.target === card
        ) {

            const modalName =
                card.dataset.modal;

            const modal =
                document.getElementById(
                    `modal-${modalName}`
                );

            if (!modal) return;

            modal.classList.add("active");

            modal.setAttribute(
                "aria-hidden",
                "false"
            );

            document.body.classList.add(
                "modal-open"
            );
        }
    });
});


modals.forEach((modal) => {

    const closeButton =
        modal.querySelector(".modal-close");

    const overlay =
        modal.querySelector(".modal-overlay");

    const closeModal = () => {

        modal.classList.remove("active");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-open"
        );
    };

    closeButton?.addEventListener(
        "click",
        closeModal
    );

    overlay?.addEventListener(
        "click",
        closeModal
    );
});


document.addEventListener("keydown", (event) => {

    if (event.key !== "Escape") return;

    const openModal =
        document.querySelector(
            ".modal.active"
        );

    if (!openModal) return;

    openModal.classList.remove(
        "active"
    );

    openModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-open"
    );
});


/* =========================================================
   ACTIVIDAD PRÁCTICA
========================================================= */

const solutionInput =
    document.getElementById(
        "solutionInput"
    );

const solutionCounter =
    document.getElementById(
        "solutionCounter"
    );

const buildSolution =
    document.getElementById(
        "buildSolution"
    );

const solutionFeedback =
    document.getElementById(
        "solutionFeedback"
    );


function updateSolutionCounter() {

    if (
        !solutionInput ||
        !solutionCounter
    ) {
        return;
    }

    solutionCounter.textContent =
        `${solutionInput.value.length} / 700`;
}


solutionInput?.addEventListener(
    "input",
    updateSolutionCounter
);

updateSolutionCounter();


function analyzeSolution() {

    if (
        !solutionInput ||
        !solutionFeedback
    ) {
        return;
    }

    const text =
        solutionInput.value.trim();

    solutionFeedback.className =
        "task-feedback";


    if (!text) {

        solutionFeedback.textContent =
            "Describa primero un problema o una tarea que usted quiera mejorar.";

        solutionFeedback.classList.add(
            "show",
            "warning"
        );

        solutionInput.focus();

        return;
    }


    const normalized =
        text.toLowerCase();

    const components = [];


    if (
        normalized.includes("dato") ||
        normalized.includes("excel") ||
        normalized.includes("archivo") ||
        normalized.includes("información") ||
        normalized.includes("informacion") ||
        normalized.includes("reporte")
    ) {

        components.push("datos");
    }


    if (
        normalized.includes("correo") ||
        normalized.includes("enviar") ||
        normalized.includes("copiar") ||
        normalized.includes("registrar") ||
        normalized.includes("consolidar")
    ) {

        components.push("automatización");
    }


    if (
        normalized.includes("analizar") ||
        normalized.includes("resumir") ||
        normalized.includes("clasificar") ||
        normalized.includes("comparar") ||
        normalized.includes("ia") ||
        normalized.includes("inteligencia artificial")
    ) {

        components.push(
            "inteligencia artificial"
        );
    }


    let recommendation =
        "<strong>Su problema puede convertirse en una solución integrada.</strong><br><br>";

    recommendation +=
        "Empiece identificando el proceso actual, sus entradas, reglas y resultado esperado. ";


    if (components.length > 0) {

        recommendation +=
            `En su descripción aparecen oportunidades relacionadas con: <strong>${components.join(", ")}</strong>. `;

    } else {

        recommendation +=
            "Aún no es necesario seleccionar una herramienta específica. Primero estructure el problema. ";
    }


    recommendation +=
        "Después determine qué parte puede apoyarse con datos, IA o automatización y cómo verificará el resultado.";


    solutionFeedback.innerHTML =
        recommendation;

    solutionFeedback.classList.add(
        "show",
        "success"
    );


    localStorage.setItem(
        "empleadoAumentado_finalSolution",
        text
    );
}


buildSolution?.addEventListener(
    "click",
    analyzeSolution
);


/* =========================================================
   RECUPERAR EJERCICIO GUARDADO
========================================================= */

const savedSolution =
    localStorage.getItem(
        "empleadoAumentado_finalSolution"
    );


if (
    savedSolution &&
    solutionInput
) {

    solutionInput.value =
        savedSolution;

    updateSolutionCounter();
}


/* =========================================================
   RETO FINAL
========================================================= */

const challengeOptions =
    document.querySelectorAll(
        ".challenge-option"
    );

const challengeFeedback =
    document.getElementById(
        "challengeFeedback"
    );


challengeOptions.forEach((option) => {

    option.addEventListener(
        "click",
        () => {

            challengeOptions.forEach(
                (item) => {

                    item.classList.remove(
                        "correct",
                        "incorrect"
                    );
                }
            );


            const isCorrect =
                option.dataset.correct ===
                "true";


            option.classList.add(
                isCorrect
                    ? "correct"
                    : "incorrect"
            );


            if (!challengeFeedback) {
                return;
            }


            challengeFeedback.className =
                "challenge-feedback show";


            if (isCorrect) {

                challengeFeedback.classList.add(
                    "correct"
                );

                challengeFeedback.innerHTML =
                    "<strong>Correcto.</strong> Una solución integrada comienza comprendiendo el problema y el proceso, organizando los datos, definiendo dónde aporta valor la IA, automatizando las acciones adecuadas y validando el resultado.";

            } else {

                challengeFeedback.classList.add(
                    "incorrect"
                );

                challengeFeedback.innerHTML =
                    "<strong>No es la mejor opción.</strong> Integrar no significa acumular herramientas ni reemplazar el criterio humano. Primero debe comprender el problema y después conectar los recursos que realmente aportan valor.";
            }
        }
    );
});


/* =========================================================
   ANIMACIONES DE SCROLL
========================================================= */

const animatedElements =
    document.querySelectorAll(
        ".capability-card, " +
        ".method-step, " +
        ".responsibility-card, " +
        ".transformation-column, " +
        ".result-list > div, " +
        ".project-step"
    );


if ("IntersectionObserver" in window) {

    const observer =
        new IntersectionObserver(
            (entries, observerInstance) => {

                entries.forEach((entry) => {

                    if (
                        !entry.isIntersecting
                    ) {
                        return;
                    }

                    entry.target.classList.add(
                        "is-visible"
                    );

                    observerInstance.unobserve(
                        entry.target
                    );
                });
            },
            {
                threshold: 0.12
            }
        );


    animatedElements.forEach(
        (element, index) => {

            element.style.setProperty(
                "--animation-delay",
                `${index * 0.06}s`
            );

            observer.observe(element);
        }
    );

} else {

    animatedElements.forEach(
        (element) => {

            element.classList.add(
                "is-visible"
            );
        }
    );
}


/* =========================================================
   NAVEGACIÓN SUAVE
========================================================= */

document
    .querySelectorAll(
        'a[href^="#"]'
    )
    .forEach((anchor) => {

        anchor.addEventListener(
            "click",
            (event) => {

                const selector =
                    anchor.getAttribute(
                        "href"
                    );

                if (
                    !selector ||
                    selector === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(
                        selector
                    );

                if (!target) {
                    return;
                }

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        );
    });


/* =========================================================
   CERTIFICADO
   CORPORACIÓN BÁRAKA
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const certificateButton =
            document.getElementById(
                "certificateButton"
            );

        const certificateData =
            document.getElementById(
                "certificateData"
            );

        const generateCertificate =
            document.getElementById(
                "generateCertificate"
            );

        const studentName =
            document.getElementById(
                "studentName"
            );

        const studentEmail =
            document.getElementById(
                "studentEmail"
            );

        const certificateFeedback =
            document.getElementById(
                "certificateFeedback"
            );


        /* =================================================
           MOSTRAR FORMULARIO
        ================================================= */

        if (
            certificateButton &&
            certificateData
        ) {

            certificateButton.addEventListener(
                "click",
                () => {

                    certificateData.classList.add(
                        "active"
                    );

                    certificateData.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });


                    if (studentName) {

                        setTimeout(
                            () => {
                                studentName.focus();
                            },
                            600
                        );
                    }
                }
            );
        }


        /* =================================================
           GENERAR CERTIFICADO
        ================================================= */

        if (generateCertificate) {

            generateCertificate.addEventListener(
                "click",
                () => {

                    if (
                        !studentName ||
                        !studentEmail ||
                        !certificateFeedback
                    ) {
                        return;
                    }


                    const nombre =
                        studentName.value.trim();

                    const correo =
                        studentEmail.value.trim();


                    /* -----------------------------------------
                       VALIDAR NOMBRE
                    ----------------------------------------- */

                    if (nombre === "") {

                        certificateFeedback.textContent =
                            "Por favor, escriba su nombre completo.";

                        certificateFeedback.className =
                            "certificate-feedback error";

                        studentName.focus();

                        return;
                    }


                    /* -----------------------------------------
                       VALIDAR CORREO
                    ----------------------------------------- */

                    if (correo === "") {

                        certificateFeedback.textContent =
                            "Por favor, escriba su correo electrónico.";

                        certificateFeedback.className =
                            "certificate-feedback error";

                        studentEmail.focus();

                        return;
                    }


                    const emailValido =
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                    if (
                        !emailValido.test(correo)
                    ) {

                        certificateFeedback.textContent =
                            "Ingrese un correo electrónico válido.";

                        certificateFeedback.className =
                            "certificate-feedback error";

                        studentEmail.focus();

                        return;
                    }


                    /* -----------------------------------------
                       FECHA
                    ----------------------------------------- */

                    const fecha =
                        new Date();


                    const fechaFormateada =
                        fecha.toLocaleDateString(
                            "es-CO",
                            {
                                day: "2-digit",
                                month: "long",
                                year: "numeric"
                            }
                        );


                    /* -----------------------------------------
                       CÓDIGO
                    ----------------------------------------- */

                    const codigo =
                        generarCodigoCertificado();


                    /* -----------------------------------------
                       DATOS
                    ----------------------------------------- */

                    const datosCertificado = {

                        nombre: nombre,

                        correo: correo,

                        fecha: fechaFormateada,

                        codigo: codigo,

                        curso:
                            "El Empleado Aumentado",

                        modulos: 5,

                        entidad:
                            "Corporación BÁRAKA",

                        nit:
                            "901844127-7"

                    };


                    /* -----------------------------------------
                       GUARDAR
                    ----------------------------------------- */

                    localStorage.setItem(
                        "datosCertificado",
                        JSON.stringify(
                            datosCertificado
                        )
                    );


                    /* -----------------------------------------
                       MENSAJE
                    ----------------------------------------- */

                    certificateFeedback.textContent =
                        "Certificado generado correctamente.";

                    certificateFeedback.className =
                        "certificate-feedback success";


                    /* -----------------------------------------
                       MOSTRAR
                    ----------------------------------------- */

                    mostrarCertificado(
                        datosCertificado
                    );
                }
            );
        }


        /* =================================================
           GENERAR CÓDIGO
        ================================================= */

        function generarCodigoCertificado() {

            const caracteres =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

            let codigo =
                "EA-2026-";


            for (
                let i = 0;
                i < 6;
                i++
            ) {

                const posicion =
                    Math.floor(
                        Math.random() *
                        caracteres.length
                    );

                codigo +=
                    caracteres[posicion];
            }


            return codigo;
        }


        /* =================================================
           MOSTRAR CERTIFICADO
        ================================================= */

        function mostrarCertificado(
            datos
        ) {

            const certificadoExistente =
                document.getElementById(
                    "certificateResult"
                );


            if (
                certificadoExistente
            ) {

                certificadoExistente.remove();
            }


            const certificado =
                document.createElement(
                    "section"
                );


            certificado.id =
                "certificateResult";

            certificado.className =
                "certificate-result";


            certificado.innerHTML = `

                <div class="certificate-container">

                    <div class="certificate">

                        <div class="certificate-border">


                            <!-- =================================
                                 ENCABEZADO
                            ================================== -->

                            <div class="certificate-header">

                                <div class="certificate-logo">

                                    <img
                                        src="../../assets/logo.png"
                                        alt="Corporación BÁRAKA"
                                    >

                                </div>


                                <div class="certificate-label">

                                    CERTIFICADO
                                    DE FINALIZACIÓN

                                </div>

                            </div>


                            <!-- =================================
                                 CUERPO
                            ================================== -->

                            <div class="certificate-body">

                                <p class="certificate-issuer">

                                    La Corporación BÁRAKA

                                </p>


                                <p class="certificate-intro">

                                    certifica que

                                </p>


                                <h1>

                                    ${escapeHTML(
                                        datos.nombre
                                    )}

                                </h1>


                                <p class="certificate-text">

                                    completó y aprobó
                                    satisfactoriamente el curso

                                </p>


                                <h2>

                                    EL EMPLEADO AUMENTADO

                                </h2>


                                <p class="certificate-description">

                                    Formación orientada a la integración
                                    de procesos, datos, inteligencia
                                    artificial, automatización y
                                    tecnología aplicada al trabajo.

                                </p>


                                <!-- =================================
                                     INFORMACIÓN COMO TEXTO
                                ================================== -->

                                <p class="certificate-info">

                                    <strong>DURACIÓN:</strong>
                                    5 módulos

                                </p>


                                <p class="certificate-info">

                                    <strong>FECHA DE FINALIZACIÓN:</strong>
                                    ${datos.fecha}

                                </p>


                                <!-- =================================
                                     FIRMA Y CÓDIGO
                                ================================== -->

                                <div class="certificate-footer">

                                    <div class="certificate-signature">

                                        <img
                                            src="../../assets/Firma.png"
                                            alt="Firma"
                                            class="signature-image"
                                        >


                                        <div class="signature-line"></div>


                                        <span>
                                            Corporación BÁRAKA
                                        </span>


                                        <small>
                                            NIT 901844127-7
                                        </small>

                                    </div>


                                    <div class="certificate-code">

                                        <span>
                                            CÓDIGO DEL CERTIFICADO
                                        </span>


                                        <strong>
                                            ${datos.codigo}
                                        </strong>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    <!-- =================================
                         BOTÓN
                    ================================== -->

                    <div class="certificate-actions">

                        <button
                            type="button"
                            class="button button-primary"
                            id="printCertificate"
                        >

                            Imprimir / Guardar PDF

                            <span>
                                ↓
                            </span>

                        </button>

                    </div>

                </div>
            `;


            const main =
                document.querySelector(
                    "main"
                );


            if (!main) {
                return;
            }


            main.appendChild(
                certificado
            );


            certificado.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });


            const printButton =
                document.getElementById(
                    "printCertificate"
                );


            if (printButton) {

                printButton.addEventListener(
                    "click",
                    () => {

                        window.print();

                    }
                );
            }
        }


        /* =================================================
           PROTEGER TEXTO HTML
        ================================================= */

        function escapeHTML(
            text
        ) {

            const div =
                document.createElement(
                    "div"
                );

            div.textContent =
                text;

            return div.innerHTML;
        }

    }
);