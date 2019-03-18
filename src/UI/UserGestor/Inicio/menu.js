import Preinscripciones from "@UI/UserGestor/Paginas/Preinscripciones/index";
import Cursos from "@UI/UserGestor/Paginas/Cursos/index";
import Programas from "@UI/UserGestor/Paginas/Programas/index";

import Home from "@UI/UserCiudadano/Paginas/Home/index";

const Menu = [
  {
    url: "/InicioGestor/Preinscripciones",
    exact: true,
    mostrarEnMenu: true,
    component: Preinscripciones,
    nombre: "Preinscripciones",
    titulo: "Preinscripciones",
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
    url: "/InicioGestor/Programas",
    exact: true,
    mostrarEnMenu: true,
    component: Programas,
    nombre: "Programas",
    titulo: "Programas",
  },
  {
    url: "/Inicio",
    exact: true,
    mostrarEnMenu: true,
    component: Home,
    nombre: "Modo Ciudadano",
    titulo: "Modo Ciudadano",
  }
];

export default Menu;
