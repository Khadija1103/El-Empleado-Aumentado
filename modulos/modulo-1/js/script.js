/* =========================================================
   EL EMPLEADO AUMENTADO
   MÓDULO 01 — JAVASCRIPT COMPLETO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTOS PRINCIPALES
    ====================================================== */

    const body = document.body;

    const startModule = document.getElementById("startModule");

    const processInput = document.getElementById("processInput");
    const inputCounter = document.getElementById("inputCounter");
    const saveProcess = document.getElementById("saveProcess");
    const processFeedback = document.getElementById("processFeedback");

    const challengeOptions =
        document.querySelectorAll(".challenge-option");

    const challengeFeedback =
        document.getElementById("challengeFeedback");

    const progressBar =
        document.getElementById("progressBar");


    /* =====================================================
       INICIO DEL MÓDULO
    ====================================================== */

    if (startModule) {
        startModule.addEventListener("click", () => {

            const introduction =
                document.getElementById("introduccion");

            if (introduction) {
                introduction.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

        });
    }


    /* =====================================================
       MODALES
    ====================================================== */

    const modalTriggers =
        document.querySelectorAll(".modal-trigger");

    const modals =
        document.querySelectorAll(".modal");

    const modalCloseButtons =
        document.querySelectorAll(".modal-close");

    const modalOverlays =
        document.querySelectorAll(".modal-overlay");


    function openModal(modal) {

        if (!modal) return;

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");

        body.classList.add("modal-open");

        const closeButton =
            modal.querySelector(".modal-close");

        if (closeButton) {
            setTimeout(() => {
                closeButton.focus();
            }, 100);
        }
    }


    function closeModal(modal) {

        if (!modal) return;

        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");

        const activeModal =
            document.querySelector(".modal.active");

        if (!activeModal) {
            body.classList.remove("modal-open");
        }
    }


    function closeAllModals() {

        modals.forEach(modal => {
            modal.classList.remove("active");
            modal.setAttribute("aria-hidden", "true");
        });

        body.classList.remove("modal-open");
    }


    modalTriggers.forEach(trigger => {

        trigger.addEventListener("click", () => {

            const modalId =
                trigger.getAttribute("data-modal");

            if (!modalId) return;

            const modal =
                document.getElementById(modalId);

            openModal(modal);

        });

    });


    modalCloseButtons.forEach(button => {

        button.addEventListener("click", () => {

            const modal =
                button.closest(".modal");

            closeModal(modal);

        });

    });


    modalOverlays.forEach(overlay => {

        overlay.addEventListener("click", () => {

            const modal =
                overlay.closest(".modal");

            closeModal(modal);

        });

    });


    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            const activeModal =
                document.querySelector(".modal.active");

            if (activeModal) {
                closeModal(activeModal);
            }

        }

    });


    /* =====================================================
       CONTADOR DEL PROCESO
    ====================================================== */

    function updateCounter() {

        if (!processInput || !inputCounter) return;

        const length =
            processInput.value.length;

        const maximum =
            processInput.maxLength || 1500;

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

    const STORAGE_PROCESS =
        "empleadoAumentado_modulo1_proceso";


    function showProcessFeedback(
        message,
        type = "success"
    ) {

        if (!processFeedback) return;

        processFeedback.textContent =
            message;

        processFeedback.className =
            "process-feedback";

        processFeedback.classList.add(type);

    }


    function saveUserProcess() {

        if (!processInput) return;

        const value =
            processInput.value.trim();

        if (value.length < 10) {

            showProcessFeedback(
                "Escriba una descripción más completa del proceso.",
                "error"
            );

            processInput.focus();

            return;
        }


        try {

            localStorage.setItem(
                STORAGE_PROCESS,
                value
            );

        } catch (error) {

            showProcessFeedback(
                "No fue posible guardar la información en este navegador.",
                "error"
            );

            return;
        }


        showProcessFeedback(
            "✓ Proceso guardado correctamente. Ahora puede continuar con el análisis.",
            "success"
        );


        if (saveProcess) {

            saveProcess.textContent =
                "Proceso guardado ✓";

            saveProcess.classList.add(
                "saved"
            );

            setTimeout(() => {

                saveProcess.textContent =
                    "Actualizar proceso";

                saveProcess.classList.remove(
                    "saved"
                );

            }, 2500);

        }

    }


    if (saveProcess) {

        saveProcess.addEventListener(
            "click",
            saveUserProcess
        );

    }


    /* =====================================================
       RECUPERAR PROCESO GUARDADO
    ====================================================== */

    function restoreProcess() {

        if (!processInput) return;

        try {

            const savedProcess =
                localStorage.getItem(
                    STORAGE_PROCESS
                );

            if (savedProcess) {

                processInput.value =
                    savedProcess;

                updateCounter();

                showProcessFeedback(
                    "Proceso guardado previamente recuperado.",
                    "success"
                );

            }

        } catch (error) {

            console.warn(
                "No fue posible recuperar el proceso.",
                error
            );

        }

    }


    restoreProcess();


    /* =====================================================
       LIMPIAR FEEDBACK AL EDITAR
    ====================================================== */

    if (processInput) {

        processInput.addEventListener(
            "input",
            () => {

                if (processFeedback) {
                    processFeedback.textContent = "";
                }

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
       CTRL + ENTER PARA GUARDAR
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

    const STORAGE_CHALLENGE =
        "empleadoAumentado_modulo1_reto";


    /*
       IMPORTANTE:
       Al cargar la página NO se muestra ninguna respuesta.

       Todas las opciones comienzan limpias.
       La respuesta solamente aparece después
       de que el estudiante haga clic.
    */

    challengeOptions.forEach(option => {

        option.classList.remove(
            "correct",
            "incorrect"
        );

    });


    if (challengeFeedback) {
        challengeFeedback.textContent = "";
    }


    function answerChallenge(option) {

        if (!option) return;


        challengeOptions.forEach(item => {

            item.classList.remove(
                "correct",
                "incorrect"
            );

        });


        const isCorrect =
            option.dataset.correct === "true";


        if (isCorrect) {

            option.classList.add(
                "correct"
            );


            if (challengeFeedback) {

                challengeFeedback.textContent =
                    "✓ Correcto. Primero debemos comprender y mejorar el proceso antes de decidir qué tecnología utilizar.";

            }


            try {

                localStorage.setItem(
                    STORAGE_CHALLENGE,
                    "completado"
                );

            } catch (error) {

                console.warn(
                    "No fue posible guardar el resultado del reto.",
                    error
                );

            }


        } else {

            option.classList.add(
                "incorrect"
            );


            if (challengeFeedback) {

                challengeFeedback.textContent =
                    "Aún no. Antes de comprar o desarrollar una herramienta, debemos comprender qué está ocurriendo en el proceso.";

            }

        }

    }


    challengeOptions.forEach(option => {

        option.addEventListener(
            "click",
            () => {

                answerChallenge(option);

            }
        );

    });


    /* =====================================================
       IMPORTANTE:
       NO SE RESTAURA VISUALMENTE EL RETO AL CARGAR.

       El localStorage solamente conserva que el reto
       fue completado, pero NO pinta la respuesta correcta
       automáticamente.
    ====================================================== */

    function restoreChallenge() {

        try {

            const completed =
                localStorage.getItem(
                    STORAGE_CHALLENGE
                );

            if (completed === "completado") {

                /*
                   Se conserva el registro de que fue completado,
                   pero visualmente el reto permanece sin responder
                   hasta que el estudiante seleccione una opción.
                */

                if (challengeFeedback) {
                    challengeFeedback.textContent = "";
                }

                challengeOptions.forEach(option => {

                    option.classList.remove(
                        "correct",
                        "incorrect"
                    );

                });

            }

        } catch (error) {

            console.warn(
                "No fue posible recuperar el reto.",
                error
            );

        }

    }


    restoreChallenge();


    /* =====================================================
       NAVEGACIÓN SUAVE
    ====================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const targetId =
                        link.getAttribute("href");

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


                    if (!target) return;

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        });


    /* =====================================================
       ANIMACIONES AL HACER SCROLL
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


    revealElements.forEach(element => {

        element.classList.add(
            "scroll-reveal"
        );

    });


    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "is-visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -40px 0px"
                }
            );


        revealElements.forEach(element => {

            observer.observe(element);

        });

    } else {

        revealElements.forEach(element => {

            element.classList.add(
                "is-visible"
            );

        });

    }


    /* =====================================================
       BARRA DE PROGRESO
    ====================================================== */

    function updateProgress() {

        if (!progressBar) return;


        const scrollTop =
            window.scrollY;

        const documentHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;


        if (documentHeight <= 0) {

            progressBar.style.width =
                "20%";

            return;

        }


        const percentage =
            scrollTop / documentHeight;


        const progress =
            Math.min(
                100,
                Math.max(
                    20,
                    20 + percentage * 80
                )
            );


        progressBar.style.width =
            `${progress}%`;

    }


    window.addEventListener(
        "scroll",
        updateProgress,
        { passive: true }
    );


    updateProgress();


    /* =====================================================
       MAPA DE PROCESOS — INTERACCIÓN
    ====================================================== */

    const mapSteps =
        document.querySelectorAll(
            ".map-step"
        );


    mapSteps.forEach((step, index) => {

        step.addEventListener(
            "mouseenter",
            () => {

                mapSteps.forEach(
                    (otherStep, otherIndex) => {

                        if (
                            otherIndex < index
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

    });


    /* =====================================================
       EVITAR SCROLL DE FONDO EN MODALES
    ====================================================== */

    modals.forEach(modal => {

        modal.addEventListener(
            "wheel",
            event => {

                if (
                    event.target === modal
                ) {

                    event.preventDefault();

                }

            },
            { passive: false }
        );

    });


    /* =====================================================
       CERRAR MODAL AL CAMBIAR DE PÁGINA
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

    body.classList.add(
        "module-loaded"
    );


    /* =====================================================
       LOG DE INICIO
    ====================================================== */

    console.log(
        "✓ El Empleado Aumentado — Módulo 01 cargado correctamente."
    );

});