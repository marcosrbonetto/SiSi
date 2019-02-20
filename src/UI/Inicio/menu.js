import Home from "@UI/Paginas/Home/index";
import Perfil from "@UI/Paginas/Perfil/index";

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
  }
];

export default Menu;
