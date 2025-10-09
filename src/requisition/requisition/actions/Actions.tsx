import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Button from "../../components/form/Button";
import { LiaExchangeAltSolid } from "react-icons/lia";
import { MdCancel, MdEdit } from "react-icons/md";
import Tooltip from "../../components/toltip/Toltip";
import { showConfirmationAlert, showToast } from "../../sweetalert/Sweetalert";
import { AxiosRequest, GetAxios } from "../../axios/Axios";
import { useMutation, useQueries } from "@tanstack/react-query";
import { BsFiletypePdf } from "react-icons/bs";
import Pdfrequisition from "../pdf/Pdfrequisition";
import Observable from "../../extras/observable";
import { PiPersonArmsSpreadThin } from "react-icons/pi";
import AutorizedComponent from "../autorized/Autorized";
import { customLog } from "../../extras/consoles";
import { PermissionMenu } from "../../extras/menupermisos";
import { MdOutlineCheckBox } from "react-icons/md";
import CotizacionComponent from "../cotizacion/Cotizacion";
import Spinner from "../../loading/Loading";
import { FaEye } from "react-icons/fa";
import DetailsRequistion from "../details/DetailsRequisition";
import TracingComponent from "../tracing/Tracing";
import DropdownComponent from "../../components/drop/DropDown";
import { TbReport } from "react-icons/tb";
import ModalComponent from "../../components/modal/Modal";
import FormikForm from "../../components/formik/Formik";
import {
   FormikInput,
   FormikNumberInput,
   FormikTextArea,
} from "../../components/formik/FormikInputs/FormikInput";
import ChangeStatusRequisition from "../status/ChangeStatus";
import { GrFormView } from "react-icons/gr";

const Actions: React.FC<{
   data: Record<string, any>;
   setReloadTable: Dispatch<SetStateAction<boolean>>;
   setOpenForm: Dispatch<SetStateAction<boolean>>;
}> = ({ data, setReloadTable, setOpenForm }) => {
   const [open, setOpen] = useState({
      pdf: false,
      autorized: false,
      cotizacion: false,
      view: false,
      tracing: false,
   });
   const [changeStatus, setChangeStatus] = useState<boolean>(false);
   const [spiner, setSpiner] = useState<boolean>(false);
   const permisosString = localStorage.getItem("permisos") ?? "{}"; // Valor predeterminado: objeto vacío
   const permisos = JSON.parse(permisosString); // Convertir el string a un objeto
   const [openSu, setOpenSu] = useState<boolean>(false);
   const [autorized, SetAutorized] = useState(false);
   const [canceled, setCanceled] = useState(false);
   const { ObservablePost,ObservableDelete } = Observable();
   const mutation = useMutation({
      mutationFn: ({
         url,
         method,
         data,
      }: {
         url: string;
         method: "POST" | "PUT" | "DELETE";
         data?: any;
      }) => AxiosRequest(url, method, data),
      onMutate(variables) {
         setSpiner(true);
         setReloadTable(false);
      },
      onSuccess: (data) => {
         setReloadTable(true);
         setSpiner(false);

         showToast(data.message, data.status);
         if (mutation.status === "success") {
            mutation.reset();
         }
      },
      onError: (error: any) => {
         showToast(
            error.response?.data?.message || "Error al realizar la acción",
            "error",
         );
      },
   });
   const userGroups: number[] = Array.isArray(JSON.parse(localStorage.getItem("group") || "[]"))
      ? JSON.parse(localStorage.getItem("group") || "[]").map(Number)
      : [Number(JSON.parse(localStorage.getItem("group") || "0"))];

   // Convertir IDDepartamento a número para la comparación
   const isUserGroup = userGroups.includes(Number(data?.IDDepartamento ?? -1));
   const mutationPdf = useMutation({
      mutationFn: ({
         url,
         method,
         data,
         pdfData,
         status,
      }: {
         url: string;
         method: "POST" | "PUT" | "DELETE";
         data?: any;
         pdfData: Record<string, any>;
         status: string;
      }) => AxiosRequest(url, method, data),
      onMutate(variables) {
         setSpiner(true);
      },
      onSuccess: async (data, variables) => {
         try {
            const result = await ObservablePost("PdfRequisicion", {
               data: {
                  products: data.data,
                  pdfData: variables.pdfData,
                  status: variables.status,
               },
            });
         } catch (e) {
         } finally {
            setSpiner(false);

            setOpen((prev) => ({
               autorized: false,
               cotizacion: false,
               view: false,
               pdf: true,
               tracing: false,
            }));
         }
      },
      onError: (error: any) => {
         showToast(
            error.response?.data?.message || "Error al realizar la acción",
            "error",
         );
      },
   });
   const mutationEdit = useMutation({
      mutationFn: ({
         url,
         method,
         data,
      }: {
         url: string;
         method: "POST" | "PUT" | "DELETE";
         data?: any;
      }) => AxiosRequest(url, method, data),
      onMutate(variables) {
         setSpiner(true);
      },
      onSuccess: async (data,variables) => {
         setSpiner(false);
         try {
            const result = await ObservablePost("FormRequisicion", {
               data: {
                  data: data.data,
                  edicion:variables?.data?.edicion,
               },
            });
         } catch (e) {
         } finally {
            setOpenForm(true);
            // setOpen((prev) => ({
            //   autorized: false,
            //   cotizacion: false,
            //   pdf: false,
            //   view: true,
            //   tracing: false,
            // }));
         }
      },
      onError: (error: any) => {
         setSpiner(false);
      },
   });
   const newStatus = (status: string): string => {
      let state = "";
      switch (status) {
         case "CP":
            state = "AU";
            break;
         case "AU":
            state = "AS";
            break;
         case "AS":
            state = "CO";
            break;
         case "CO":
            state = "OC";
            break;
         case "OC":
            state = "SU";
            break;
      }
      return state;
   };

   const mutationView = useMutation({
      mutationFn: ({
         url,
         method,
         data,
      }: {
         url: string;
         method: "POST" | "PUT" | "DELETE";
         data?: any;
      }) => AxiosRequest(url, method, data),
      onMutate(variables) {
         setSpiner(true);
      },
      onSuccess: async (data, variables) => {
         try {
            // customLog(`${JSON.stringify(data)}`, "green");
            const result = await ObservablePost("IdRequisicion", {
               data: {
                  data: data.data,
               },
            });
         } catch (e) {
         } finally {
            setOpen((prev) => ({
               autorized: false,
               cotizacion: false,
               pdf: false,
               view: true,
               tracing: false,
            }));
         }
         setSpiner(false);
      },
      onError: (error: any) => {
         showToast(
            error.response?.data?.message || "Error al realizar la acción",
            "error",
         );
      },
   });
   const getColorButton = (status: string): string => {
      let color = "";
      if (status == "CP") {
         color = "class_ca";
      }
      if (status == "AU") {
         color = "class_au";
      }
      if (status == "AS") {
         color = "class_as";
      }
      if (status == "CO") {
         color = "class_co";
      }
      if (status == "OC") {
         color = "class_oc";
      }
      if (status == "RE") {
         color = "class_re";
      }
      if (status == "SU") {
         color = "class_su";
      }
      if (status == "CA") {
         color = "class_rec";
      }
      return color;
   };
   const AutorizedEspecial = (
      autorized: boolean,
      can: boolean,
      status: string,
      // idEspecial:number,
      // :number
   ): boolean => {
      if (status != "AS") {
         return true;
      }
      if (!autorized) {
         return true;
      }
      if (autorized && can) {
         return true;
      }
      return false;
   };
   const Autorized = (permission: string): boolean => {
      const depencePermissions: { [key: string]: string } = {
         Permiso_Autorizar: "AU",
         Permiso_Asignar: "AS",
         Permiso_Cotizar: "CO",
         Permiso_Orden_Compra: "OC",
         Permiso_Surtir: "SU",
      };

      if (!permisos) {
         // console.error("La variable 'permisos' es null o undefined.");
         return false;
      }

      return Object.entries(depencePermissions).some(
         ([key, value]) => value === permission && permisos[key] === 1,
      );
   };

   const buttonVobo = (idTipo: number): boolean => {
      const rawGroup = localStorage.getItem("group");

      // Inicializar array vacío
      let userGroups: number[] = [];

      // Intentar parsear y convertir a números
      try {
         const parsed = JSON.parse(rawGroup || "[]");
         if (Array.isArray(parsed)) {
            userGroups = parsed.map(Number); // Si es array, map a números
         } else {
            userGroups = [Number(parsed)]; // Si es un solo valor, meterlo en array
         }
      } catch (e) {
         userGroups = []; // En caso de error, array vacío
      }


      // const group = localStorage.getItem("group");
      // if (group === null) {
      //    return false;
      // }
      // let idGroup = parseInt(group, 10);
      // console.log(idTipo, idGroup);
      if (
         (userGroups.includes(84) && idTipo == 5) ||
         (userGroups.includes(83) && idTipo == 7) ||
         (userGroups.includes(27) && idTipo == 6)
      ) {
         // console.log("aqui")
         return true;
      }

      return false;
   };
   useEffect(() => {
      // customLog(`${data.Status}`, "blue", "medium");

      // customLog(`${Autorized(newStatus(data.Status))}`, "orange", "medium");
      SetAutorized(Autorized(newStatus(data.Status)));
   }, [data]);
   return (
      <>
         {data.Status != "CA" && (
            <>
               {spiner && <Spinner />}

               {open.tracing && (
                  <TracingComponent
                     open={open.tracing}
                     setOpen={() => {
                        setOpen((prev) => ({
                           pdf: false,
                           autorized: false,
                           cotizacion: false,
                           view: false,
                           tracing: false,
                        }));
                     }}
                  />
               )}
               {open.autorized && (
                  <AutorizedComponent
                     setReloadTable={setReloadTable}
                     open={open.autorized}
                     setOpen={() => {
                        setOpen((prev) => ({
                           pdf: false,
                           autorized: false,
                           cotizacion: false,
                           view: false,
                           tracing: false,
                        }));
                     }}
                  />
               )}

               {open.pdf && (
                  <Pdfrequisition
                     open={open.pdf}
                     setOpen={() => {
                        setOpen((prev) => ({
                           autorized: false,
                           pdf: false,
                           cotizacion: false,
                           view: false,
                           tracing: false,
                        }));
                     }}
                  />
               )}
               {changeStatus && (
                  <ChangeStatusRequisition
                     setReloadTable={setReloadTable}
                     open={changeStatus}
                     setOpen={() => {
                        setChangeStatus(false);
                     }}
                  />
               )}
               {open.cotizacion && (
                  <CotizacionComponent
                     setReloadTable={setReloadTable}
                     open={open.cotizacion}
                     setOpen={() => {
                        setOpen((prev) => ({
                           autorized: false,
                           pdf: false,
                           cotizacion: false,
                           view: false,
                           tracing: false,
                        }));
                     }}
                  />
               )}
               {open.view && (
                  <DetailsRequistion
                     open={open.view}
                     setOpen={() => {
                        setOpen((prev) => ({
                           autorized: false,
                           pdf: false,
                           cotizacion: false,
                           view: false,
                           tracing: false,
                        }));
                     }}
                  />
               )}
               <DropdownComponent id="tableRequisitionActions">
                  <div className="flex flex-col gap-2">
                     {/* <div className="w-fit">
                <Tooltip content="Ver requisición">
                  <Button
                    color="presidencia"
                    variant="solid"
                    size="small"
                    onClick={() => {
                      mutationView.mutate({
                        method: "POST",
                        url: "/requisiciones/show",
                        data: {
                          IDRequisicion: data.IDRequisicion,
                          Ejercicio: data.Ejercicio,
                        },
                      });
                    }}
                  >
                    <FaEye />
                  </Button>
                </Tooltip>
              </div> */}

                     {/* ((data.Status == "CP" &&
                        data.IDDepartamento ==
                           Number(localStorage.getItem("group"))) ||
                        ["SISTEMAS", "DIRECTORCOMPRAS", "REQUISITOR"].includes(
                           localStorage.getItem("role") ?? "",
                        )) */}

                     <div className="w-fit">
                        <Tooltip content={`${(((data.Status == "CP") &&
                                          userGroups.includes((data?.IDDepartamento))
                                       ) ||
                                          ["SISTEMAS", "DIRECTORCOMPRAS", "REQUISITOR"].includes(
                                             localStorage.getItem("role") ?? "",
                                          ))?"Editar":"Vista"}`}>
                           <Button
                              id="formRequisition_edit"
                              color="yellow"
                              variant="solid"
                              size="small"
                              onClick={() => {
                                                         ObservableDelete("FormRequisicion");

                                 mutationEdit.mutate({
                                    method: "POST",
                                    url: "/requisiciones/showRequisicion",
                                    data: {
                                       Id: data.Id,
                                       edicion: ((data.Status == "CP" &&
                                          userGroups.includes((data?.IDDepartamento))
                                       ) ||
                                          ["SISTEMAS", "DIRECTORCOMPRAS", "REQUISITOR"].includes(
                                             localStorage.getItem("role") ?? "",
                                          ))
                                    },
                                 });
                              }}>
                                 {
                                    ((data.Status == "CP" &&
                                          userGroups.includes((data?.IDDepartamento))
                                       ) ||
                                          ["SISTEMAS", "DIRECTORCOMPRAS", "REQUISITOR"].includes(
                                             localStorage.getItem("role") ?? "",
                                          ))?<MdEdit /> :<GrFormView/>
                                 }
                       
                           </Button>
                        </Tooltip>
                     </div>

                     {data.Status != "CP" && (
                        <div className="w-fit">
                           <Tooltip content="Cancelar">
                              <Button
                                 color="red"
                                 variant="solid"
                                 size="small"
                                 onClick={() => {
                                    setCanceled(true);
                                    // showConfirmationAlert(
                                    //   `El estatus se cambiara a  CA `,
                                    //   "Esta acción no se puede deshacer."
                                    // ).then((isConfirmed) => {
                                    //   if (isConfirmed) {
                                    //     mutation.mutate({
                                    //       method: "PUT",
                                    //       url: "/requisiciones/update",
                                    //       data: { Status: "CA", id: data.Id },
                                    //     });
                                    //   } else {
                                    //     showToast("La acción fue cancelada.", "error");
                                    //   }
                                    // });
                                 }}>
                                 <MdCancel />
                              </Button>
                           </Tooltip>
                        </div>
                     )}
                     {((data.Status == "AU" &&
                        data.AutEspecial == 1 &&
                        !data.UsuarioVoBo &&
                        buttonVobo(data.IDTipo)) ||
                        (localStorage.getItem("role") == "SISTEMAS" &&
                           data.AutEspecial == 1 &&
                           !data.UsuarioVoBo)) && (
                           <PermissionMenu IdMenu={"VoBo"}>
                              <Tooltip content="Visto bueno">
                                 <Button
                                    color="teal"
                                    variant="solid"
                                    size="small"
                                    onClick={() => {
                                       mutation.mutate({
                                          method: "PUT",
                                          url: "/requisiciones/vobo",
                                          data: { id: data.Id },
                                       });
                                    }}>
                                    <MdOutlineCheckBox />
                                 </Button>
                              </Tooltip>
                           </PermissionMenu>
                        )}
                     <div className="w-fit">
                        <Tooltip content="Ver requisición">
                           <Button
                              color="presidencia"
                              variant="solid"
                              size="small"
                              onClick={async () => {
                                 mutationPdf.mutate({
                                    method: "POST",
                                    url: "/requisiciones/detailsRequisicion",
                                    pdfData: data,
                                    status: data.Status,
                                    data: {
                                       IDRequisicion: data.IDRequisicion,
                                       Ejercicio: data.Ejercicio,
                                    },
                                 });
                              }}>
                              <BsFiletypePdf />
                           </Button>
                        </Tooltip>
                     </div>
                     <div className="w-fit">
                        <PermissionMenu IdMenu="SeguimientoRequis">
                           <Tooltip content="Seguimiento de la requisición">
                              <Button
                                 color="presidencia"
                                 variant="solid"
                                 size="small"
                                 onClick={async () => {
                                    try {
                                       const result = await ObservablePost(
                                          "tracingRequisition",
                                          {
                                             data: {
                                                data: data,
                                             },
                                          },
                                       );
                                    } finally {
                                       setOpen((prev) => ({
                                          autorized: false,
                                          cotizacion: false,
                                          view: false,
                                          pdf: false,
                                          tracing: true,
                                       }));
                                    }
                                 }}>
                                 <TbReport />
                              </Button>
                           </Tooltip>
                        </PermissionMenu>
                     </div>

                     <div className="w-fit">
                        <PermissionMenu IdMenu="CambioEstatus">
                           <Tooltip content="Cambiar status">
                              <Button
                                 color="purple"
                                 variant="solid"
                                 size="small"
                                 onClick={async () => {
                                    try {
                                       const result = await ObservablePost(
                                          "changeStatusRequisition",
                                          {
                                             data: {
                                                data: data,
                                             },
                                          },
                                       );
                                    } finally {
                                       setChangeStatus(true);
                                    }
                                 }}>
                                 <TbReport />
                              </Button>
                           </Tooltip>
                        </PermissionMenu>
                     </div>

                     {["AU", "AS", "CO"].includes(data.Status) &&
                        permisos?.Permiso_Asignar == 1 &&
                        ((data.AutEspecial == 1 && data.UsuarioVoBo != null) ||
                           data.AutEspecial == 0) && (
                           <div className="w-fit">
                              <Tooltip content="Asignar requisitor">
                                 <Button
                                    color="indigo"
                                    variant="solid"
                                    size="small"
                                    onClick={async () => {
                                       try {
                                          await ObservablePost(
                                             "IdRequisicion",
                                             {
                                                id: data.Id,
                                             },
                                          );
                                       } catch (e) {
                                       } finally {
                                          setOpen((prev) => ({
                                             autorized: true,
                                             pdf: false,
                                             cotizacion: false,
                                             view: false,
                                             tracing: false,
                                          }));
                                       }
                                    }}>
                                    <PiPersonArmsSpreadThin />
                                 </Button>
                              </Tooltip>
                           </div>
                        )}
                     {!["CP", "AU", "SU", "CA"].includes(data.Status) && (
                        <>
                           <div className="w-fit ">
                              {permisos &&
                                 permisos["Permiso_Orden_Compra"] == 1 && (
                                    <Tooltip content={"seleccionar provedor"}>
                                       <Button
                                          color={"pink"}
                                          variant="solid"
                                          size="small"
                                          onClick={async () => {
                                             try {
                                                // customLog(`${JSON.stringify(data)}`, "green");
                                                const result =
                                                   await ObservablePost(
                                                      "IdRequisicion",
                                                      {
                                                         data: {
                                                            IDRequisicion:
                                                               data.IDRequisicion,
                                                            Ejercicio:
                                                               data.Ejercicio,

                                                            status: "OC",
                                                         },
                                                      },
                                                   );
                                             } catch (e) {
                                             } finally {
                                                setOpen((prev) => ({
                                                   autorized: false,
                                                   cotizacion: true,
                                                   pdf: false,
                                                   view: false,
                                                   tracing: false,
                                                }));
                                             }
                                          }}>
                                          seleccionar provedor
                                       </Button>
                                    </Tooltip>
                                 )}
                           </div>
                           <div className="w-fit ">
                              {permisos && permisos["Permiso_Cotizar"] == 1 && (
                                 <Tooltip content={"cotizar"}>
                                    <Button
                                       color={"orange"}
                                       variant="solid"
                                       size="small"
                                       onClick={async () => {
                                          try {
                                             // customLog(`${JSON.stringify(data)}`, "green");
                                             console.log("aqui", data)
                                             const result =
                                                await ObservablePost(
                                                   "IdRequisicion",
                                                   {
                                                      data: {
                                                         Nombre_Departamento: data?.Nombre_Departamento,
                                                         Centro_Costo: data?.Centro_Costo,
                                                         IDRequisicion:
                                                            data.IDRequisicion,
                                                         Ejercicio:
                                                            data.Ejercicio,

                                                         status: "CO",
                                                      },
                                                   },
                                                );
                                          } catch (e) {
                                          } finally {
                                             setOpen((prev) => ({
                                                autorized: false,
                                                cotizacion: true,
                                                pdf: false,
                                                view: false,
                                                tracing: false,
                                             }));
                                          }
                                       }}>
                                       cotizar
                                    </Button>
                                 </Tooltip>
                              )}
                           </div>
                        </>
                     )}
                     {((userGroups.includes((data?.IDDepartamento)) &&
                        newStatus(data.Status) == "AU") ||
                        ["AUTORIZADOR", "SISTEMAS", "REQUISITOR"].includes(
                           localStorage.getItem("role") ?? "",
                        ) ||
                        (newStatus(data.Status) != "CP" &&
                           newStatus(data.Status) != "AU" &&
                           // && newStatus(data.Status) !== "SU"
                           newStatus(data.Status) != "AS" &&
                           AutorizedEspecial(
                              data.RequiereAut,
                              data.AutEspecial,
                              newStatus(data.Status),
                           ))) &&
                        autorized && (
                           <Tooltip
                              content={`Cambiar status de ${data.Status} a ${newStatus(data.Status)}`}>
                              <div
                                 onClick={async () => {
                                    newStatus(data.Status) != "SU"
                                       ? showConfirmationAlert(
                                          `El estatus se cambiara a ${newStatus(data.Status)} `,
                                          "Esta acción no se puede deshacer.",
                                       ).then((isConfirmed) => {
                                          if (isConfirmed) {
                                             mutation.mutate({
                                                method: "PUT",
                                                url: "/requisiciones/update",
                                                data: {
                                                   Status: newStatus(
                                                      data.Status,
                                                   ),
                                                   id: data.Id,
                                                },
                                             });
                                          } else {
                                             showToast(
                                                "La acción fue cancelada.",
                                                "error",
                                             );
                                          }
                                       })
                                       : setOpenSu(true);
                                 }}
                                 className={`w-fit flex flex-row gap-2 items-center shadow-md  ${getColorButton(newStatus(data.Status))}  text-white hover:bg-teal-700 focus:ring-teal-500  rounded-xl  hover:shadow-lg focus:ring-4 text-sm py-2 px-4 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2  `}>
                                 <span>{data.Status}</span>
                                 <LiaExchangeAltSolid className="text-whitecursor-pointer" />
                                 <span>{newStatus(data.Status)} </span>
                              </div>
                           </Tooltip>
                        )}
                  </div>
               </DropdownComponent>
               <ModalComponent
                  title="Surtir la orden"
                  open={openSu}
                  setOpen={() => {
                     setOpenSu(false);
                  }}
                  children={
                     <>
                        <div className="mb-6"> </div>
                        <FormikForm
                           buttonMessage="Surtir"
                           initialValues={{ ClavePresupuestal: 1 }}
                           children={() => (
                              <FormikNumberInput
                                 label="Numero de orden de compra"
                                 name="ClavePresupuestal"
                                 decimals={false}
                              />
                           )}
                           onSubmit={(values) => {
                              mutation.mutate({
                                 method: "PUT",
                                 url: "/requisiciones/update",
                                 data: {
                                    Status: newStatus(data.Status),
                                    id: data.Id,
                                    ClavePresupuestal: values.ClavePresupuestal,
                                 },
                              });
                           }}
                        />
                     </>
                  }
               />

               <ModalComponent
                  title="Cancelación de requisición"
                  open={canceled}
                  setOpen={() => {
                     setCanceled(false);
                  }}
                  children={
                     <>
                        <div className="mb-6"> </div>
                        <FormikForm
                           buttonMessage="Cancelar"
                           initialValues={{ Motivo_Cancelacion: "" }}
                           children={() => (
                              <FormikTextArea
                                 label="Motivo de cancelación"
                                 name="Motivo_Cancelacion"
                              />
                           )}
                           onSubmit={(values) => {
                              mutation.mutate({
                                 method: "PUT",
                                 url: "/requisiciones/update",
                                 data: {
                                    Status: "CA",
                                    id: data.Id,
                                    Motivo_Cancelacion:
                                       values.Motivo_Cancelacion,
                                 },
                              });
                           }}
                        />
                     </>
                  }
               />
            </>
         )}
      </>
   );
};

export default Actions;
