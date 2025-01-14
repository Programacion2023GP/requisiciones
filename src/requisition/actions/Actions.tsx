import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Button from "../../components/form/Button";
import { LiaExchangeAltSolid } from "react-icons/lia";
import { MdCancel } from "react-icons/md";
import Tooltip from "../../components/toltip/Toltip";
import { showConfirmationAlert, showToast } from "../../sweetalert/Sweetalert";
import { AxiosRequest } from "../../axios/Axios";
import { useMutation } from "@tanstack/react-query";
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

const Actions: React.FC<{
  data: Record<string, any>;
  setReloadTable: Dispatch<SetStateAction<boolean>>;
}> = ({ data, setReloadTable }) => {
  const [open, setOpen] = useState({
    pdf: false,
    autorized: false,
    cotizacion: false,
    view: false,
  });
  const [spiner, setSpiner] = useState<boolean>(false);
  const permisosString = localStorage.getItem("permisos") ?? "{}"; // Valor predeterminado: objeto vacío

  const permisos = JSON.parse(permisosString); // Convertir el string a un objeto
  const [autorized, SetAutorized] = useState(false);
  const { ObservablePost } = Observable();
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
        "error"
      );
    },
  });
  const mutationPdf = useMutation({
    mutationFn: ({
      url,
      method,
      data,
      pdfData,
    }: {
      url: string;
      method: "POST" | "PUT" | "DELETE";
      data?: any;
      pdfData: Record<string, any>;
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
        }));
      }
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.message || "Error al realizar la acción",
        "error"
      );
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
        }));
      }
      setSpiner(false);
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.message || "Error al realizar la acción",
        "error"
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
    status: string
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
      ([key, value]) => value === permission && permisos[key] === 1
    );
  };
  const buttonVobo = (idTipo: number): boolean => {
    const group = localStorage.getItem("group");
    if (group === null) {
      return false;
    }

    let idGroup = parseInt(group, 10);
    if (
      (idGroup == 84 && idTipo == 5) ||
      (idGroup == 83 && idTipo == 7) ||
      (idGroup == 27 && idTipo == 6)
    ) {
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
                }));
              }}
            />
          )}

          {open.pdf && (
            <PermissionMenu IdMenu="SeguimientoRequis">
              <Pdfrequisition
                open={open.pdf}
                setOpen={() => {
                  setOpen((prev) => ({
                    autorized: false,
                    pdf: false,
                    cotizacion: false,
                    view: false,
                  }));
                }}
              />
            </PermissionMenu>
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
                }));
              }}
            />
          )}
          <div className="flex flex-row gap-2">
            <div className="w-fit">
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
            
            </div>
            <div className="w-fit ">
            {(newStatus(data.Status) == "CO" ||
              newStatus(data.Status) == "OC") && (

                <Tooltip content={newStatus(data.Status) == "CO"?'cotizar':'seleccionar provedor'}>
                <Button
                  color={newStatus(data.Status) == "CO"?'orange':'pink'}
                  variant="solid"
                  size="small"
                  onClick={async() => {
                    try {
                      // customLog(`${JSON.stringify(data)}`, "green");
                      const result = await ObservablePost("IdRequisicion", {
                        data: {
                          IDRequisicion: data.IDRequisicion,
                          Ejercicio: data.Ejercicio,

                          status: newStatus(data.Status),
                        },
                      });
                    } catch (e) {
                    } finally {
                      setOpen((prev) => ({
                        autorized: false,
                        cotizacion: true,
                        pdf: false,
                        view: false,
                      }));
                    }
                 
                  }}
                >
                  {newStatus(data.Status) == "CO"?'cotizar':'seleccionar provedor'}
                </Button>
              </Tooltip>
              )}
            </div>
            {newStatus(data.Status) !== "CP" &&
              // newStatus(data.Status) !== "SU" &&
              newStatus(data.Status) !== "AS" &&
              AutorizedEspecial(
                data.RequiereAut,
                data.AutEspecial,
                newStatus(data.Status)
              ) &&
              autorized && (
                <Tooltip
                  content={`Cambiar status de ${data.Status} a ${newStatus(data.Status)}`}
                >
                  <div
                    onClick={async () => {
                      showConfirmationAlert(
                        `El estatus se cambiara a ${newStatus(data.Status)} `,
                        "Esta acción no se puede deshacer."
                      ).then((isConfirmed) => {
                        if (isConfirmed) {
                          mutation.mutate({
                            method: "PUT",
                            url: "/requisiciones/update",
                            data: {
                              Status: newStatus(data.Status),
                              id: data.Id,
                            },
                          });
                        } else {
                          showToast("La acción fue cancelada.", "error");
                        }
                      });
                    }}
                    className={`w-fit flex flex-row gap-2 items-center shadow-md  ${getColorButton(newStatus(data.Status))}  text-white hover:bg-teal-700 focus:ring-teal-500  rounded-xl  hover:shadow-lg focus:ring-4 text-sm py-2 px-4 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2  `}
                  >
                    <span>{data.Status}</span>
                    <LiaExchangeAltSolid className="text-whitecursor-pointer" />
                    <span>{newStatus(data.Status)} </span>
                  </div>
                </Tooltip>
              )}
        
            {data.Status !== "SU" &&
              localStorage.getItem("role") == "COMPRAS" && (
                <div className="w-fit">
                  <Tooltip content="Cancelar">
                    <Button
                      color="red"
                      variant="solid"
                      size="small"
                      onClick={() => {
                        showConfirmationAlert(
                          `El estatus se cambiara a  CA `,
                          "Esta acción no se puede deshacer."
                        ).then((isConfirmed) => {
                          if (isConfirmed) {
                            mutation.mutate({
                              method: "PUT",
                              url: "/requisiciones/update",
                              data: { Status: "CA", id: data.Id },
                            });
                          } else {
                            showToast("La acción fue cancelada.", "error");
                          }
                        });
                      }}
                    >
                      <MdCancel />
                    </Button>
                  </Tooltip>
                </div>
              )}

            {data.Status == "AU" &&
              data.AutEspecial == 1 &&
              !data.UsuarioVoBo &&
              buttonVobo(data.IDTipo) && (
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
                      }}
                    >
                      <MdOutlineCheckBox />
                      {data.UsuarioVoBo}
                    </Button>
                  </Tooltip>
                </PermissionMenu>
              )}

            <div className="w-fit">
              <PermissionMenu IdMenu="SeguimientoRequis">
                <Tooltip content="Descargar archivo adjunto">
                  <Button
                    color="blue"
                    variant="solid"
                    size="small"
                    onClick={async () => {
                      mutationPdf.mutate({
                        method: "POST",
                        url: "/requisiciones/detailsRequisicion",
                        pdfData: data,
                        data: {
                          IDRequisicion: data,
                          Ejercicio: data.Ejercicio,
                        },
                      });
                    }}
                  >
                    <BsFiletypePdf />
                  </Button>
                </Tooltip>
              </PermissionMenu>
            </div>

            {!data.UsuarioAS &&
              newStatus(data.Status) == "AS" &&
              permisos.Permiso_Asignar == 1 && (
                <div className="w-fit">
                  <Tooltip content="Asignar requisitor">
                    <Button
                      color="indigo"
                      variant="solid"
                      size="small"
                      onClick={async () => {
                        try {
                          await ObservablePost("IdRequisicion", {
                            id: data.Id,
                          });
                        } catch (e) {
                        } finally {
                          setOpen((prev) => ({
                            autorized: true,
                            pdf: false,
                            cotizacion: false,
                            view: false,
                          }));
                        }
                      }}
                    >
                      <PiPersonArmsSpreadThin />
                    </Button>
                  </Tooltip>
                </div>
              )}
          </div>
        </>
      )}
    </>
  );
};

export default Actions;
