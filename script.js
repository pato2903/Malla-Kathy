const malla = [
  ["Inglés I", "Introducción a Nutrición y Dietética", "Ciencias de los Alimentos", "Biología Celular", "Introducción a la Salud Comunitaria", "Química"],
  ["Inglés II", "Comunicación en Salud Comunitaria", "Técnicas Dietéticas Aplicadas", "Microbiología y Parasitología", "Morfología y Función", "Bioquímica"],
  ["Ética en Salud Comunitaria", "Gastronomía Aplicada a la Nutrición", "Inocuidad y Análisis Alimentario", "Nutrición Básica", "Fisiología General", "Introducción al Análisis de Datos"],
  ["Dietética I", "Ejercicio y Salud", "Tecnología y Marketing de los Alimentos", "Fisiopatología", "Epidemiología", "Promoción de Salud en Comunidad"],
  ["Dietética II", "Evaluación del Estado Nutricional I", "Bases Fisiológicas del Deporte", "Salud Pública y Salud Comunitaria", "Farmacología", "Prácticas Integradas I"],
  ["Cineantropometría", "Evaluación del Estado Nutricional II", "Dietoterapia del Adulto y Adulto Mayor", "Gestión Alimentaria", "Proyectos en Salud Comunitaria", "Prácticas Integradas II"],
  ["Metodología de Investigación", "Nutrición Deportiva", "Dietoterapia Materno-Infantil", "Administración de Servicios de Alimentación", "Implementos de Proyectos en Salud Comunitaria", "Prácticas Integradas III"],
  ["Innovación y Emprendimiento", "Atención Primaria y Salud Familiar", "Seminario de Investigación", "Tendencias en Apoyo Nutricional", "Herramientas Educativas en Salud", "Prácticas Integradas IV"],
  ["", "", "", "", "Práctica Profesional I", "Práctica Profesional II"],
  ["", "", "", "", "Práctica Profesional III", "Práctica Profesional IV"]
];

function renderMalla() {
  const container = document.getElementById("malla-container");
  const estadoGuardado = JSON.parse(localStorage.getItem("estadoMalla") || "{}");

  malla.forEach((ramos, i) => {
    const semDiv = document.createElement("div");
    semDiv.classList.add("semestre");

    const title = document.createElement("h2");
    title.textContent = `${i + 1}° Semestre`;
    semDiv.appendChild(title);

    ramos.forEach(nombre => {
      const div = document.createElement("div");
      div.classList.add("ramo");

      const isVacio = nombre.trim().toUpperCase() === "VACÍO";
      if (isVacio) {
        div.classList.add("vacio");
        div.innerHTML = "&nbsp;";
      } else {
        const aprobado = estadoGuardado[nombre];
        div.textContent = aprobado ? `✔️ ${nombre}` : nombre;
        if (aprobado) div.classList.add("aprobado");

        div.addEventListener("click", () => {
          div.classList.toggle("aprobado");
          const aprobado = div.classList.contains("aprobado");
          div.innerHTML = aprobado ? `✔️ ${nombre}` : nombre;

          guardarEstado(); // actualiza localStorage
        });
      }

      semDiv.appendChild(div);
    });

    container.appendChild(semDiv);
  });
}

function guardarEstado() {
  const ramos = document.querySelectorAll(".ramo");
  const estado = {};
  ramos.forEach(r => {
    const texto = r.textContent.replace(/^✔️\s*/, "").trim();
    if (!r.classList.contains("vacio") && texto !== "") {
      estado[texto] = r.classList.contains("aprobado");
    }
  });
  localStorage.setItem("estadoMalla", JSON.stringify(estado));
}

function exportarMalla() {
  guardarEstado();
  const estado = localStorage.getItem("estadoMalla");
  const blob = new Blob([estado], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "malla.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function importarMalla(event) {
  const archivo = event.target.files[0];
  if (!archivo) return;
  const lector = new FileReader();
  lector.onload = function (e) {
    localStorage.setItem("estadoMalla", e.target.result);
    location.reload(); // aplica los cambios recargando
  };
  lector.readAsText(archivo);
}

document.addEventListener("DOMContentLoaded", () => {
  renderMalla();
  document.getElementById("exportar").addEventListener("click", exportarMalla);
  document.getElementById("importar").addEventListener("change", importarMalla);
});
