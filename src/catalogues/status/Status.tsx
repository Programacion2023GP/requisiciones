import React, { useRef, useState } from "react";
import { ListComponent } from "../../components/list/ListComponent";
import { ModalComponent } from "../../components/modal/Modal";
import { FormHandle, Formulario } from "../../components/form/Formulario";
import { FInput } from "../../components/form/input/Input";
import { useCatalogues } from "../cataloguesHook";
import { Axios } from "../../axios/axios";
import ToastComponent, { ToastProps } from "../../components/toast/Toast";
import { SwitchComponent } from "../../components/switch/Switch";
import Tooltip from "../../components/toltip/Toltip";
interface MessageModal {
  title: string;
  messageButton: string;
}

export const CatalogueIndexStatus: React.FC = () => {
  const { data, getData, item, setItem,loading } = useCatalogues({ url: "/status" });
  const ref = useRef<FormHandle>(null);
  const [modal, setModal] = useState<MessageModal>();
  const [open, setOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastProps>();
  const setAlert = (toast: ToastProps) => {
    setToast(toast);
    setTimeout(() => {
      setToast({ loading: false, message: "", title: "", type: "error" });
    }, 2500);
  };
  const handleDelete = (item: Record<string, any>) => {
    Axios.delete(`/status/${item.id}`)
      .then((response) => {
        getData();
        setAlert({
          loading: true,
          title: response.data.title,
          message: response.data.message,
          type: "success",
          icon: <i className="ri-shield-user-line ri-2x"></i>,
        });
      })
      .catch((error) => {
        getData();
        setAlert({
          loading: true,
          title: error.response.data.title,
          message: error.response.data.message,
          type: "error",
          icon: <i className="ri-shield-user-line ri-2x"></i>,
        });
      });
  };
  const handleEdit = (item: Record<string, any>) => {
    setItem(item);
    setOpen(true);
  };
  const submit = (values: Record<string, any>) => {
    ref.current?.resetForm();
    setOpen(false);
    if (!item) {
      Axios.post("/status", values)
        .then((response) => {
          getData();
          setAlert({
            loading: true,
            title: response.data.title,
            message: response.data.message,
            type: "success",
            icon: <i className="ri-information-line ri-2x"></i>,
          });
        })
        .catch((error) => {
          getData();

          setAlert({
            loading: true,
            title: error.response.data.title,
            message: error.response.data.message,
            type: "error",
            icon: <i className="ri-information-line ri-2x"></i>,
          });
        });
    } else {
      Axios.put(`/status/${item!!.id}`, values)
        .then((response) => {
          getData();
          setAlert({
            loading: true,
            title: response.data.title,
            message: response.data.message,
            type: "success",
            icon: <i className="ri-information-line ri-2x"></i>,
          });
        })
        .catch((error) => {
          getData();

          setAlert({
            loading: true,
            title: error.response.data.title,
            message: error.response.data.message,
            type: "error",
            icon: <i className="ri-information-line ri-2x"></i>,
          });
        });
    }
  };
  const handleSelectAllChange = (it:Record<string,any>)=>{
    Axios.put(`/status/${it!!.id}`, {...it,active:!it.active})
    .then((response) => {
      getData();
      setAlert({
        loading: true,
        title: response.data.title,
        message: response.data.message,
        type: "success",
        icon: <i className="ri-information-line ri-2x"></i>,
      });
    })
    .catch((error) => {
      getData();
  
      setAlert({
        loading: true,
        title: error.response.data.title,
        message: error.response.data.message,
        type: "error",
        icon: <i className="ri-information-line ri-2x"></i>,
      });
    });
  } 

  return (
    <>
      {toast?.loading && (
        <ToastComponent
          loading={toast?.loading}
          title={toast?.title}
          message={toast?.message}
          type={toast?.type}
          icon={toast?.icon}
        />
      )}
      <ListComponent
        title="status del sistema"
        loading={loading}
        filter
        button
        titleItem="name"
        addIcon={
          <>
            <button
              onClick={() => {
                setItem(null);
                setOpen(true);
                setModal({
                  title: "Registro de status",
                  messageButton: "Registrar",
                });
              }}
              className="ml-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition duration-300 ease-in-out transform hover:scale-110"
            >
              <i className="ri-add-line text-2xl"></i>
            </button>
          </>
        }
        data={data}
        // loading={users.loading}
        buttons={(item) => (
          <>
            <Tooltip content={`click para ${item.active?'desactivar':'activar'} status`}>
              <div className="mt-1">
                <SwitchComponent
                  iconClass={item.active?'ri-check-line':'ri-close-line'} // Icono para "Todos"
                  classChecked={item.active?'bg-green-500':'bg-red-500'} // Color para "Todos"
                  checked={item.active} // Marca "Todos" si todos están seleccionados
                  onChange={()=>{
                    handleSelectAllChange(item)
                  }}
                />
              </div>
            </Tooltip>

            <button
              onClick={() => {
                handleEdit(item);
              }}
              className="rounded-md bg-yellow-300 px-2 py-1 text-white transition duration-200 hover:bg-yellow-500"
            >
              <i className="ri-edit-box-line"></i>
            </button>
            <button
              onClick={() => {
                handleDelete(item);
              }}
              className="rounded-md bg-red-300 px-2 py-1 text-white transition duration-200 hover:bg-red-500"
            >
              <i className="ri-delete-bin-6-line"></i>
            </button>
          </>
        )}
      />
      <ModalComponent
        title={modal?.title}
        messageButton={modal?.messageButton}
        open={open}
        setOpen={setOpen}
        handleButton={() => {}}
      >
        <Formulario ref={ref} onSubmit={submit}>
          {({}) => (
            <>
              <FInput
                label="nombre"
                name="name"
                value={item?.name || null}
                required={{
                  condition: true,
                  message: "es necesario el nombre",
                }}
              />

              <button
                type="submit"
                className="w-24 h-10 bg-cyan-500 text-white font-semibold rounded-md shadow-md transition duration-300 ease-in-out transform hover:bg-cyan-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-opacity-50"
              >
                {modal?.messageButton}
              </button>
            </>
          )}
        </Formulario>
      </ModalComponent>
    </>
  );
};
