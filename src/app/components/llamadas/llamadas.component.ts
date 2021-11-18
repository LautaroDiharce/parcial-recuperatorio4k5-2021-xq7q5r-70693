import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Llamada } from '../../models/llamada';
import { LlamadasService } from '../../services/llamadas.service';
import { ModalDialogService } from '../../services/modal-dialog.service';

@Component({
  selector: 'app-llamadas',
  templateUrl: './llamadas.component.html',
  styleUrls: ['./llamadas.component.css'],
})
export class LlamadasComponent implements OnInit {
  Titulo = 'Llamadas';
  TituloAccionABMC = {
    A: '(Agregar)',
    B: '(Eliminar)',
    M: '(Modificar)',
    C: '(Consultar)',
    L: '(Listado)',
  };
  AccionABMC = 'L';
  FormBusqueda: FormGroup;
  FormRegistro: FormGroup;
  submitted = false;
  Llamadas: Llamada[] = null;
  RegistrosTotal: number;
  OpcionesActiva = [
    { Id: null, Nombre: '' },
    { Id: true, Nombre: 'SI' },
    { Id: false, Nombre: 'NO' },
  ];
  constructor(
    private llamadasService: LlamadasService,
    public formBuilder: FormBuilder,
    private modalDialogService: ModalDialogService
  ) {}

  ngOnInit() {
    this.FormBusqueda = this.formBuilder.group({
      Nombre: [''],
      Activo: [null],
    });
    this.FormRegistro = this.formBuilder.group({
      Id: [0],
      Nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(55),
        ],
      ],
      MaxPasajeros: [
        null,
        [Validators.required, Validators.pattern('[0-9]{1,7}')],
      ],
      FechaAlta: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}'
          ),
        ],
      ],
      Habilitado: [true],
    });
  }
  Volver() {
    this.AccionABMC = 'L';
  }

  Buscar() {
    this.AccionABMC = 'L';
    this.llamadasService
      .get()
      .subscribe((res: any) => {
        this.Llamadas = res;
        this.RegistrosTotal = res.RegistrosTotal;
        //console.log(this.Hoteles);
      });
    //console.log(this.Hoteles);
    //console.log(this.RegistrosTotal.toString());
  }
}
