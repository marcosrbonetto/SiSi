import Preinscripciones from "@UI/UserGestor/Paginas/Preinscripciones/index";
import Cursos from "@UI/UserGestor/Paginas/Cursos/index";

const Menu = [
  {
    url: "/InicioGestor/Cursos",
    exact: true,
    mostrarEnMenu: true,
    component: Cursos,
    nombre: "Cursos",
    titulo: "Cursos",
  },
  {
    url: "/InicioGestor/Preinscripciones",
    exact: true,
    mostrarEnMenu: true,
    component: Preinscripciones,
    nombre: "Preinscripciones",
    titulo: "Preinscripciones",
  }
];

export default Menu;
