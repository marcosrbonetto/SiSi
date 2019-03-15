import Preinscripciones from "@UI/UserGestor/Paginas/Preinscripciones/index";
import Cursos from "@UI/UserGestor/Paginas/Cursos/index";
import Programas from "@UI/UserGestor/Paginas/Programas/index";

const Menu = [
  {
    url: "/InicioGestor/Programas",
    exact: true,
    mostrarEnMenu: true,
    component: Programas,
    nombre: "Programas",
    titulo: "Programas",
  },
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
