document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      alert("Form submitted! (This is just a placeholder. You can add real logic later.)");
    });
  });
});
