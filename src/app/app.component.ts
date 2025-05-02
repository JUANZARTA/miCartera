import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'ng-menu-dashboard';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');

    if (redirect) {
      // Actualiza la URL sin recargar la página
      window.history.replaceState({}, '', redirect);
      // Opcional: Fuerza la navegación dentro de Angular si quieres que el componente se monte de inmediato
      this.router.navigateByUrl(redirect);
    }
  }
}
