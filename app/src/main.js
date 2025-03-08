// DOM Elements
const sidebar = document.querySelector(".sidebar");
const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
const navLinks = document.querySelectorAll(".nav-links li");
const pages = document.querySelectorAll(".page");
const projectFilters = document.querySelectorAll(".filter-btn");
const projectItems = document.querySelectorAll(".project-item");
const contactForm = document.getElementById("contactForm");

// Initialize GSAP
gsap.registerPlugin();

// Mobile Navigation Toggle
mobileNavToggle.addEventListener("click", () => {
  sidebar.classList.toggle("active");

  if (sidebar.classList.contains("active")) {
    mobileNavToggle.innerHTML = '<i class="fas fa-times"></i>';
  } else {
    mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
  }
});

// Navigation Functionality
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    // Get the page id from the link's href
    const targetId = link.querySelector("a").getAttribute("href").substring(1);
    const targetPage = document.getElementById(targetId);

    // Update active link
    navLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");

    // Page transition animation
    if (targetPage) {
      // Get the current active page
      const currentPage = document.querySelector(".page.active");

      if (currentPage !== targetPage) {
        // Animate current page out
        gsap.to(currentPage, {
          duration: 0.6,
          opacity: 0,
          x: "-100%",
          ease: "power2.inOut",
          onComplete: () => {
            currentPage.classList.remove("active");

            // Prepare the target page for animation
            gsap.set(targetPage, {
              opacity: 0,
              x: "100%",
            });

            // Make target page visible
            targetPage.classList.add("active");

            // Animate target page in
            gsap.to(targetPage, {
              duration: 0.6,
              opacity: 1,
              x: "0%",
              ease: "power2.inOut",
            });
          },
        });
      }
    }

    // Close mobile menu if open
    if (window.innerWidth <= 768 && sidebar.classList.contains("active")) {
      sidebar.classList.remove("active");
      mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });
});

// Project Filtering
projectFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    // Update active filter
    projectFilters.forEach((btn) => btn.classList.remove("active"));
    filter.classList.add("active");

    const category = filter.getAttribute("data-filter");

    // Filter projects
    projectItems.forEach((item) => {
      const itemCategory = item.getAttribute("data-category");

      if (category === "all" || category === itemCategory) {
        gsap.to(item, {
          duration: 0.4,
          opacity: 1,
          y: 0,
          scale: 1,
          ease: "power1.out",
          clearProps: "all",
        });
      } else {
        gsap.to(item, {
          duration: 0.4,
          opacity: 0,
          y: 20,
          scale: 0.95,
          ease: "power1.out",
        });
      }
    });
  });
});

// Contact Form Submission
// chat bot telegram

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const contactName = document.getElementById("name").value;
    const contactEmail = document.getElementById("email").value;
    const contactSubject = document.getElementById("subject").value;
    const contactMessage = document.getElementById("message").value;

    // message to send to Telegram
    const messageToSend = `Nama: ${contactName}\nEmail: ${contactEmail}\nSubjek: ${contactSubject}\nPesan: ${contactMessage}`;

    // Telegram Bot Token and Chat ID
    const botToken = "7414286787:AAFG_hunMf3fTsjFVzuos1FT6wNFLyUucZs";
    const chatId = "6858660674";

    // Send message to Telegram
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageToSend,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          alert("Message sent successfully! Thank you for your message.");
        } else {
          alert("An error occurred while sending the message.");
        }
      })
      .catch((error) => console.error("Error:", error));

    // Reset form
    contactForm.reset();
  });
}

// Page Load Animation
window.addEventListener("load", () => {
  // Get the initial page based on URL hash or default to home
  const initialPageId = window.location.hash
    ? window.location.hash.substring(1)
    : "home";
  const initialPage = document.getElementById(initialPageId);
  const initialNavLink = document.querySelector(
    `.nav-links li[data-page="${initialPageId}"]`
  );

  // Set initial active page and nav link
  if (initialPage) {
    pages.forEach((page) => page.classList.remove("active"));
    initialPage.classList.add("active");

    navLinks.forEach((link) => link.classList.remove("active"));
    if (initialNavLink) {
      initialNavLink.classList.add("active");
    } else {
      // Default to home if no matching link
      document
        .querySelector('.nav-links li[data-page="home"]')
        .classList.add("active");
    }

    // Animate initial page in
    gsap.from(initialPage, {
      duration: 0.8,
      opacity: 0,
      y: 30,
      ease: "power2.out",
    });
  }

  // Animate sidebar elements
  gsap.from(".sidebar", {
    duration: 0.8,
    x: -50,
    opacity: 0,
    ease: "power2.out",
  });

  gsap.from(".nav-links li", {
    duration: 0.5,
    opacity: 0,
    x: -20,
    stagger: 0.1,
    ease: "power2.out",
    delay: 0.3,
  });
});

// Skill bars animation when skills page becomes visible
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const skillLevels = entry.target.querySelectorAll(".skill-level");

        skillLevels.forEach((level) => {
          const width = level.style.width;

          // Reset width to 0 before animation
          level.style.width = "0%";

          // Animate to the original width
          gsap.to(level, {
            width: width,
            duration: 1.5,
            ease: "power2.out",
          });
        });

        // Unobserve after animation
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

// Observe the skills section
const skillsSection = document.getElementById("skills");
if (skillsSection) {
  observer.observe(skillsSection);
}

// Handle navigation via URL hash changes
window.addEventListener("hashchange", () => {
  const pageId = window.location.hash.substring(1);
  const targetLink = document.querySelector(
    `.nav-links li[data-page="${pageId}"] a`
  );

  if (targetLink) {
    targetLink.click();
  }
});

// Add page transition effect for internal links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href").substring(1);
    const targetLink = document.querySelector(
      `.nav-links li[data-page="${targetId}"] a`
    );

    if (targetLink) {
      e.preventDefault();
      targetLink.click();
    }
  });
});
