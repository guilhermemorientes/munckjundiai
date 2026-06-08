/* ============================================================
   MUNCK JUNDIAÍ — Main JS (vanilla, modern)
   ============================================================ */

(function () {
    "use strict";

    const WHATSAPP_NUMBER = "5511997667704";
    const WHATSAPP_DISPLAY = "(11) 99766-7704";

    /* ----------------------------------------------------------
       Lucide icons init (run when ready)
       ---------------------------------------------------------- */
    function initIcons() {
        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
        }
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initIcons);
    } else {
        initIcons();
    }
    // Also retry once script is fully loaded
    window.addEventListener("load", initIcons);

    /* ----------------------------------------------------------
       Year in footer
       ---------------------------------------------------------- */
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    /* ----------------------------------------------------------
       Navbar scroll state
       ---------------------------------------------------------- */
    const navbar = document.getElementById("navbar");
    const onScrollNav = () => {
        if (!navbar) return;
        navbar.classList.toggle("scrolled", window.scrollY > 24);
    };
    onScrollNav();
    window.addEventListener("scroll", onScrollNav, { passive: true });

    /* ----------------------------------------------------------
       Smooth scroll for anchor links
       ---------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener("click", (e) => {
            const href = a.getAttribute("href");
            if (!href || href === "#") return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            closeMobileMenu();
        });
    });

    /* ----------------------------------------------------------
       Active section in navbar
       ---------------------------------------------------------- */
    const sectionIds = ["home", "servicos", "faq", "contato"];
    const navLinks = document.querySelectorAll(".nav-link");

    function updateActiveSection() {
        let current = "home";
        for (const id of sectionIds) {
            const el = document.getElementById(id);
            if (el && window.scrollY >= el.offsetTop - 120) current = id;
        }
        navLinks.forEach((link) => {
            const href = link.getAttribute("href") || "";
            link.classList.toggle("active", href === "#" + current);
        });
    }
    updateActiveSection();
    window.addEventListener("scroll", throttle(updateActiveSection, 120), { passive: true });

    /* ----------------------------------------------------------
       Mobile menu
       ---------------------------------------------------------- */
    const mobileToggle = document.getElementById("mobileToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    function closeMobileMenu() {
        if (!mobileToggle || !mobileMenu) return;
        mobileToggle.classList.remove("active");
        mobileMenu.classList.remove("open");
        mobileToggle.setAttribute("aria-expanded", "false");
        mobileToggle.setAttribute("aria-label", "Abrir menu");
    }

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener("click", () => {
            const isOpen = mobileMenu.classList.toggle("open");
            mobileToggle.classList.toggle("active", isOpen);
            mobileToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
            mobileToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
        });
    }

    /* ----------------------------------------------------------
       FAQ accordion
       ---------------------------------------------------------- */
    document.querySelectorAll(".faq-item").forEach((item) => {
        const trigger = item.querySelector(".faq-trigger");
        if (!trigger) return;
        trigger.addEventListener("click", () => {
            const isOpen = item.classList.contains("open");
            // Close all
            document.querySelectorAll(".faq-item").forEach((other) => {
                other.classList.remove("open");
                const t = other.querySelector(".faq-trigger");
                if (t) t.setAttribute("aria-expanded", "false");
            });
            // Toggle current
            if (!isOpen) {
                item.classList.add("open");
                trigger.setAttribute("aria-expanded", "true");
            }
        });
    });

    /* ----------------------------------------------------------
       Reveal on scroll (IntersectionObserver)
       ---------------------------------------------------------- */
    const reveals = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && reveals.length) {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
        );
        reveals.forEach((el) => io.observe(el));
    } else {
        // Fallback: show all
        reveals.forEach((el) => el.classList.add("visible"));
    }

    /* ----------------------------------------------------------
       Toast
       ---------------------------------------------------------- */
    const toastEl = document.getElementById("toast");
    let toastTimeout;
    function showToast(message, type) {
        if (!toastEl) return;
        clearTimeout(toastTimeout);
        toastEl.textContent = message;
        toastEl.className = "toast";
        toastEl.classList.add("show", type || "success");
        toastTimeout = setTimeout(() => {
            toastEl.classList.remove("show");
        }, 3500);
    }

    /* ----------------------------------------------------------
       Forms → WhatsApp
       ---------------------------------------------------------- */
    function buildWhatsAppUrl(data) {
        const lines = [
            "*Nova solicitação de orçamento — Munck Jundiaí*",
            "",
            "*Nome:* " + data.nome,
            "*Telefone:* " + data.telefone,
        ];
        if (data.email && data.email.trim()) lines.push("*E-mail:* " + data.email);
        lines.push("*Cidade:* " + data.cidade);
        lines.push("*Serviço:* " + data.servico);
        if (data.mensagem && data.mensagem.trim()) lines.push("*Mensagem:* " + data.mensagem);
        return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
    }

    function readForm(form) {
        const get = (name) => {
            const el = form.querySelector('[name="' + name + '"]');
            return el ? (el.value || "").trim() : "";
        };
        return {
            nome:     get("nome"),
            telefone: get("telefone"),
            email:    get("email"),
            cidade:   get("cidade"),
            servico:  get("servico"),
            mensagem: get("mensagem"),
        };
    }

    function validateForm(form, data) {
        const required = ["nome", "telefone", "cidade", "servico"];
        let valid = true;
        required.forEach((name) => {
            const el = form.querySelector('[name="' + name + '"]');
            if (!el) return;
            if (!data[name]) {
                el.classList.add("invalid");
                valid = false;
            } else {
                el.classList.remove("invalid");
            }
        });
        return valid;
    }

    function clearInvalidOnInput(form) {
        form.querySelectorAll("input, select, textarea").forEach((el) => {
            el.addEventListener("input", () => el.classList.remove("invalid"));
            el.addEventListener("change", () => el.classList.remove("invalid"));
        });
    }

    function setupForm(formId) {
        const form = document.getElementById(formId);
        if (!form) return;
        clearInvalidOnInput(form);

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const data = readForm(form);
            if (!validateForm(form, data)) {
                showToast("Preencha todos os campos obrigatórios.", "error");
                return;
            }
            const btn = form.querySelector(".btn-primary");
            const originalHTML = btn ? btn.innerHTML : "";
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = "<span>Abrindo WhatsApp...</span>";
            }

            const url = buildWhatsAppUrl(data);
            window.open(url, "_blank", "noopener,noreferrer");
            showToast("Abrindo WhatsApp com sua solicitação...", "success");
            form.reset();

            setTimeout(() => {
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = originalHTML;
                    initIcons();
                }
            }, 700);
        });
    }

    setupForm("contactForm");
    setupForm("contactForm2");

    /* ----------------------------------------------------------
       Utilities
       ---------------------------------------------------------- */
    function throttle(fn, wait) {
        let last = 0;
        let t;
        return function () {
            const now = Date.now();
            const ctx = this;
            const args = arguments;
            const remaining = wait - (now - last);
            if (remaining <= 0) {
                clearTimeout(t);
                t = null;
                last = now;
                fn.apply(ctx, args);
            } else if (!t) {
                t = setTimeout(() => {
                    last = Date.now();
                    t = null;
                    fn.apply(ctx, args);
                }, remaining);
            }
        };
    }
})();
