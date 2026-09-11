"use strict";

/* =========================================================
   BARRA DE PROGRESO
========================================================= */

const progressBar = document.getElementById("progressBar");

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

    progressBar.style.width = `${Math.min(progress, 100)}%`;
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

    card.addEventListener("click", () => {

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
    });

});


modals.forEach((modal) => {

    const closeButton =
        modal.querySelector(".modal-close");

    const overlay =
        modal.querySelector(".modal-overlay");

    function closeModal() {

        modal.classList.remove("active");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-open"
        );
    }

    closeButton?.addEventListener(
        "click",
        closeModal
    );

    overlay?.addEventListener(
        "click",
        closeModal
    );

});


document.addEventListener(
    "keydown",
    (event) => {

        if (event.key !== "Escape") {
            return;
        }

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
    }
);


/* =========================================================
   EJERCICIO
========================================================= */

const automationInput =
    document.getElementById(
        "automationInput"
    );

const indicatorCounter =
    document.getElementById(
        "indicatorCounter"
    );

const analyzeTask =
    document.getElementById(
        "analyzeTask"
    );

const taskFeedback =
    document.getElementById(
        "taskFeedback"
    );


function updateCounter() {

    if (!automationInput || !indicatorCounter) {
        return;
    }

    indicatorCounter.textContent =
        `${automationInput.value.length} / 500`;
}


automationInput?.addEventListener(
    "input",
    updateCounter
);

updateCounter();


function analyzeAutomationTask() {

    if (
        !automationInput ||
        !taskFeedback
    ) {
        return;
    }

    const task =
        automationInput.value.trim();

    taskFeedback.className =
        "task-feedback";

    if (!task) {

        taskFeedback.textContent =
            "Describa primero una tarea que usted realice con frecuencia.";

        taskFeedback.classList.add(
            "show",
            "warning"
        );

        automationInput.focus();

        return;
    }

    const normalized =
        task.toLowerCase();

    const indicators = [];

    if (
        normalized.includes("cada") ||
        normalized.includes("diario") ||
        normalized.includes("semanal") ||
        normalized.includes("siempre") ||
        normalized.includes("repet")
    ) {
        indicators.push(
            "La tarea parece tener una frecuencia definida."
        );
    }

    if (
        normalized.includes("excel") ||
        normalized.includes("archivo") ||
        normalized.includes("datos") ||
        normalized.includes("reporte") ||
        normalized.includes("registro")
    ) {
        indicators.push(
            "La tarea trabaja con información estructurada."
        );
    }

    if (
        normalized.includes("correo") ||
        normalized.includes("enviar") ||
        normalized.includes("guardar") ||
        normalized.includes("copiar") ||
        normalized.includes("consolid")
    ) {
        indicators.push(
            "Se observan acciones repetitivas que podrían estructurarse."
        );
    }

    taskFeedback.classList.add(
        "show",
        "success"
    );

    let message =
        "<strong>Primera revisión:</strong> ";

    if (indicators.length > 0) {

        message +=
            indicators.join(" ") +
            " ";

    } else {

        message +=
            "la tarea puede analizarse descomponiéndola en entradas, reglas, acciones y resultado. ";

    }

    message +=
        "Antes de seleccionar una herramienta, identifique qué parte se repite, qué reglas aplica y cómo puede verificar el resultado.";

    taskFeedback.innerHTML = message;

    localStorage.setItem(
        "empleadoAumentado_automationTask",
        task
    );
}


analyzeTask?.addEventListener(
    "click",
    analyzeAutomationTask
);


/* =========================================================
   CARGAR TAREA GUARDADA
========================================================= */

const savedTask =
    localStorage.getItem(
        "empleadoAumentado_automationTask"
    );

if (
    savedTask &&
    automationInput
) {
    automationInput.value =
        savedTask;

    updateCounter();
}


/* =========================================================
   RETO
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
                    "<strong>Correcto.</strong> Antes de automatizar, primero debe documentar y comprender el flujo actual: entradas, reglas, pasos, excepciones y resultado esperado.";

            } else {

                challengeFeedback.classList.add(
                    "incorrect"
                );

                challengeFeedback.innerHTML =
                    "<strong>No es el primer paso.</strong> Antes de elegir una herramienta debe comprender y estructurar el proceso que desea automatizar.";

            }
        }
    );

});


/* =========================================================
   ANIMACIONES AL HACER SCROLL
========================================================= */

const animatedElements =
    document.querySelectorAll(
        ".capability-card, " +
        ".method-step, " +
        ".responsibility-card, " +
        ".transformation-column, " +
        ".result-list > div"
    );


if ("IntersectionObserver" in window) {

    const observer =
        new IntersectionObserver(
            (entries, observerInstance) => {

                entries.forEach(
                    (entry) => {

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
                    }
                );

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

            observer.observe(
                element
            );
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
   ANCLAS SUAVES
========================================================= */

document
    .querySelectorAll(
        'a[href^="#"]'
    )
    .forEach(
        (anchor) => {

            anchor.addEventListener(
                "click",
                (event) => {

                    const selector =
                        anchor.getAttribute(
                            "href"
                        );

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
        }
    );