/* =========================================================
   EL EMPLEADO AUMENTADO
   MÓDULO 01 — JAVASCRIPT COMPLETO
   VALIDACIÓN REAL + FEEDBACK + RETO ALEATORIO
   + GOOGLE ANALYTICS
========================================================= */

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
        "analytics_modulo1_visto",
        {
            modulo: "1",
            nombre_modulo: "Comprender el trabajo"
        }
    );

    /* =====================================================
       ELEMENTOS PRINCIPALES
    ====================================================== */

    const body =
        document.body;

    const startModule =
        document.getElementById(
            "startModule"
        );

    const processInput =
        document.getElementById(
            "processInput"
        );

    const inputCounter =
        document.getElementById(
            "inputCounter"
        );

    const saveProcess =
        document.getElementById(
            "saveProcess"
        );

    const processFeedback =
        document.getElementById(
            "processFeedback"
        );

    let challengeOptions =
        document.querySelectorAll(
            ".challenge-option"
        );

    const challengeFeedback =
        document.getElementById(
            "challengeFeedback"
        );

    const progressBar =
        document.getElementById(
            "progressBar"
        );

    const progressPercentage =
        document.getElementById(
            "progressPercentage"
        );

    const nextModuleButton =
        document.getElementById(
            "nextModuleButton"
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

    /* =====================================================
       ALMACENAMIENTO
    ====================================================== */

    const STORAGE_PROCESS =
        "empleadoAumentado_modulo1_proceso";

    const STORAGE_CHALLENGE =
        "empleadoAumentado_modulo1_reto";

    const STORAGE_MODULE =
        "empleadoAumentado_modulo1_completado";

    const STORAGE_PROGRESS =
        "empleadoAumentado_progreso";

    /* =====================================================
       ESTADO DEL MÓDULO
    ====================================================== */

    const moduleState = {
        activityCompleted: false,
        challengeCompleted: false,
        moduleCompleted: false
    };

    /* =====================================================
       LOCALSTORAGE
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
            localStorage.removeItem(
                key
            );

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
       DETECTAR TEXTO REPETITIVO / BASURA
    ====================================================== */

    function isClearlyInvalidText(text) {

        const value =
            normalizeText(text);

        const compact =
            value.replace(
                /\s/g,
                ""
            );

        /* Texto vacío */

        if (!value) {
            return {
                invalid: true,
                message:
                    "Escriba una descripción del proceso que desea analizar."
            };
        }

        /* Muy corto */

        if (value.length < 40) {
            return {
                invalid: true,
                message:
                    "La descripción es demasiado corta. Explique con mayor detalle el proceso o actividad."
            };
        }

        /* Menos de 7 palabras */

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
                    "Explique el proceso con mayor detalle. Escriba al menos siete palabras."
            };
        }

        /* Caracteres repetidos */

        if (
            /(.)\1{4,}/iu.test(
                value
            )
        ) {
            return {
                invalid: true,
                message:
                    "La respuesta contiene caracteres repetidos y no parece una descripción válida."
            };
        }

        /* Secuencias de teclado */

        const suspiciousPatterns = [
            "asdfgh",
            "qwerty",
            "zxcvbn",
            "poiuy",
            "lkjhg",
            "mnbvc"
        ];

        const suspicious =
            suspiciousPatterns.some(
                pattern =>
                    value.includes(
                        pattern
                    )
            );

        if (suspicious) {
            return {
                invalid: true,
                message:
                    "La respuesta no parece contener una descripción real del proceso."
            };
        }

        /* Una misma palabra repetida */

        const wordCount = {};

        words.forEach(
            word => {
                wordCount[word] =
                    (
                        wordCount[word] ||
                        0
                    ) + 1;
            }
        );

        const repetitions =
            Object.values(
                wordCount
            );

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
                    "La respuesta repite demasiado las mismas palabras. Escriba una descripción real del proceso."
            };
        }

        /* Exceso de números */

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
                    "La respuesta contiene demasiados números y no parece una descripción del proceso."
            };
        }

        /* Poca variedad */

        const uniqueCharacters =
            new Set(
                compact
            ).size;

        if (
            uniqueCharacters < 8
        ) {
            return {
                invalid: true,
                message:
                    "La respuesta no contiene suficiente variedad de contenido."
            };
        }

        /* Demasiados números */

        const digitRatio =
            numbers /
            Math.max(
                1,
                compact.length
            );

        if (
            digitRatio > 0.6
        ) {
            return {
                invalid: true,
                message:
                    "La respuesta debe ser una descripción escrita y no una secuencia de números."
            };
        }

        return {
            invalid: false,
            message: ""
        };
    }

    /* =====================================================
       VALIDACIÓN REAL DEL PROCESO
    ====================================================== */

    function validateProcessContent(text) {

        const value =
            normalizeText(
                text
            );

        const basicValidation =
            isClearlyInvalidText(
                text
            );

        if (
            basicValidation.invalid
        ) {
            return {
                valid: false,
                message:
                    basicValidation.message
            };
        }

        const processKeywords = [
            "proceso",
            "actividad",
            "tarea",
            "paso",
            "pasos",
            "procedimiento",
            "trabajo",
            "operacion",
            "operaciones",
            "cliente",
            "servicio",
            "problema",
            "error",
            "mejora",
            "mejorar",
            "resultado",
            "tiempo",
            "calidad",
            "seguimiento",
            "registro",
            "atencion",
            "flujo",
            "entrada",
            "salida",
            "recurso",
            "usuario",
            "solicitud",
            "entrega",
            "respuesta",
            "control",
            "gestion"
        ];

        const detectedKeywords =
            processKeywords.filter(
                keyword =>
                    value.includes(
                        keyword
                    )
            );

        if (
            detectedKeywords.length < 2
        ) {
            return {
                valid: false,
                message:
                    "La respuesta no parece estar relacionada con un proceso. Mencione elementos como una actividad, tarea, pasos, problema, cliente, tiempo, resultado o mejora."
            };
        }

        const actionKeywords = [
            "hacer",
            "realizar",
            "recibir",
            "registrar",
            "revisar",
            "atender",
            "analizar",
            "organizar",
            "controlar",
            "gestionar",
            "seguir",
            "verificar",
            "mejorar",
            "resolver",
            "medir",
            "reducir",
            "identificar",
            "ejecutar",
            "entregar",
            "preparar",
            "procesar",
            "coordinar",
            "validar"
        ];

        const hasAction =
            actionKeywords.some(
                keyword =>
                    value.includes(
                        keyword
                    )
            );

        if (!hasAction) {
            return {
                valid: false,
                message:
                    "Describa qué se hace en el proceso. Incluya al menos una acción concreta."
            };
        }

        return {
            valid: true,
            message:
                "La descripción del proceso es válida."
        };
    }

    /* =====================================================
       FEEDBACK
       ROJO = INCORRECTO
       VERDE = CORRECTO
    ====================================================== */

    function showProcessFeedback(
        message,
        type = "success"
    ) {

        if (!processFeedback) {
            return;
        }

        processFeedback.textContent =
            message;

        processFeedback.className =
            "process-feedback show";

        if (
            type === "error"
        ) {

            processFeedback.classList.add(
                "error"
            );

            processFeedback.style.color =
                "#dc2626";

            processFeedback.style.backgroundColor =
                "rgba(220, 38, 38, 0.08)";

            processFeedback.style.border =
                "1px solid rgba(220, 38, 38, 0.25)";

        } else {

            processFeedback.classList.add(
                "success"
            );

            processFeedback.style.color =
                "#059669";

            processFeedback.style.backgroundColor =
                "rgba(5, 150, 105, 0.08)";

            processFeedback.style.border =
                "1px solid rgba(5, 150, 105, 0.25)";
        }
    }

    /* =====================================================
       MEZCLAR OPCIONES DEL RETO
       LA CORRECTA PUEDE QUEDAR EN A, B, C O D
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

        if (
            options.length <= 1
        ) {
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

        /* Reinserta las opciones */

        options.forEach(
            option => {
                container.appendChild(
                    option
                );
            }
        );

        /* Actualizar letras A B C D */

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

                /* Clases para la letra */

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

                /* Elemento con data-letter */

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

                /* Primer hijo = letra */

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

                /* Letra directamente en HTML */

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

                /* Respaldo */

                option.dataset.optionLetter =
                    newLetter;
            }
        );

        challengeOptions =
            container.querySelectorAll(
                ".challenge-option"
            );

        console.log(
            "✓ Opciones del Módulo 01 mezcladas correctamente."
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
       CARGAR ESTADO DEL MÓDULO
    ====================================================== */

    function loadModuleState() {

        const savedProcess =
            getStorage(
                STORAGE_PROCESS
            );

        const savedChallenge =
            getStorage(
                STORAGE_CHALLENGE
            );

        const savedModule =
            getStorage(
                STORAGE_MODULE
            );

        if (
            savedProcess &&
            validateProcessContent(
                savedProcess
            ).valid
        ) {

            moduleState.activityCompleted =
                true;

        } else {

            moduleState.activityCompleted =
                false;
        }

        moduleState.challengeCompleted =
            savedChallenge ===
            "completado";

        moduleState.moduleCompleted =
            savedModule ===
            "completado";
    }

    /* =====================================================
       GUARDAR PROGRESO GENERAL
    ====================================================== */

    function saveCourseProgress() {

        let progress = {};

        try {

            const stored =
                localStorage.getItem(
                    STORAGE_PROGRESS
                );

            if (stored) {

                progress =
                    JSON.parse(
                        stored
                    );
            }

        } catch (error) {

            console.warn(
                "No fue posible leer el progreso general.",
                error
            );
        }

        progress.modulo1 = {

            actividad:
                moduleState.activityCompleted,

            reto:
                moduleState.challengeCompleted,

            completado:
                moduleState.moduleCompleted
        };

        setStorage(
            STORAGE_PROGRESS,
            JSON.stringify(
                progress
            )
        );
    }

    /* =====================================================
       CALCULAR PROGRESO
    ====================================================== */

    function calculateModuleProgress() {

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
            calculateModuleProgress();

        if (progressBar) {

            progressBar.style.setProperty(
                "--progress",
                `${progress}%`
            );

            progressBar.style.width =
                `${progress}%`;
        }

        if (progressPercentage) {

            progressPercentage.textContent =
                `${progress}%`;
        }

        updateRequirement(
            requirementActivity,
            moduleState.activityCompleted,
            "Actividad completada",
            "Pendiente"
        );

        updateRequirement(
            requirementChallenge,
            moduleState.challengeCompleted,
            "Reto completado",
            "Pendiente"
        );

        updateRequirement(
            requirementModule,
            moduleState.moduleCompleted,
            "Módulo aprobado",
            "Bloqueado"
        );

        if (
            moduleState.moduleCompleted
        ) {

            unlockNextModule();

        } else {

            lockNextModule();
        }

        saveCourseProgress();
    }

    /* =====================================================
       BLOQUEAR MÓDULO 2
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
            Módulo 2 bloqueado
            <span>
                🔒
            </span>
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
                "MÓDULO 01 BLOQUEADO";
        }

        if (completionMessage) {

            completionMessage.textContent =
                "Complete la actividad práctica y el reto de comprensión para habilitar el siguiente módulo.";
        }
    }

    /* =====================================================
       DESBLOQUEAR MÓDULO 2
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
            Ir al Módulo 2
            <span>
                →
            </span>
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
                "MÓDULO 01 COMPLETADO";
        }

        if (completionMessage) {

            completionMessage.textContent =
                "¡Felicitaciones! Usted completó y aprobó el Módulo 1. Ahora puede continuar con el Módulo 2.";
        }
    }

    /* =====================================================
       CONTROL DEL ENLACE AL MÓDULO 2
    ====================================================== */

    if (nextModuleButton) {

        nextModuleButton.addEventListener(
            "click",
            event => {

                if (
                    !moduleState.moduleCompleted
                ) {

                    event.preventDefault();

                    if (
                        completionMessage
                    ) {

                        completionMessage.textContent =
                            "El Módulo 2 permanece bloqueado. Complete la actividad práctica y responda correctamente el reto.";
                    }

                    if (moduleComplete) {

                        moduleComplete.animate(
                            [
                                {
                                    transform:
                                        "translateX(0)"
                                },
                                {
                                    transform:
                                        "translateX(-6px)"
                                },
                                {
                                    transform:
                                        "translateX(6px)"
                                },
                                {
                                    transform:
                                        "translateX(0)"
                                }
                            ],
                            {
                                duration:
                                    350
                            }
                        );
                    }
                }
            }
        );
    }

    /* =====================================================
       INICIO DEL MÓDULO
    ====================================================== */

    if (startModule) {

        startModule.addEventListener(
            "click",
            () => {

                trackEventOnce(
                    "inicio_modulo",
                    "analytics_modulo1_inicio",
                    {
                        modulo: "1"
                    }
                );

                const introduction =
                    document.getElementById(
                        "introduccion"
                    );

                if (introduction) {

                    introduction.scrollIntoView({
                        behavior:
                            "smooth",
                        block:
                            "start"
                    });
                }
            }
        );
    }

    /* =====================================================
       MODALES
    ====================================================== */

    const modalTriggers =
        document.querySelectorAll(
            ".modal-trigger"
        );

    const modals =
        document.querySelectorAll(
            ".modal"
        );

    const modalCloseButtons =
        document.querySelectorAll(
            ".modal-close"
        );

    const modalOverlays =
        document.querySelectorAll(
            ".modal-overlay"
        );

    function openModal(modal) {

        if (!modal) {
            return;
        }

        modal.classList.add(
            "active"
        );

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        body.classList.add(
            "modal-open"
        );

        const closeButton =
            modal.querySelector(
                ".modal-close"
            );

        if (closeButton) {

            setTimeout(
                () => {
                    closeButton.focus();
                },
                100
            );
        }
    }

    function closeModal(modal) {

        if (!modal) {
            return;
        }

        modal.classList.remove(
            "active"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        const activeModal =
            document.querySelector(
                ".modal.active"
            );

        if (!activeModal) {

            body.classList.remove(
                "modal-open"
            );
        }
    }

    function closeAllModals() {

        modals.forEach(
            modal => {

                modal.classList.remove(
                    "active"
                );

                modal.setAttribute(
                    "aria-hidden",
                    "true"
                );
            }
        );

        body.classList.remove(
            "modal-open"
        );
    }

    modalTriggers.forEach(
        trigger => {

            trigger.addEventListener(
                "click",
                () => {

                    const modalId =
                        trigger.getAttribute(
                            "data-modal"
                        );

                    if (!modalId) {
                        return;
                    }

                    const modal =
                        document.getElementById(
                            modalId
                        );

                    openModal(
                        modal
                    );
                }
            );
        }
    );

    modalCloseButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    closeModal(
                        button.closest(
                            ".modal"
                        )
                    );
                }
            );
        }
    );

    modalOverlays.forEach(
        overlay => {

            overlay.addEventListener(
                "click",
                () => {

                    closeModal(
                        overlay.closest(
                            ".modal"
                        )
                    );
                }
            );
        }
    );

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !==
                "Escape"
            ) {
                return;
            }

            const activeModal =
                document.querySelector(
                    ".modal.active"
                );

            if (activeModal) {

                closeModal(
                    activeModal
                );
            }
        }
    );

    /* =====================================================
       CONTADOR
    ====================================================== */

    function updateCounter() {

        if (
            !processInput ||
            !inputCounter
        ) {
            return;
        }

        const length =
            processInput.value.length;

        const maximum =
            processInput.maxLength ||
            1500;

        inputCounter.textContent =
            `${length} / ${maximum}`;
    }

    if (processInput) {

        processInput.addEventListener(
            "input",
            updateCounter
        );

        updateCounter();
    }

    /* =====================================================
       GUARDAR PROCESO
    ====================================================== */

    function saveUserProcess() {

        if (!processInput) {
            return;
        }

        const value =
            processInput.value.trim();

        const validation =
            validateProcessContent(
                value
            );

        /* INCORRECTA */

        if (
            !validation.valid
        ) {

            moduleState.activityCompleted =
                false;

            removeStorage(
                STORAGE_PROCESS
            );

            showProcessFeedback(
                `🔴 ${validation.message}`,
                "error"
            );

            checkModuleCompletion();

            processInput.focus();

            return;
        }

        /* CORRECTA */

        const saved =
            setStorage(
                STORAGE_PROCESS,
                value
            );

        if (!saved) {

            showProcessFeedback(
                "🔴 No fue posible guardar la información en este navegador.",
                "error"
            );

            return;
        }

        const wasAlreadyCompleted =
            moduleState.activityCompleted;

        moduleState.activityCompleted =
            true;

        showProcessFeedback(
            "🟢 Proceso guardado correctamente. Actividad completada.",
            "success"
        );

        if (!wasAlreadyCompleted) {

            trackEventOnce(
                "actividad_completada",
                "analytics_modulo1_actividad",
                {
                    modulo: "1",
                    actividad: "descripcion_proceso"
                }
            );
        }

        if (saveProcess) {

            saveProcess.textContent =
                "Proceso guardado ✓";

            saveProcess.classList.add(
                "saved"
            );

            setTimeout(
                () => {

                    saveProcess.textContent =
                        "Actualizar proceso";

                    saveProcess.classList.remove(
                        "saved"
                    );

                },
                2500
            );
        }

        checkModuleCompletion();
    }

    if (saveProcess) {

        saveProcess.addEventListener(
            "click",
            saveUserProcess
        );
    }

    /* =====================================================
       RECUPERAR PROCESO
    ====================================================== */

    function restoreProcess() {

        if (!processInput) {
            return;
        }

        const savedProcess =
            getStorage(
                STORAGE_PROCESS
            );

        if (!savedProcess) {
            return;
        }

        const validation =
            validateProcessContent(
                savedProcess
            );

        if (
            validation.valid
        ) {

            processInput.value =
                savedProcess;

            moduleState.activityCompleted =
                true;

            updateCounter();

            showProcessFeedback(
                "🟢 Proceso guardado previamente recuperado.",
                "success"
            );

            if (saveProcess) {

                saveProcess.textContent =
                    "Actualizar proceso";
            }

        } else {

            moduleState.activityCompleted =
                false;
        }
    }

    restoreProcess();

    /* =====================================================
       LIMPIAR FEEDBACK AL ESCRIBIR
    ====================================================== */

    if (processInput) {

        processInput.addEventListener(
            "input",
            () => {

                if (processFeedback) {

                    processFeedback.textContent =
                        "";

                    processFeedback.className =
                        "process-feedback";

                    processFeedback.style.color =
                        "";

                    processFeedback.style.backgroundColor =
                        "";

                    processFeedback.style.border =
                        "";
                }

                moduleState.activityCompleted =
                    false;

                checkModuleCompletion();

                if (saveProcess) {

                    saveProcess.textContent =
                        "Guardar proceso";

                    saveProcess.classList.remove(
                        "saved"
                    );
                }
            }
        );
    }

    /* =====================================================
       FOCUS DEL TEXTAREA
    ====================================================== */

    if (processInput) {

        processInput.addEventListener(
            "focus",
            () => {

                processInput.classList.add(
                    "input-active"
                );
            }
        );

        processInput.addEventListener(
            "blur",
            () => {

                processInput.classList.remove(
                    "input-active"
                );
            }
        );
    }

    /* =====================================================
       CTRL + ENTER
    ====================================================== */

    if (processInput) {

        processInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.ctrlKey &&
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    saveUserProcess();
                }
            }
        );
    }

    /* =====================================================
       RETO DEL MÓDULO
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
                    "analytics_modulo1_reto",
                    {
                        modulo: "1"
                    }
                );
            }

            if (challengeFeedback) {

                challengeFeedback.className =
                    "challenge-feedback show correct";

                challengeFeedback.textContent =
                    "✓ Correcto. Primero debemos comprender y mejorar el proceso antes de decidir qué tecnología utilizar.";
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

                challengeFeedback.textContent =
                    "✕ Aún no. Antes de comprar o desarrollar una herramienta, debemos comprender qué está ocurriendo en el proceso.";
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
       CARGAR RETO GUARDADO
    ====================================================== */

    function loadChallengeState() {

        const completed =
            getStorage(
                STORAGE_CHALLENGE
            );

        if (
            completed ===
            "completado"
        ) {

            moduleState.challengeCompleted =
                true;

            resetChallengeOptions();

            if (challengeFeedback) {

                challengeFeedback.textContent =
                    "";

                challengeFeedback.className =
                    "challenge-feedback";
            }
        }
    }

    loadChallengeState();

    /* =====================================================
       VERIFICAR FINALIZACIÓN
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
                    "analytics_modulo1_completado",
                    {
                        modulo: "1",
                        nombre_modulo: "Comprender el trabajo"
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
       ANIMACIONES
    ====================================================== */

    const revealElements =
        document.querySelectorAll(
            ".learning-card, " +
            ".definition-card, " +
            ".question-item, " +
            ".improvement-item, " +
            ".transformation-column, " +
            ".result-card, " +
            ".activity-card, " +
            ".process-map"
        );

    revealElements.forEach(
        element => {

            element.classList.add(
                "scroll-reveal"
            );
        }
    );

    if (
        "IntersectionObserver" in window
    ) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "is-visible"
                                );

                                observer.unobserve(
                                    entry.target
                                );
                            }
                        }
                    );
                },
                {
                    threshold:
                        0.12,

                    rootMargin:
                        "0px 0px -40px 0px"
                }
            );

        revealElements.forEach(
            element => {

                observer.observe(
                    element
                );
            }
        );

    } else {

        revealElements.forEach(
            element => {

                element.classList.add(
                    "is-visible"
                );
            }
        );
    }

    /* =====================================================
       NAVEGACIÓN SUAVE
    ====================================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    event => {

                        const targetId =
                            link.getAttribute(
                                "href"
                            );

                        if (
                            !targetId ||
                            targetId === "#"
                        ) {
                            return;
                        }

                        const target =
                            document.querySelector(
                                targetId
                            );

                        if (!target) {
                            return;
                        }

                        event.preventDefault();

                        target.scrollIntoView({
                            behavior:
                                "smooth",

                            block:
                                "start"
                        });
                    }
                );
            }
        );

    /* =====================================================
       MAPA DE PROCESOS
    ====================================================== */

    const mapSteps =
        document.querySelectorAll(
            ".map-step"
        );

    mapSteps.forEach(
        (
            step,
            index
        ) => {

            step.addEventListener(
                "mouseenter",
                () => {

                    mapSteps.forEach(
                        (
                            otherStep,
                            otherIndex
                        ) => {

                            if (
                                otherIndex <
                                index
                            ) {

                                otherStep.style.opacity =
                                    "0.5";
                            }
                        }
                    );
                }
            );

            step.addEventListener(
                "mouseleave",
                () => {

                    mapSteps.forEach(
                        otherStep => {

                            otherStep.style.opacity =
                                "";
                        }
                    );
                }
            );
        }
    );

    /* =====================================================
       MODALES — SCROLL
    ====================================================== */

    modals.forEach(
        modal => {

            modal.addEventListener(
                "wheel",
                event => {

                    if (
                        event.target ===
                        modal
                    ) {

                        event.preventDefault();
                    }
                },
                {
                    passive:
                        false
                }
            );
        }
    );

    /* =====================================================
       LIMPIAR MODALES AL SALIR
    ====================================================== */

    window.addEventListener(
        "beforeunload",
        () => {
            closeAllModals();
        }
    );

    /* =====================================================
       ESTADO INICIAL
    ====================================================== */

    loadModuleState();

    checkModuleCompletion();

    updateCounter();

    /* =====================================================
       MEZCLAR OPCIONES
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
        "✓ El Empleado Aumentado — Módulo 01 cargado correctamente con Google Analytics."
    );

});