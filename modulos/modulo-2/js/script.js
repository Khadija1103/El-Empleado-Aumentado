document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       MODALES DE CAPACIDADES
    ========================================================= */

    const modalButtons = document.querySelectorAll("[data-modal]");
    const modals = document.querySelectorAll(".modal");
    const modalCloseButtons = document.querySelectorAll(".modal-close");
    const modalOverlays = document.querySelectorAll(".modal-overlay");

    function openModal(name) {
        const modal = document.getElementById(`modal-${name}`);

        if (!modal) {
            return;
        }

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");

        document.body.classList.add("modal-open");
    }

    function closeModal(modal) {
        if (!modal) {
            return;
        }

        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");

        const activeModal = document.querySelector(".modal.active");

        if (!activeModal) {
            document.body.classList.remove("modal-open");
        }
    }

    modalButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const modalName = button.dataset.modal;

            openModal(modalName);
        });
    });

    modalCloseButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const modal = button.closest(".modal");

            closeModal(modal);
        });
    });

    modalOverlays.forEach((overlay) => {
        overlay.addEventListener("click", () => {
            const modal = overlay.closest(".modal");

            closeModal(modal);
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") {
            return;
        }

        const activeModal = document.querySelector(".modal.active");

        if (activeModal) {
            closeModal(activeModal);
        }
    });


    /* =========================================================
       CONTADOR DE CARACTERES
    ========================================================= */

    const taskInput = document.getElementById("taskInput");
    const characterCounter = document.getElementById("characterCounter");

    function updateCharacterCounter() {
        if (!taskInput || !characterCounter) {
            return;
        }

        const currentLength = taskInput.value.length;
        const maxLength = taskInput.maxLength;

        characterCounter.textContent =
            `${currentLength} / ${maxLength}`;
    }

    if (taskInput) {
        taskInput.addEventListener("input", updateCharacterCounter);

        updateCharacterCounter();
    }


    /* =========================================================
       GUARDAR TAREA
    ========================================================= */

    const saveTaskButton = document.getElementById("saveTask");
    const taskFeedback = document.getElementById("taskFeedback");

    function saveTask() {
        if (!taskInput || !taskFeedback) {
            return;
        }

        const task = taskInput.value.trim();

        if (!task) {
            taskFeedback.textContent =
                "Escriba una tarea antes de guardarla.";

            taskFeedback.style.color = "var(--red)";

            taskInput.focus();

            return;
        }

        const savedTask = {
            task: task,
            module: "Módulo 02",
            createdAt: new Date().toISOString()
        };

        try {
            localStorage.setItem(
                "empleadoAumentado_task",
                JSON.stringify(savedTask)
            );

            taskFeedback.textContent =
                "✓ Su tarea fue guardada correctamente.";

            taskFeedback.style.color = "var(--green)";

            saveTaskButton.innerHTML =
                'Guardado <span>✓</span>';

            setTimeout(() => {
                saveTaskButton.innerHTML =
                    'Guardar tarea <span>→</span>';
            }, 2000);

        } catch (error) {
            console.error("No fue posible guardar la tarea:", error);

            taskFeedback.textContent =
                "No fue posible guardar la tarea.";

            taskFeedback.style.color = "var(--red)";
        }
    }

    if (saveTaskButton) {
        saveTaskButton.addEventListener("click", saveTask);
    }


    /* =========================================================
       RECUPERAR TAREA GUARDADA
    ========================================================= */

    function loadSavedTask() {
        if (!taskInput || !taskFeedback) {
            return;
        }

        try {
            const storedTask =
                localStorage.getItem("empleadoAumentado_task");

            if (!storedTask) {
                return;
            }

            const savedTask = JSON.parse(storedTask);

            if (
                savedTask &&
                typeof savedTask.task === "string"
            ) {
                taskInput.value = savedTask.task;

                updateCharacterCounter();
            }

        } catch (error) {
            console.error(
                "No fue posible recuperar la tarea guardada:",
                error
            );
        }
    }

    loadSavedTask();


    /* =========================================================
       RETO FINAL
    ========================================================= */

    const challengeOptions =
        document.querySelectorAll(".challenge-option");

    const challengeFeedback =
        document.getElementById("challengeFeedback");

    function resetChallengeOptions() {
        challengeOptions.forEach((option) => {
            option.classList.remove(
                "correct",
                "incorrect"
            );
        });
    }

    challengeOptions.forEach((option) => {

        option.addEventListener("click", () => {

            resetChallengeOptions();

            const isCorrect =
                option.dataset.correct === "true";

            if (isCorrect) {

                option.classList.add("correct");

                if (challengeFeedback) {
                    challengeFeedback.className =
                        "challenge-feedback correct";

                    challengeFeedback.textContent =
                        "✓ Correcto. La IA apoya el análisis, pero usted mantiene el control y revisa el resultado.";
                }

            } else {

                option.classList.add("incorrect");

                if (challengeFeedback) {
                    challengeFeedback.className =
                        "challenge-feedback incorrect";

                    challengeFeedback.textContent =
                        "✕ No es la mejor opción. Recuerde proporcionar contexto, revisar la respuesta y mantener el criterio profesional.";
                }
            }

        });

    });


    /* =========================================================
       ANIMACIONES AL HACER SCROLL
    ========================================================= */

    const animatedElements = document.querySelectorAll(
        ".capability-card, " +
        ".method-step, " +
        ".responsibility-card, " +
        ".transformation-column, " +
        ".result-list > div"
    );

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            (entries, observerInstance) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.style.opacity = "1";
                    entry.target.style.transform =
                        "translateY(0)";

                    observerInstance.unobserve(
                        entry.target
                    );
                });

            },
            {
                threshold: 0.12
            }
        );

        animatedElements.forEach((element, index) => {

            element.style.opacity = "0";
            element.style.transform =
                "translateY(25px)";

            element.style.transition =
                `opacity 0.7s ease ${index * 0.06}s, ` +
                `transform 0.7s ease ${index * 0.06}s`;

            observer.observe(element);
        });

    }


    /* =========================================================
       ANCLAJES SUAVES
    ========================================================= */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach((link) => {

            link.addEventListener("click", (event) => {

                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(targetId);

                if (!target) {
                    return;
                }

                event.preventDefault();

                const header =
                    document.querySelector(".header");

                const headerHeight =
                    header
                        ? header.offsetHeight
                        : 0;

                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    headerHeight -
                    20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });

            });

        });


    /* =========================================================
       ESTADO DE CARGA
    ========================================================= */

    document.body.classList.add("js-ready");

});