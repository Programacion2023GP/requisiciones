import { useMutation } from "@tanstack/react-query";
import FormikForm from "../../components/formik/Formik"
import { FormikAutocomplete } from "../../components/formik/FormikInputs/FormikInput"
import ModalComponent from "../../components/modal/Modal"
import Observable from "../../extras/observable";
import { Requisition } from "../tracing/Tracing";
import { AxiosRequest } from "../../axios/Axios";
import { Dispatch, SetStateAction, useState } from "react";
import { showToast } from "../../sweetalert/Sweetalert";
import Spinner from "../../loading/Loading";
type DataTracing = {
    data: DataT;
};
type DataT = {
    data: Requisition;
};

type LineTime = {
    title: string;
    date: string;
    autor: string | null;
};
const ChangeStatusRequisition = ({ open, setOpen, setReloadTable }: {
    open: boolean, setOpen: () => void, setReloadTable: Dispatch<SetStateAction<boolean>>;
}) => {
    const [spiner, setSpiner] = useState<boolean>(false);

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
    const item = Observable().ObservableGet("changeStatusRequisition") as DataTracing;
    console.log("datos aqui", item.data)
    return (

        <>
            {spiner && <Spinner />}

            <ModalComponent title={`Cambio de estatus del folio`} open={open} setOpen={setOpen}>
                <FormikForm initialValues={{ status: item.data?.data.Status, id: item.data?.data.IDRequisicion }} onSubmit={(values) => {
                    mutation.mutate({
                        method: "POST",
                        url: "/requisiciones/show",
                        data: values,
                    });
                }}
                    buttonMessage="Cambiar" children={() => (
                        <div className="mt-8 w-full">

                            <FormikAutocomplete loading={false} label="cambia el status" name="status" idKey="value" labelKey="text" options={[
                                { "text": "Captura", value: "CP" },
                                { "text": "Autorizada", value: "AU" },
                                { "text": "Visto Bueno", value: "VoBo" },
                                { "text": "Cotización", value: "CO" },
                                { "text": "Orden de compra", value: "OC" },
                                { "text": "Rechazada", value: "CA" },

                            ]} />
                        </div>
                    )} />
            </ModalComponent>
        </>
    )
}

export default ChangeStatusRequisition