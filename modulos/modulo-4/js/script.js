"use strict";

/* =========================================================
   GOOGLE ANALYTICS
========================================================= */

function trackEvent(eventName, parameters = {}) {
    if (typeof window.gtag === "function") {
        window.gtag("event", eventName, parameters);
    }
}

function trackEventOnce(eventName, storageKey, parameters = {}) {
    try {
        if (sessionStorage.getItem(storageKey) === "true") {
            return;
        }

        trackEvent(eventName, parameters);
        sessionStorage.setItem(storageKey, "true");

    } catch (error) {
        trackEvent(eventName, parameters);
    }
}

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       GOOGLE ANALYTICS — MÓDULO VISTO
    ====================================================== */

    trackEventOnce(
        "modulo_visto",
        "analytics_modulo4_visto",
        {
            modulo: "4",
            nombre_modulo: "Automatizar tareas y procesos"
        }
    );

    /* =====================================================
       STORAGE
    ====================================================== */

    const STORAGE_TASK =
        "empleadoAumentado_modulo4_task";

    const STORAGE_CHALLENGE =
        "empleadoAumentado_modulo4_reto";

    const STORAGE_MODULE =
        "empleadoAumentado_modulo4_completado";

    const STORAGE_PROGRESS =
        "empleadoAumentado_progreso";

    /* =====================================================
       ELEMENTOS
    ====================================================== */

    const body =
        document.body;

    const progressBar =
        document.getElementById(
            "progressBar"
        );

    const progressPercentage =
        document.getElementById(
            "progressPercentage"
        );

    const automationInput =
        document.getElementById(
            "automationInput"
        );

    const characterCounter =
        document.getElementById(
            "characterCounter"
        );

    const analyzeTask =
        document.getElementById(
            "analyzeTask"
        );

    const taskFeedback =
        document.getElementById(
            "taskFeedback"
        );

    let challengeOptions =
        document.querySelectorAll(
            ".challenge-option"
        );

    const challengeFeedback =
        document.getElementById(
            "challengeFeedback"
        );

    const requirementActivity =
        document.getElementById(
            "requirementActivity"
        );

    const requirementChallenge =
        document.getElementById(
            "requirementChallenge"
        );

    const requirementModule =
        document.getElementById(
            "requirementModule"
        );

    const moduleComplete =
        document.getElementById(
            "moduleComplete"
        );

    const completionLabel =
        document.getElementById(
            "completionLabel"
        );

    const completionMessage =
        document.getElementById(
            "completionMessage"
        );

    const nextModuleButton =
        document.getElementById(
            "nextModuleButton"
        );

    /* =====================================================
       ESTADO
    ====================================================== */

    const moduleState = {
        activityCompleted: false,
        challengeCompleted: false,
        moduleCompleted: false
    };

    /* =====================================================
       STORAGE HELPERS
    ====================================================== */

    function getStorage(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.warn(
                `No fue posible leer ${key}.`,
                error
            );
            return null;
        }
    }

    function setStorage(key, value) {
        try {
            localStorage.setItem(
                key,
                value
            );
            return true;
        } catch (error) {
            console.warn(
                `No fue posible guardar ${key}.`,
                error
            );
            return false;
        }
    }

    function removeStorage(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn(
                `No fue posible eliminar ${key}.`,
                error
            );
        }
    }

    /* =====================================================
       NORMALIZAR TEXTO
    ====================================================== */

    function normalizeText(text) {
        return String(text || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .replace(
                /[^\p{L}\p{N}\s]/gu,
                " "
            )
            .replace(
                /\s+/g,
                " "
            )
            .trim();
    }

    /* =====================================================
       VALIDAR TEXTO BASURA
    ====================================================== */

    function detectInvalidText(text) {

        const value =
            normalizeText(text);

        const compact =
            value.replace(/\s/g, "");

        if (!value) {
            return {
                invalid: true,
                message:
                    "La respuesta está vacía. Describa una tarea real que pueda analizarse para automatización."
            };
        }

        if (value.length < 40) {
            return {
                invalid: true,
                message:
                    "La respuesta es demasiado corta. Explique con mayor detalle la tarea que realiza."
            };
        }

        const words =
            value
                .split(" ")
                .filter(
                    word =>
                        word.length > 1
                );

        if (words.length < 7) {
            return {
                invalid: true,
                message:
                    "Explique la tarea con mayor detalle. Indique qué se hace y cómo se realiza."
            };
        }

        if (/(.)\1{4,}/iu.test(value)) {
            return {
                invalid: true,
                message:
                    "La respuesta contiene caracteres repetidos y no parece una respuesta válida."
            };
        }

        const suspiciousPatterns = [
            "asdfgh",
            "qwerty",
            "zxcvbn",
            "poiuy",
            "lkjhg",
            "mnbvc"
        ];

        if (
            suspiciousPatterns.some(
                pattern =>
                    value.includes(pattern)
            )
        ) {
            return {
                invalid: true,
                message:
                    "La respuesta no parece contener una descripción real."
            };
        }

        const wordCount = {};

        words.forEach(word => {
            wordCount[word] =
                (
                    wordCount[word] ||
                    0
                ) + 1;
        });

        const repetitions =
            Object.values(wordCount);

        const highestRepetition =
            repetitions.length
                ? Math.max(...repetitions)
                : 0;

        if (
            highestRepetition >= 4 &&
            highestRepetition >=
                words.length / 2
        ) {
            return {
                invalid: true,
                message:
                    "La respuesta repite demasiado las mismas palabras. Escriba una descripción real de la tarea."
            };
        }

        const letters =
            (
                value.match(
                    /[a-záéíóúñ]/gi
                ) || []
            ).length;

        const numbers =
            (
                value.match(
                    /[0-9]/g
                ) || []
            ).length;

        if (
            numbers > letters &&
            numbers > 5
        ) {
            return {
                invalid: true,
                message:
                    "La respuesta contiene demasiados números y no parece una descripción válida."
            };
        }

        const uniqueCharacters =
            new Set(compact).size;

        if (uniqueCharacters < 8) {
            return {
                invalid: true,
                message:
                    "La respuesta no contiene suficiente variedad de contenido."
            };
        }

        return {
            invalid: false,
            message: ""
        };
    }

    /* =====================================================
       VALIDAR ACTIVIDAD DE AUTOMATIZACIÓN
    ====================================================== */

    function validateAutomationTask(text) {

        const basicValidation =
            detectInvalidText(text);

        if (basicValidation.invalid) {
            return {
                valid: false,
                message:
                    basicValidation.message
            };
        }

        const value =
            normalizeText(text);

        const automationKeywords = [
            "automatizar",
            "automatizacion",
            "automatizado",
            "automatizada",
            "automatiza",
            "automatico",
            "automaticamente",
            "regla",
            "reglas",
            "flujo",
            "workflow",
            "proceso",
            "procesar",
            "bot",
            "robot",
            "herramienta",
            "sistema",
            "integracion",
            "integrar"
        ];

        const taskKeywords = [
            "tarea",
            "trabajo",
            "actividad",
            "correo",
            "correos",
            "excel",
            "archivo",
            "archivos",
            "datos",
            "reporte",
            "informacion",
            "registro",
            "registros",
            "tabla",
            "tablas",
            "cliente",
            "clientes",
            "solicitud",
            "solicitudes",
            "documento",
            "documentos",
            "factura",
            "facturas",
            "notificar",
            "notificacion",
            "copiar",
            "pegar",
            "guardar",
            "enviar",
            "consolidar",
            "consolidado"
        ];

        const repetitionKeywords = [
            "cada",
            "diario",
            "diaria",
            "diariamente",
            "semanal",
            "semanalmente",
            "mensual",
            "mensualmente",
            "siempre",
            "repetir",
            "repetitiva",
            "repetitivo",
            "repetidamente",
            "frecuencia",
            "varias veces",
            "todos los dias"
        ];

        const actionKeywords = [
            "recibir",
            "recibo",
            "registrar",
            "registro",
            "revisar",
            "reviso",
            "copiar",
            "copio",
            "pegar",
            "pego",
            "guardar",
            "guardo",
            "enviar",
            "envio",
            "consolidar",
            "consolido",
            "notificar",
            "notifico",
            "clasificar",
            "clasifico",
            "buscar",
            "busco",
            "extraer",
            "extraigo",
            "calcular",
            "calculo",
            "generar",
            "genero",
            "actualizar",
            "actualizo",
            "pasar",
            "comparar",
            "comparo",
            "validar",
            "valido"
        ];

        const detectedAutomation =
            automationKeywords.filter(
                keyword =>
                    value.includes(keyword)
            );

        const detectedTasks =
            taskKeywords.filter(
                keyword =>
                    value.includes(keyword)
            );

        const detectedRepetition =
            repetitionKeywords.filter(
                keyword =>
                    value.includes(keyword)
            );

        const detectedActions =
            actionKeywords.filter(
                keyword =>
                    value.includes(keyword)
            );

        if (detectedTasks.length < 1) {
            return {
                valid: false,
                message:
                    "Describa una tarea concreta de su trabajo que desea analizar para automatización."
            };
        }

        if (detectedActions.length < 1) {
            return {
                valid: false,
                message:
                    "Indique qué acción realiza en esa tarea: registrar, copiar, revisar, enviar, consolidar, clasificar, calcular, etc."
            };
        }

        if (
            detectedAutomation.length < 1 &&
            detectedRepetition.length < 1
        ) {
            return {
                valid: false,
                message:
                    "La actividad debe identificar una tarea repetitiva, una regla, un flujo o una posibilidad concreta de automatización."
            };
        }

        if (value.length < 50) {
            return {
                valid: false,
                message:
                    "Explique qué hace actualmente, qué parte se repite y qué podría automatizarse."
            };
        }

        return {
            valid: true,
            message:
                "La tarea contiene elementos suficientes para analizar una posible automatización."
        };
    }

    /* =====================================================
       FEEDBACK
    ====================================================== */

    function showTaskFeedback(
        message,
        type = "success"
    ) {

        if (!taskFeedback) {
            return;
        }

        taskFeedback.textContent =
            message;

        taskFeedback.className =
            "task-feedback show";

        if (type === "error") {

            taskFeedback.classList.add(
                "error"
            );

            taskFeedback.style.color =
                "#dc2626";

            taskFeedback.style.backgroundColor =
                "rgba(220, 38, 38, 0.08)";

            taskFeedback.style.border =
                "1px solid rgba(220, 38, 38, 0.25)";

        } else {

            taskFeedback.classList.add(
                "success"
            );

            taskFeedback.style.color =
                "#059669";

            taskFeedback.style.backgroundColor =
                "rgba(5, 150, 105, 0.08)";

            taskFeedback.style.border =
                "1px solid rgba(5, 150, 105, 0.25)";
        }
    }

    /* =====================================================
       VALIDAR ACCESO DESDE MÓDULO 03
    ====================================================== */

    function moduleThreeIsCompleted() {
        return (
            getStorage(
                "empleadoAumentado_modulo3_completado"
            ) ===
            "completado"
        );
    }

    function protectModuleFour() {

        if (moduleThreeIsCompleted()) {
            return;
        }

        const warning =
            document.createElement("div");

        warning.innerHTML = `
            <div class="module-access-message">
                <strong>
                    🔒 Módulo 04 bloqueado
                </strong>

                <span>
                    Primero debe completar y aprobar el Módulo 03.
                </span>

                <a href="../modulo-3/index.html">
                    Ir al Módulo 03
                </a>
            </div>
        `;

        document.body.prepend(
            warning
        );

        document.body.classList.add(
            "module-access-blocked"
        );

        if (automationInput) {
            automationInput.disabled =
                true;
        }

        if (analyzeTask) {
            analyzeTask.disabled =
                true;
        }

        challengeOptions.forEach(
            option => {
                option.disabled =
                    true;
            }
        );

        if (nextModuleButton) {
            nextModuleButton.setAttribute(
                "aria-disabled",
                "true"
            );
        }
    }

    /* =====================================================
       MODALES
    ====================================================== */

    const capabilityCards =
        document.querySelectorAll(
            ".capability-card"
        );

    const modals =
        document.querySelectorAll(
            ".modal"
        );

    let lastFocusedElement =
        null;

    capabilityCards.forEach(
        card => {

            card.addEventListener(
                "click",
                () => {

                    const modalName =
                        card.dataset.modal;

                    const modal =
                        document.getElementById(
                            `modal-${modalName}`
                        );

                    if (!modal) {
                        return;
                    }

                    lastFocusedElement =
                        document.activeElement;

                    modal.classList.add(
                        "active"
                    );

                    modal.setAttribute(
                        "aria-hidden",
                        "false"
                    );

                    document.body.classList.add(
                        "modal-open"
                    );

                    const closeButton =
                        modal.querySelector(
                            ".modal-close"
                        );

                    if (closeButton) {
                        closeButton.focus();
                    }
                }
            );
        }
    );

    modals.forEach(
        modal => {

            const closeButton =
                modal.querySelector(
                    ".modal-close"
                );

            const overlay =
                modal.querySelector(
                    ".modal-overlay"
                );

            function closeModal() {

                modal.classList.remove(
                    "active"
                );

                modal.setAttribute(
                    "aria-hidden",
                    "true"
                );

                const anotherModal =
                    document.querySelector(
                        ".modal.active"
                    );

                if (!anotherModal) {

                    document.body.classList.remove(
                        "modal-open"
                    );

                    if (
                        lastFocusedElement &&
                        typeof lastFocusedElement.focus ===
                            "function"
                    ) {
                        lastFocusedElement.focus();
                    }

                    lastFocusedElement =
                        null;
                }
            }

            if (closeButton) {
                closeButton.addEventListener(
                    "click",
                    closeModal
                );
            }

            if (overlay) {
                overlay.addEventListener(
                    "click",
                    closeModal
                );
            }
        }
    );

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }

            const openModal =
                document.querySelector(
                    ".modal.active"
                );

            if (!openModal) {
                return;
            }

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

            if (
                lastFocusedElement &&
                typeof lastFocusedElement.focus ===
                    "function"
            ) {
                lastFocusedElement.focus();
            }

            lastFocusedElement =
                null;
        }
    );

    /* =====================================================
       CONTADOR
    ====================================================== */

    function updateCounter() {

        if (
            !automationInput ||
            !characterCounter
        ) {
            return;
        }

        const maximum =
            automationInput.maxLength ||
            500;

        characterCounter.textContent =
            `${automationInput.value.length} / ${maximum}`;
    }

    if (automationInput) {

        automationInput.addEventListener(
            "input",
            updateCounter
        );

        updateCounter();
    }

    /* =====================================================
       ANALIZAR / GUARDAR ACTIVIDAD
    ====================================================== */

    function analyzeAutomationTask() {

        if (!automationInput) {
            return;
        }

        const task =
            automationInput.value.trim();

        const validation =
            validateAutomationTask(task);

        if (!validation.valid) {

            moduleState.activityCompleted =
                false;

            removeStorage(
                STORAGE_TASK
            );

            showTaskFeedback(
                `🔴 ${validation.message}`,
                "error"
            );

            checkModuleCompletion();

            automationInput.focus();

            return;
        }

        const data = {
            task:
                task,

            module:
                "Módulo 04 — Automatizar tareas y procesos",

            createdAt:
                new Date().toISOString()
        };

        const saved =
            setStorage(
                STORAGE_TASK,
                JSON.stringify(data)
            );

        if (!saved) {

            showTaskFeedback(
                "🔴 No fue posible guardar la actividad.",
                "error"
            );

            return;
        }

        const wasAlreadyCompleted =
            moduleState.activityCompleted;

        moduleState.activityCompleted =
            true;

        if (!wasAlreadyCompleted) {

            trackEventOnce(
                "actividad_completada",
                "analytics_modulo4_actividad",
                {
                    modulo: "4",
                    actividad: "analisis_de_automatizacion"
                }
            );
        }

        const normalized =
            normalizeText(task);

        const indicators = [];

        if (
            normalized.includes("cada") ||
            normalized.includes("diario") ||
            normalized.includes("semanal") ||
            normalized.includes("mensual") ||
            normalized.includes("siempre") ||
            normalized.includes("repet") ||
            normalized.includes("frecuencia")
        ) {

            indicators.push(
                "La tarea tiene una frecuencia o repetición identificable."
            );
        }

        if (
            normalized.includes("excel") ||
            normalized.includes("archivo") ||
            normalized.includes("datos") ||
            normalized.includes("reporte") ||
            normalized.includes("registro") ||
            normalized.includes("tabla")
        ) {

            indicators.push(
                "La tarea trabaja con información que puede estructurarse."
            );
        }

        if (
            normalized.includes("correo") ||
            normalized.includes("enviar") ||
            normalized.includes("guardar") ||
            normalized.includes("copiar") ||
            normalized.includes("consolid") ||
            normalized.includes("notificar")
        ) {

            indicators.push(
                "Se observan acciones repetitivas que podrían convertirse en reglas."
            );
        }

        let message =
            "<strong>🟢 Actividad válida.</strong> ";

        if (indicators.length > 0) {

            message +=
                indicators.join(" ");

        } else {

            message +=
                "La tarea puede descomponerse en entradas, reglas, acciones y resultado.";
        }

        message +=
            " Antes de seleccionar una herramienta, identifique qué parte se repite, qué reglas aplica y cómo verificar el resultado.";

        if (taskFeedback) {

            taskFeedback.innerHTML =
                message;

            taskFeedback.className =
                "task-feedback show success";

            taskFeedback.style.color =
                "#059669";

            taskFeedback.style.backgroundColor =
                "rgba(5, 150, 105, 0.08)";

            taskFeedback.style.border =
                "1px solid rgba(5, 150, 105, 0.25)";
        }

        if (analyzeTask) {

            const originalHTML =
                analyzeTask.innerHTML;

            analyzeTask.innerHTML =
                "Actividad guardada <span>✓</span>";

            analyzeTask.classList.add(
                "saved"
            );

            analyzeTask.disabled =
                true;

            setTimeout(
                () => {

                    analyzeTask.innerHTML =
                        originalHTML;

                    analyzeTask.classList.remove(
                        "saved"
                    );

                    analyzeTask.disabled =
                        false;

                },
                2200
            );
        }

        checkModuleCompletion();
    }

    if (analyzeTask) {

        analyzeTask.addEventListener(
            "click",
            analyzeAutomationTask
        );
    }

    /* =====================================================
       CARGAR ACTIVIDAD GUARDADA
    ====================================================== */

    function loadSavedTask() {

        if (!automationInput) {
            return;
        }

        const saved =
            getStorage(
                STORAGE_TASK
            );

        if (!saved) {
            return;
        }

        try {

            const data =
                JSON.parse(saved);

            if (
                data &&
                typeof data.task ===
                    "string"
            ) {

                const validation =
                    validateAutomationTask(
                        data.task
                    );

                if (validation.valid) {

                    automationInput.value =
                        data.task;

                    moduleState.activityCompleted =
                        true;

                    updateCounter();

                } else {

                    removeStorage(
                        STORAGE_TASK
                    );
                }
            }

        } catch (error) {

            console.warn(
                "No fue posible recuperar la actividad.",
                error
            );

            removeStorage(
                STORAGE_TASK
            );
        }
    }

    loadSavedTask();

    /* =====================================================
       LIMPIAR FEEDBACK AL EDITAR
    ====================================================== */

    if (automationInput) {

        automationInput.addEventListener(
            "input",
            () => {

                if (taskFeedback) {

                    taskFeedback.textContent =
                        "";

                    taskFeedback.innerHTML =
                        "";

                    taskFeedback.className =
                        "task-feedback";

                    taskFeedback.style.color =
                        "";

                    taskFeedback.style.backgroundColor =
                        "";

                    taskFeedback.style.border =
                        "";
                }

                moduleState.activityCompleted =
                    false;

                checkModuleCompletion();
            }
        );
    }

    /* =====================================================
       MEZCLAR OPCIONES DEL RETO
    ====================================================== */

    function shuffleChallengeOptions() {

        const container =
            document.querySelector(
                ".challenge-options"
            );

        if (!container) {

            console.warn(
                "No se encontró .challenge-options"
            );

            return;
        }

        let options =
            Array.from(
                container.querySelectorAll(
                    ".challenge-option"
                )
            );

        if (options.length <= 1) {
            return;
        }

        /* Fisher-Yates */

        for (
            let i =
                options.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );

            [
                options[i],
                options[j]
            ] =
            [
                options[j],
                options[i]
            ];
        }

        /* Reinserta en nuevo orden */

        options.forEach(
            option => {
                container.appendChild(
                    option
                );
            }
        );

        /* Actualizar letras */

        const letters = [
            "A",
            "B",
            "C",
            "D"
        ];

        options.forEach(
            (
                option,
                index
            ) => {

                const newLetter =
                    letters[index];

                const letterElement =
                    option.querySelector(
                        ".option-letter, " +
                        ".challenge-letter, " +
                        ".answer-letter"
                    );

                if (letterElement) {

                    letterElement.textContent =
                        newLetter;

                    letterElement.setAttribute(
                        "data-letter",
                        newLetter
                    );

                    return;
                }

                const dataLetterElement =
                    option.querySelector(
                        "[data-letter]"
                    );

                if (dataLetterElement) {

                    dataLetterElement.textContent =
                        newLetter;

                    dataLetterElement.setAttribute(
                        "data-letter",
                        newLetter
                    );

                    return;
                }

                const firstChild =
                    option.firstElementChild;

                if (firstChild) {

                    const firstText =
                        firstChild.textContent
                            .trim();

                    if (
                        /^[A-D]$/i.test(
                            firstText
                        )
                    ) {

                        firstChild.textContent =
                            newLetter;

                        return;
                    }

                    if (
                        /^[A-D][.)\-:]$/i.test(
                            firstText
                        )
                    ) {

                        firstChild.textContent =
                            `${newLetter}.`;

                        return;
                    }
                }

                const html =
                    option.innerHTML;

                if (
                    /^\s*[A-D][.)\-:]\s*/i.test(
                        html
                    )
                ) {

                    option.innerHTML =
                        html.replace(
                            /^\s*[A-D][.)\-:]\s*/i,
                            `${newLetter}. `
                        );

                    return;
                }

                option.dataset.optionLetter =
                    newLetter;
            }
        );

        challengeOptions =
            container.querySelectorAll(
                ".challenge-option"
            );

        console.log(
            "✓ Opciones del Módulo 04 mezcladas."
        );

        options.forEach(
            (
                option,
                index
            ) => {

                console.log(
                    `${letters[index]} → correcta:`,
                    option.dataset.correct === "true"
                );
            }
        );
    }

    /* =====================================================
       RETO
    ====================================================== */

    function resetChallengeOptions() {

        challengeOptions.forEach(
            option => {

                option.classList.remove(
                    "correct",
                    "incorrect"
                );
            }
        );
    }

    function answerChallenge(option) {

        if (!option) {
            return;
        }

        resetChallengeOptions();

        const isCorrect =
            option.dataset.correct ===
            "true";

        if (isCorrect) {

            option.classList.add(
                "correct"
            );

            const wasAlreadyCompleted =
                moduleState.challengeCompleted;

            moduleState.challengeCompleted =
                true;

            setStorage(
                STORAGE_CHALLENGE,
                "completado"
            );

            if (!wasAlreadyCompleted) {

                trackEventOnce(
                    "reto_aprobado",
                    "analytics_modulo4_reto",
                    {
                        modulo: "4"
                    }
                );
            }

            if (challengeFeedback) {

                challengeFeedback.className =
                    "challenge-feedback show correct";

                challengeFeedback.innerHTML =
                    "<strong>✓ Correcto.</strong> Antes de automatizar, primero debe documentar y comprender el flujo actual: entradas, reglas, pasos, excepciones y resultado esperado.";
            }

            checkModuleCompletion();

        } else {

            option.classList.add(
                "incorrect"
            );

            moduleState.challengeCompleted =
                false;

            removeStorage(
                STORAGE_CHALLENGE
            );

            if (challengeFeedback) {

                challengeFeedback.className =
                    "challenge-feedback show incorrect";

                challengeFeedback.innerHTML =
                    "<strong>✕ No es el primer paso.</strong> Antes de elegir una herramienta debe comprender y estructurar el proceso que desea automatizar.";
            }

            checkModuleCompletion();
        }
    }

    challengeOptions.forEach(
        option => {

            option.addEventListener(
                "click",
                () => {

                    answerChallenge(
                        option
                    );
                }
            );
        }
    );

    /* =====================================================
       CARGAR ESTADO DEL RETO
    ====================================================== */

    function loadChallengeState() {

        const savedChallenge =
            getStorage(
                STORAGE_CHALLENGE
            );

        if (
            savedChallenge ===
            "completado"
        ) {

            moduleState.challengeCompleted =
                true;

            resetChallengeOptions();

            if (challengeFeedback) {

                challengeFeedback.textContent =
                    "";

                challengeFeedback.innerHTML =
                    "";

                challengeFeedback.className =
                    "challenge-feedback";
            }
        }
    }

    loadChallengeState();

    /* =====================================================
       PROGRESO
    ====================================================== */

    function calculateProgress() {

        let completed = 0;

        if (
            moduleState.activityCompleted
        ) {
            completed++;
        }

        if (
            moduleState.challengeCompleted
        ) {
            completed++;
        }

        if (
            moduleState.moduleCompleted
        ) {
            completed++;
        }

        return Math.round(
            (
                completed /
                3
            ) * 100
        );
    }

    /* =====================================================
       ACTUALIZAR REQUISITOS
    ====================================================== */

    function updateRequirement(
        element,
        completed,
        completedText,
        pendingText
    ) {

        if (!element) {
            return;
        }

        const number =
            element.querySelector(
                ":scope > span"
            );

        const small =
            element.querySelector(
                "small"
            );

        element.classList.remove(
            "completed",
            "pending",
            "locked"
        );

        if (completed) {

            element.classList.add(
                "completed"
            );

            if (number) {
                number.textContent =
                    "✓";
            }

            if (small) {
                small.textContent =
                    completedText;
            }

        } else {

            element.classList.add(
                "pending"
            );

            if (small) {
                small.textContent =
                    pendingText;
            }
        }
    }

    /* =====================================================
       ACTUALIZAR INTERFAZ
    ====================================================== */

    function updateModuleUI() {

        const progress =
            calculateProgress();

        if (progressBar) {

            progressBar.style.width =
                `${progress}%`;

            progressBar.style.setProperty(
                "--progress",
                `${progress}%`
            );
        }

        if (progressPercentage) {

            progressPercentage.textContent =
                `${progress}%`;
        }

        updateRequirement(
            requirementActivity,
            moduleState.activityCompleted,
            "Completada",
            "Pendiente"
        );

        updateRequirement(
            requirementChallenge,
            moduleState.challengeCompleted,
            "Aprobado",
            "Pendiente"
        );

        if (requirementModule) {

            const number =
                requirementModule.querySelector(
                    ":scope > span"
                );

            const small =
                requirementModule.querySelector(
                    "small"
                );

            requirementModule.classList.remove(
                "completed",
                "pending",
                "locked"
            );

            if (
                moduleState.moduleCompleted
            ) {

                requirementModule.classList.add(
                    "completed"
                );

                if (number) {
                    number.textContent =
                        "✓";
                }

                if (small) {
                    small.textContent =
                        "Aprobado";
                }

            } else {

                requirementModule.classList.add(
                    "locked"
                );

                if (number) {
                    number.textContent =
                        "04";
                }

                if (small) {
                    small.textContent =
                        "Bloqueado";
                }
            }
        }

        if (
            moduleState.moduleCompleted
        ) {
            unlockNextModule();
        } else {
            lockNextModule();
        }

        saveCourseProgress(
            progress
        );
    }

    /* =====================================================
       GUARDAR PROGRESO GENERAL
    ====================================================== */

    function saveCourseProgress(
        moduleProgress
    ) {

        let courseProgress = {};

        try {

            const existing =
                getStorage(
                    STORAGE_PROGRESS
                );

            if (existing) {

                courseProgress =
                    JSON.parse(
                        existing
                    );
            }

        } catch (error) {

            courseProgress = {};
        }

        courseProgress.modulo4 = {

            actividad:
                moduleState.activityCompleted,

            reto:
                moduleState.challengeCompleted,

            completado:
                moduleState.moduleCompleted,

            progreso:
                moduleProgress
        };

        setStorage(
            STORAGE_PROGRESS,
            JSON.stringify(
                courseProgress
            )
        );
    }

    /* =====================================================
       COMPROBAR APROBACIÓN
    ====================================================== */

    function checkModuleCompletion() {

        const completed =
            moduleState.activityCompleted &&
            moduleState.challengeCompleted;

        if (completed) {

            const wasAlreadyCompleted =
                moduleState.moduleCompleted;

            moduleState.moduleCompleted =
                true;

            setStorage(
                STORAGE_MODULE,
                "completado"
            );

            if (!wasAlreadyCompleted) {

                trackEventOnce(
                    "modulo_completado",
                    "analytics_modulo4_completado",
                    {
                        modulo: "4",
                        nombre_modulo:
                            "Automatizar tareas y procesos"
                    }
                );
            }

        } else {

            moduleState.moduleCompleted =
                false;

            removeStorage(
                STORAGE_MODULE
            );
        }

        updateModuleUI();
    }

    /* =====================================================
       BLOQUEAR MÓDULO 05
    ====================================================== */

    function lockNextModule() {

        if (!nextModuleButton) {
            return;
        }

        nextModuleButton.setAttribute(
            "aria-disabled",
            "true"
        );

        nextModuleButton.classList.remove(
            "unlocked"
        );

        nextModuleButton.innerHTML = `
            Módulo 05 bloqueado
            <span>🔒</span>
        `;

        if (moduleComplete) {

            moduleComplete.classList.add(
                "blocked"
            );

            moduleComplete.classList.remove(
                "completed"
            );
        }

        if (completionLabel) {

            completionLabel.textContent =
                "MÓDULO 04 BLOQUEADO";
        }

        if (completionMessage) {

            completionMessage.textContent =
                "Complete la actividad práctica y el reto de comprensión para habilitar el Módulo 05.";
        }
    }

    /* =====================================================
       DESBLOQUEAR MÓDULO 05
    ====================================================== */

    function unlockNextModule() {

        if (!nextModuleButton) {
            return;
        }

        nextModuleButton.setAttribute(
            "aria-disabled",
            "false"
        );

        nextModuleButton.classList.add(
            "unlocked"
        );

        nextModuleButton.innerHTML = `
            Ir al Módulo 05
            <span>→</span>
        `;

        if (moduleComplete) {

            moduleComplete.classList.remove(
                "blocked"
            );

            moduleComplete.classList.add(
                "completed"
            );
        }

        if (completionLabel) {

            completionLabel.textContent =
                "MÓDULO 04 COMPLETADO";
        }

        if (completionMessage) {

            completionMessage.textContent =
                "Excelente. Completó la actividad y aprobó el reto. Ahora puede avanzar al Módulo 05.";
        }
    }

    /* =====================================================
       PROTEGER BOTÓN DEL MÓDULO 05
    ====================================================== */

    if (nextModuleButton) {

        nextModuleButton.addEventListener(
            "click",
            event => {

                if (
                    !moduleState.moduleCompleted
                ) {

                    event.preventDefault();

                    if (completionMessage) {

                        completionMessage.textContent =
                            "Primero debe completar la actividad y aprobar el reto final.";
                    }

                    return;
                }

                nextModuleButton.setAttribute(
                    "aria-disabled",
                    "false"
                );
            }
        );
    }

    /* =====================================================
       ANIMACIONES
    ====================================================== */

    const animatedElements =
        document.querySelectorAll(
            ".capability-card, " +
            ".method-step, " +
            ".responsibility-card, " +
            ".transformation-column, " +
            ".result-list > div"
        );

    if (
        "IntersectionObserver" in window
    ) {

        const observer =
            new IntersectionObserver(
                (
                    entries,
                    observerInstance
                ) => {

                    entries.forEach(
                        entry => {

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
                    threshold:
                        0.12
                }
            );

        animatedElements.forEach(
            (
                element,
                index
            ) => {

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
            element => {

                element.classList.add(
                    "is-visible"
                );
            }
        );
    }

    /* =====================================================
       ANCLAS SUAVES
    ====================================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(
            anchor => {

                anchor.addEventListener(
                    "click",
                    event => {

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

                        const header =
                            document.querySelector(
                                ".module-header"
                            );

                        const headerHeight =
                            header
                                ? header.offsetHeight
                                : 0;

                        const targetPosition =
                            target
                                .getBoundingClientRect()
                                .top +
                            window.scrollY -
                            headerHeight -
                            20;

                        window.scrollTo({
                            top:
                                targetPosition,
                            behavior:
                                "smooth"
                        });
                    }
                );
            }
        );

    /* =====================================================
       ESTADO INICIAL
    ====================================================== */

    const savedModule =
        getStorage(
            STORAGE_MODULE
        );

    if (
        savedModule ===
        "completado"
    ) {

        moduleState.moduleCompleted =
            true;
    }

    checkModuleCompletion();

    /* =====================================================
       PROTEGER ACCESO AL MÓDULO 04
    ====================================================== */

    protectModuleFour();

    /* =====================================================
       MEZCLAR OPCIONES DEL RETO
       ÚNICA LLAMADA
    ====================================================== */

    shuffleChallengeOptions();

    /* =====================================================
       INICIO
    ====================================================== */

    if (body) {

        body.classList.add(
            "js-ready"
        );
    }

    /* =====================================================
       LOG
    ====================================================== */

    console.log(
        "✓ El Empleado Aumentado — Módulo 04 cargado correctamente con Google Analytics."
    );

});