document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       BARRA DE PROGRESO
    ========================================================= */

    const progressBar =
        document.getElementById("progressBar");

    function updateProgress() {

        if (!progressBar) {
            return;
        }

        const documentHeight =
            document.documentElement.scrollHeight;

        const viewportHeight =
            window.innerHeight;

        const scrollableHeight =
            documentHeight - viewportHeight;

        if (scrollableHeight <= 0) {

            progressBar.style.width = "100%";

            return;
        }

        const scrollTop =
            window.scrollY;

        const progress =
            (scrollTop / scrollableHeight) * 100;

        progressBar.style.width =
            `${Math.min(100, Math.max(0, progress))}%`;
    }

    window.addEventListener(
        "scroll",
        updateProgress,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        updateProgress
    );

    updateProgress();


    /* =========================================================
       MODALES
    ========================================================= */

    const modalButtons =
        document.querySelectorAll("[data-modal]");

    const modalCloseButtons =
        document.querySelectorAll(".modal-close");

    const modalOverlays =
        document.querySelectorAll(".modal-overlay");

    let lastFocusedElement = null;


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

        modal.classList.add("active");

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

        modal.classList.remove("active");

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
                typeof lastFocusedElement.focus === "function"
            ) {
                lastFocusedElement.focus();
            }

            lastFocusedElement = null;
        }
    }


    modalButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                openModal(
                    button.dataset.modal
                );

            }
        );

    });


    modalCloseButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                closeModal(
                    button.closest(".modal")
                );

            }
        );

    });


    modalOverlays.forEach((overlay) => {

        overlay.addEventListener(
            "click",
            () => {

                closeModal(
                    overlay.closest(".modal")
                );

            }
        );

    });


    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key !== "Escape") {
                return;
            }

            const activeModal =
                document.querySelector(
                    ".modal.active"
                );

            if (activeModal) {
                closeModal(activeModal);
            }

        }
    );


    /* =========================================================
       INDICADOR
    ========================================================= */

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


    function updateIndicatorCounter() {

        if (
            !indicatorInput ||
            !indicatorCounter
        ) {
            return;
        }

        indicatorCounter.textContent =
            `${indicatorInput.value.length} / ${indicatorInput.maxLength}`;
    }


    if (indicatorInput) {

        indicatorInput.addEventListener(
            "input",
            updateIndicatorCounter
        );

        updateIndicatorCounter();
    }


    function saveIndicatorData() {

        if (
            !indicatorInput ||
            !indicatorFeedback
        ) {
            return;
        }

        const indicator =
            indicatorInput.value.trim();


        if (!indicator) {

            indicatorFeedback.textContent =
                "Escriba un indicador antes de guardarlo.";

            indicatorFeedback.style.color =
                "var(--red)";

            indicatorInput.focus();

            return;
        }


        const data = {

            indicator,

            module:
                "Módulo 03 — Datos para tomar decisiones",

            createdAt:
                new Date().toISOString()
        };


        try {

            localStorage.setItem(
                "empleadoAumentado_indicator",
                JSON.stringify(data)
            );


            indicatorFeedback.textContent =
                "✓ Indicador guardado correctamente.";

            indicatorFeedback.style.color =
                "var(--green)";


            if (saveIndicator) {

                const originalHTML =
                    saveIndicator.innerHTML;

                saveIndicator.innerHTML =
                    'Guardado <span>✓</span>';

                saveIndicator.disabled =
                    true;

                setTimeout(() => {

                    saveIndicator.innerHTML =
                        originalHTML;

                    saveIndicator.disabled =
                        false;

                }, 2200);
            }


        } catch (error) {

            console.error(
                "Error al guardar el indicador:",
                error
            );

            indicatorFeedback.textContent =
                "No fue posible guardar el indicador.";

            indicatorFeedback.style.color =
                "var(--red)";
        }
    }


    if (saveIndicator) {

        saveIndicator.addEventListener(
            "click",
            saveIndicatorData
        );

    }


    /* =========================================================
       RECUPERAR INDICADOR
    ========================================================= */

    function loadSavedIndicator() {

        if (!indicatorInput) {
            return;
        }

        try {

            const saved =
                localStorage.getItem(
                    "empleadoAumentado_indicator"
                );

            if (!saved) {
                return;
            }

            const data =
                JSON.parse(saved);

            if (
                data &&
                typeof data.indicator === "string"
            ) {

                indicatorInput.value =
                    data.indicator;

                updateIndicatorCounter();
            }

        } catch (error) {

            console.error(
                "No fue posible recuperar el indicador:",
                error
            );
        }
    }

    loadSavedIndicator();


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
                    option.dataset.correct === "true";


                if (isCorrect) {

                    option.classList.add(
                        "correct"
                    );

                    if (challengeFeedback) {

                        challengeFeedback.className =
                            "challenge-feedback correct";

                        challengeFeedback.textContent =
                            "✓ Correcto. Un cambio en un indicador debe analizarse dentro de su contexto y validarse antes de convertirlo en una conclusión o una decisión.";
                    }

                } else {

                    option.classList.add(
                        "incorrect"
                    );

                    if (challengeFeedback) {

                        challengeFeedback.className =
                            "challenge-feedback incorrect";

                        challengeFeedback.textContent =
                            "✕ Una variación puede ser una señal importante, pero no demuestra por sí sola cuál es la causa. Primero hay que comparar, contextualizar y validar.";
                    }
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


    if (
        "IntersectionObserver" in window
    ) {

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
       ANCLAJES SUAVES
    ========================================================= */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach((link) => {

            link.addEventListener(
                "click",
                (event) => {

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
                        target.getBoundingClientRect()
                            .top +
                        window.scrollY -
                        headerHeight -
                        20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: "smooth"
                    });

                }
            );

        });


    console.log(
        "✓ Módulo 03 cargado correctamente."
    );

});