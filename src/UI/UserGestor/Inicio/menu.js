import Preinscripciones from "@UI/UserGestor/Paginas/Preinscripciones/index";
import Cursos from "@UI/UserGestor/Paginas/Cursos/index";
import Programas from "@UI/UserGestor/Paginas/Programas/index";

import Aulas from "@UI/UserGestor/Paginas/Aulas/index";

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
    url: "/InicioGestor/Aulas",
    exact: true,
    mostrarEnMenu: true,
    component: Aulas,
    nombre: "Asignación Aulas",
    titulo: "Asignación Aulas",
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
    url: window.Config.URL_ROOT + '/Inicio',
    exact: true,
    mostrarEnMenu: true,
    component: Home,
    nombre: "Modo Ciudadano",
    titulo: "Modo Ciudadano",
    externalLink: true
  }
];

export default Menu;
