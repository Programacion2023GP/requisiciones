const StatusColumn: React.FC<{
    data: Record<string, any>;
  }> = ({ data }) => {
   const ChangeName  = (name:string):Array<string>=>{
    let value = ''
    let color = ''
    switch(name){
     case 'AS':
        value = 'ASIGNADO'
        color = 'class_as'
     break;
     case 'CP':
        value = 'CAPTURA'
        color = 'class_cp'
     break;
     case 'CO':
        value = 'COTIZADO'
        color = 'class_co'
     break;
     case 'OC':
        value = 'ORDEN DE COMPRA'
        color = 'class_oc'
     break;
     case 'SU':
        value = 'SURTIDA'
        color = 'class_su'
     break;
     case 'CA':
        value = 'RECHAZADA'
        color = 'class_ca'
     break;
     case 'AU':
         if (data.AutEspecial == 1 &&
                        !data.UsuarioVoBo) {
        value = 'falta/Vobo'
            color = 'class_vobo'
            
         }
         else{
            value = 'AUTORIZADA'
            color = 'class_au'

         }
     break;
    }
    return [value,color];

   }
   
    return (
      <div className={`flex gap-2 w-full p-1 text-wrap shadow-lg rounded-lg ${ChangeName(data.Status)[1]}`}>
        {ChangeName(data.Status)[0]}
      </div>
    );
  }
  export default StatusColumn;

