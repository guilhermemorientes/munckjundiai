// ===== MODERN MINIMALIST INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
  // Initialize icons
  if (window.lucide) {
    window.lucide.createIcons()
  }

  // Initialize modules
  Navigation.init()
  Forms.init()
  FAQ.init()
  ScrollAnimations.init()
})

// ===== NAVIGATION MODULE =====
const Navigation = {
  init() {
    this.setupSmoothScrolling()
    this.setupActiveSection()
    this.setupMobileMenu()
    this.setupNavbarScroll()
  },

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault()
        const target = document.querySelector(anchor.getAttribute("href"))
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      })
    })
  },

  setupActiveSection() {
    const sections = document.querySelectorAll("section[id]")
    const navLinks = document.querySelectorAll(".nav-link")

    const updateActiveSection = Utils.throttle(() => {
      let current = "home"
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100
        if (window.scrollY >= sectionTop) {
          current = section.id
        }
      })

      navLinks.forEach((link) => {
        link.classList.remove("active")
        if (link.getAttribute("href") === `#${current}`) {
          link.classList.add("active")
        }
      })
    }, 100)

    window.addEventListener("scroll", updateActiveSection, { passive: true })
    updateActiveSection()
  },

  setupMobileMenu() {
    const toggle = document.querySelector(".mobile-menu-toggle")
    const menu = document.querySelector(".mobile-menu")
    const navLinks = document.querySelectorAll(".mobile-nav-link")

    if (!toggle || !menu) return

    toggle.addEventListener("click", () => {
      menu.classList.toggle("active")
      toggle.classList.toggle("active")
      toggle.setAttribute("aria-expanded", toggle.classList.contains("active"))

      const hamburgers = toggle.querySelectorAll(".hamburger")
      hamburgers.forEach((bar, index) => {
        if (toggle.classList.contains("active")) {
          if (index === 0) bar.style.transform = "rotate(45deg) translate(6px, 6px)"
          if (index === 1) bar.style.opacity = "0"
          if (index === 2) bar.style.transform = "rotate(-45deg) translate(6px, -6px)"
        } else {
          bar.style.transform = "none"
          bar.style.opacity = "1"
        }
      })
    })

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("active")
        toggle.classList.remove("active")
        toggle.setAttribute("aria-expanded", "false")

        const hamburgers = toggle.querySelectorAll(".hamburger")
        hamburgers.forEach((bar) => {
          bar.style.transform = "none"
          bar.style.opacity = "1"
        })
      })
    })
  },

  setupNavbarScroll() {
    const navbar = document.querySelector(".navbar")

    const updateNavbar = Utils.throttle(() => {
      if (window.scrollY > 50) {
        navbar.style.background = "rgba(255, 255, 255, 0.98)"
        navbar.style.boxShadow = "var(--shadow)"
      } else {
        navbar.style.background = "rgba(255, 255, 255, 0.95)"
        navbar.style.boxShadow = "none"
      }
    }, 16)

    window.addEventListener("scroll", updateNavbar, { passive: true })
  },
}

// ===== FORMS MODULE =====
const Forms = {
  init() {
    this.setupContactForm()
    this.setupFormValidation()
  },

  setupContactForm() {
    const form1 = document.getElementById("contactForm")
    const form2 = document.getElementById("contactForm2")

    if (form1) {
      form1.addEventListener("submit", (e) => {
        e.preventDefault()
        this.handleContactSubmit(form1, 1)
      })
    }

    if (form2) {
      form2.addEventListener("submit", (e) => {
        e.preventDefault()
        this.handleContactSubmit(form2, 2)
      })
    }
  },

  setupFormValidation() {
    const inputs = document.querySelectorAll("input, textarea, select")

    inputs.forEach((input) => {
      input.addEventListener("blur", () => {
        this.validateField(input)
      })

      input.addEventListener("input", () => {
        this.clearFieldError(input)
      })
    })
  },

  validateField(field) {
    const isValid = field.checkValidity() && field.value.trim() !== ""

    if (!isValid && field.hasAttribute("required")) {
      field.style.borderColor = "#dc2626"
      field.style.boxShadow = "0 0 0 3px rgba(220, 38, 38, 0.1)"
    } else {
      field.style.borderColor = ""
      field.style.boxShadow = ""
    }

    return isValid
  },

  clearFieldError(field) {
    field.style.borderColor = ""
    field.style.boxShadow = ""
  },

  handleContactSubmit(form, formNumber) {
    const suffix = formNumber === 2 ? "2" : ""
    const data = {
      nome: document.getElementById(`nome${suffix}`).value,
      telefone: document.getElementById(`telefone${suffix}`).value,
      email: document.getElementById(`email${suffix}`).value,
      cidade: document.getElementById(`cidade${suffix}`).value,
      servico: document.getElementById(`servico${suffix}`).value,
      mensagem: document.getElementById(`mensagem${suffix}`).value,
    }

    if (!this.validateForm(data)) {
      this.showToast("Preencha todos os campos obrigatórios", "error")
      return
    }

    this.submitContact(data, formNumber)
  },

  validateForm(data) {
    const requiredFields = ["nome", "telefone", "cidade", "servico"]
    return requiredFields.every((field) => data[field] && data[field].trim() !== "")
  },

  async submitContact(data, formNumber = 1) {
    try {
      const submitBtn =
        formNumber === 2
          ? document.querySelector("#contactForm2 .btn-submit")
          : document.querySelector("#contactForm .btn-submit")

      const originalHTML = submitBtn.innerHTML
      submitBtn.innerHTML = '<span>Enviando...</span><div class="loading-spinner"></div>'
      submitBtn.disabled = true

      // URL do Google Apps Script
      const SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycbwnyoOFtAM4BAAtnpTAUS_62hPcBC_Cwagz8bF3cHDAk59y7YgmlQL2ZkadKRMm3mZS1g/exec"

      // Preparar dados para envio
      const formData = {
        nome: data.nome,
        telefone: data.telefone,
        email: data.email || "",
        cidade: data.cidade,
        servico: data.servico,
        mensagem: data.mensagem || "",
      }

      console.log("Enviando dados para planilha:", formData)

      // Enviar para Google Apps Script
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Importante para Google Apps Script
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      // Como usamos no-cors, sempre assumimos sucesso se não houver erro
      console.log("Dados enviados para planilha com sucesso")

      // Resetar formulário
      const formId = formNumber === 2 ? "contactForm2" : "contactForm"
      document.getElementById(formId).reset()

      // Mostrar mensagem de sucesso
      this.showToast("✅ Solicitação enviada com sucesso! Entraremos em contato em breve.", "success")

      // Restaurar botão
      submitBtn.innerHTML = originalHTML
      submitBtn.disabled = false

      if (window.lucide) {
        window.lucide.createIcons()
      }
    } catch (error) {
      console.error("Erro ao enviar:", error)

      this.showToast("❌ Erro ao enviar solicitação. Tente novamente.", "error")

      // Restaurar botão
      const submitBtn =
        formNumber === 2
          ? document.querySelector("#contactForm2 .btn-submit")
          : document.querySelector("#contactForm .btn-submit")

      const buttonText = formNumber === 2 ? "Enviar Solicitação" : "Solicitar Orçamento"
      submitBtn.innerHTML = `<span>${buttonText}</span><i data-lucide="arrow-right" class="btn-icon"></i>`
      submitBtn.disabled = false

      if (window.lucide) {
        window.lucide.createIcons()
      }
    }
  },

  showToast(message, type = "success") {
    const toast = document.getElementById("toast")
    if (!toast) return

    toast.textContent = message
    toast.className = `toast ${type} show`

    setTimeout(() => {
      toast.classList.remove("show")
    }, 4000)
  },
}

// ===== FAQ MODULE =====
const FAQ = {
  init() {
    this.setupFAQToggle()
  },

  setupFAQToggle() {
    const faqQuestions = document.querySelectorAll(".faq-question")

    faqQuestions.forEach((question) => {
      question.addEventListener("click", () => {
        const faqItem = question.closest(".faq-item")
        const isActive = faqItem.classList.contains("active")

        // Close all other FAQs
        document.querySelectorAll(".faq-item").forEach((item) => {
          if (item !== faqItem) {
            item.classList.remove("active")
            const otherQuestion = item.querySelector(".faq-question")
            otherQuestion.setAttribute("aria-expanded", "false")
          }
        })

        // Toggle current FAQ
        if (isActive) {
          faqItem.classList.remove("active")
          question.setAttribute("aria-expanded", "false")
        } else {
          faqItem.classList.add("active")
          question.setAttribute("aria-expanded", "true")
        }
      })
    })
  },
}

// ===== SCROLL ANIMATIONS MODULE =====
const ScrollAnimations = {
  init() {
    this.setupIntersectionObserver()
    this.setupCounterAnimations()
  },

  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1"
            entry.target.style.transform = "translateY(0)"
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    const animatedElements = document.querySelectorAll(".servico-card, .faq-item")

    animatedElements.forEach((el) => {
      el.style.opacity = "0"
      el.style.transform = "translateY(30px)"
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
      observer.observe(el)
    })
  },

  setupCounterAnimations() {
    const counters = document.querySelectorAll(".stat-number")

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target
          const target = counter.textContent
          const isNumber = /^\d+/.test(target)

          if (isNumber) {
            const finalNumber = Number.parseInt(target)
            this.animateCounter(counter, 0, finalNumber, 2000)
          }

          observer.unobserve(counter)
        }
      })
    })

    counters.forEach((counter) => observer.observe(counter))
  },

  animateCounter(element, start, end, duration) {
    const startTime = performance.now()
    const suffix = element.textContent.replace(/^\d+/, "")

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      const current = Math.floor(start + (end - start) * this.easeOutCubic(progress))
      element.textContent = current + suffix

      if (progress < 1) {
        requestAnimationFrame(updateCounter)
      }
    }

    requestAnimationFrame(updateCounter)
  },

  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3)
  },
}

// ===== UTILITIES =====
const Utils = {
  throttle(func, limit) {
    let inThrottle
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  },

  debounce(func, wait) {
    let timeout
    return function (...args) {
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, args), wait)
    }
  },
}

// ===== PERFORMANCE OPTIMIZATIONS =====
window.addEventListener(
  "resize",
  Utils.debounce(() => {
    if (window.lucide) {
      window.lucide.createIcons()
    }
  }, 250),
)

// ===== ERROR HANDLING =====
window.addEventListener("error", (e) => {
  console.error("JavaScript Error:", e.error)
})

window.addEventListener("unhandledrejection", (e) => {
  console.error("Promise Rejection:", e.reason)
})
