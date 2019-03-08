import Home from "@UI/UserCiudadano/Paginas/Home/index";
import ExperienciaLaboral from "@UI/UserCiudadano/Paginas/ExperienciaLaboral/index";
import EstudiosRealizados from "@UI/UserCiudadano/Paginas/EstudiosRealizados/index";
import Programas from "@UI/UserCiudadano/Paginas/Programas/index";


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
  }
];

export default Menu;
