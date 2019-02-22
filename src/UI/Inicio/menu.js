import Home from "@UI/Paginas/Home/index";
import Perfil from "@UI/Paginas/Perfil/index";
import ExperienciaLaboral from "@UI/Paginas/ExperienciaLaboral/index";
import EstudiosRealizados from "@UI/Paginas/EstudiosRealizados/index";
import Programas from "@UI/Paginas/Programas/index";


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
    url: "/Inicio/Perfil",
    exact: true,
    mostrarEnMenu: true,
    component: Perfil,
    nombre: "Perfil",
    titulo: "Perfil",
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
