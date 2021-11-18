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
    this.FormBusqueda = this.formBuilder.group({});
    this.FormRegistro = this.formBuilder.group({
      Id: [0],
      Contacto: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
        ],
      ],
      TipoLlamada: [
        null,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
        ],
      ],
      FechaLlamada: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}'
          ),
        ],
      ],
      Activa: [true],
    });
  }
  Volver() {
    this.AccionABMC = 'L';
  }

  BuscarPorId(Llamada, AccionABMC) {
    window.scroll(0, 0); // ir al incio del scroll

    this.llamadasService.getById(Llamada.Id).subscribe((res: any) => {
      this.FormRegistro.patchValue(res);

      // debugger;
      var arrFecha = res.FechaLLamada.substr(0, 10).split('-');
      this.FormRegistro.controls.FechaLlamada.patchValue(
        arrFecha[2] + '/' + arrFecha[1] + '/' + arrFecha[0]
      );

      this.AccionABMC = AccionABMC;
    });
  }

  Modificar(Llamada) {
    if (!Llamada.Activa) {
      this.modalDialogService.Alert(
        'No puede modificarse un registro Inactivo.'
      );
      return;
    }
    this.submitted = false;
    this.FormRegistro.markAsUntouched();
    this.BuscarPorId(Llamada, 'M');
  }
  Buscar() {
    this.AccionABMC = 'L';
    this.llamadasService.get().subscribe((res: any) => {
      this.Llamadas = res;
      this.RegistrosTotal = res.RegistrosTotal;
    });
  }

  Grabar() {
    this.submitted = true;
    // verificar que los validadores esten OK
    if (this.FormRegistro.invalid) {
      return;
    }

    //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
    const itemCopy = { ...this.FormRegistro.value };

    //convertir fecha de string dd/MM/yyyy a ISO para que la entienda webapi
    var arrFecha = itemCopy.FechaLlamada.substr(0, 10).split('/');
    if (arrFecha.length == 3)
      itemCopy.FechaLlamada = new Date(
        arrFecha[2],
        arrFecha[1] - 1,
        arrFecha[0]
      ).toISOString();

    // agregar post
    if (this.AccionABMC == 'A') {
      this.llamadasService.post(itemCopy).subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert('Registro agregado correctamente.');
        this.Buscar();
      });
    } else {
      // modificar put
      this.llamadasService.put(itemCopy.Id, itemCopy).subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert('Registro modificado correctamente.');
        this.Buscar();
      });
    }
  }
}
