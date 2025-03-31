import { Component, inject } from "@angular/core";
import { routes } from "../../../app.routes";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { filter, map, tap } from "rxjs";
import { AsyncPipe } from "@angular/common";
import { toSignal } from "@angular/core/rxjs-interop";

@Component({
    selector: "app-navbar",
    imports: [AsyncPipe, RouterLink],
    templateUrl: "./navbar.component.html",
})
export class NavbarComponent {
    router = inject(Router);
    // Inyecta el servicio Router de Angular para poder trabajar con las rutas y la navegación.

    routes = routes
        .map((r) => ({
            path: r.path,
            title: `${r.title ?? "Maps en Angular"}`,
        }))
        // Recorre cada ruta y asegura que tenga un título. Si no lo tiene, le asigna "Maps en Angular" por defecto.

        .filter((r) => r.path != "**");
    // Filtra y elimina la ruta comodín "**" (usada normalmente para páginas no encontradas).

    pageTitle$ = this.router.events.pipe(
        filter((e) => e instanceof NavigationEnd),
        // Escucha los eventos de navegación y solo deja pasar los que indican que terminó una navegación.

        map((e) => e.url),
        // Extrae la URL de la ruta actual.

        map(
            (url) =>
                routes.find((route) => `/${route.path}` === url)?.title ??
                "Mapas"
        )
        // Busca en el arreglo de rutas cuál coincide con la URL actual, y devuelve su título.
        // Si no encuentra ninguna coincidencia, usa "Mapas" como título por defecto.
    );

    pageTitle = toSignal(
        //De esta forma se trabaja con señales

        this.router.events.pipe(
            filter((e) => e instanceof NavigationEnd),
            // Escucha los eventos de navegación y solo deja pasar los que indican que terminó una navegación.

            map((e) => e.url),
            // Extrae la URL de la ruta actual.

            map(
                (url) =>
                    routes.find((route) => `/${route.path}` === url)?.title ??
                    "Mapas"
            )
            // Busca en el arreglo de rutas cuál coincide con la URL actual, y devuelve su título.
            // Si no encuentra ninguna coincidencia, usa "Mapas" como título por defecto.
        )
    );
}
