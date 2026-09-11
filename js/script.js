document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =========================================================
       EL EMPLEADO AUMENTADO
       JavaScript principal
       ========================================================= */

    const body = document.body;

    /* =========================================================
       1. NAVEGACIÓN SUAVE
       ========================================================= */

    const navLinks = document.querySelectorAll(
        'a[href^="#"], .nav a, .header-button'
    );

    navLinks.forEach(link => {
        link.addEventListener("click", event => {
            const href = link.getAttribute("href");

            if (!href || href === "#") {
                return;
            }

            const target = document.querySelector(href);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });


    /* =========================================================
       2. ANIMACIONES AL HACER SCROLL
       ========================================================= */

    const animatedElements = document.querySelectorAll(
        ".section-head, .idea-grid, .capability-item, " +
        ".method-card, .method-result, .module, " +
        ".transformation-layout, .challenge-steps, .challenge-final, " +
        ".final-content"
    );

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -50px 0px"
            }
        );

        animatedElements.forEach(element => {
            element.classList.add("scroll-reveal");
            observer.observe(element);
        });
    } else {
        animatedElements.forEach(element => {
            element.classList.add("is-visible");
        });
    }


    /* =========================================================
       3. HEADER AL HACER SCROLL
       ========================================================= */

    const header = document.querySelector(".header");

    const updateHeader = () => {
        if (!header) {
            return;
        }

        if (window.scrollY > 30) {
            header.classList.add("header-scrolled");
        } else {
            header.classList.remove("header-scrolled");
        }
    };

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    updateHeader();


    /* =========================================================
       4. NAVEGACIÓN ACTIVA SEGÚN LA SECCIÓN
       ========================================================= */

    const sections = document.querySelectorAll("main section[id]");
    const navigationLinks = document.querySelectorAll(".nav a");

    if (sections.length && navigationLinks.length) {
        const sectionObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    const currentId = entry.target.id;

                    navigationLinks.forEach(link => {
                        link.classList.remove("active");

                        const href = link.getAttribute("href");

                        if (href === `#${currentId}`) {
                            link.classList.add("active");
                        }
                    });
                });
            },
            {
                threshold: 0.35
            }
        );

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }


    /* =========================================================
       5. EFECTO EN TARJETAS DE CAPACIDADES
       ========================================================= */

    const capabilityItems = document.querySelectorAll(".capability-item");

    capabilityItems.forEach(item => {
        item.addEventListener("mouseenter", () => {
            capabilityItems.forEach(other => {
                if (other !== item) {
                    other.classList.add("dimmed");
                }
            });

            item.classList.add("hovered");
        });

        item.addEventListener("mouseleave", () => {
            capabilityItems.forEach(other => {
                other.classList.remove("dimmed");
            });

            item.classList.remove("hovered");
        });
    });


    /* =========================================================
       6. INTERACCIÓN CON LOS MÓDULOS
       ========================================================= */

    const modules = document.querySelectorAll(".module");

    modules.forEach((module, index) => {
        module.setAttribute("tabindex", "0");

        module.addEventListener("mouseenter", () => {
            module.classList.add("module-active");
        });

        module.addEventListener("mouseleave", () => {
            module.classList.remove("module-active");
        });

        module.addEventListener("focus", () => {
            module.classList.add("module-active");
        });

        module.addEventListener("blur", () => {
            module.classList.remove("module-active");
        });

        module.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                module.classList.toggle("module-selected");
            }
        });
    });


    /* =========================================================
       7. EFECTO DE LOS ELEMENTOS DEL HERO
       ========================================================= */

    const heroGraphic = document.querySelector(".hero-graphic");

    if (heroGraphic) {
        const graphicBoxes = heroGraphic.querySelectorAll(
            ".graphic-box"
        );

        graphicBoxes.forEach(box => {
            box.addEventListener("mouseenter", () => {
                graphicBoxes.forEach(other => {
                    if (other !== box) {
                        other.classList.add("graphic-dimmed");
                    }
                });

                box.classList.add("graphic-active");
            });

            box.addEventListener("mouseleave", () => {
                graphicBoxes.forEach(other => {
                    other.classList.remove("graphic-dimmed");
                });

                box.classList.remove("graphic-active");
            });
        });
    }


    /* =========================================================
       8. EFECTO PARALLAX MUY SUTIL EN EL HERO
       ========================================================= */

    const hero = document.querySelector(".hero");

    if (
        hero &&
        window.matchMedia("(prefers-reduced-motion: no-preference)").matches
    ) {
        let ticking = false;

        window.addEventListener(
            "scroll",
            () => {
                if (ticking) {
                    return;
                }

                window.requestAnimationFrame(() => {
                    const scroll = window.scrollY;

                    if (scroll < window.innerHeight) {
                        const graphic = document.querySelector(
                            ".hero-graphic"
                        );

                        if (graphic) {
                            graphic.style.transform =
                                `translateY(${scroll * 0.08}px)`;
                        }
                    }

                    ticking = false;
                });

                ticking = true;
            },
            { passive: true }
        );
    }


    /* =========================================================
       9. MÉTODO — SECUENCIA VISUAL
       ========================================================= */

    const methodCards = document.querySelectorAll(".method-card");

    methodCards.forEach((card, index) => {
        card.addEventListener("mouseenter", () => {
            methodCards.forEach(other => {
                other.classList.remove("method-highlight");
            });

            card.classList.add("method-highlight");
        });
    });


    /* =========================================================
       10. TRANSFORMACIÓN ANTES / DESPUÉS
       ========================================================= */

    const before = document.querySelector(".before");
    const after = document.querySelector(".after");

    if (before && after) {
        before.addEventListener("mouseenter", () => {
            before.classList.add("transformation-focus");
            after.classList.remove("transformation-focus");
        });

        after.addEventListener("mouseenter", () => {
            after.classList.add("transformation-focus");
            before.classList.remove("transformation-focus");
        });

        const transformationLayout = document.querySelector(
            ".transformation-layout"
        );

        if (transformationLayout) {
            transformationLayout.addEventListener("mouseleave", () => {
                before.classList.remove("transformation-focus");
                after.classList.remove("transformation-focus");
            });
        }
    }


    /* =========================================================
       11. PASOS DEL RETO
       ========================================================= */

    const challengeSteps = document.querySelectorAll(
        ".challenge-steps > *"
    );

    challengeSteps.forEach((step, index) => {
        step.addEventListener("mouseenter", () => {
            challengeSteps.forEach(other => {
                other.classList.remove("challenge-active");
            });

            step.classList.add("challenge-active");
        });
    });


    /* =========================================================
       12. BOTÓN PRINCIPAL DEL HEADER
       ========================================================= */

    const headerButton = document.querySelector(".header-button");

    if (headerButton) {
        headerButton.addEventListener("click", event => {
            const target =
                document.querySelector("#ruta") ||
                document.querySelector(".route") ||
                document.querySelector("#modulos") ||
                document.querySelector(".modules");

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    }


    /* =========================================================
       13. TECLADO — ESC PARA QUITAR ESTADOS
       ========================================================= */

    document.addEventListener("keydown", event => {
        if (event.key !== "Escape") {
            return;
        }

        document
            .querySelectorAll(
                ".hovered, .module-active, .module-selected, " +
                ".graphic-active, .method-highlight, " +
                ".transformation-focus, .challenge-active"
            )
            .forEach(element => {
                element.classList.remove(
                    "hovered",
                    "module-active",
                    "module-selected",
                    "graphic-active",
                    "method-highlight",
                    "transformation-focus",
                    "challenge-active"
                );
            });

        capabilityItems.forEach(item => {
            item.classList.remove("dimmed");
        });

        if (heroGraphic) {
            heroGraphic
                .querySelectorAll(".graphic-box")
                .forEach(box => {
                    box.classList.remove("graphic-dimmed");
                });
        }
    });


    /* =========================================================
       14. DETECCIÓN DE REDUCED MOTION
       ========================================================= */

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    const applyMotionPreference = () => {
        if (reducedMotion.matches) {
            body.classList.add("reduced-motion");
        } else {
            body.classList.remove("reduced-motion");
        }
    };

    applyMotionPreference();

    if (reducedMotion.addEventListener) {
        reducedMotion.addEventListener(
            "change",
            applyMotionPreference
        );
    }


    /* =========================================================
       15. AÑO AUTOMÁTICO DEL FOOTER
       ========================================================= */

    const footerYear = document.querySelector(
        "[data-current-year]"
    );

    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }


    /* =========================================================
       16. CARGA INICIAL
       ========================================================= */

    requestAnimationFrame(() => {
        body.classList.add("page-loaded");
    });


    console.log(
        "El Empleado Aumentado — JavaScript cargado correctamente."
    );
});