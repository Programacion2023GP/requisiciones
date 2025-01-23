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
import Spinner from "../../loading/Loading";

type HeaderComponentProps = {
  button?: React.ReactNode;
};

const HeaderComponent: React.FC<HeaderComponentProps> = ({ button }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [open,setOpen] = useState<boolean>(false);
  // const [spiner,setSpiner] = useState<boolean>(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const initialValues = {
    Password: '',
  
  }
  const validationSchema = Yup.object({
    Password: Yup.string()
      .required("La contraseña es obligatoria")
      .min(6, "Debe tener al menos 6 caracteres"),
  
  });
  const onSubmit = (values:Record<string,any>) => {
    mutation.mutate({
      url: `/auth/changePassword`,
      method: "POST",
      data: values,
    })
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
    <div className="bg-presidencia w-full h-full p-4 shadow-lg flex items-center justify-between">
      {mutation.status === "pending" &&<Spinner/>}
      <div className="flex items-center space-x-3">{button}</div>

      <div className="flex items-end space-x-3">
        <Typography className="shadow-md" color="white" size="4xl" variant="h2">
          {localStorage.getItem("name")}
        </Typography>
      </div>

      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="text-white p-2 rounded-md focus:outline-none hover:bg-cyan-700 transition duration-200"
        >
          <BiUserCircle className="w-8 h-8"/>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md">
            <div className="p-2 space-y-2">
              <button onClick={()=>{
                setOpen(true)
              }} className="w-full text-left text-sm cursor-pointer text-gray-700 hover:bg-presidencia hover:text-white p-2 rounded-md transition">
                Cambiar contraseña
              </button>
            </div>
          </div>
        )}
      </div>
      <ModalComponent title="Cambio de contraseña" open={open} setOpen={()=>{
        setOpen(false)
      }} >
        <div className="mt-6"></div>
      <FormikForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          buttonMessage="Actualizar"
          onSubmit={onSubmit}
          children={() => (
            <FormikPasswordInput label="Nueva contraseña" name="Password"/>
          )}/>
      </ModalComponent>
    </div>
  );
};

export default memo(HeaderComponent);
