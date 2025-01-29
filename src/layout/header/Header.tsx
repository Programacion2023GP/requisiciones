import React, { memo, useState } from "react";
import Typography from "../../components/typografy/Typografy";
import ModalComponent from "../../components/modal/Modal";
import FormikForm from "../../components/formik/Formik";
import * as Yup from "yup";
import { FormikPasswordInput } from "../../components/formik/FormikInputs/FormikInput";
import { useMutation } from "@tanstack/react-query";
import { AxiosRequest } from "../../axios/Axios";
import { showToast } from "../../sweetalert/Sweetalert";
import { BiUserCircle } from "react-icons/bi";
import { IoMdSettings, IoMdLock } from "react-icons/io";
import Spinner from "../../loading/Loading";

type HeaderComponentProps = {
  button?: React.ReactNode;
};

const HeaderComponent: React.FC<HeaderComponentProps> = ({ button }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [open, setOpen] = useState<boolean>(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const initialValues = {
    Password: '',
  };

  const validationSchema = Yup.object({
    Password: Yup.string()
      .required("La contraseña es obligatoria")
      .min(6, "Debe tener al menos 6 caracteres"),
  });

  const onSubmit = (values: Record<string, any>) => {
    mutation.mutate({
      url: `/auth/changePassword`,
      method: "POST",
      data: values,
    });
  };

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
    onSuccess: (data) => {
      showToast(data.message, data.status);
      setOpen(false);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Error al realizar la acción";
      showToast(message, "error");
    },
  });

  return (
    <div className="bg-gradient-to-r from-[#ffffff] to-[#ffffff] w-full h-16 px-6 shadow-lg flex items-center justify-between">
      {mutation.status === "pending" && <Spinner />}
      
      <div className="flex items-center space-x-3">{button}</div>
      
      <div className="flex items-center space-x-4">
        <Typography 
          className="text-blue/80 hover:text-blue transition-colors" 
          size="lg" 
        >
          {localStorage.getItem("name")}
        </Typography>
        
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="
              text-blue-500 hover:text-blue 
              p-2 rounded-full 
              hover:bg-white/10 
              transition duration-300 
              focus:outline-none
            "
          >
            <BiUserCircle className="w-7 h-7" />
          </button>

          {isDropdownOpen && (
            <div 
              className="
                absolute right-0 mt-2 w-56 
                bg-white/10 backdrop-blur-lg 
                border border-white/20 
                shadow-2xl rounded-lg 
                overflow-hidden
              "
            >
              <div className="py-2">
                <button 
                  onClick={() => setOpen(true)}
                  className="
                    w-full text-left px-4 py-2 
                    text-blue/80 hover:text-blue-500 
                    hover:bg-white/10 
                    flex items-center 
                    space-x-3 
                    transition
                  "
                >
                  <IoMdLock className="w-5 h-5" />
                  <span>Cambiar contraseña</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ModalComponent 
        title="Cambio de contraseña" 
        open={open} 
        setOpen={() => setOpen(false)} 
      >
        <div className="mt-6">
          <FormikForm
            initialValues={initialValues}
            validationSchema={validationSchema}
            buttonMessage="Actualizar"
            onSubmit={onSubmit}
            children={() => (
              <FormikPasswordInput 
                label="Nueva contraseña" 
                name="Password" 
              />
            )}
          />
        </div>
      </ModalComponent>
    </div>
  );
};

export default memo(HeaderComponent);