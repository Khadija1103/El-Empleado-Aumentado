/* =========================================================
   EL EMPLEADO AUMENTADO
   MÓDULO 02 — JAVASCRIPT COMPLETO
   VALIDACIÓN REAL + FEEDBACK + RETO ALEATORIO
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONFIGURACIÓN
    ====================================================== */

    const STORAGE_TASK =
        "empleadoAumentado_modulo2_task";

    const STORAGE_CHALLENGE =
        "empleadoAumentado_modulo2_reto";

    const STORAGE_MODULE =
        "empleadoAumentado_modulo2_completado";

    const STORAGE_PROGRESS =
        "empleadoAumentado_progreso";

    const STORAGE_MODULE1 =
        "empleadoAumentado_modulo1_completado";


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

    const taskInput =
        document.getElementById(
            "taskInput"
        );

    const characterCounter =
        document.getElementById(
            "characterCounter"
        );

    const saveTaskButton =
        document.getElementById(
            "saveTask"
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

        activityCompleted:
            false,

        challengeCompleted:
            false,

        moduleCompleted:
            false

    };


    /* =====================================================
       LOCALSTORAGE
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
       DETECTAR TEXTO REPETITIVO O BASURA
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
                    "La respuesta está vacía. Escriba una tarea o situación laboral concreta."
            };
        }


        if (
            value.length < 40
        ) {

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


        if (
            words.length < 7
        ) {

            return {
                invalid: true,
                message:
                    "La respuesta debe explicar con mayor detalle la tarea o situación laboral."
            };
        }


        if (
            /(.)\1{4,}/iu.test(
                value
            )
        ) {

            return {
                invalid: true,
                message:
                    "La respuesta contiene caracteres repetidos y no parece una respuesta válida."
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
                    "La respuesta repite demasiado las mismas palabras. Escriba una descripción real."
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
                    "La respuesta no parece contener una descripción real."
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
       VALIDAR CONTENIDO DE LA ACTIVIDAD
       TEMA:
       IA COMO ASISTENTE DE TRABAJO
    ====================================================== */

    function validateTaskContent(text) {

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


        const aiKeywords = [

            "ia",
            "inteligencia artificial",
            "artificial",
            "chatgpt",
            "copilot",
            "gemini",
            "claude",
            "asistente",
            "modelo",
            "herramienta",
            "prompt",
            "prompts",
            "automatizar",
            "generar",
            "analizar",
            "resumir",
            "clasificar",
            "redactar"

        ];


        const workKeywords = [

            "tarea",
            "trabajo",
            "proceso",
            "actividad",
            "cliente",
            "correo",
            "reporte",
            "informe",
            "documento",
            "reunion",
            "respuesta",
            "registro",
            "seguimiento",
            "informacion",
            "datos",
            "usuario",
            "servicio",
            "solicitud",
            "caso",
            "empleado"

        ];


        const actionKeywords = [

            "analizar",
            "analizo",
            "redactar",
            "redacto",
            "resumir",
            "resumo",
            "organizar",
            "organizo",
            "clasificar",
            "clasifico",
            "generar",
            "genero",
            "revisar",
            "reviso",
            "comparar",
            "comparo",
            "buscar",
            "busco",
            "extraer",
            "extraigo",
            "preparar",
            "preparo",
            "crear",
            "creo",
            "responder",
            "respondo",
            "automatizar",
            "automatizo",
            "mejorar",
            "mejoro",
            "identificar",
            "identifico",
            "procesar",
            "proceso"

        ];


        const resultKeywords = [

            "resultado",
            "tiempo",
            "error",
            "errores",
            "rapidez",
            "productividad",
            "calidad",
            "mejora",
            "mejorar",
            "ahorrar",
            "reducir",
            "facilitar",
            "apoyar",
            "eficiencia",
            "decision",
            "decidir",
            "productivo"

        ];


        const detectedAI =
            aiKeywords.filter(
                keyword =>
                    value.includes(
                        keyword
                    )
            );


        const detectedWork =
            workKeywords.filter(
                keyword =>
                    value.includes(
                        keyword
                    )
            );


        const detectedActions =
            actionKeywords.filter(
                keyword =>
                    value.includes(
                        keyword
                    )
            );


        const detectedResults =
            resultKeywords.filter(
                keyword =>
                    value.includes(
                        keyword
                    )
            );


        if (
            detectedAI.length <
            1
        ) {

            return {
                valid: false,
                message:
                    "La respuesta debe relacionarse con inteligencia artificial o con una herramienta de IA."
            };
        }


        if (
            detectedWork.length <
            1
        ) {

            return {
                valid: false,
                message:
                    "Describa una tarea, actividad o situación concreta de su trabajo."
            };
        }


        if (
            detectedActions.length <
            1
        ) {

            return {
                valid: false,
                message:
                    "Indique qué quiere hacer con la IA: analizar, resumir, redactar, organizar, revisar, generar, comparar o mejorar."
            };
        }


        if (
            detectedResults.length <
            1
        ) {

            return {
                valid: false,
                message:
                    "Indique qué resultado o beneficio espera obtener con el apoyo de la IA."
            };
        }


        return {
            valid: true,
            message:
                "La actividad contiene una situación laboral concreta y un uso pertinente de la IA."
        };
    }


    /* =====================================================
       FEEDBACK
       ROJO = INCORRECTO
       VERDE = CORRECTO
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


        if (
            type === "error"
        ) {

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
       VERIFICAR MÓDULO 1
    ====================================================== */

    function moduleOneIsCompleted() {

        return (
            getStorage(
                STORAGE_MODULE1
            ) ===
            "completado"
        );
    }


    function protectModuleTwo() {

        if (
            moduleOneIsCompleted()
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
                    🔒 Módulo 02 bloqueado
                </strong>

                <span>
                    Primero debe completar y aprobar el Módulo 01.
                </span>

                <a href="../modulo-1/index.html">
                    Ir al Módulo 01
                </a>

            </div>

        `;


        document.body.prepend(
            warning
        );


        document.body.classList.add(
            "module-access-blocked"
        );


        if (taskInput) {

            taskInput.disabled =
                true;
        }


        if (saveTaskButton) {

            saveTaskButton.disabled =
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
       MEZCLAR RETO
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
           FISHER-YATES
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
           REINSERTAR EN EL NUEVO ORDEN
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
                   Buscar elemento que representa
                   la letra de la opción
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
                   Buscar elemento con data-letter
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
                   Si el primer hijo es la letra
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
                   Si la opción empieza con A., B., C. o D.
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
                   Guardar la posición como respaldo
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
            "✓ Opciones del Módulo 02 mezcladas correctamente."
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


    function openModal(name) {

        const modal =
            document.getElementById(
                `modal-${name}`
            );


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

    function updateCharacterCounter() {

        if (
            !taskInput ||
            !characterCounter
        ) {

            return;
        }


        const currentLength =
            taskInput.value.length;


        const maxLength =
            taskInput.maxLength ||
            500;


        characterCounter.textContent =
            `${currentLength} / ${maxLength}`;
    }


    if (taskInput) {

        taskInput.addEventListener(
            "input",
            updateCharacterCounter
        );


        updateCharacterCounter();
    }


    /* =====================================================
       GUARDAR TAREA
    ====================================================== */

    function saveTask() {

        if (!taskInput) {
            return;
        }


        const task =
            taskInput.value.trim();


        const validation =
            validateTaskContent(
                task
            );


        /* =================================================
           INCORRECTA
        ================================================= */

        if (
            !validation.valid
        ) {

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


            taskInput.focus();


            return;
        }


        /* =================================================
           CORRECTA
        ================================================= */

        const savedTask = {

            task:
                task,

            module:
                "Módulo 02",

            createdAt:
                new Date().toISOString()

        };


        const saved =
            setStorage(
                STORAGE_TASK,
                JSON.stringify(
                    savedTask
                )
            );


        if (!saved) {

            showTaskFeedback(
                "🔴 No fue posible guardar la tarea.",
                "error"
            );


            return;
        }


        moduleState.activityCompleted =
            true;


        showTaskFeedback(
            "🟢 Tarea guardada correctamente. Actividad completada.",
            "success"
        );


        if (saveTaskButton) {

            saveTaskButton.innerHTML =
                "Guardado <span>✓</span>";


            saveTaskButton.classList.add(
                "saved"
            );


            setTimeout(
                () => {

                    saveTaskButton.innerHTML =
                        "Actualizar tarea <span>→</span>";


                    saveTaskButton.classList.remove(
                        "saved"
                    );

                },
                2500
            );
        }


        checkModuleCompletion();
    }


    if (saveTaskButton) {

        saveTaskButton.addEventListener(
            "click",
            saveTask
        );
    }


    /* =====================================================
       RECUPERAR TAREA
    ====================================================== */

    function loadSavedTask() {

        if (!taskInput) {
            return;
        }


        const storedTask =
            getStorage(
                STORAGE_TASK
            );


        if (!storedTask) {
            return;
        }


        try {

            const savedTask =
                JSON.parse(
                    storedTask
                );


            if (
                savedTask &&
                typeof savedTask.task ===
                    "string"
            ) {

                const validation =
                    validateTaskContent(
                        savedTask.task
                    );


                if (
                    validation.valid
                ) {

                    taskInput.value =
                        savedTask.task;


                    moduleState.activityCompleted =
                        true;


                    updateCharacterCounter();


                    if (saveTaskButton) {

                        saveTaskButton.innerHTML =
                            "Actualizar tarea <span>→</span>";
                    }

                } else {

                    removeStorage(
                        STORAGE_TASK
                    );
                }
            }

        } catch (error) {

            console.warn(
                "No fue posible recuperar la tarea guardada.",
                error
            );


            removeStorage(
                STORAGE_TASK
            );
        }
    }


    loadSavedTask();


    /* =====================================================
       LIMPIAR FEEDBACK AL ESCRIBIR
    ====================================================== */

    if (taskInput) {

        taskInput.addEventListener(
            "input",
            () => {

                if (taskFeedback) {

                    taskFeedback.textContent =
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
                    "✓ Correcto. La IA puede apoyar el trabajo, pero usted mantiene el control, aporta el contexto y revisa el resultado.";
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
                    "✕ No es la mejor opción. Recuerde que la IA debe utilizarse como apoyo y usted debe revisar y validar sus resultados.";
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
       RECUPERAR ESTADO DEL RETO
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
       REQUISITOS
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


        if (progressPercentage) {

            progressPercentage.textContent =
                `${progress}%`;
        }


        if (progressBar) {

            progressBar.style.width =
                `${progress}%`;


            progressBar.style.setProperty(
                "--progress",
                `${progress}%`
            );
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
       GUARDAR PROGRESO GENERAL
    ====================================================== */

    function saveCourseProgress() {

        let existingProgress =
            {};


        try {

            const stored =
                localStorage.getItem(
                    STORAGE_PROGRESS
                );


            if (stored) {

                existingProgress =
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


        existingProgress.modulo2 = {

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
                existingProgress
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
       BLOQUEAR SIGUIENTE
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

            Módulo 3 bloqueado

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
                "MÓDULO 02 BLOQUEADO";
        }


        if (completionMessage) {

            completionMessage.textContent =
                "Complete la actividad práctica y responda correctamente el reto para habilitar el Módulo 3.";
        }
    }


    /* =====================================================
       DESBLOQUEAR SIGUIENTE
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

            Ir al Módulo 3

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
                "MÓDULO 02 COMPLETADO";
        }


        if (completionMessage) {

            completionMessage.textContent =
                "¡Felicitaciones! Usted completó y aprobó el Módulo 2. Ahora puede continuar con el Módulo 3.";
        }
    }


    /* =====================================================
       PROTEGER ENLACE AL MÓDULO 3
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
                            "El Módulo 3 permanece bloqueado. Complete primero la actividad y el reto final.";
                    }
                }
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


                            entry.target.style.opacity =
                                "1";


                            entry.target.style.transform =
                                "translateY(0)";


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

                element.style.opacity =
                    "0";


                element.style.transform =
                    "translateY(25px)";


                element.style.transition =
                    `opacity 0.7s ease ${index * 0.06}s, ` +
                    `transform 0.7s ease ${index * 0.06}s`;


                observer.observe(
                    element
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
       SCROLL
       EL PROGRESO NO DEPENDE DEL SCROLL
    ====================================================== */

    function updateScrollProgress() {

        /* Intencionalmente vacío. */

    }


    window.addEventListener(
        "scroll",
        updateScrollProgress,
        {
            passive: true
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


    /* =====================================================
       PROTEGER ACCESO AL MÓDULO 02
    ====================================================== */

    protectModuleTwo();


    /* =====================================================
       COMPROBAR ESTADO
    ====================================================== */

    checkModuleCompletion();


    updateCharacterCounter();


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


    /* =====================================================
       LOG
    ====================================================== */

    console.log(
        "✓ El Empleado Aumentado — Módulo 02 cargado correctamente."
    );

});