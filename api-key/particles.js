document.addEventListener("DOMContentLoaded", () => {

  if (typeof particlesJS === "undefined") {
    console.error("particles.js belum diload!");
    return;
  }

  particlesJS("particles-js", {
    particles: {
      number: {
        value: 150,
        density: {
          enable: true,
          value_area: 800
        }
      },

      color: {
        value: ["#00ffff", "#00ffcc", "#0099ff"]
      },

      shape: {
        type: "circle"
      },

      opacity: {
        value: 0.6,
        random: true
      },

      size: {
        value: 3,
        random: true
      },

      line_linked: {
        enable: true,
        distance: 130,
        color: "#00ffff",
        opacity: 0.4,
        width: 1.2
      },

      move: {
        enable: true,
        speed: 1.5,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false
      }
    },

    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "grab"
        },
        onclick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },

      modes: {
        grab: {
          distance: 150,
          line_linked: {
            opacity: 0.7
          }
        },

        push: {
          particles_nb: 4
        }
      }
    },

    retina_detect: true
  });

});