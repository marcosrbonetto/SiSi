import Home from "@UI/UserCiudadano/Paginas/Home/index";
import ExperienciaLaboral from "@UI/UserCiudadano/Paginas/ExperienciaLaboral/index";
import EstudiosRealizados from "@UI/UserCiudadano/Paginas/EstudiosRealizados/index";
import Programas from "@UI/UserCiudadano/Paginas/Programas/index";
import ProgramasVirtuales from "@UI/UserCiudadano/Paginas/ProgramasVirtuales/index";

import Preinscripciones from "@UI/UserGestor/Paginas/Preinscripciones/index";
import MisInscripciones from "@UI/UserCiudadano/Paginas/MisInscripciones/index";

import CurriculumVitae from "@UI/UserCiudadano/Paginas/CurriculumVitae/index";
import FormDatosAdicionales from "@UI/UserCiudadano/Paginas/FormDatosAdicionales/index";

const Menu = [
  {
    url: "/Inicio",
    exact: true,
    mostrarEnMenu: true,
    component: Home,
    nombre: "Si Estudio, Si Trabajo",
    titulo: "Si Estudio, Si Trabajo",
  },
  {
    url: "/Inicio/Programas",
    exact: true,
    mostrarEnMenu: true,
    component: Programas,
    nombre: "Programas",
    titulo: "Programas",
  },
  {
    url: "/Inicio/ProgramasVirtuales",
    exact: true,
    mostrarEnMenu: true,
    component: ProgramasVirtuales,
    nombre: "Programas Virtuales",
    titulo: "Programas Virtuales",
  },
  {
    url: "/Inicio/MisInscripciones",
    exact: true,
    mostrarEnMenu: true,
    component: MisInscripciones,
    nombre: "Mis Inscripciones",
    titulo: "Mis Inscripciones",
  },
  {
    url: "/Inicio/ExperienciaLaboral",
    exact: true,
    mostrarEnMenu: true,
    component: ExperienciaLaboral,
    nombre: "Experiencia Laboral",
    titulo: "Experiencia Laboral",
  },
  {
    url: "/Inicio/EstudiosRealizados",
    exact: true,
    mostrarEnMenu: true,
    component: EstudiosRealizados,
    nombre: "Estudios Realizados",
    titulo: "Estudios Realizados",
  },
  {
    url: "/Inicio/CurriculumVitae",
    exact: true,
    mostrarEnMenu: true,
    component: CurriculumVitae,
    nombre: "Curriculum Vitae",
    titulo: "Curriculum Vitae",
  },
  {
    url: "/Inicio/FormDatosAdicionales",
    exact: true,
    mostrarEnMenu: true,
    component: FormDatosAdicionales,
    nombre: "Datos Adicionales",
    titulo: "Datos Adicionales",
  },
  {
    url: window.Config.URL_ROOT + "/InicioGestor/Preinscripciones",
    exact: true,
    mostrarEnMenu: true,
    component: Preinscripciones,
    itemGestor: true,
    nombre: "Modo Gestor",
    titulo: "Modo Gestor",
    externalLink: true
  }
];

export default Menu;
