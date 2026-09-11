/* =========================================================
   EL EMPLEADO AUMENTADO
   MÓDULO 03 — JAVASCRIPT COMPLETO
   VALIDACIÓN REAL + FEEDBACK + RETO ALEATORIO
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONFIGURACIÓN Y STORAGE
    ====================================================== */

    const STORAGE_INDICATOR =
        "empleadoAumentado_modulo3_indicator";

    const STORAGE_CHALLENGE =
        "empleadoAumentado_modulo3_reto";

    const STORAGE_MODULE =
        "empleadoAumentado_modulo3_completado";

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

    const indicatorInput =
        document.getElementById(
            "indicatorInput"
        );

    const indicatorCounter =
        document.getElementById(
            "indicatorCounter"
        );

    const saveIndicator =
        document.getElementById(
            "saveIndicator"
        );

    const indicatorFeedback =
        document.getElementById(
            "indicatorFeedback"
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
       ESTADO DEL MÓDULO
    ====================================================== */

    const moduleState = {

        activityCompleted:
            false,

        challengeCompleted:
            false,

        moduleCompleted:
            false

    };


    /* =====================================================
       STORAGE
    ====================================================== */

    function getStorage(key) {

        try {

            return localStorage.getItem(
                key
            );

        } catch (error) {

            console.warn(
                `No fue posible leer ${key}.`,
                error
            );

            return null;
        }
    }


    function setStorage(
        key,
        value
    ) {

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
       DETECTAR TEXTO INVÁLIDO
    ====================================================== */

    function detectInvalidText(text) {

        const value =
            normalizeText(text);

        const compact =
            value.replace(
                /\s/g,
                ""
            );


        if (!value) {

            return {
                invalid: true,
                message:
                    "La respuesta está vacía. Escriba un indicador relacionado con los datos de una actividad o proceso."
            };
        }


        if (
            value.length < 35
        ) {

            return {
                invalid: true,
                message:
                    "La respuesta es demasiado corta. Explique el indicador y qué información permite conocer."
            };
        }


        const words =
            value
                .split(" ")
                .filter(
                    word =>
                        word.length > 1
                );


        if (
            words.length < 6
        ) {

            return {
                invalid: true,
                message:
                    "Escriba una explicación más completa del indicador."
            };
        }


        if (
            /(.)\1{4,}/iu.test(value)
        ) {

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
                    value.includes(
                        pattern
                    )
            )
        ) {

            return {
                invalid: true,
                message:
                    "La respuesta no parece contener información real."
            };
        }


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


        const highestRepetition =
            Math.max(
                ...Object.values(
                    wordCount
                )
            );


        if (
            highestRepetition >= 4 &&
            highestRepetition >=
                words.length / 2
        ) {

            return {
                invalid: true,
                message:
                    "La respuesta repite demasiado las mismas palabras. Explique el indicador con contenido real."
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
                    "La respuesta contiene demasiados números y no parece una explicación válida."
            };
        }


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


        return {
            invalid: false,
            message: ""
        };
    }


    /* =====================================================
       VALIDAR INDICADOR
       TEMA:
       DATOS PARA TOMAR DECISIONES
    ====================================================== */

    function validateIndicatorContent(text) {

        const basicValidation =
            detectInvalidText(
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


        const value =
            normalizeText(
                text
            );


        const dataKeywords = [

            "dato",
            "datos",
            "indicador",
            "kpi",
            "medicion",
            "medir",
            "medida",
            "registro",
            "informacion",
            "numero",
            "cantidad",
            "porcentaje",
            "promedio",
            "tasa",
            "valor",
            "frecuencia"

        ];


        const processKeywords = [

            "proceso",
            "actividad",
            "tarea",
            "servicio",
            "cliente",
            "ventas",
            "atencion",
            "tiempo",
            "calidad",
            "entrega",
            "respuesta",
            "operacion",
            "operaciones",
            "seguimiento",
            "productividad",
            "empleado",
            "caso",
            "solicitud"

        ];


        const decisionKeywords = [

            "decision",
            "decidir",
            "decisiones",
            "mejora",
            "mejorar",
            "problema",
            "problemas",
            "control",
            "analizar",
            "analisis",
            "comparar",
            "comparacion",
            "seguimiento",
            "resultado",
            "evaluar",
            "evaluacion",
            "gestionar",
            "priorizar"

        ];


        const detectedData =
            dataKeywords.filter(
                keyword =>
                    value.includes(
                        keyword
                    )
            );


        const detectedProcess =
            processKeywords.filter(
                keyword =>
                    value.includes(
                        keyword
                    )
            );


        const detectedDecision =
            decisionKeywords.filter(
                keyword =>
                    value.includes(
                        keyword
                    )
            );


        if (
            detectedData.length <
            1
        ) {

            return {
                valid: false,
                message:
                    "La respuesta debe relacionarse con un dato, indicador, medición o KPI."
            };
        }


        if (
            detectedProcess.length <
            1
        ) {

            return {
                valid: false,
                message:
                    "Relacione el indicador con una actividad, proceso o situación real."
            };
        }


        if (
            detectedDecision.length <
            1
        ) {

            return {
                valid: false,
                message:
                    "Explique qué decisión, análisis, mejora o seguimiento puede realizarse con ese indicador."
            };
        }


        return {
            valid: true,
            message:
                "El indicador está relacionado con datos, un proceso y la toma de decisiones."
        };
    }


    /* =====================================================
       FEEDBACK
       ROJO = INCORRECTO
       VERDE = CORRECTO
    ====================================================== */

    function showIndicatorFeedback(
        message,
        type = "success"
    ) {

        if (!indicatorFeedback) {
            return;
        }


        indicatorFeedback.textContent =
            message;


        indicatorFeedback.className =
            "task-feedback show";


        if (
            type === "error"
        ) {

            indicatorFeedback.classList.add(
                "error"
            );


            indicatorFeedback.style.color =
                "#dc2626";


            indicatorFeedback.style.backgroundColor =
                "rgba(220, 38, 38, 0.08)";


            indicatorFeedback.style.border =
                "1px solid rgba(220, 38, 38, 0.25)";

        } else {

            indicatorFeedback.classList.add(
                "success"
            );


            indicatorFeedback.style.color =
                "#059669";


            indicatorFeedback.style.backgroundColor =
                "rgba(5, 150, 105, 0.08)";


            indicatorFeedback.style.border =
                "1px solid rgba(5, 150, 105, 0.25)";
        }
    }


    /* =====================================================
       VALIDAR ACCESO DESDE MÓDULO 02
    ====================================================== */

    function moduleTwoIsCompleted() {

        return (
            getStorage(
                "empleadoAumentado_modulo2_completado"
            ) ===
            "completado"
        );
    }


    function protectModuleThree() {

        if (
            moduleTwoIsCompleted()
        ) {

            return;
        }


        const warning =
            document.createElement(
                "div"
            );


        warning.innerHTML = `

            <div class="module-access-message">

                <strong>
                    🔒 Módulo 03 bloqueado
                </strong>

                <span>
                    Primero debe completar y aprobar el Módulo 02.
                </span>

                <a href="../modulo-2/index.html">
                    Ir al Módulo 02
                </a>

            </div>

        `;


        document.body.prepend(
            warning
        );


        document.body.classList.add(
            "module-access-blocked"
        );


        if (indicatorInput) {

            indicatorInput.disabled =
                true;
        }


        if (saveIndicator) {

            saveIndicator.disabled =
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


        /* =================================================
           MEZCLA ALEATORIA
        ================================================== */

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


        /* =================================================
           REINSERTAR EN NUEVO ORDEN
        ================================================== */

        options.forEach(
            option => {

                container.appendChild(
                    option
                );

            }
        );


        /* =================================================
           ACTUALIZAR LETRAS A B C D
        ================================================== */

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


                /* -----------------------------------------
                   CLASES COMUNES PARA LA LETRA
                ----------------------------------------- */

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


                /* -----------------------------------------
                   ELEMENTO CON DATA-LETTER
                ----------------------------------------- */

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


                /* -----------------------------------------
                   PRIMER HIJO = LETRA
                ----------------------------------------- */

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


                /* -----------------------------------------
                   LETRA DENTRO DEL HTML
                   EJEMPLO: A. Texto...
                ----------------------------------------- */

                const html =
                    option.innerHTML;


                if (
                    /^[\s]*[A-D][.)\-:]\s*/i.test(
                        html
                    )
                ) {

                    option.innerHTML =
                        html.replace(
                            /^[\s]*[A-D][.)\-:]\s*/i,
                            `${newLetter}. `
                        );

                    return;
                }


                /* -----------------------------------------
                   GUARDAR POSICIÓN COMO RESPALDO
                ----------------------------------------- */

                option.dataset.optionLetter =
                    newLetter;
            }
        );


        /* =================================================
           ACTUALIZAR REFERENCIA
        ================================================== */

        challengeOptions =
            container.querySelectorAll(
                ".challenge-option"
            );


        console.log(
            "✓ Opciones del Módulo 03 mezcladas correctamente."
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
       MODALES
    ====================================================== */

    const modalButtons =
        document.querySelectorAll(
            "[data-modal]"
        );

    const modalCloseButtons =
        document.querySelectorAll(
            ".modal-close"
        );

    const modalOverlays =
        document.querySelectorAll(
            ".modal-overlay"
        );

    let lastFocusedElement =
        null;


    function openModal(name) {

        const modal =
            document.getElementById(
                `modal-${name}`
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


    modalButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    openModal(
                        button.dataset.modal
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

    function updateIndicatorCounter() {

        if (
            !indicatorInput ||
            !indicatorCounter
        ) {

            return;
        }


        const maximum =
            indicatorInput.maxLength ||
            500;


        indicatorCounter.textContent =
            `${indicatorInput.value.length} / ${maximum}`;
    }


    if (indicatorInput) {

        indicatorInput.addEventListener(
            "input",
            updateIndicatorCounter
        );

        updateIndicatorCounter();
    }


    /* =====================================================
       GUARDAR INDICADOR
    ====================================================== */

    function saveIndicatorData() {

        if (!indicatorInput) {
            return;
        }


        const indicator =
            indicatorInput.value.trim();


        const validation =
            validateIndicatorContent(
                indicator
            );


        if (
            !validation.valid
        ) {

            moduleState.activityCompleted =
                false;


            removeStorage(
                STORAGE_INDICATOR
            );


            showIndicatorFeedback(
                `🔴 ${validation.message}`,
                "error"
            );


            checkModuleCompletion();


            indicatorInput.focus();


            return;
        }


        const data = {

            indicator:
                indicator,

            module:
                "Módulo 03 — Datos para tomar decisiones",

            createdAt:
                new Date().toISOString()

        };


        const saved =
            setStorage(
                STORAGE_INDICATOR,
                JSON.stringify(
                    data
                )
            );


        if (!saved) {

            showIndicatorFeedback(
                "🔴 No fue posible guardar el indicador.",
                "error"
            );


            return;
        }


        moduleState.activityCompleted =
            true;


        showIndicatorFeedback(
            "🟢 Indicador guardado correctamente. Actividad completada.",
            "success"
        );


        if (saveIndicator) {

            const originalHTML =
                saveIndicator.innerHTML;


            saveIndicator.innerHTML =
                "Guardado <span>✓</span>";


            saveIndicator.classList.add(
                "saved"
            );


            saveIndicator.disabled =
                true;


            setTimeout(
                () => {

                    saveIndicator.innerHTML =
                        originalHTML;


                    saveIndicator.classList.remove(
                        "saved"
                    );


                    saveIndicator.disabled =
                        false;

                },
                2200
            );
        }


        checkModuleCompletion();
    }


    if (saveIndicator) {

        saveIndicator.addEventListener(
            "click",
            saveIndicatorData
        );
    }


    /* =====================================================
       RECUPERAR INDICADOR
    ====================================================== */

    function loadSavedIndicator() {

        if (!indicatorInput) {
            return;
        }


        const saved =
            getStorage(
                STORAGE_INDICATOR
            );


        if (!saved) {
            return;
        }


        try {

            const data =
                JSON.parse(
                    saved
                );


            if (
                data &&
                typeof data.indicator ===
                    "string"
            ) {

                const validation =
                    validateIndicatorContent(
                        data.indicator
                    );


                if (
                    validation.valid
                ) {

                    indicatorInput.value =
                        data.indicator;


                    moduleState.activityCompleted =
                        true;


                    updateIndicatorCounter();

                } else {

                    removeStorage(
                        STORAGE_INDICATOR
                    );
                }
            }

        } catch (error) {

            console.warn(
                "No fue posible recuperar el indicador.",
                error
            );


            removeStorage(
                STORAGE_INDICATOR
            );
        }
    }


    loadSavedIndicator();


    /* =====================================================
       LIMPIAR FEEDBACK AL EDITAR
    ====================================================== */

    if (indicatorInput) {

        indicatorInput.addEventListener(
            "input",
            () => {

                if (indicatorFeedback) {

                    indicatorFeedback.textContent =
                        "";

                    indicatorFeedback.className =
                        "task-feedback";

                    indicatorFeedback.style.color =
                        "";

                    indicatorFeedback.style.backgroundColor =
                        "";

                    indicatorFeedback.style.border =
                        "";
                }


                moduleState.activityCompleted =
                    false;


                checkModuleCompletion();
            }
        );
    }


    /* =====================================================
       RETO FINAL
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


            moduleState.challengeCompleted =
                true;


            setStorage(
                STORAGE_CHALLENGE,
                "completado"
            );


            if (challengeFeedback) {

                challengeFeedback.className =
                    "challenge-feedback show correct";


                challengeFeedback.textContent =
                    "✓ Correcto. Un resultado debe compararse, contextualizarse y validarse antes de convertirse en una conclusión o decisión.";
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
                    "✕ Esa opción no representa un análisis profesional. Primero debe comparar, contextualizar e investigar antes de concluir.";
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
       RECUPERAR RETO
    ====================================================== */

    function loadChallengeState() {

        const challenge =
            getStorage(
                STORAGE_CHALLENGE
            );


        if (
            challenge ===
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
       CALCULAR PROGRESO
    ====================================================== */

    function calculateProgress() {

        let completed =
            0;


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
       ACTUALIZAR REQUISITO
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
            "Actividad completada",
            "Pendiente"
        );


        updateRequirement(
            requirementChallenge,
            moduleState.challengeCompleted,
            "Reto completado",
            "Pendiente"
        );


        if (requirementModule) {

            requirementModule.classList.remove(
                "completed",
                "pending",
                "locked"
            );


            const number =
                requirementModule.querySelector(
                    ":scope > span"
                );


            const small =
                requirementModule.querySelector(
                    "small"
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
                        "03";
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

        let courseProgress =
            {};


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

            courseProgress =
                {};
        }


        courseProgress.modulo3 = {

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
       COMPLETAR MÓDULO
    ====================================================== */

    function checkModuleCompletion() {

        const completed =
            moduleState.activityCompleted &&
            moduleState.challengeCompleted;


        if (completed) {

            moduleState.moduleCompleted =
                true;


            setStorage(
                STORAGE_MODULE,
                "completado"
            );

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
       BLOQUEAR MÓDULO 04
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

            Módulo 04 bloqueado

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
                "MÓDULO 03 BLOQUEADO";
        }


        if (completionMessage) {

            completionMessage.textContent =
                "Complete la actividad práctica y el reto de comprensión para habilitar el siguiente módulo.";
        }
    }


    /* =====================================================
       DESBLOQUEAR MÓDULO 04
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

            Ir al Módulo 04

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
                "MÓDULO 03 COMPLETADO";
        }


        if (completionMessage) {

            completionMessage.textContent =
                "Excelente. Completó la actividad y aprobó el reto. Ahora puede avanzar al Módulo 04.";
        }
    }


    /* =====================================================
       PROTEGER BOTÓN DEL MÓDULO 04
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
       ANCLAJES SUAVES
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


    protectModuleThree();

    checkModuleCompletion();

    updateIndicatorCounter();


    /* =====================================================
       MEZCLAR OPCIONES
       ÚNICA LLAMADA
    ====================================================== */

    shuffleChallengeOptions();


    /* =====================================================
       INICIO
    ====================================================== */

    body.classList.add(
        "js-ready"
    );


    console.log(
        "✓ El Empleado Aumentado — Módulo 03 cargado correctamente."
    );

});