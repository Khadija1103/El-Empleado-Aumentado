/* =========================================================
   EL EMPLEADO AUMENTADO
   MÓDULO 05 — JAVASCRIPT COMPLETO
   VALIDACIÓN REAL + FEEDBACK + RETO ALEATORIO
   CERTIFICACIÓN
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       STORAGE
    ====================================================== */

    const STORAGE_SOLUTION =
        "empleadoAumentado_modulo5_solution";

    const STORAGE_CHALLENGE =
        "empleadoAumentado_modulo5_reto";

    const STORAGE_MODULE =
        "empleadoAumentado_modulo5_completado";

    const STORAGE_PROGRESS =
        "empleadoAumentado_progreso";

    const STORAGE_CERTIFICATE =
        "datosCertificado";


    /* =====================================================
       ELEMENTOS PRINCIPALES
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

    const courseComplete =
        document.getElementById(
            "courseComplete"
        );

    const completionLabel =
        document.getElementById(
            "completionLabel"
        );

    const completionMessage =
        document.getElementById(
            "completionMessage"
        );

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
       STORAGE HELPERS
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
                    "La respuesta está vacía. Describa una solución concreta para un problema o proceso."
            };
        }


        if (
            value.length < 50
        ) {

            return {
                invalid: true,
                message:
                    "La respuesta es demasiado corta. Explique el problema, la solución propuesta y el resultado esperado."
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
            words.length < 9
        ) {

            return {
                invalid: true,
                message:
                    "Describa con mayor detalle el problema y cómo integraría la solución."
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
                    "La respuesta no parece contener una descripción real."
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
                    "La respuesta repite demasiado las mismas palabras. Escriba una descripción real de la solución."
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
       VALIDAR SOLUCIÓN DEL MÓDULO 5
    ====================================================== */

    function validateSolutionContent(
        text
    ) {

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


        const problemKeywords = [

            "problema",
            "problemas",
            "necesidad",
            "necesita",
            "dificultad",
            "error",
            "errores",
            "demora",
            "retraso",
            "tiempo",
            "repetitivo",
            "repetitiva",
            "ineficiente",
            "manual",
            "proceso"

        ];


        const dataKeywords = [

            "dato",
            "datos",
            "informacion",
            "excel",
            "reporte",
            "registro",
            "tabla",
            "indicador",
            "kpi",
            "medicion",
            "medir",
            "dashboard",
            "power bi",
            "base de datos"

        ];


        const aiKeywords = [

            "ia",
            "inteligencia artificial",
            "chatgpt",
            "copilot",
            "gemini",
            "claude",
            "modelo",
            "asistente",
            "prompt",
            "prompts"

        ];


        const automationKeywords = [

            "automatizar",
            "automatizacion",
            "automatico",
            "flujo",
            "workflow",
            "regla",
            "reglas",
            "bot",
            "robot",
            "integrar",
            "integracion",
            "sistema",
            "proceso"

        ];


        const resultKeywords = [

            "resultado",
            "mejora",
            "mejorar",
            "eficiencia",
            "productividad",
            "calidad",
            "tiempo",
            "reducir",
            "ahorrar",
            "control",
            "seguimiento",
            "decision",
            "decidir",
            "validar",
            "verificar"

        ];


        const detectedProblem =
            problemKeywords.filter(
                keyword =>
                    value.includes(
                        keyword
                    )
            );


        const detectedData =
            dataKeywords.filter(
                keyword =>
                    value.includes(
                        keyword
                    )
            );


        const detectedAI =
            aiKeywords.filter(
                keyword =>
                    value.includes(
                        keyword
                    )
            );


        const detectedAutomation =
            automationKeywords.filter(
                keyword =>
                    value.includes(
                        keyword
                    )
            );


        const detectedResult =
            resultKeywords.filter(
                keyword =>
                    value.includes(
                        keyword
                    )
            );


        if (
            detectedProblem.length <
            1
        ) {

            return {
                valid: false,
                message:
                    "Identifique primero el problema o necesidad que desea solucionar."
            };
        }


        const technologicalComponents =
            (
                detectedData.length > 0
                    ? 1
                    : 0
            ) +
            (
                detectedAI.length > 0
                    ? 1
                    : 0
            ) +
            (
                detectedAutomation.length > 0
                    ? 1
                    : 0
            );


        if (
            technologicalComponents <
            1
        ) {

            return {
                valid: false,
                message:
                    "La solución debe indicar cómo utilizaría datos, inteligencia artificial, automatización o alguna combinación de estas capacidades."
            };
        }


        if (
            detectedResult.length <
            1
        ) {

            return {
                valid: false,
                message:
                    "Explique qué resultado, mejora o beneficio espera obtener con la solución."
            };
        }


        if (
            technologicalComponents <
            2
        ) {

            return {
                valid: false,
                message:
                    "La actividad debe integrar al menos dos elementos entre datos, inteligencia artificial y automatización."
            };
        }


        return {
            valid: true,
            message:
                "La propuesta integra el problema, la tecnología y un resultado esperado."
        };
    }


    /* =====================================================
       FEEDBACK
    ====================================================== */

    function showSolutionFeedback(
        message,
        type = "success"
    ) {

        if (!solutionFeedback) {
            return;
        }


        solutionFeedback.className =
            "task-feedback show";


        if (
            type === "error"
        ) {

            solutionFeedback.classList.add(
                "error"
            );

            solutionFeedback.style.color =
                "#dc2626";

            solutionFeedback.style.backgroundColor =
                "rgba(220, 38, 38, 0.08)";

            solutionFeedback.style.border =
                "1px solid rgba(220, 38, 38, 0.25)";

        } else {

            solutionFeedback.classList.add(
                "success"
            );

            solutionFeedback.style.color =
                "#059669";

            solutionFeedback.style.backgroundColor =
                "rgba(5, 150, 105, 0.08)";

            solutionFeedback.style.border =
                "1px solid rgba(5, 150, 105, 0.25)";
        }


        solutionFeedback.textContent =
            message;
    }


    /* =====================================================
       VALIDAR ACCESO DESDE MÓDULO 04
    ====================================================== */

    function moduleFourIsCompleted() {

        return (
            getStorage(
                "empleadoAumentado_modulo4_completado"
            ) ===
            "completado"
        );
    }


    function protectModuleFive() {

        if (
            moduleFourIsCompleted()
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
                    🔒 Módulo 05 bloqueado
                </strong>

                <span>
                    Primero debe completar y aprobar el Módulo 04.
                </span>

                <a href="../modulo-4/index.html">
                    Ir al Módulo 04
                </a>

            </div>

        `;


        document.body.prepend(
            warning
        );


        document.body.classList.add(
            "module-access-blocked"
        );


        if (solutionInput) {

            solutionInput.disabled =
                true;
        }


        if (buildSolution) {

            buildSolution.disabled =
                true;
        }


        challengeOptions.forEach(
            option => {

                option.disabled =
                    true;

            }
        );


        if (certificateButton) {

            certificateButton.setAttribute(
                "aria-disabled",
                "true"
            );


            certificateButton.disabled =
                true;
        }


        if (generateCertificate) {

            generateCertificate.disabled =
                true;
        }
    }


    /* =====================================================
       MEZCLAR OPCIONES
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


        if (options.length <= 1) {
            return;
        }


        /* ---------------------------------------------
           MEZCLAR FÍSICAMENTE LOS BOTONES
        --------------------------------------------- */

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


        /* ---------------------------------------------
           VOLVER A INSERTAR EN ORDEN ALEATORIO
        --------------------------------------------- */

        options.forEach(
            option => {

                container.appendChild(
                    option
                );

            }
        );


        /* ---------------------------------------------
           ACTUALIZAR LETRAS VISIBLES
        --------------------------------------------- */

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


                /* -------------------------------------
                   CASO 1:
                   elemento con clases de letra
                ------------------------------------- */

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


                /* -------------------------------------
                   CASO 2:
                   elemento con data-letter
                ------------------------------------- */

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


                /* -------------------------------------
                   CASO 3:
                   primer elemento contiene A/B/C/D
                ------------------------------------- */

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


                /* -------------------------------------
                   CASO 4:
                   la opción empieza directamente
                   con A. B. C. D.
                ------------------------------------- */

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


                /* -------------------------------------
                   CASO 5:
                   guardar letra como atributo
                ------------------------------------- */

                option.dataset.optionLetter =
                    newLetter;
            }
        );


        /* ---------------------------------------------
           ACTUALIZAR REFERENCIA
        --------------------------------------------- */

        challengeOptions =
            container.querySelectorAll(
                ".challenge-option"
            );


        console.log(
            "✓ Opciones mezcladas correctamente."
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


            if (!activeModal) {
                return;
            }


            activeModal.classList.remove(
                "active"
            );


            activeModal.setAttribute(
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

    function updateSolutionCounter() {

        if (
            !solutionInput ||
            !solutionCounter
        ) {

            return;
        }


        const maximum =
            solutionInput.maxLength ||
            700;


        solutionCounter.textContent =
            `${solutionInput.value.length} / ${maximum}`;
    }


    if (solutionInput) {

        solutionInput.addEventListener(
            "input",
            updateSolutionCounter
        );
    }


    updateSolutionCounter();


    /* =====================================================
       ANALIZAR / GUARDAR SOLUCIÓN
    ====================================================== */

    function analyzeSolution() {

        if (!solutionInput) {
            return;
        }


        const text =
            solutionInput.value.trim();


        const validation =
            validateSolutionContent(
                text
            );


        if (
            !validation.valid
        ) {

            moduleState.activityCompleted =
                false;


            removeStorage(
                STORAGE_SOLUTION
            );


            showSolutionFeedback(
                `🔴 ${validation.message}`,
                "error"
            );


            checkModuleCompletion();


            solutionInput.focus();


            return;
        }


        const data = {

            solution:
                text,

            module:
                "Módulo 05 — Integrar soluciones",

            createdAt:
                new Date().toISOString()

        };


        const saved =
            setStorage(
                STORAGE_SOLUTION,
                JSON.stringify(
                    data
                )
            );


        if (!saved) {

            showSolutionFeedback(
                "🔴 No fue posible guardar la actividad.",
                "error"
            );


            return;
        }


        moduleState.activityCompleted =
            true;


        const normalized =
            normalizeText(
                text
            );


        const components = [];


        if (
            normalized.includes("dato") ||
            normalized.includes("excel") ||
            normalized.includes("reporte") ||
            normalized.includes("indicador") ||
            normalized.includes("kpi") ||
            normalized.includes("power bi")
        ) {

            components.push(
                "datos"
            );
        }


        if (
            normalized.includes("ia") ||
            normalized.includes(
                "inteligencia artificial"
            ) ||
            normalized.includes("chatgpt") ||
            normalized.includes("copilot") ||
            normalized.includes("gemini")
        ) {

            components.push(
                "inteligencia artificial"
            );
        }


        if (
            normalized.includes(
                "automat"
            ) ||
            normalized.includes(
                "workflow"
            ) ||
            normalized.includes(
                "flujo"
            ) ||
            normalized.includes(
                "regla"
            ) ||
            normalized.includes(
                "integrar"
            )
        ) {

            components.push(
                "automatización"
            );
        }


        let recommendation =
            "🟢 Solución válida. ";


        recommendation +=
            "Su propuesta identifica un problema y conecta recursos tecnológicos con un resultado esperado. ";


        if (
            components.length > 0
        ) {

            recommendation +=
                `Componentes identificados: ${components.join(", ")}. `;
        }


        recommendation +=
            "El siguiente paso es validar el flujo completo, comprobar los resultados y verificar que la solución realmente genere valor.";


        if (solutionFeedback) {

            solutionFeedback.textContent =
                recommendation;


            solutionFeedback.className =
                "task-feedback show success";


            solutionFeedback.style.color =
                "#059669";


            solutionFeedback.style.backgroundColor =
                "rgba(5, 150, 105, 0.08)";


            solutionFeedback.style.border =
                "1px solid rgba(5, 150, 105, 0.25)";
        }


        if (buildSolution) {

            const originalHTML =
                buildSolution.innerHTML;


            buildSolution.innerHTML =
                "Solución guardada <span>✓</span>";


            buildSolution.classList.add(
                "saved"
            );


            buildSolution.disabled =
                true;


            setTimeout(
                () => {

                    buildSolution.innerHTML =
                        originalHTML;


                    buildSolution.classList.remove(
                        "saved"
                    );


                    buildSolution.disabled =
                        false;

                },
                2200
            );
        }


        checkModuleCompletion();
    }


    if (buildSolution) {

        buildSolution.addEventListener(
            "click",
            analyzeSolution
        );
    }


    /* =====================================================
       RECUPERAR ACTIVIDAD
    ====================================================== */

    function loadSavedSolution() {

        if (!solutionInput) {
            return;
        }


        const saved =
            getStorage(
                STORAGE_SOLUTION
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
                typeof data.solution ===
                    "string"
            ) {

                const validation =
                    validateSolutionContent(
                        data.solution
                    );


                if (
                    validation.valid
                ) {

                    solutionInput.value =
                        data.solution;


                    moduleState.activityCompleted =
                        true;


                    updateSolutionCounter();

                } else {

                    removeStorage(
                        STORAGE_SOLUTION
                    );
                }
            }

        } catch (error) {

            console.warn(
                "No fue posible recuperar la actividad.",
                error
            );


            removeStorage(
                STORAGE_SOLUTION
            );
        }
    }


    loadSavedSolution();


    /* =====================================================
       LIMPIAR FEEDBACK AL EDITAR
    ====================================================== */

    if (solutionInput) {

        solutionInput.addEventListener(
            "input",
            () => {

                if (solutionFeedback) {

                    solutionFeedback.textContent =
                        "";

                    solutionFeedback.innerHTML =
                        "";

                    solutionFeedback.className =
                        "task-feedback";

                    solutionFeedback.style.color =
                        "";

                    solutionFeedback.style.backgroundColor =
                        "";

                    solutionFeedback.style.border =
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


                challengeFeedback.innerHTML =
                    "<strong>✓ Correcto.</strong> Una solución integrada conecta el problema con los datos, la IA y la automatización que realmente aportan valor, y después valida el resultado.";
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
                    "<strong>✕ No es la mejor opción.</strong> Integrar no significa acumular herramientas. Debe partir del problema y conectar únicamente los recursos que aportan valor.";
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


        courseProgress.modulo5 = {

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
                        "05";
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

            unlockCourse();

        } else {

            lockCourse();
        }


        saveCourseProgress(
            progress
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
       BLOQUEAR CURSO / CERTIFICADO
    ====================================================== */

    function lockCourse() {

        if (courseComplete) {

            courseComplete.classList.add(
                "blocked"
            );


            courseComplete.classList.remove(
                "completed"
            );
        }


        if (completionLabel) {

            completionLabel.textContent =
                "CURSO BLOQUEADO";
        }


        if (completionMessage) {

            completionMessage.textContent =
                "Complete la actividad práctica y apruebe el reto final para finalizar el curso y habilitar la certificación.";
        }


        if (certificateButton) {

            certificateButton.setAttribute(
                "aria-disabled",
                "true"
            );


            certificateButton.disabled =
                true;


            certificateButton.classList.remove(
                "unlocked"
            );


            certificateButton.innerHTML = `
                Certificado bloqueado
                <span>🔒</span>
            `;
        }


        if (certificateData) {

            certificateData.classList.remove(
                "unlocked"
            );


            certificateData.classList.add(
                "blocked"
            );
        }


        if (generateCertificate) {

            generateCertificate.disabled =
                true;
        }
    }


    /* =====================================================
       DESBLOQUEAR CURSO / CERTIFICADO
    ====================================================== */

    function unlockCourse() {

        if (courseComplete) {

            courseComplete.classList.remove(
                "blocked"
            );


            courseComplete.classList.add(
                "completed"
            );
        }


        if (completionLabel) {

            completionLabel.textContent =
                "CURSO COMPLETADO";
        }


        if (completionMessage) {

            completionMessage.textContent =
                "¡Felicitaciones! Completó y aprobó los cinco módulos. Ya puede generar su certificado de finalización.";
        }


        if (certificateButton) {

            certificateButton.setAttribute(
                "aria-disabled",
                "false"
            );


            certificateButton.disabled =
                false;


            certificateButton.classList.add(
                "unlocked"
            );


            certificateButton.innerHTML = `
                Obtener certificado
                <span>↓</span>
            `;
        }


        if (generateCertificate) {

            generateCertificate.disabled =
                false;
        }
    }


    /* =====================================================
       ABRIR FORMULARIO DEL CERTIFICADO
    ====================================================== */

    if (certificateButton) {

        certificateButton.addEventListener(
            "click",
            () => {

                if (
                    !moduleState.moduleCompleted
                ) {

                    return;
                }


                if (!certificateData) {

                    return;
                }


                certificateData.classList.remove(
                    "blocked"
                );


                certificateData.classList.add(
                    "unlocked"
                );


                certificateData.scrollIntoView({

                    behavior:
                        "smooth",

                    block:
                        "start"
                });


                setTimeout(
                    () => {

                        if (studentName) {

                            studentName.focus();
                        }

                    },
                    650
                );
            }
        );
    }


    /* =====================================================
       VALIDAR DATOS DEL CERTIFICADO
    ====================================================== */

    if (generateCertificate) {

        generateCertificate.addEventListener(
            "click",
            () => {

                if (
                    !moduleState.moduleCompleted
                ) {

                    return;
                }


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


                certificateFeedback.className =
                    "certificate-feedback";


                certificateFeedback.style.color =
                    "";


                if (
                    nombre === ""
                ) {

                    certificateFeedback.textContent =
                        "Por favor, escriba su nombre completo.";


                    certificateFeedback.className =
                        "certificate-feedback error";


                    studentName.focus();


                    return;
                }


                if (
                    nombre.length < 3
                ) {

                    certificateFeedback.textContent =
                        "El nombre debe contener al menos 3 caracteres.";


                    certificateFeedback.className =
                        "certificate-feedback error";


                    studentName.focus();


                    return;
                }


                if (
                    correo === ""
                ) {

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
                    !emailValido.test(
                        correo
                    )
                ) {

                    certificateFeedback.textContent =
                        "Ingrese un correo electrónico válido.";


                    certificateFeedback.className =
                        "certificate-feedback error";


                    studentEmail.focus();


                    return;
                }


                const fecha =
                    new Date();


                const fechaFormateada =
                    fecha.toLocaleDateString(
                        "es-CO",
                        {
                            day:
                                "2-digit",

                            month:
                                "long",

                            year:
                                "numeric"
                        }
                    );


                const codigo =
                    generarCodigoCertificado();


                const datosCertificado = {

                    nombre:
                        nombre,

                    correo:
                        correo,

                    fecha:
                        fechaFormateada,

                    codigo:
                        codigo,

                    curso:
                        "El Empleado Aumentado",

                    modulos:
                        5,

                    entidad:
                        "Corporación BÁRAKA",

                    nit:
                        "901844127-7"
                };


                const saved =
                    setStorage(
                        STORAGE_CERTIFICATE,
                        JSON.stringify(
                            datosCertificado
                        )
                    );


                if (!saved) {

                    certificateFeedback.textContent =
                        "No fue posible guardar los datos del certificado.";


                    certificateFeedback.className =
                        "certificate-feedback error";


                    return;
                }


                certificateFeedback.textContent =
                    "Certificado generado correctamente.";


                certificateFeedback.className =
                    "certificate-feedback success";


                mostrarCertificado(
                    datosCertificado
                );
            }
        );
    }


    /* =====================================================
       GENERAR CÓDIGO DE CERTIFICADO
    ====================================================== */

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


    /* =====================================================
       MOSTRAR CERTIFICADO
    ====================================================== */

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

                        <div class="certificate-header">

                            <div class="certificate-logo">

                                <img
                                    src="../../assets/logo.png"
                                    alt="Corporación BÁRAKA"
                                >

                            </div>


                            <div class="certificate-label">

                                CERTIFICADO
                                <br>
                                DE FINALIZACIÓN

                            </div>

                        </div>


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


                            <div class="certificate-details">

                                <div>

                                    <span>
                                        DURACIÓN
                                    </span>

                                    <strong>
                                        5 módulos
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        FECHA DE FINALIZACIÓN
                                    </span>

                                    <strong>
                                        ${escapeHTML(
                                            datos.fecha
                                        )}
                                    </strong>

                                </div>

                            </div>


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
                                        ${escapeHTML(
                                            datos.codigo
                                        )}
                                    </strong>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


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

            behavior:
                "smooth",

            block:
                "start"
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


    /* =====================================================
       ESCAPAR HTML
    ====================================================== */

    function escapeHTML(text) {

        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            text;


        return div.innerHTML;
    }


    /* =====================================================
       CARGAR CERTIFICADO GUARDADO
    ====================================================== */

    function loadSavedCertificate() {

        const saved =
            getStorage(
                STORAGE_CERTIFICATE
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
                typeof data.nombre ===
                    "string" &&
                typeof data.correo ===
                    "string" &&
                typeof data.codigo ===
                    "string"
            ) {

                if (studentName) {

                    studentName.value =
                        data.nombre;
                }


                if (studentEmail) {

                    studentEmail.value =
                        data.correo;
                }
            }

        } catch (error) {

            console.warn(
                "No fue posible recuperar el certificado.",
                error
            );
        }
    }


    loadSavedCertificate();


    /* =====================================================
       ANIMACIONES
    ====================================================== */

    const animatedElements =
        document.querySelectorAll(
            ".capability-card, " +
            ".method-step, " +
            ".responsibility-card, " +
            ".transformation-column, " +
            ".result-list > div, " +
            ".project-step"
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
       NAVEGACIÓN SUAVE
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
       PROTEGER ACCESO AL MÓDULO 05
    ====================================================== */

    protectModuleFive();


    /* =====================================================
       MEZCLAR OPCIONES DEL RETO
       IMPORTANTE:
       ESTA ES LA ÚNICA FUNCIÓN DE MEZCLA
    ====================================================== */

    shuffleChallengeOptions();


    /* =====================================================
       INICIO
    ====================================================== */

    body.classList.add(
        "js-ready"
    );


    console.log(
        "✓ El Empleado Aumentado — Módulo 05 cargado correctamente."
    );

});