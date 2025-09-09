import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-unauthorized-component',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './unauthorized-component.component.html',
  styleUrl: './unauthorized-component.component.css'
})
export class UnauthorizedComponentComponent {

}
