import Home from "@UI/Paginas/Home/index";
import Perfil from "@UI/Paginas/Perfil/index";
import ExperienciaLaboral from "@UI/Paginas/ExperienciaLaboral/index";

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
    nombre: "Mi Perfil",
    titulo: "Mi Perfil",
  },
  {
    url: "/Inicio/ExperienciaLaboral",
    exact: true,
    mostrarEnMenu: true,
    component: ExperienciaLaboral,
    nombre: "Mi Experiencia Laboral",
    titulo: "Mi Experiencia Laboral",
  }
];

export default Menu;
