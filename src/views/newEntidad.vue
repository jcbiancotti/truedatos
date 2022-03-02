<template>
<div class="container-fluid">

    <telon :hidden="hiddentelon"/>

    <h1 v-if="claveId != null">Definición de la entidad de datos: {{modelo.oDatosGenerales.descripcion}} ({{claveId}})</h1>
    <!-- TABS -->
    
    <!-- ICONO HAY ERRORES -->
    <div v-if="errores.length > 0" @click="E_expanded = !E_expanded" class="float-end p-2">

        <span v-if="error_grave > 0">Hay {{error_grave}} errores</span>
        <span v-if="error_grave == 0 && error_warning > 0">Hay {{error_warning}} alertas</span>

        <span v-if="E_expanded == false && error_grave > 0" class="iconos inline-icon btn-img material-icons float-end" style="color:red;" title="Errores bloqueante">error</span>
        <span v-if="E_expanded == false && error_grave == 0 && error_warning > 0" class="iconos inline-icon btn-img material-icons float-end" style="color:yellow;" title="Advertencias">warning</span>

        <span v-if="E_expanded == true && error_grave > 0" class="iconos inline-icon btn-img material-icons float-end" style="color:red;">close</span>
        <span v-if="E_expanded == true && error_grave == 0 && error_warning > 0"  class="iconos inline-icon btn-img material-icons float-end" style="color:yellow;">close</span>

    </div>


    <ul class="nav nav-pills" role="tablist">
        <li class="nav-item"><a class="nav-link" :class="{active : tab == 1}" @click="tab=1" data-toggle="tab" href="#datos-generales">Datos generales</a></li>
        <li class="nav-item"><a class="nav-link" :class="{active : tab == 2 && modelo.oDatosGenerales.tipo == 'L', disabled : modelo.oDatosGenerales.tipo != 'L'}" @click="tab=2" data-toggle="tab" href="#datos-lista">Lista de valores</a></li>
        <li class="nav-item"><a class="nav-link" :class="{active : tab == 3 && modelo.oDatosGenerales.tipo == 'T', disabled : modelo.oDatosGenerales.tipo != 'T'}" @click="tab=3" data-toggle="tab" href="#datos-tabla">Tabla</a></li>
        <li class="nav-item"><a class="nav-link" :class="{active : tab == 4 && modelo.oDatosGenerales.tipo == 'Q', disabled : modelo.oDatosGenerales.tipo != 'Q'}" @click="tab=4" data-toggle="tab" href="#datos-query">Consulta SQL</a></li>
        <li class="nav-item"><a class="nav-link" :class="{active : tab == 5 && modelo.oDatosGenerales.tipo == 'I', disabled : modelo.oDatosGenerales.tipo != 'I'}" @click="tab=5" data-toggle="tab" href="#datos-seleccionable">Seleccionable</a></li>

        <li class="nav-item"><a class="nav-link" :class="{active : tab == 9}" @click="Grabar()">Grabar</a></li>

    </ul>

    <!-- LISTA DE ERRORES -->
    <div v-if="E_expanded == true" style="border: 1px solid red;margin: 5px;border-radius: 5px !important;">

        <div class="float-end container-fluid">
            <span @click="Validaciones()" class="iconos inline-icon btn-img material-icons float-end" style="color:blue;" title="Comprobar errores">refresh</span>
        </div>

        <div v-for="err of errores" :key="err.idx">

            <div @click="enfocar(err.ref, err.tab)" class="input-group text-left" style="bacground-color: grey;cursor: pointer;">
                <div class="text-center" style="width:5%;">
                    {{err.idx}}
                </div>                
                <div style="width:15%;">
                    <span v-if="errDescripcion(err.codigo, 'C') == 1" class="iconos inline-icon btn-img material-icons" style="color:red;" title="Error bloqueante">error</span>
                    <span v-if="errDescripcion(err.codigo, 'C') == 2" class="iconos inline-icon btn-img material-icons" style="color:yellow;" title="Advertencia">warning</span>
                </div>
                <div style="width:20%;;">
                    {{err.codigo}} - {{errDescripcion(err.codigo, 'L')}}
                </div>
                <div style="width:60%;">
                    {{err.descripcion}}
                </div>
            </div>

        </div>

    </div>

    <!-- Tab panes -->
    <div class="tab-content">

        <!-- DATOS GENERALES -->
        <div id="datos-generales" class="container-fluid tab-pane fade " :class="{show : tab == 1, active : tab == 1}"><br>

            <div class="row justify-content-center">
            <div class="card" style="width: 90%;">

                <div class="card-header">
                    <h3>Datos generales de la entidad</h3>
                </div>
                <div class="card-body">

                    <form action @submit.prevent="cero">

                        <div class="form-group row" style="color: silver;">{{modelo.oDatosGenerales.entidadId}}</div>
                   
                        <!-- DESCRIPCION -->
                        <div class="input-group">
                            <div class="w-50 text-right">
                                <label>(*) Descripci&oacute;n:</label>
                            </div>
                            <div class="w-50">                            
                                <input ref="entdescripcion" type="text" class="form-control" v-model="modelo.oDatosGenerales.descripcion" placeholder="Descripción para identificar la entidad">
                            </div> 
                        </div>

                        <!-- TIPO -->
                        <!-- L: lista de valores  T: tabla   Q: Query  I: Selección para desplegable -->
                        <div class="input-group">
                            <div class="w-50 text-right">
                                <label>(*) Tipo de entidad:</label>
                            </div>
                            <div class="w-50">
                                <select ref="enttipo" class="form-select" v-model="this.modelo.oDatosGenerales.tipo">
                                    <option v-for="t of tipos" :key="t.id" :value="t.id" :disabled="t.id=='0'">{{t.literal}}</option>
                                </select>                                
                            </div> 
                        </div>                      

                        <!-- ENTORNO -->
                        <!-- S: Sistema  C: Core, comun a todo el sistema  M: Master, para uso por la empresa Master  G: Gestion, para uso por el cliente empresario -->
                        <div class="input-group">
                            <div class="w-50 text-right">
                                <label>(*) Entorno de disponibilidad:</label>
                            </div>
                            <div class="w-50">    
                                <select ref="ententorno" class="form-select" v-model="this.modelo.oDatosGenerales.entorno">
                                    <option v-for="t of entornos" :key="t.id" :value="t.id" :disabled="t.id=='0'">{{t.literal}}</option>
                                </select>                                                                
                            </div>    
                        </div>       

                    </form>

                </div>

            </div>
            </div>

        </div>

        <!-- LISTA DE VALORES -->
        <div id="datos-lista" class="container-fluid tab-pane fade " :class="{show : tab == 2, active : tab == 2}"><br>

            <div class="row justify-content-center">
            <div class="card" style="width: 90%;">

                <div class="card-header">
                    <h3>Lista de valores</h3>
                </div>
                <div class="card-body">

                    <!-- NUEVO REGISTRO -->
                    <div class="btn-img float-right" @click="expandir('L')">
                        <h3 class="float-right">Valores</h3>
                        <span v-if="L_expanded == false" class="material-icons">add_circle_outline</span>
                        <span v-if="L_expanded == true" class="material-icons">remove_circle_outline</span>
                    </div>

                    <div v-if="L_expanded">
                        <!-- <div> -->
                        <table>
                            <thead>
                                <th>Código</th>
                                <th>Valor</th>
                                <th>Descripción</th>
                                <th>Orden</th>
                                <th>Acciones</th>
                            </thead>
                            <tr>
                                <td style="width:15%;">
                                    <input ref="nuevo_codigo" type="text" class="form-control" style="width:100%;" v-model="lcodigo" placeholder="Código del item">
                                </td>                                
                                <td style="width:15%;">
                                    <input ref="nuevo_valor" type="text" class="form-control" style="width:100%;" v-model="lvalor" placeholder="Valor que devolverá el item">
                                </td>
                                <td style="width:50%;">
                                    <input ref="nueva_descripcion" type="text" class="form-control" style="width:100%;" v-model="ldescripcion" placeholder="Texto a mostrar en la lista">
                                </td>
                                <td style="width:10%;">
                                    <input ref="nuevo_orden" type="number" class="form-control" style="width:100%;" v-model="lorden" placeholder="Orden">
                                </td>                                
                                <td style="width:10%;">
                                    <span @click="lAgregar()" class="iconos inline-icon btn-img material-icons" title="Agregar a la lista">save_alt</span>
                                    <span @click="lDescartar()" class="iconos inline-icon btn-img material-icons" title="Descartar">clear</span>
                                </td>
                            </tr>
                        </table>
                    </div>

                    <!-- LISTA DE REGISTROS -->
                    <div class="tableFixHead table-responsive">
                    <table >
                        <thead>
                            <th>Código</th>
                            <th>Valor</th>
                            <th>Descripción</th>
                            <th>Orden</th>
                            <th>Acciones</th>
                        </thead>
                        <tr v-for="registro of modelo.oLista" :key="registro.id">
                            <td>{{registro.codigo}}</td>
                            <td>{{registro.valor}}</td>
                            <td>{{registro.descripcion}}</td>
                            <td>{{registro.orden}}</td>
                            <td>
                                <span @click="lQuitar(registro.id)" class="iconos inline-icon btn-img material-icons" title="Eliminar de la lista">delete</span>
                                <span @click="lEditar(registro.id)" class="iconos inline-icon btn-img material-icons" title="Editar este registro">mode_edit</span>
                            </td>
                        </tr>

                    </table>
                    </div>
                    


                </div>

            </div>
            </div>

        </div>

        <!-- TABLAS -->
        <div id="datos-tabla" class="container-fluid tab-pane fade " :class="{show : tab == 3, active : tab == 3}"><br>

            <div class="row justify-content-center">
            <div class="card" style="width: 90%;">

                <div class="card-header">
                    <h3>Tabla</h3>
                </div>
                <div class="card-body">

                    <form action @submit.prevent="cero">

                        <div @click="S_expanded = !S_expanded" class="w-100 text-end p-2">
                            <span>Sincronizar con la base de datos</span>
                            <span v-if="S_expanded == false" class="iconos inline-icon btn-img material-icons float-end" title="Sincronizar con la base de datos">auto_fix_normal</span>
                            <span v-if="S_expanded == true" class="iconos inline-icon btn-img material-icons float-end" title="Sincronizar con la base de datos">auto_fix_off</span>
                        </div>


                        <!-- NOMBRE -->
                        <div class="w-50 text-left input-group addon">
                            <label>(*) Nombre de la tabla:</label>
                            <input ref="nombreTabla" type="text" class="form-control" v-model="modelo.oTabla.nombre" placeholder="Nombre de la tabla">
                        </div> 

                        <!-- SINCRONIZACION -->
                        <div v-if="S_expanded" class="w-100 p-2 text-start" style="border: 1px solid var(--true-button-border);margin: 5px;border-radius: 5px !important;">

                            <div class="w-100 text-end">
                                <span @click="importarDefinicion()" class="iconos inline-icon btn-img material-icons float-end" title="Importar definición desde la tabla">switch_access_shortcut</span>                                
                                <span @click="aplicarCorrecciones()" class="iconos inline-icon btn-img material-icons float-end" title="Aplicar cambios">save_alt</span>                                
                                <span @click="comprobarDiferencias()" class="iconos inline-icon btn-img material-icons float-end" title="Comprobar diferencias">sync</span>
                            </div>

                            <h3>Sincronización</h3>

                            <div v-for="tarea of tDiferencias" :key="tarea.idx">

                                <div class="input-group text-left text-left" style="cursor: pointer;">

                                    <div style="width:15%;">
                                        <span v-if="tarea.criticidad == 0" class="iconos inline-icon btn-img material-icons" style="color:green;" title="Sin acción necesaria">check_circle_outline</span>
                                        <span v-if="tarea.criticidad == 1" class="iconos inline-icon btn-img material-icons" style="color:red;" title="Error bloqueante">error</span>
                                        <span v-if="tarea.criticidad == 2" class="iconos inline-icon btn-img material-icons" style="color:yellow;" title="Advertencia">warning</span>
                                    </div>
                                    <div style="width:55%;padding-right:5px;">
                                        {{tarea.mensaje}}
                                    </div>
                                    <div style="width:25%;">
                                        <span v-if="tarea.hecha == 1" class="iconos inline-icon btn-img material-icons" style="color:green;" title="Realizado con exito">check_circle_outline</span>
                                        <span v-if="tarea.hecha == 2" class="iconos inline-icon btn-img material-icons" style="color:red;" title="Realizado con exito">error</span>
                                        <span>Accion:</span>
                                        {{tarea.accion}}
                                    </div>
                                    <div style="width:5%;">
                                        <span @click="tarea.verSQL = !tarea.verSQL" v-if="tarea.sql != '' && tarea.verSQL == false" class="iconos inline-icon btn-img material-icons" title="Ver instrucción SQL">visibility</span>
                                        <span @click="tarea.verSQL = !tarea.verSQL" v-if="tarea.sql != '' && tarea.verSQL == true"  class="iconos inline-icon btn-img material-icons" title="Ocultar instrucción SQL">visibility_off</span>
                                    </div>  
                                    <div style="width:15%;" v-if="tarea.sql != '' && tarea.verSQL == true"></div>                                          
                                    <div style="width:85%;color:grey;padding-bottom: 10px;" v-if="tarea.sql != '' && tarea.verSQL == true">
                                        {{tarea.sql}}
                                    </div>  

                                </div>

                            </div>

                        </div>  

                        <!-- NUEVO CAMPO -->
                        <div class="btn-img float-right" @click="expandir('T')">
                            <h3 class="float-right">Campos</h3>
                            <span v-if="T_expanded == false" class="material-icons">add_circle_outline</span>
                            <span v-if="T_expanded == true" class="material-icons">remove_circle_outline</span>
                        </div>

                        <div v-if="T_expanded">

                            <table>
                                <!-- PRIMER RENGLON -->
                                <tr>
                                    <td style="width:30%;">
                                        <div class="input-group addon">
                                            <label for="nuevo_cnombre">Nombre:</label>
                                            <input ref="nuevo_cnombre" id="nuevo_cnombre" type="text" class="form-control" style="width:70%;" v-model="tnombre" placeholder="Nombre del campo">
                                        </div>
                                    </td>                                
                                    <td style="width:15%;">
                                        <div class="input-group addon">
                                            <label for="nuevo_ctipo">Tipo:</label>
                                            <select id="nuevo_ctipo" class="form-select" v-model="ttipo" @change="tdefault='';tdecimales=decXtipo;tancho=anchoXtipo">
                                                <option v-for="t of ttipos" :key="t.id" :value="t.id" :disabled="t.id=='0'">{{t.literal}}</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td style="width:10%;">
                                        <div class="input-group addon">
                                            <label for="nuevo_cancho" v-if="ttipo=='C' || ttipo=='A'">Ancho:</label>                                        
                                            <label for="nuevo_cancho" v-if="ttipo=='N' || ttipo=='M'">Parte entera:</label>                                        
                                            <input 
                                                ref="nuevo_cancho" 
                                                id="nuevo_cancho"
                                                v-if="ttipo=='C' || ttipo=='N' || ttipo=='M' || ttipo=='A'" 
                                                type="number" 
                                                min="1" 
                                                :max="maxXtipo" 
                                                class="form-control" 
                                                style="width:40%;" 
                                                v-model="tancho"
                                                @change="tdecimales = decXtipo">
                                        </div>
                                    </td>
                                    <td style="width:10%;">
                                        <div class="input-group addon">
                                            <label for="nuevo_cdecimales" v-if="ttipo=='N' || ttipo=='M'" type="number">Decimales:</label> 
                                            <input 
                                                ref="nuevo_cdecimales" 
                                                id="nuevo_cdecimales"
                                                v-if="ttipo=='N' || ttipo=='M'" type="number" 
                                                min="0" 
                                                :max="maxDecimales" 
                                                class="form-control" 
                                                style="width:50%;" 
                                                v-model="tdecimales"
                                                @change="numberChange(tdefault)"
                                                >
                                        </div>
                                    </td>   
                                                                
                                    <td style="width:10%;">
                                        <span @click="tAgregar()" class="iconos inline-icon btn-img material-icons" title="Agregar a la lista">save_alt</span>
                                        <span @click="tDescartar()" class="iconos inline-icon btn-img material-icons" title="Descartar">clear</span>
                                    </td>
                                </tr>
                                <!-- SEGUNDO RENGLON -->
                                <tr>
                                    <td style="width:30%;">
                                        <div class="input-group addon">
                                            <label for="nuevo_clabel">Etiqueta:</label>
                                            <input ref="nuevo_clabel" id="nuevo_clabel" type="text" class="form-control" style="width: 70%;" v-model="tlabel" placeholder="Etiqueta">
                                        </div>
                                    </td>                                
                                    <td colspan="3">
                                        <!-- VALOR POR DEFECTO SEGUN EL TIPO -->
                                        <div v-if="ttipo=='C'" class="input-group addon">
                                            <label for="nuevo_cdefault">Valor inicial:</label>
                                            <input ref="nuevo_cdefault" id="nuevo_cdefault" type="text" class="form-control" :maxlength="tancho" style="width:60%;" v-model="largoDefault" placeholder="Valor inicial">
                                        </div>
  
                                        <div v-if="ttipo=='D'" class="input-group addon">
                                            <label for="nuevo_cdefault">Valor inicial:</label>
                                            <input ref="nuevo_cdefault" id="nuevo_cdefault" type="date" class="form-control" :maxlength="tancho" style="width:60%;" v-model="largoDefault" placeholder="Valor inicial">
                                        </div> 
                                        <div v-if="ttipo=='T'" class="input-group addon">
                                            <label for="nuevo_cdefault">Valor inicial:</label>
                                            <input ref="nuevo_cdefault" id="nuevo_cdefault" type="datetime-local" class="form-control" :maxlength="tancho" style="width:60%;" v-model="largoDefault" placeholder="Valor inicial">
                                        </div>    
                                        <div v-if="ttipo=='H'" class="input-group addon">
                                            <label for="nuevo_cdefault">Valor inicial:</label>
                                            <input ref="nuevo_cdefault" id="nuevo_cdefault" type="time" class="form-control" :maxlength="tancho" style="width:60%;" v-model="largoDefault" placeholder="Valor inicial">
                                        </div>       
                                        <div v-if="ttipo=='A'" class="input-group addon mb-3">
                                            <label for="nuevo_cdefault">Valor inicial:</label>
                                            <textarea ref="nuevo_cdefault" id="nuevo_cdefault" class="form-control" cols="50" :maxlength="tancho" style="width:100%;" v-model="largoDefault" placeholder="Valor inicial"></textarea>
                                        </div>
                                        <div v-if="ttipo=='K'">
                                            <div class="input-group addon">
                                                <label for="nuevo_cdefault">Valor inicial:</label>
                                                <label class="content-input">
                                                    <input ref="nuevo_cdefault" id="nuevo_cdefault" type="checkbox" v-model="largoDefault">
                                                    <i></i>
                                                </label>                                              
                                            </div>
                                        </div>        
                                        <div v-if="ttipo=='N' || ttipo=='M'" class="input-group addon">
                                            <label for="nuevo_cdefault">Valor inicial:</label>
                                            <input 
                                                ref="nuevo_cdefault" 
                                                id="nuevo_cdefault" 
                                                type="text" style="width:60%;" 
                                                class="form-control" 
                                                :value="tdefault" 
                                                @blur="validarDefault($event)" 
                                                :title="`${'Valor máximo: ' + valorMaximoDefault}`" >
                                                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="z-index:9999" v-if="Numerico(tdefault) > valorMaximoDefault">Máx: {{valorMaximoDefault}}</span>
                                        </div>                                               

                                    </td>
                                    <td style="color:red;">
                                        {{tMensaje}}
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <!-- LISTA DE CAMPOS -->
                        <div class="tableFixHead table-responsive">
                        <table >
                            <thead>
                                <th>Nombre</th>
                                <th>Tipo</th>
                                <th>Ancho</th>
                                <th>Decimales</th>
                                <th>Etiqueta</th>
                                <th>Valor inicial</th>
                                <th>Acciones</th>
                            </thead>
                            <tr v-for="registro of modelo.oTabla.oCampos" :key="registro.id">
                                <td>{{registro.nombre}}</td>
                                <td>  
                                    <!-- {{registro.tipo}} -->
                                    {{ttipos[ttipos.findIndex(x => x.id === registro.tipo)].literal}}
                                </td>
                                <td><span v-if="registro.tipo=='C' || registro.tipo=='A' || registro.tipo=='N' || registro.tipo=='M'">{{registro.ancho}}</span></td>
                                <td><span v-if="registro.tipo=='N' || registro.tipo=='M'">{{registro.decimales}}</span></td>
                                <td>{{registro.etiqueta}}</td>
                                <td v-if="registro.tipo=='K' && registro.default==true">SI</td>
                                <td v-if="registro.tipo=='K' && registro.default==false">NO</td>
                                <td v-if="registro.tipo!='K'">{{registro.default}}</td>
                                <td>
                                    <span @click="tQuitar(registro.id)" class="iconos inline-icon btn-img material-icons" title="Eliminar de la lista">delete</span>
                                    <span @click="tEditar(registro.id)" class="iconos inline-icon btn-img material-icons" title="Editar este registro">mode_edit</span>
                                </td>
                            </tr>

                        </table>
                        </div>

                    </form>


                </div>

            </div>
            </div>

        </div>

        <!-- QUERYS -->
        <div id="datos-query" class="container-fluid tab-pane fade " :class="{show : tab == 4, active : tab == 4}"><br>

            <div class="row justify-content-center">
            <div class="card" style="width: 90%;">

                <div class="card-header">
                    <h3>Consulta SQL</h3>
                </div>
                <div class="card-body">

                    <form action @submit.prevent="cero">

                        <!-- CONSULTA SQL  -->
                        <div class="w-100 text-left">
                            <label>(*) Consulta SQL:</label>
                            <span @click="qComprobar()" class="iconos inline-icon btn-img material-icons float-right" title="Comprobar la consulta">check_circle_outline</span>
                        </div>
                        <div class="w-100 text-right" v-if="mensageValidacionSQL !=''">
                            <span @click="mensageValidacionSQL = ''" class="iconos inline-icon btn-img material-icons float-right" style="color: silver;">close</span>
                            {{mensageValidacionSQL}}
                        </div>
                        <div class="w-100 input-group addon">
                            <textarea ref="consultasql" id="consultasql" class="form-control" rows="5" :maxlength="5000" style="height: 100px;width: 100%;font-family:Courier" v-model="modelo.oQuery.cadenaSQL" placeholder="Consulta SQL completa"></textarea>
                        </div> 

                        <!-- FILTROS-->
                        <div class="btn-img float-right" @click="expandir('F')">
                            <h3 class="float-right">Filtros</h3>
                            <span v-if="F_expanded == false" class="material-icons">add_circle_outline</span>
                            <span v-if="F_expanded == true" class="material-icons">remove_circle_outline</span>
                        </div>                        
                        <div v-if="F_expanded">

                            <table>
                                <!-- PRIMER RENGLON -->
                                <tr>
                                    <td style="width:35%;">
                                        <div class="input-group addon">
                                            <label for="fetiqueta">(*) Etiqueta:</label>
                                            <input ref="fetiqueta" id="fetiqueta" type="text" class="form-control" style="width:70%;" v-model="fetiqueta" placeholder="Etiqueta para el filtro">
                                        </div>
                                    </td> 
                                    <td style="width:30%;">
                                        <div class="input-group addon">
                                            <label for="ftipo">Tipo:</label>
                                            <select id="ftipo" class="form-select" v-model="ftipo" >
                                                <option v-for="t of ftipos" :key="t.id" :value="t.id" :disabled="t.id=='0'">{{t.literal}}</option>
                                            </select>
                                        </div>
                                    </td>  
                                    <td style="width:10%;">
                                        <span @click="fAgregar()" class="iconos inline-icon btn-img material-icons" title="Agregar a la lista">save_alt</span>
                                        <span @click="fDescartar()" class="iconos inline-icon btn-img material-icons" title="Descartar">clear</span>
                                    </td>                                    
                                </tr>
                                <!-- SEGUNDO RENGLON -->
                                <tr>                                       
                                    <td style="width:30%;">
                                        <div class="input-group addon">
                                            <label for="fcampo">(*) Variable en la consulta:</label>
                                            <input ref="fcampo" id="fcampo" type="text" class="form-control" style="width:70%;" v-model="fcampo" placeholder="Variable dentro de la consulta">
                                        </div>
                                    </td>                                                               
                                    <td style="width:10%;">
                                        <div class="input-group addon">
                                            <label for="fobligatorio">Indicación obligatoria:</label>
                                            <label class="content-input">
                                                <input ref="fobligatorio" id="fobligatorio" type="checkbox" v-model="fobligatorio">
                                                <i></i>
                                            </label>                                              
                                        </div>
                                    </td>                                                                

                                </tr>
                            </table>
                        </div>

                        <!-- LISTA DE FILTROS -->
                        <div class="tableFixHead table-responsive">
                        <table >
                            <thead>
                                <th>Etiqueta</th>
                                <th>Tipo de filtro</th>
                                <th>Variable en la consulta</th>
                                <th>Obligatorio</th>
                                <th>Acciones</th>
                            </thead>
                            <tr v-for="registro of modelo.oQuery.oFiltros" :key="registro.id">
                                <td>{{registro.etiqueta}}</td>
                                <td>  
                                    {{ftipos[ftipos.findIndex(x => x.id === registro.tipo)].literal}}
                                </td>
                                <td>{{registro.campo}}</td>
                                <td v-if="registro.obligatorio==true">SI</td>
                                <td v-if="registro.obligatorio==false">NO</td>  
                                <td>
                                    <span @click="fQuitar(registro.id)" class="iconos inline-icon btn-img material-icons" title="Eliminar de la lista">delete</span>
                                    <span @click="fEditar(registro.id)" class="iconos inline-icon btn-img material-icons" title="Editar este registro">mode_edit</span>
                                </td>
                            </tr>

                        </table>
                        </div>


                    </form>

                </div>

            </div>
            </div>

        </div>

        <!-- SELECCIONABLE -->
        <div id="datos-seleccionable" class="container-fluid tab-pane fade " :class="{show : tab == 5, active : tab == 5}"><br>

            <div class="row justify-content-center">
            <div class="card" style="width: 90%;">

                <div class="card-header">
                    <h3>Selección para desplegable</h3>
                </div>
                <div class="card-body">

                    <form action @submit.prevent="cero">

                        <table>
                            <!-- QUERY -->
                            <tr>
                                <td class="text-end">
                                    <label>(*) Consulta de datos:</label>
                                </td>
                                <td class="text-start">
                                    <select ref="selectableQuery" class="form-select" v-model="modelo.oSelectable.idQuery" @change="cargaCamposConsulta()">
                                        <option v-for="q of aQuerys" :key="q.id" :disabled="q.id=='0'" :value="q.id">{{q.id}} {{q.descripcion}}</option>
                                    </select>
                                </td>
                                <td class="text-start">
                                    <span v-if="modelo.oSelectable.idQuery == '0'" class="iconos inline-icon btn-img material-icons" title="Selecciona una consulta">visibility_off</span>
                                    <span @click="CargaConsulta(modelo.oSelectable.idQuery)" v-if="modelo.oSelectable.idQuery != '0'" class="iconos inline-icon btn-img material-icons" title="Ver consulta">visibility</span>
                                </td>
                            </tr>
                            <tr v-if="modelo.oSelectable.idQuery != '0' && icadenaSQL != ''">
                                <td colspan="3"> 
                                    <div  class="w-100 input-group addon pb-4">
                                        <div class="container-fluid">
                                            <span @click="icadenaSQL = ''" class="iconos inline-icon btn-img material-icons float-end" title="Cerrar">close</span>
                                        </div>
                                        <textarea ref="iconsultasql" id="iconsultasql" class="form-control" disabled rows="5" :maxlength="5000" style="height: 100px;width: 100%;font-family:Courier" v-model="icadenaSQL" placeholder="Consulta SQL completa"></textarea>
                                    </div>
                                </td> 
                            </tr>

                            <!-- CAMPO VALOR -->
                            <tr>
                                <td class="text-end">
                                    <label>(*) Campo para el valor:</label>
                                </td>
                                <td class="text-start">
                                    <select ref="selectableValor" class="form-select" v-model="modelo.oSelectable.campo_valor">
                                        <option v-for="q of aCampos" :key="q.id" :disabled="q.id=='0'" :value="q.id">{{q.descripcion}}</option>
                                    </select>
                                </td>
                            </tr>

                            <!-- CAMPO DESCRIPCION -->
                            <tr>
                                <td class="text-end">
                                    <label>(*) Campo para la descripción:</label>
                                </td>
                                <td class="text-start">
                                    <select ref="selectableDescripcion" class="form-select" v-model="modelo.oSelectable.campo_descripcion">
                                        <option v-for="q of aCampos" :key="q.id" :disabled="q.id=='0'" :value="q.id">{{q.descripcion}}</option>
                                    </select>
                                </td>
                            </tr>
                        </table>

                    </form>

                </div>

            </div>
            </div>

        </div>



    <!-- fin tab panes -->
    </div>

</div>
</template>

<script>

import global from '@/utils/global'
import funciones from '@/utils/funciones'
import datos from '@/utils/datos'
import telon from '@/components/visuales/telon'


export default {
    name: 'NewEntidad',
    components:{
        telon,

    },
    data() {

        return {
            tab: 1,
            errores: [], error_grave: 0, error_warning: 0,
            mensageValidacionSQL: '',
            hiddentelon: true,
            E_expanded: false,   // Lista de errores
            L_expanded: false,   // Lista de valores, nuevo valor
            T_expanded: false,   // Tabla, nuevo campo
            F_expanded: false,   // Querys, nuevo filtro
            S_expanded: false,   // Tabla, Sincronizar con BBDD
            // claveId recibida para editar
            claveId: '',
            tipos: [
                {id: '0', literal: 'Selecciona una opción ...'},
                {id: 'L', literal: 'Lista de valores'},
                {id: 'T', literal: 'Tabla'},
                {id: 'Q', literal: 'Consulta SQL'},
                {id: 'I', literal: 'Selección para desplegable'}
            ],
            entornos: [
                {id: '0', literal: 'Selecciona una opción ...'},
                {id: 'C', literal: 'CORE: común para todo el sistema'},
                {id: 'M', literal: 'MASTER: solo utilizable en funcionalidades de la empresa Master'},
                {id: 'G', literal: 'GESTION: utilizable en las funcionalidades del cliente'}
            ],            
            // nueva linea de la lista de valores
            L_id: funciones.generarUUID2(),
            lvalor: '',
            lcodigo: '',
            ldescripcion: '',
            lorden: 0,
            // nuevo campo en la tabla
            tMensaje: '',
            T_id: funciones.generarUUID2(),
            tnombre: '',
            ttipo: '0',
            tancho: 50,
            tdecimales: 0, 
            tlabel: '',
            tdefault: '',
            ttipos: [
                {id:"0",literal:"Selecciona ..."},
                {id:"C",literal:"Caracteres"},
                {id:"N",literal:"Numérico"},
                {id:"M",literal:"Moneda"},
                {id:"K",literal:"Si/No"},
                {id:"D",literal:"Fecha"},
                {id:"T",literal:"Fecha y hora"},
                {id:"H",literal:"Hora"},
                {id:"A",literal:"Area de texto"}],           
            tDiferencias: [],
            // Filtros del la consulta sql
            F_id: funciones.generarUUID2(),
            fetiqueta: '',
            fcampo: '',
            fobligatorio: false,
            ftipo: '0',
            ftipos: [
                {id:"0",literal:"Selecciona ..."},
                {id:"C",literal:"Caracteres"},
                {id:"N",literal:"Numérico"},
                {id:"M",literal:"Moneda"},
                {id:"K",literal:"Si/No"},
                {id:"D",literal:"Fecha"},
                {id:"T",literal:"Fecha y hora"},
                {id:"H",literal:"Hora"}],
            // Seleccionable
            aQuerys: [],
            aCampos: [],
            icadenaSQL: '',
            // Modelo de la entidad
            modelo: {
                oDatosGenerales: {
                    entidadId: funciones.generarUUID2(), 
                    tipo: '0',        // L: lista de valores  T: tabla   Q: Query  I: Selección para desplegable
                    descripcion: '',
                    entorno: '0',     // S: Sistema  C: Core, comun a todo el sistema  M: Master, para uso por la empresa Master  G: Gestion, para uso por el cliente empresario
                },
                oLista: [],
                oTabla: {
                    nombre: '',
                    oCampos: []
                },
                oQuery: {
                    cadenaSQL: '',
                    oFiltros: []
                },
                oSelectable: {
                    idQuery: '0',
                    campo_valor: '0',
                    campo_descripcion: '0'     
                }
            },

        }
    },
    methods: {
        cero(e) {
            e.preventDefault();
        },
        numberChange(valor) {

            let monetario = null;
            if(this.ttipo == 'M')
                monetario = global.currencySimbol;

            this.tdefault = funciones.formatNumber(valor, monetario, this.tdecimales);

        }, 
        Numerico(pval) {
            return pval.replace('.',',').replace(',','.');
        }, 
        enfocar(referencia, tabulacion) {
            this.tab = tabulacion;
            if(referencia != null) {
                this.$nextTick(() => {
                    this.$refs[referencia].focus();
                })
            }

        },
        errDescripcion(pCodigo, que) {
            let err = funciones.tablaErrores(pCodigo);
            if(que == 'L')
                return err.literal;

            if(que == 'C')
                return err.criticidad;

        },
        LeerDatos() {

            try {

                this.hiddentelon = false;

                datos.leerLista('sys_modelo_datos', "id='" + this.claveId + "'", ['objeto'], '')
                .then((result) => {

                    if(result.success == 1 && result.status == 200) {
                        this.modelo = JSON.parse(result.data[0].objeto.split('&quot;').join('"'));

                        this.cargaCamposConsulta();
                        
                    }
                }).finally(() => {
                    this.hiddentelon = true;              
                })

            } catch(error) {
                console.log(error);
            }

        },
        async Validaciones() {

            this.errores = [];
            this.error_grave = 0;
            this.error_warning = 0;

            // Limpiar los objetos que no aplican
            switch(this.modelo.oDatosGenerales.tipo) {
            case 'L':
                this.modelo.oTabla.nombre = '';
                this.modelo.oTabla.oCampos = [];
                this.modelo.oQuery.cadenaSQL = '';
                this.modelo.oQuery.oFiltros = [];
                this.modelo.oSelectable.idQuery = '';
                this.modelo.oSelectable.campo_codigo = '';
                this.modelo.oSelectable.campo_valor = '';
                this.modelo.oSelectable.campo_descripcion = '';     
                break;      
                
            case 'T':
                this.modelo.oLista = [];
                this.modelo.oQuery.cadenaSQL = '';
                this.modelo.oQuery.oFiltros = [];
                this.modelo.oSelectable.idQuery = '';
                this.modelo.oSelectable.campo_codigo = '';
                this.modelo.oSelectable.campo_valor = '';
                this.modelo.oSelectable.campo_descripcion = '';     
                break;    
                
            case 'Q':
                this.modelo.oLista = [];
                this.modelo.oTabla.nombre = '';
                this.modelo.oTabla.oCampos = [];                                    
                this.modelo.oSelectable.idQuery = '';
                this.modelo.oSelectable.campo_codigo = '';
                this.modelo.oSelectable.campo_valor = '';
                this.modelo.oSelectable.campo_descripcion = '';     
                break;                                        
                
            case 'I':
                this.modelo.oLista = [];
                this.modelo.oTabla.nombre = '';
                this.modelo.oTabla.oCampos = [];                                    
                this.modelo.oQuery.cadenaSQL = '';
                this.modelo.oQuery.oFiltros = [];
                break;       

            }

            // Remplazar espacios
            this.modelo.oTabla.nombre = this.modelo.oTabla.nombre.split(' ').join('_');

            // Datos generales
            if(this.modelo.oDatosGenerales.descripcion == '') {
                this.errores.push({
                    idx: this.errores.length + 1,
                    codigo: 'e001',   // 'e001' Falta rellenar el campo
                    descripcion: "No has indicado la descripción",
                    ref: 'entdescripcion',
                    tab: 1
                })
                this.error_grave++;
            }
            if(this.modelo.oDatosGenerales.tipo == 0) {
                this.errores.push({
                    idx: this.errores.length + 1,
                    codigo: 'e001',   // 'e001' Falta rellenar el campo
                    descripcion: "No has indicado el tipo de entidad",
                    ref: 'enttipo',
                    tab: 1
                })
                this.error_grave++;
            }
            if(this.modelo.oDatosGenerales.entorno == 0) {
                this.errores.push({
                    idx: this.errores.length + 1,
                    codigo: 'e002',   // 'e002' Alerta
                    descripcion: "No has indicado el entorno, (se asumirá CORE, es decir, común a todo el sistema)",
                    ref: 'ententorno',
                    tab: 1
                })
                this.error_warning++;
            }  

            // Lista de valores
            if(this.modelo.oDatosGenerales.tipo == 'L' && this.modelo.oLista.length == 0) {
                this.errores.push({
                    idx: this.errores.length + 1,
                    codigo: 'e001',   // 'e002' Alerta
                    descripcion: "Has indicado que la entidad es una lista de valores pero no has definido los valores",
                    ref: null,
                    tab: 2
                })
                this.error_grave++;
            }  

            // Tablas
            if(this.modelo.oDatosGenerales.tipo == 'T' && this.modelo.oTabla.nombre == '') {
                this.errores.push({
                    idx: this.errores.length + 1,
                    codigo: 'e001',   // 'e002' Alerta
                    descripcion: "Has indicado que la entidad es una tabla pero no has indicado su nombre",
                    ref: 'nombreTabla',
                    tab: 3
                })
                this.error_grave++;
            }              
            if(this.modelo.oDatosGenerales.tipo == 'T' && this.modelo.oTabla.oCampos.length == 0) {
                this.errores.push({
                    idx: this.errores.length + 1,
                    codigo: 'e001',   // 'e002' Alerta
                    descripcion: "Has indicado que la entidad es una tabla pero no has descrito los campos",
                    ref: null,
                    tab: 3
                })
                this.error_grave++;
            } 

            // Querys
            if(this.modelo.oDatosGenerales.tipo == 'Q' && this.modelo.oQuery.cadenaSQL == '') {
                this.errores.push({
                    idx: this.errores.length + 1,
                    codigo: 'e001',   // 'e002' Alerta
                    descripcion: "Has indicado que la entidad es una Consulta SQL pero no la has definido",
                    ref: 'consultasql',
                    tab: 4
                })
                this.error_grave++;
            }              
            if(this.modelo.oDatosGenerales.tipo == 'Q' && this.modelo.oQuery.oFiltros.length == 0) {
                this.errores.push({
                    idx: this.errores.length + 1,
                    codigo: 'e002',   // 'e002' Alerta
                    descripcion: "Has indicado que la entidad es una Consulta SQL pero no has incluido filtros. Continúa si es correcto",
                    ref: null,
                    tab: 4
                })
                this.error_warning++;
            }  

            // Seleccionable
            if(this.modelo.oDatosGenerales.tipo == 'I' && this.modelo.oSelectable.idQuery == '0') {
                this.errores.push({
                    idx: this.errores.length + 1,
                    codigo: 'e001',   // 'e002' Alerta
                    descripcion: "Has indicado que la entidad es una selección para un desplegable pero no has indicado la consulta de los datos",
                    ref: 'selectableQuery',
                    tab: 5
                })
                this.error_grave++;
            }              
            if(this.modelo.oDatosGenerales.tipo == 'I' && this.modelo.oSelectable.campo_valor == '0') {
                this.errores.push({
                    idx: this.errores.length + 1,
                    codigo: 'e001',   // 'e002' Alerta
                    descripcion: "Has indicado que la entidad es una selección para un desplegable pero no has indicado el campo para el valor",
                    ref: 'selectableValor',
                    tab: 5
                })
                this.error_grave++;
            }    
            if(this.modelo.oDatosGenerales.tipo == 'I' && this.modelo.oSelectable.campo_descripcion == '0') {
                this.errores.push({
                    idx: this.errores.length + 1,
                    codigo: 'e001',   // 'e002' Alerta
                    descripcion: "Has indicado que la entidad es una selección para un desplegable pero no has indicado el campo para la descripción",
                    ref: 'selectableDescripcion',
                    tab: 5
                })
                this.error_grave++;
            }    
            // *************************************************************************************** //                        
            if(this.error_grave == 0 && this.error_warning == 0) {
                this.E_expanded = false;
            }

        },
        Grabar() {

            this.Validaciones()
            .then(() => {

                // Hay errores
                if(this.error_grave > 0) {
                    funciones.popAlert('error', 'Hay errores que no permiten guardar', true, false, 8000, "Ok")
                    .then(() => {
                        return;
                    })
                } else if (this.error_warning > 0) {

                    funciones.popAlert('warning', 'Faltan datos importantes, quieres continuar?', true, true, 8000, "Sí")
                    .then((result) => {

                        if(result==true) {

                            // Con warning - Guardar
                            if(this.claveId == null) {
                                // Almacenar nuevo 
                                this.Agregar();
                            } else {    
                                // Actualizar claveId
                                this.Actualizar();
                            }

                        }
                    
                    })

                } else {

                    // Sin errores - Guardar
                    funciones.popAlert('question', 'Quieres guardar la definición de la entidad de datos?', true, true, 8000, "Sí")
                    .then((result) => {

                        if(result==true) {

                            if(this.claveId == null) {
                                // Almacenar nuevo documento
                                this.Agregar();
                            } else {    
                                // Actualizar el documento claveId
                                this.Actualizar();
                            }
                            
                        }
                    })

                }

            })

        },
        Agregar() {

            try{

                this.hiddentelon = false;

                let tmp = this.modelo;
                let almacenar = "";

                // Almacenar nueva definición
                almacenar = {
                    id:          tmp.oDatosGenerales.entidadId, 
                    descripcion: tmp.oDatosGenerales.descripcion, 
                    tipo:        tmp.oDatosGenerales.tipo,
                    entorno:     tmp.oDatosGenerales.entorno, 
                    objeto:      JSON.stringify(this.modelo, null, '\t')
                };
                datos.grabarEntidad(almacenar)
                .then((result) => {

                    if(result.success == 1 && result.status == 201) {

                        funciones.popAlert("success", "Datos almacenados!", true, false, 3000, "ok")
                        .then(() => {
                            this.$router.push('/inicio');
                        })

                    } else {
                        funciones.popAlert("error", "No se ha podido grabar en este momento! (ce001)", true, false, 3000, "ok");
                    }

                }).finally(() => {
                    this.hiddentelon = true;              
                })

            } catch (error) {
                console.log(error);
            }            
        },
        Actualizar() {

           try {

                let tmp = this.modelo;
                let almacenar = "";

                // Actualizar las propiedades de la entidad
                almacenar = {
                    id:          tmp.oDatosGenerales.entidadId, 
                    descripcion: tmp.oDatosGenerales.descripcion, 
                    tipo:        tmp.oDatosGenerales.tipo,
                    entorno:     tmp.oDatosGenerales.entorno, 
                    objeto:      JSON.stringify(this.modelo, null, '\t')
                };                
                datos.actualizarEntidad("id='" + tmp.oDatosGenerales.entidadId + "'", almacenar)
                .then((result) => {

                    if(result.success == 1 && result.status == 200) {

                        funciones.popAlert("success", "Datos actualizados!", true, false, 3000, "ok")
                        .then(() => {
                            this.$router.push('/inicio');
                        });

                    } else {
                        funciones.popAlert("error", "No se ha podido grabar en este momento! (ce001)", true, false, 3000, "ok");
                    }

                }).finally(() => {
                    this.hiddentelon = true;              
                })

            } catch (error) {
                console.log(error);
            }

        },
        expandir(elQue) {

            if(elQue == 'L') {
                this.L_expanded = !this.L_expanded;
                this.lorden = this.modelo.oLista.reduce((op, item) => op = op > item.orden ? op : item.orden, 0) + 1;
            }
            if(elQue == 'T') {
                this.T_expanded = !this.T_expanded;
            }
            if(elQue == 'F') {
                this.F_expanded = !this.F_expanded;
            }


        },
        // LISTA DE VALORES
        lDescartar() {
            this.L_id = funciones.generarUUID2();
            this.lcodigo = '';
            this.lvalor = '';
            this.ldescripcion = '';
            this.lorden = this.modelo.oLista.reduce((op, item) => op = op > item.orden ? op : item.orden, 0) + 1;
            
            this.$refs.nuevo_codigo.focus();
        },
        lAgregar() {

            let existe = this.modelo.oLista.findIndex(x => x.codigo === this.lcodigo);
            let editando = this.modelo.oLista.findIndex(x => x.id === this.L_id);

            if(this.lcodigo == '' || this.lvalor == '' || this.ldescripcion == '' || (existe != -1 && editando == -1)) {
                this.$refs.nuevo_codigo.focus();
                return;
            }

            if(editando == -1) {
                this.modelo.oLista.push({
                    id: this.L_id,
                    codigo: this.lcodigo, 
                    valor: this.lvalor,
                    descripcion: this.ldescripcion,
                    orden: this.lorden                
                })
            } else {
                this.modelo.oLista[editando].codigo = this.lcodigo;
                this.modelo.oLista[editando].valor = this.lvalor;
                this.modelo.oLista[editando].descripcion = this.ldescripcion;
                this.modelo.oLista[editando].orden = this.lorden;
            }


            this.modelo.oLista.sort((a, b) => { return a.orden - b.orden;});

            this.lDescartar();

        },
        lQuitar(pId) {

            this.modelo.oLista = this.modelo.oLista.filter((tx) => {
                return tx.id != pId; 
            }) 

        },
        lEditar(pId) {

            let idx = this.modelo.oLista.findIndex(x => x.id === pId);

            this.L_expanded = true;

            this.L_id = pId;
            this.lcodigo = this.modelo.oLista[idx].codigo;
            this.lvalor = this.modelo.oLista[idx].valor;
            this.ldescripcion = this.modelo.oLista[idx].descripcion;
            this.lorden = this.modelo.oLista[idx].orden;

        },
        // TABLA
        tDescartar() {
            this.T_id = funciones.generarUUID2();
            this.tnombre = '';
            this.ttipo = '0';
            this.tancho = this.anchoXtipo;
            this.tdecimales = 0;
            this.tlabel = '';
            this.tdefault = '';
            
            this.tMensaje = '';
            this.$refs.nuevo_cnombre.focus();

        },
        tAgregar() {

            let existe = this.modelo.oTabla.oCampos.findIndex(x => x.nombre === this.tnombre);
            let editando = this.modelo.oTabla.oCampos.findIndex(x => x.id === this.T_id);

            if(this.tnombre == '' || this.ttipo == '0') {
                this.$refs.nuevo_cnombre.focus();
                this.tMensaje = "Faltan datos";
                return;
            }
            if(existe != -1 && (editando == -1 || editando != existe)) {
                this.$refs.nuevo_cnombre.focus();
                this.tMensaje = "Campo repetido";
                return;
            }               
            if( this.tnombre.toLowerCase() == 'clave' || this.tnombre.toLowerCase() == 'id' || this.tnombre.toLowerCase() == 'deleted' || this.tnombre.toLowerCase() == 'deleted_at' ||
                this.tnombre.toLowerCase() == 'created_at' || this.tnombre.toLowerCase() == 'updated_at') {
                funciones.popAlert("error", "El nombre de campo '" + this.tnombre.toLowerCase() + "' es un nombre reservado, usa otro nombre", true, false, 4000, "Ok")
                .then(() => {
                    this.tMensaje = "Nombre del campo no permitido";
                    this.$refs.nuevo_cnombre.focus();
                })
                return;
            }

            this.tnombre = this.tnombre.split(' ').join('_');

            if(editando == -1) {
                this.modelo.oTabla.oCampos.push({
                    id: this.T_id,
                    nombre: this.tnombre,
                    tipo: this.ttipo,
                    ancho: this.tancho,
                    decimales: this.tdecimales,
                    etiqueta: this.tlabel,
                    default: this.tdefault               
                })
            } else {
                this.modelo.oTabla.oCampos[editando].nombre = this.tnombre;
                this.modelo.oTabla.oCampos[editando].tipo = this.ttipo;
                this.modelo.oTabla.oCampos[editando].ancho = this.tancho;
                this.modelo.oTabla.oCampos[editando].decimales = this.tdecimales;
                this.modelo.oTabla.oCampos[editando].etiqueta = this.tlabel;
                this.modelo.oTabla.oCampos[editando].default = this.tdefault;
            }

            this.tDescartar();

        },
        tQuitar(pId) {

            this.modelo.oTabla.oCampos = this.modelo.oTabla.oCampos.filter((tx) => {
                return tx.id != pId; 
            }) 

        },
        tEditar(pId) {

            let idx = this.modelo.oTabla.oCampos.findIndex(x => x.id === pId);

            this.T_expanded = true;

            this.T_id = pId;
            this.tnombre = this.modelo.oTabla.oCampos[idx].nombre;
            this.ttipo = this.modelo.oTabla.oCampos[idx].tipo;
            this.tancho = this.modelo.oTabla.oCampos[idx].ancho;
            this.tdecimales = this.modelo.oTabla.oCampos[idx].decimales;
            this.tlabel = this.modelo.oTabla.oCampos[idx].etiqueta;
            this.tdefault = this.modelo.oTabla.oCampos[idx].default;

            this.tMensaje = '';

        },
        validarDefault(e) {  

            // Dar format numérico al valor
            this.numberChange(e.target.value);

            if(this.Numerico(this.tdefault) > this.valorMaximoDefault) {
                this.$refs.nuevo_cdefault.focus();
            }

        },
        completartmpSQL(poCampo) {

            let retorno = '';
            switch(poCampo.tipo) {
                case 'C':
                    retorno += " VARCHAR(" + poCampo.ancho + ")";
                    break;
                case 'N':
                case 'M':
                    retorno += " DECIMAL(" + poCampo.ancho + "," + poCampo.decimales + ")";
                    break;
                case 'K':
                    retorno += " INT(1)";
                    break;
                case 'A':
                    retorno += " TEXT";
                    break;
                case 'D':
                    retorno += " DATE";
                    break;
                case 'T':
                    retorno += " DATETIME";
                    break;
                case 'H':
                    retorno += " TIME";
                    break;  
            }
            return retorno;

        },
        async comprobarDiferencias() {

            if(this.modelo.oTabla.nombre == '') {
                this.$refs.nombreTabla.focus();
                return;
            }

            this.modelo.oTabla.nombre = this.modelo.oTabla.nombre.split(' ').join('_');

            this.tDiferencias = [];
            let aCampos_tabla = [];
            let sql = '';
            let tmpSQL = '';

            // Comprobar si la tabla existe
            try {
                datos.comprobarSQL("SELECT * FROM " + this.modelo.oTabla.nombre, [])
                .then((result) => {
                    if(result.success == 1 && result.status == 202) {
                        // Si existe, nada
                        this.tDiferencias.push({
                            criticidad: 0,
                            mensaje: "La tabla ya existe",
                            accion: "nada",
                            sql: '',
                            verSQL: false
                        })    

                        // Existe, recuperar y comprobar campos
                        sql = "SELECT * FROM Information_Schema.Columns WHERE TABLE_NAME = '" + this.modelo.oTabla.nombre + "' ORDER BY COLUMN_NAME";
                        funciones.ejecutaQuery(sql, [])
                        .then((result) => {

                            if(result.success == 1 && result.status == 200) {
                                
                                aCampos_tabla = [];
                                for(let x=0; x < result.data.length; x++) {

                                    if(result.data[x].COLUMN_NAME.substr(0, 1) != '_') {
                                        aCampos_tabla.push({
                                            nombre:    result.data[x].COLUMN_NAME,
                                            col_tipo:  result.data[x].COLUMN_TYPE,
                                            dat_tipo:  result.data[x].DATA_TYPE,
                                            chr_ancho: result.data[x].CHARACTER_MAXIMUM_LENGTH,
                                            enteros:   result.data[x].NUMERIC_PRECISION,
                                            decimales: result.data[x].NUMERIC_SCALE
                                        })
                                    }
                                }

                                console.log("Campos", aCampos_tabla);

                                // Campos clave y de auditoria
                                let esta_clave = false;
                                let esta_id = false;
                                let esta_created_at = false;
                                let esta_updated_at = false;
                                let esta_deleted = false;
                                let esta_deleted_at = false;

                                // Los campos que estaban y ya no están, renombrarlos

                                for(let x=0; x < aCampos_tabla.length; x++) {

                                    let campo_sigue_estando = false;

                                    if( aCampos_tabla[x].nombre.toLowerCase() == "clave" ||
                                        aCampos_tabla[x].nombre.toLowerCase() == "id" ||
                                        aCampos_tabla[x].nombre.toLowerCase() == "created_at" ||
                                        aCampos_tabla[x].nombre.toLowerCase() == "updated_at" ||
                                        aCampos_tabla[x].nombre.toLowerCase() == "deleted" ||
                                        aCampos_tabla[x].nombre.toLowerCase() == "deleted_at") {

                                        if( aCampos_tabla[x].nombre.toLowerCase() == "clave")
                                            esta_clave = true;
                                        if( aCampos_tabla[x].nombre.toLowerCase() == "id")
                                            esta_id = true;
                                        if( aCampos_tabla[x].nombre.toLowerCase() == "created_at")
                                            esta_created_at = true;
                                        if( aCampos_tabla[x].nombre.toLowerCase() == "updated_at")
                                            esta_updated_at = true;
                                        if( aCampos_tabla[x].nombre.toLowerCase() == "deleted")
                                            esta_deleted = true;                                                                                        
                                        if( aCampos_tabla[x].nombre.toLowerCase() == "deleted_at")
                                            esta_deleted_at = true; 

                                    } else {

                                        for(let t=0; t < this.modelo.oTabla.oCampos.length; t++) {
                                            if(this.modelo.oTabla.oCampos[t].nombre.toLowerCase() == aCampos_tabla[x].nombre.toLowerCase()) {
                                                campo_sigue_estando = true;
                                                break;
                                            }
                                        }
                                        // Está o no está
                                        if(campo_sigue_estando == false) {
                                            this.tDiferencias.push({
                                                criticidad: 1,
                                                mensaje: "[" + aCampos_tabla[x].nombre + "] El campo de la tabla no está en la definición",
                                                accion: "Eliminar campo de la tabla",
                                                sql: "ALTER TABLE " + this.modelo.oTabla.nombre + " CHANGE " + aCampos_tabla[x].nombre + " _" + funciones.generarUUID2() + aCampos_tabla[x].nombre + " " + aCampos_tabla[x].col_tipo,
                                                verSQL: false
                                            })                                          
                                        }

                                    }

                                }

                                // Si los campos clave, id y los de auditoria no están
                                if(esta_clave == false) {

                                    tmpSQL =  "ALTER TABLE " + this.modelo.oTabla.nombre + " ADD COLUMN clave int(11);";                       
                                    tmpSQL += "ALTER TABLE " + this.modelo.oTabla.nombre + " ADD PRIMARY KEY (clave);";
                                    tmpSQL += "ALTER TABLE " + this.modelo.oTabla.nombre + " MODIFY clave int(11) NOT NULL AUTO_INCREMENT;";

                                    this.tDiferencias.push({
                                        criticidad: 2,
                                        mensaje: "Falta el campo 'clave'",
                                        accion: "Crear campo en la tabla",
                                        sql: tmpSQL,
                                        verSQL: false
                                    })     

                                }
                                if(esta_id == false) {

                                        this.tDiferencias.push({
                                            criticidad: 2,
                                            mensaje: "Falta el campo 'id'",
                                            accion: "Crear campo en la tabla",
                                            sql: "ALTER TABLE " + this.modelo.oTabla.nombre + " ADD COLUMN id VARCHAR(13)",
                                            verSQL: false
                                        })     

                                }                                
                                if( esta_created_at == false
                                 || esta_updated_at == false
                                 || esta_deleted == false
                                 || esta_deleted_at == false) {

                                    let aud = "ALTER TABLE " + this.modelo.oTabla.nombre + " ";

                                    if(esta_created_at == false) 
                                        aud += "ADD COLUMN created_at timestamp DEFAULT current_timestamp()";

                                    if(esta_updated_at == false) {

                                        if(esta_created_at == false)
                                            aud += ",";

                                        aud += "ADD COLUMN updated_at timestamp NULL DEFAULT NULL";

                                    }

                                    if(esta_deleted_at == false) {

                                        if(esta_created_at == false || esta_updated_at == false)
                                            aud += ",";

                                        aud += "ADD COLUMN deleted_at timestamp NULL DEFAULT NULL";

                                    }

                                    if(esta_deleted == false) {

                                        if(esta_created_at == false || esta_updated_at == false || esta_deleted_at == false) 
                                            aud += ",";

                                        aud += "ADD COLUMN deleted INT(11) DEFAULT 0";

                                    }

                                    this.tDiferencias.push({
                                        criticidad: 1,
                                        mensaje: "Faltan campos de auditoría",
                                        accion: "Crear campo en la tabla",
                                        sql: aud,
                                        verSQL: false
                                    })     

                                }
                                // Los campos definidos no están, crearlos
                                let dif_estructura = false;
                                if(this.modelo.oTabla.oCampos.length == 0) {
                                    dif_estructura = true;
                                } 

                                for(let x=0; x < this.modelo.oTabla.oCampos.length; x++) {

                                    let campo_ya_esta = false;
                                    let t=0;

                                    for(t = 0; t < aCampos_tabla.length; t++) {
                                        if(aCampos_tabla[t].nombre.toLowerCase() == this.modelo.oTabla.oCampos[x].nombre.toLowerCase()) {
                                            campo_ya_esta = true;
                                            break;
                                        }
                                    }

                                    if(campo_ya_esta == false) {

                                        tmpSQL = "ALTER TABLE " + this.modelo.oTabla.nombre + " ADD COLUMN ";
                                        tmpSQL += this.modelo.oTabla.oCampos[x].nombre.toLowerCase();

                                        tmpSQL += this.completartmpSQL(this.modelo.oTabla.oCampos[x]);

                                        this.tDiferencias.push({
                                            criticidad: 1,
                                            mensaje: "[" + this.modelo.oTabla.oCampos[x].nombre + "] El campo de la definición aún no está en la tabla",
                                            accion: "Crear campo en la tabla",
                                            sql: tmpSQL,
                                            verSQL: false
                                        })     
                                        dif_estructura = true;


                                    } else {

                                        // El campo SI existe pero está diferente. Renombrar y crear nuevo (t = el campo encontrado)
                                        tmpSQL = '';

                                        if( (this.modelo.oTabla.oCampos[x].tipo == 'C' && aCampos_tabla[t].dat_tipo != 'varchar') || 
                                            (this.modelo.oTabla.oCampos[x].tipo == 'C' && this.modelo.oTabla.oCampos[x].ancho != aCampos_tabla[t].chr_ancho)) {

                                            tmpSQL = "ALTER TABLE " + this.modelo.oTabla.nombre + " CHANGE " + aCampos_tabla[t].nombre + " _" + funciones.generarUUID2() + aCampos_tabla[t].nombre + " " + aCampos_tabla[t].col_tipo + ";"
                                            tmpSQL += "ALTER TABLE " + this.modelo.oTabla.nombre + " ADD COLUMN ";
                                            tmpSQL += this.modelo.oTabla.oCampos[x].nombre.toLowerCase() + " VARCHAR(" + this.modelo.oTabla.oCampos[x].ancho + ")";

                                            dif_estructura = true;                                              
                                        }
                                        if( (this.modelo.oTabla.oCampos[x].tipo == 'K' && aCampos_tabla[t].col_tipo != 'int(1)')) {

                                            tmpSQL = "ALTER TABLE " + this.modelo.oTabla.nombre + " CHANGE " + aCampos_tabla[t].nombre + " _" + funciones.generarUUID2() + aCampos_tabla[t].nombre + " " + aCampos_tabla[t].col_tipo + ";"
                                            tmpSQL += "ALTER TABLE " + this.modelo.oTabla.nombre + " ADD COLUMN ";
                                            tmpSQL += this.modelo.oTabla.oCampos[x].nombre.toLowerCase() + " INT(1)";

                                            dif_estructura = true;                                             
                                        }
                                        if( ((this.modelo.oTabla.oCampos[x].tipo == 'N' || this.modelo.oTabla.oCampos[x].tipo == 'M') && aCampos_tabla[t].dat_tipo != 'decimal') || 
                                            ((this.modelo.oTabla.oCampos[x].tipo == 'N' || this.modelo.oTabla.oCampos[x].tipo == 'M') && this.modelo.oTabla.oCampos[x].ancho != aCampos_tabla[t].enteros) ||
                                            ((this.modelo.oTabla.oCampos[x].tipo == 'N' || this.modelo.oTabla.oCampos[x].tipo == 'M') && this.modelo.oTabla.oCampos[x].decimales != aCampos_tabla[t].decimales)
                                            ) {

                                            tmpSQL = "ALTER TABLE " + this.modelo.oTabla.nombre + " CHANGE " + aCampos_tabla[t].nombre + " _" + funciones.generarUUID2() + aCampos_tabla[t].nombre + " " + aCampos_tabla[t].col_tipo + ";"
                                            tmpSQL += "ALTER TABLE " + this.modelo.oTabla.nombre + " ADD COLUMN ";
                                            tmpSQL += this.modelo.oTabla.oCampos[x].nombre.toLowerCase() + " DECIMAL(" + this.modelo.oTabla.oCampos[x].ancho + "," + this.modelo.oTabla.oCampos[x].decimales + ")";

                                            dif_estructura = true;                                            
                                        }                                        
                                        if( (this.modelo.oTabla.oCampos[x].tipo == 'D' && aCampos_tabla[t].col_tipo != 'date')) {

                                            tmpSQL = "ALTER TABLE " + this.modelo.oTabla.nombre + " CHANGE " + aCampos_tabla[t].nombre + " _" + funciones.generarUUID2() + aCampos_tabla[t].nombre + " " + aCampos_tabla[t].col_tipo + ";"
                                            tmpSQL += "ALTER TABLE " + this.modelo.oTabla.nombre + " ADD COLUMN ";
                                            tmpSQL += this.modelo.oTabla.oCampos[x].nombre.toLowerCase() + " DATE";
                                        
                                            dif_estructura = true;                                            
                                        }
                                        if( (this.modelo.oTabla.oCampos[x].tipo == 'T' && aCampos_tabla[t].col_tipo != 'datetime')) {

                                            tmpSQL = "ALTER TABLE " + this.modelo.oTabla.nombre + " CHANGE " + aCampos_tabla[t].nombre + " _" + funciones.generarUUID2() + aCampos_tabla[t].nombre + " " + aCampos_tabla[t].col_tipo + ";"
                                            tmpSQL += "ALTER TABLE " + this.modelo.oTabla.nombre + " ADD COLUMN ";
                                            tmpSQL += this.modelo.oTabla.oCampos[x].nombre.toLowerCase() + " DATETIME";
                                           
                                            dif_estructura = true;                                          
                                        }
                                        if( (this.modelo.oTabla.oCampos[x].tipo == 'H' && aCampos_tabla[t].col_tipo != 'time')) {

                                            tmpSQL = "ALTER TABLE " + this.modelo.oTabla.nombre + " CHANGE " + aCampos_tabla[t].nombre + " _" + funciones.generarUUID2() + aCampos_tabla[t].nombre + " " + aCampos_tabla[t].col_tipo + ";"
                                            tmpSQL += "ALTER TABLE " + this.modelo.oTabla.nombre + " ADD COLUMN ";
                                            tmpSQL += this.modelo.oTabla.oCampos[x].nombre.toLowerCase() + " TIME";
                                          
                                            dif_estructura = true;                                           
                                        }  
                                        if( (this.modelo.oTabla.oCampos[x].tipo == 'A' && aCampos_tabla[t].dat_tipo != 'text') || 
                                            (this.modelo.oTabla.oCampos[x].tipo == 'A' && aCampos_tabla[t].chr_ancho != 65535)
                                            ) {

                                            tmpSQL = "ALTER TABLE " + this.modelo.oTabla.nombre + " CHANGE " + aCampos_tabla[t].nombre + " _" + funciones.generarUUID2() + aCampos_tabla[t].nombre + " " + aCampos_tabla[t].col_tipo + ";"
                                            tmpSQL += "ALTER TABLE " + this.modelo.oTabla.nombre + " ADD COLUMN ";
                                            tmpSQL += this.modelo.oTabla.oCampos[x].nombre.toLowerCase() + " TEXT";
                                                
                                            dif_estructura = true;                                           
                                        }
                                        
                                        if(tmpSQL != '') {
                                            this.tDiferencias.push({
                                                criticidad: 1,
                                                mensaje: "[" + this.modelo.oTabla.oCampos[x].nombre + "] El campo de la definición no coincide con el de la tabla. Se perderá el contenido actual del campo.",
                                                accion: "Transformar campo de la tabla",
                                                sql: tmpSQL,
                                                verSQL: false
                                            })                                            
                                        }


                                    }

                                }

                                // No hay difererncias entre la definición y la tabla
                                if(!dif_estructura) {
                                    this.tDiferencias.push({
                                        criticidad: 0,
                                        mensaje: "Los campos de la tabla coinciden con la definición",
                                        accion: "nada",
                                        sql: '',
                                        verSQL: false
                                    })                                       
                                }

                            }

                        })

                    } else {                    
                        // No existe, crearla
                        tmpSQL = "CREATE TABLE " + this.modelo.oTabla.nombre + " (";
                        tmpSQL += "clave int(11), id varchar(15),";
                        tmpSQL += "created_at timestamp DEFAULT current_timestamp(),";
                        tmpSQL += "updated_at timestamp NULL DEFAULT NULL, deleted INT(11) DEFAULT 0,";
                        tmpSQL += "deleted_at timestamp NULL DEFAULT NULL);"; 
                        tmpSQL += "ALTER TABLE " + this.modelo.oTabla.nombre + " ADD PRIMARY KEY (clave);";
                        tmpSQL += "ALTER TABLE " + this.modelo.oTabla.nombre + " MODIFY clave int(11) NOT NULL AUTO_INCREMENT";

                        this.tDiferencias.push({
                            criticidad: 1,
                            mensaje: "La tabla no existe",
                            accion: "crear tabla",
                            sql: tmpSQL,
                            verSQL: false
                        })
                        return
                    }
                })
            } catch(error) {
                console.log(error);
            }

        },
        aplicarCorrecciones() {

            this.comprobarDiferencias();

            funciones.popAlert('question', 'Quieres aplicar las correcciones para ajustar la tabla según la definición?', true, true, 8000, "Sí")
            .then((result) => {

                if(result==true) {

                    let hay_cambios = false;
                    for(let d=0; d < this.tDiferencias.length; d++) {
                        if(this.tDiferencias[d].criticidad != 0) {    // && this.tDiferencias[d].accion != 'crear tabla') {
                            hay_cambios = true;
                            break;
                        }
                    }
                    if(!hay_cambios) {
                        funciones.popAlert('success', 'No hay cambios a aplicar', true, false, 8000, "Ok")
                        .then(() => {
                            return;
                        })

                    } else {
                        //////////////////////////////////////////////////////////////////////////////////
                        funciones.popAlert('warning', 'Quieres continuar y crear/modificar la tabla?', true, true, 8000, "Sí")
                        .then((result) => {

                            if(result==true) {

                                let tmpSQL = '';
                                let err = 0;

                                for(let m=0; m < this.tDiferencias.length; m++) {

                                    // Crear tabla si no existe
                                    // Agregar la PRIMARY KEY
                                    // Agregar el autoincremental
                                    if(this.tDiferencias[m].accion == 'crear tabla') {

                                        funciones.ejecutaQuery(this.tDiferencias[m].sql, [])
                                        .then((result) => {   
                                            
                                            if(result.success == 1 && (result.status == 200 || result.status == 204)) {

                                                for(let c = 0; c < this.modelo.oTabla.oCampos.length; c++) {

                                                    tmpSQL = "ALTER TABLE " + this.modelo.oTabla.nombre + " ADD COLUMN ";
                                                    tmpSQL += this.modelo.oTabla.oCampos[c].nombre.toLowerCase();

                                                    tmpSQL += this.completartmpSQL(this.modelo.oTabla.oCampos[c]);

                                                    // Creación del campo
                                                    funciones.ejecutaQuery(tmpSQL, [])
                                                    .then((result) => {
                                                        
                                                        if(result.succes != 1 || result != 200) {
                                                            err = 1;
                                                        }

                                                    })

                                                }
                                                if(err == 1) {
                                                    // Hubo errores
                                                    funciones.popAlert('error', 'No se ha podido realizar el cambio en este momento', true, false, 8000, "Ok")
                                                    .then(() => { 
                                                        return;
                                                    })                                                   
                                                }

                                                this.tDiferencias[m].hecha = 1;   // Con exito

                                            } else {
                                                this.tDiferencias[m].hecha = 2;   // Con error, no se ha podido crear la tabla
                                            }

                                        })

                                    }

                                    // Renombrar campos que no están en la definición
                                    // Crear campos de la definición que no están en la tabla
                                    // Transformar campo de la tabla
                                    if( this.tDiferencias[m].accion == 'Eliminar campo de la tabla' || 
                                        this.tDiferencias[m].accion == 'Crear campo en la tabla' ||
                                        this.tDiferencias[m].accion == 'Transformar campo de la tabla') {

                                        funciones.ejecutaQuery(this.tDiferencias[m].sql, [])
                                        .then((result) => {

                                            if(result.success == 1 && (result.status == 200 || result.status == 204)) {
                                                this.tDiferencias[m].hecha = 1;    // Sin error
                                            } else {
                                                err = 1;
                                                this.tDiferencias[m].hecha = 2;    // Con error                                                
                                            }

                                        })

                                    }

                                }

                            }
                            
                        })
                        //////////////////////////////////////////////////////////////////////////////////

                    } 

                }
            })

        },
        async importarDefinicion() {

            let actuar = true;

            if(this.modelo.oTabla.nombre == '') {
                this.$refs.nombreTabla.focus();
                return;
            }

            // Comprobar si ya existe una definición
            if(this.modelo.oTabla.oCampos.length > 0) {
                await funciones.popAlert('warning', 'Quieres remplazar la definición actual?', true, true, 8000, "Sí, remplázala")
                .then((result) => {
                    if(result != true) {
                        actuar = false;
                    } 
                })
            } 
            if(!actuar)
                return;

            try {

                this.modelo.oTabla.nombre = this.modelo.oTabla.nombre.split(' ').join('_');

                let aCampos_tabla = [];
                this.tDiferencias = [];

                // Comprobar si la tabla existe

                datos.comprobarSQL("SELECT * FROM " + this.modelo.oTabla.nombre, [])
                .then((result) => {

                    if(result.success != 1 || result.status != 202) {

                        // Si no existe
                        this.tDiferencias.push({
                            criticidad: 1,
                            mensaje: "La tabla para importar NO existe",
                            accion: "Imposible importar"
                        })  
                        
                        return;

                    }

                    // Existe, recuperar y comprobar campos
                    let sql = "SELECT * FROM Information_Schema.Columns WHERE TABLE_NAME = '" + this.modelo.oTabla.nombre + "' ORDER BY COLUMN_NAME";
                    funciones.ejecutaQuery(sql, [])
                    .then((result) => {

                        if(result.success == 1 && result.status == 200) {
                            
                            aCampos_tabla = [];
                            this.modelo.oTabla.oCampos = [];

                            for(let x=0; x < result.data.length; x++) {

                                if(result.data[x].COLUMN_NAME.substr(0, 1) != '_') {
                                    aCampos_tabla.push({
                                        nombre:    result.data[x].COLUMN_NAME,
                                        col_tipo:  result.data[x].COLUMN_TYPE,
                                        dat_tipo:  result.data[x].DATA_TYPE,
                                        chr_ancho: result.data[x].CHARACTER_MAXIMUM_LENGTH,
                                        enteros:   result.data[x].NUMERIC_PRECISION,
                                        decimales: result.data[x].NUMERIC_SCALE
                                    })
                                }
                            }

                            console.log("Estos son los Campos", aCampos_tabla);

                            for(let c=0; c < aCampos_tabla.length; c++) {

                                let xtipo = '';
                                let xancho = 0;
                                let xdecimales = 0;

                                if( aCampos_tabla[c].nombre.toLowerCase() != "clave" &&
                                    aCampos_tabla[c].nombre.toLowerCase() != "id" &&
                                    aCampos_tabla[c].nombre.toLowerCase() != "created_at" &&
                                    aCampos_tabla[c].nombre.toLowerCase() != "updated_at" &&
                                    aCampos_tabla[c].nombre.toLowerCase() != "deleted" &&
                                    aCampos_tabla[c].nombre.toLowerCase() != "deleted_at") {

                                    switch(aCampos_tabla[c].dat_tipo.toLowerCase()) {
                                        case 'varchar':
                                            xtipo = 'C';
                                            xancho = aCampos_tabla[c].chr_ancho;
                                            xdecimales = 0;
                                            break;
                                        case 'decimal':
                                            xtipo = 'N';
                                            xancho = aCampos_tabla[c].enteros;
                                            xdecimales = aCampos_tabla[c].decimales;                                        
                                            break;
                                        case 'int':
                                            if(aCampos_tabla[c].col_tipo == 'int(1)') {
                                                xtipo = 'K';
                                                xancho = aCampos_tabla[c].chr_ancho;
                                                xdecimales = 0;     
                                            } else {
                                                xtipo = 'N';
                                                xancho = aCampos_tabla[c].enteros;
                                                xdecimales = 0;                                             
                                            }
                                            break;
                                        case 'text':
                                            xtipo = 'A';
                                            xancho = aCampos_tabla[c].chr_ancho;
                                            xdecimales = 0;                                        
                                            break;
                                        case 'date':
                                            xtipo = 'D';
                                            xancho = 0;
                                            xdecimales = 0;                                        
                                            break;
                                        case 'datetime':
                                        case 'timestamp':
                                            xtipo = 'T';
                                            xancho = 0;
                                            xdecimales = 0;                                               
                                            break;
                                        case 'time':
                                            xtipo = 'H';
                                            xancho = 0;
                                            xdecimales = 0;                                               
                                            break;  
                                    }                                

                                    this.modelo.oTabla.oCampos.push({
                                        id:        funciones.generarUUID2(),
                                        nombre:    aCampos_tabla[c].nombre,
                                        tipo:      xtipo,
                                        ancho:     xancho,
                                        decimales: xdecimales,
                                        etiqueta:  aCampos_tabla[c].nombre,
                                        default:   ''               
                                    })

                                }

                            }

                            console.log("Campos definición", this.modelo.oTabla.oCampos)

                        }
                    })
                                
                })

            } catch (error) {
                console.log(error);
            }


        },
        //QUERY
        fDescartar() {
            this.F_id = funciones.generarUUID2();
            this.fetiqueta = '';
            this.ftipo = '0';
            this.fcampo = '';
            this.fobligatorio = false;
            
            this.$refs.fetiqueta.focus();

        },
        fAgregar() {

            this.fcampo = this.fcampo.split(' ').join('_');

            let existe = this.modelo.oQuery.oFiltros.findIndex(x => x.campo === this.fcampo);
            let editando = this.modelo.oQuery.oFiltros.findIndex(x => x.id === this.F_id);

            if(this.fnombre == '' || this.ftipo == '0' || this.fcampo == '' || (existe != -1 && editando == -1)) {
                this.$refs.fetiqueta.focus();
                return;
            }

            if(editando == -1) {
                this.modelo.oQuery.oFiltros.push({
                    id: this.F_id,
                    etiqueta: this.fetiqueta,
                    tipo: this.ftipo,
                    obligatorio: this.fobligatorio,
                    campo: this.fcampo,
                    valor: this.fvalorXtipo
                })
            } else {
                this.modelo.oQuery.oFiltros[editando].etiqueta = this.fetiqueta;
                this.modelo.oQuery.oFiltros[editando].tipo = this.ftipo;
                this.modelo.oQuery.oFiltros[editando].obligatorio = this.fobligatorio;
                this.modelo.oQuery.oFiltros[editando].campo = this.fcampo;
                this.modelo.oQuery.oFiltros[editando].valor = this.fvalorXtipo;
            }

            this.fDescartar();

        },
        fQuitar(pId) {

            this.modelo.oQuery.oFiltros = this.modelo.oQuery.oFiltros.filter((tx) => {
                return tx.id != pId; 
            }) 

        },
        fEditar(pId) {

            let idx = this.modelo.oQuery.oFiltros.findIndex(x => x.id === pId);

            this.F_expanded = true;

            this.F_id = pId;
            this.fetiqueta = this.modelo.oQuery.oFiltros[idx].etiqueta;
            this.ftipo = this.modelo.oQuery.oFiltros[idx].tipo;
            this.fcampo = this.modelo.oQuery.oFiltros[idx].campo;
            this.fobligatorio = this.modelo.oQuery.oFiltros[idx].obligatorio;

        },    
        qComprobar() {

            try {
                datos.comprobarSQL(this.modelo.oQuery.cadenaSQL, this.modelo.oQuery.oFiltros)
                .then((result) => {
                    this.mensageValidacionSQL = result.message;
                })
            } catch(error) {
                console.log(error);
            }
        },
        // Seleccionable
        leerListadeQuerys() {

            try {

                this.aQuerys = [{
                    clave: '0',
                    id: '0',
                    descripcion: 'Selecciona una consulta ...'                    
                }];

                datos.leerLista("sys_modelo_datos", "tipo='Q'", ["clave","id", "descripcion"], "descripcion")
                .then((result) => {

                    if(global.DEBUG)
                        console.log("leerListadeQuerys", "datos devueltos datos.leerListadeQuerys", result);

                    if(result.success == 1 && result.status == 200) {

                        for(let x = 0; x < result.data.length; x++) {
                            this.aQuerys.push({
                                clave: result.data[x].clave,
                                id: result.data[x].id,
                                descripcion: result.data[x].descripcion
                            })
                        }

                    }
                })

            } catch(error) {
                console.log(error);
            }

        },
        CargaConsulta(pId) {

            this.hiddentelon = false;   

            try {

                datos.leerLista('sys_modelo_datos', "id='" + pId + "'", ['objeto'], '')
                .then((result) => {

                    if(result.success == 1 && result.status == 200) {

                        let tmp_modelo = JSON.parse(result.data[0].objeto.split('&quot;').join('"'));

                        this.icadenaSQL = tmp_modelo.oQuery.cadenaSQL;

                    }

                }).finally(() => {
                    this.hiddentelon = true;              
                })
                
            } catch(error) {
                console.log(error);
            }

        },
        cargaCamposConsulta() {

            this.aCampos = [{
                id: '0',
                descripcion: 'Selecciona un campo ...'
            }];

            if(this.modelo.oSelectable.idQuery == 0) {
                return;
            }

            this.hiddentelon = false;   

            try {

                datos.leerLista('sys_modelo_datos', "id='" + this.modelo.oSelectable.idQuery + "'", ['objeto'], '')
                .then((result) => {

                    if(result.success == 1 && result.status == 200) {

                        // Recuperar la cadena de la consulta
                        let tmp_modelo = JSON.parse(result.data[0].objeto.split('&quot;').join('"'));
                        let tmp_icadenaSQL = tmp_modelo.oQuery.cadenaSQL;

                        // Hacer el parse de los campos de la consulta
                        funciones.parseSQL(tmp_icadenaSQL)
                        .then((result) => {

                            if(result.success == 1 && result.status == 200) {

                                for(let x=0; x < result.data.SELECT.length; x++) {
                                    if(result.data.SELECT[x].base_expr != '*') {
                                        this.aCampos.push({
                                            id: x + 1,
                                            descripcion: result.data.SELECT[x].base_expr
                                        })
                                    }
                                }

                            }

                        })

                    }

                }).finally(() => {
                    this.hiddentelon = true;              
                })
                
            } catch(error) {
                console.log(error);
            }


        }


    }, // End methods
    mounted(){
        this.claveId = this.$route.params['p_claveId'];
        if(this.claveId != null) {
            this.LeerDatos();
        }
        this.leerListadeQuerys();
    },
  
    computed:{
        fvalorXtipo:{
            get() {

                let retorno = '';

                if(this.ftipo == 'C') {
                    retorno = "XXXX";
                }                
                if(this.ftipo == 'A') {
                    retorno = 'AAAA';
                }
                if(this.ftipo == 'D' || this.ftipo == 'T' || this.ftipo == 'H' || this.ftipo == 'K') {
                    retorno = 'NOW()';
                }
                if(this.ftipo == 'N' || this.ftipo == 'M') {
                    retorno = '10';
                }
                
                return retorno;                 
            }
        },
        maxDecimales:{
            get() {
                return 6;
            }
        },
        largoDefault:{
            get() {

                let retorno = '';

                if(this.ttipo == 'C' || this.ttipo == 'A') {
                    retorno = this.tdefault.substr(0, this.tancho);
                }
                if(this.ttipo == 'D' || this.ttipo == 'T' || this.ttipo == 'H') {
                    retorno = this.tdefault;
                }
                if(this.ttipo == 'K') {
                    if(this.tdefault == true) {
                        retorno = true;
                    } else {
                        retorno = false;
                    }
                }

                
                return retorno;

            },
            set(valor) {
                this.tdefault = valor;
            }
        },
        maxXtipo:{
            get() {

                let retorno = 10;

                if(this.ttipo == 'C') {
                    retorno = 250;
                }                
                if(this.ttipo == 'A') {
                    retorno = 5000;
                }
                if(this.ttipo == 'D' || this.ttipo == 'T' || this.ttipo == 'H' || this.ttipo == 'K') {
                    retorno = 10;
                }
                if(this.ttipo == 'N' || this.ttipo == 'M') {
                    retorno = 15;
                }
                
                return retorno;                
            }
        },
        anchoXtipo:{
            get() {

                let retorno = 10;

                if(this.ttipo == 'C') {
                    retorno = 50;
                }                
                if(this.ttipo == 'A') {
                    retorno = 2000;
                }
                if(this.ttipo == 'D' || this.ttipo == 'T' || this.ttipo == 'H' || this.ttipo == 'K') {
                    retorno = 10;
                }
                if(this.ttipo == 'N' || this.ttipo == 'M') {
                    retorno = 10;
                }
                
                return retorno;                 
            }
        },
        decXtipo:{
            get() {

                let retorno = 0;

                if(this.ttipo == 'C') {
                    retorno = 0;
                }                
                if(this.ttipo == 'A') {
                    retorno = 0;
                }
                if(this.ttipo == 'D' || this.ttipo == 'T' || this.ttipo == 'H' || this.ttipo == 'K') {
                    retorno = 0;
                }
                if(this.ttipo == 'N') {
                    retorno = 0;
                }
                if(this.ttipo == 'M') {
                    retorno = 2;
                }
                return retorno;                
            }
        },  
        valorMaximoDefault:{
            get() {

                let valor = Number(Array(this.tancho + 1).join("9") + '.' + Array(this.tdecimales + 1).join("9"));

                return valor;

            }
        }      
    },

}
</script>

