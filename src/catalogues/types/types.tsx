import { ColDef } from "ag-grid-community";
import { useMemo, useState } from "react";
import Tooltip from "../../components/toltip/Toltip";
import Button from "../../components/form/Button";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { Agtable } from "../../components/table/Agtable";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { AxiosRequest, GetAxios } from "../../axios/Axios";
import { LuPlus } from "react-icons/lu";
import FormikForm from "../../components/formik/Formik";
import ModalComponent from "../../components/modal/Modal";
import { FormikAutocomplete, FormikInput } from "../../components/formik/FormikInputs/FormikInput";
import * as Yup from "yup";
import { showConfirmationAlert, showToast } from "../../sweetalert/Sweetalert";

type cat_detailstipos = {
    IDDetalleTipo?: number;
    IDTipo: number;
    Nombre: string;
    Tipo: string;
};

const CatTypes = () => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState<boolean>(false);
    const [initialValues, setInitialValues] = useState<cat_detailstipos>({
        IDDetalleTipo: 0,
        IDTipo: 0,
        Nombre: "",
        Tipo: "",
    });

    // Manejador de edición (ahora funciona)
    const handleEdit = (detalle: cat_detailstipos): void => {
        setInitialValues({
            IDDetalleTipo: detalle.IDDetalleTipo,
            IDTipo: detalle.IDTipo,
            Nombre: detalle.Nombre,
            Tipo: detalle.Tipo,
        });
        setOpen(true);
    };

    // Dentro del componente CatTypes
    // Reemplaza tu mutation actual por esta versión mejorada
    // Carga datos de la tabla y tipos
    const queries = useQueries({
        queries: [
            {
                queryKey: ["detailstypes/index"],
                queryFn: () => GetAxios("detailstypes/index"),
                refetchOnWindowFocus: true,
            },
            {
                queryKey: ["tipos/index"],
                queryFn: () => GetAxios("tipos/index"),
                refetchOnWindowFocus: true,
            },
        ],
    });

    const [detailsTypes, types] = queries;
    
    const mutation = useMutation({
        mutationFn: ({ url, method, data }: { url: string; method: "POST" | "PUT" | "DELETE"; data?: any }) =>
            AxiosRequest(url, method, data),
        onSuccess: (data) => {
            setOpen(false);
            showToast(data.message, data.status);

            // Refresca la query después de cualquier operación
            detailsTypes.refetch(); // <-- Esto funciona porque detailsTypes es un objeto de query
        },
        onError: (error: any) => {
            showToast(error.response?.data?.message || "Error al realizar la acción", "error");
        },
    });



    // Botón agregar
    const buttonElement = useMemo(
        () => (
            <Tooltip content="Agregar Detalle">
                <div className="mb-4">
                    <Button
                        onClick={() => {
                            setInitialValues({
                                IDDetalleTipo: 0,
                                IDTipo: 0,
                                Nombre: "",
                                Tipo: "",
                            });
                            setOpen(true);
                        }}
                        size="medium"
                        color="blue"
                        variant="solid"
                    >
                        <LuPlus />
                    </Button>
                </div>
            </Tooltip>
        ),
        []
    );



    // Columnas de tabla
    const [columnDefs] = useState<ColDef<cat_detailstipos>[]>([
        {
            headerName: "Detalle",
            field: "Nombre",
            sortable: true,
            filter: true,
        },
        {
            headerName: "Tipo",
            field: "Tipo",
            sortable: true,
            filter: true,
        },
        {
            headerName: "Acciones",
            cellRenderer: (params: any) => (
                <ActionButtons
                    handleEdit={handleEdit}
                    data={params.data}
                    mutation={mutation}
                />
            ),
        },
    ]);

    const responsive = {
        "2xl": 12,
        lg: 12,
        md: 12,
        sm: 12,
        xl: 12,
    };

    const validationSchema = Yup.object({
        Nombre: Yup.string().required("El nombre es obligatorio"),
        IDTipo: Yup.number().required("El Tipo es obligatorio"),
    });

    const onSubmit = (values: Record<string, any>) => {
        mutation.mutate({
            url: `/detailstypes/createorUpdate`,
            method: "POST",
            data: values,
        });
    };

    return (
        <>
            <div className="container p-6 mx-auto mt-12 border shadow-lg">
                <div className="container w-full p-6 mx-auto ag-theme-alpine"></div>
                <Agtable
                    permissionsUserTable={{
                        buttonElement: "CatTipos",
                        table: "CatTipos",
                    }}
                    loading={detailsTypes.status === "pending"}
                    data={detailsTypes?.data?.data}
                    isLoading={detailsTypes.isLoading}
                    columnDefs={columnDefs}
                    buttonElement={buttonElement}
                />

                <ModalComponent
                    open={open}
                    fullScreen={false}
                    setOpen={() => setOpen(false)}
                >
                    <FormikForm
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        buttonMessage={
                            initialValues.IDDetalleTipo && initialValues.IDDetalleTipo > 0
                                ? "Actualizar"
                                : "Registrar"
                        }
                        onSubmit={onSubmit}
                        children={() => (

                            <>
                                <FormikAutocomplete
                                    responsive={responsive}
                                    name="IDTipo"
                                    label="Tipo correspondiente"
                                    options={types.data?.data}
                                    idKey="IDTipo"
                                    labelKey="Descripcion"
                                />
                                <FormikInput
                                    label="Nombre"
                                    name="Nombre"
                                    responsive={responsive}
                                />
                            </>
                        )}
                    >
                    </FormikForm>
                </ModalComponent>
            </div>
        </>
    );
};

export default CatTypes;

// Componente separado: Botones de acción
// En ActionButtons
const ActionButtons = ({
    data,
    handleEdit,
    mutation,
}: {
    data: Record<string, any>;
    mutation: any;
    handleEdit: (detalle: cat_detailstipos) => void;
}) => {
    const handleDelete = () => {
        showConfirmationAlert(
            `Eliminar `,
            "Se eliminara el detalle"
        ).then((isConfirmed) => {
            if (isConfirmed) {
                mutation.mutate({
                url: `/detailstypes/delete/${data.IDDetalleTipo}`,
                method: "DELETE",
                });
            } else {
                showToast("La acción fue cancelada.", "error");
            }
        });
     
    };

    return (
        <div className="flex gap-2">
            <Tooltip content="Editar Detalle del tipo">
                <Button
                    color="yellow"
                    size="small"
                    variant="solid"
                    onClick={() => handleEdit(data as cat_detailstipos)}
                >
                    <BiEdit />
                </Button>
            </Tooltip>

            <Tooltip content="Eliminar Detalle del tipo">
                <Button
                    color="red"
                    size="small"
                    variant="solid"
                    onClick={handleDelete}
                >
                    <MdDelete />
                </Button>
            </Tooltip>
        </div>
    );
};

