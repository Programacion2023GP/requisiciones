import { memo, useEffect, useState } from "react";
import { ModalComponent } from "../components/modal/Modal";
import Typography from "../components/typografy/Typografy";
import FormikForm from "../components/formik/Formik";
import { FormikSwitch } from "../components/formik/FormikInputs/FormikInput";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { AxiosRequest, GetAxios } from "../axios/Axios";
import Spinner from "../loading/Loading";
import { ColComponent, RowComponent } from "../responsive/Responsive";
import Button from "../components/form/Button";
import { BiSolidSend } from "react-icons/bi";
import { showToast } from "../sweetalert/Sweetalert";
import { MenuItem } from "../layout/sidebar/Sidebar";

type MenuComponentType = {
  Usuario: string;
  fullName: string;
  newKey:string;
};

const MenuComponent: React.FC<MenuComponentType> = ({  newKey,Usuario, fullName }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [initialValues, setInitialValues] = useState<Record<string, any>>({});
  const queryClient = useQueryClient();
  const queries = useQueries({
    queries: [
      {
        queryKey: ["menuuser/index"],
        queryFn: () => GetAxios(`menuuser/index/${Usuario}`),
        refetchOnWindowFocus: true,
      },
    ],
  });
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
      setOpen(false);
      showToast(data.message, data.status);
      // queryClient.refetchQueries({
      //   queryKey: ["users/index"],
      // });
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.message || "Error al realizar la acción",
        "error"
      );
    },
  });
  const [menus] = queries;
  const groupMenuByParent = (data: any[]): MenuItem[] => {
    const menuMap: { [key: string]: any } = {};
  
    // Crear el mapa inicial de elementos
    data.forEach((item) => {
      menuMap[item.Id] = { ...item, children: [] };
    });
  
    const result: any[] = [];
  
    // Construir el árbol de menús
    data.forEach((item) => {
      if (item.MenuPadre && menuMap[item.MenuPadre]) {
        menuMap[item.MenuPadre].children.push(menuMap[item.Id]);
      } else if (!item.MenuPadre) {
        result.push(menuMap[item.Id]);
      } else {
        console.warn(`MenuPadre ${item.MenuPadre} no encontrado para el elemento:`, item);
      }
    });
  console.log(`MenuPadre 0`,result);
    return result;
  };
  

  useEffect(() => {
    setInitialValues([]);
    queryClient.resetQueries({
      queryKey: ["menuuser/index"], // Especifica explícitamente queryKey
    });
  }, [newKey]); // El efecto se ejecuta cuando cambia el Usuario

  useEffect(() => {
    if (menus.isSuccess) {
      setOpen(true);
      const transformedMenus = groupMenuByParent(menus.data.data);
      setMenuItems(transformedMenus);

      const menuEntries = transformedMenus.flatMap(
        (item) =>
          item.children?.map((child) => [child.IdMenu, child.EstadoPermiso]) || []
      );
      setInitialValues(Object.fromEntries(menuEntries));
    }
  }, [menus.isSuccess]);

  const onSumbit = (values: Record<string, any>) => {
    mutation.mutate({
      url: `/menuuser/create/${Usuario}`,
      method: "POST",
      data: values,
    });
  };

  return (
    <>
      {menus.isLoading && <Spinner />}
      <ModalComponent
        title={`${fullName}`}
        open={open}
        setOpen={() => {
          setOpen(false);
        }}
      >
        <Typography
          className="w-full text-center "
          color="black"
          size="lg"
          weight="semibold"
        >
          Asignación de permisos del menu
        </Typography>
        {Object.keys(initialValues).length > 0 && menus.isSuccess && (
          <FormikForm
            initialValues={initialValues}
            onSubmit={onSumbit}
            // validationSchema={{}}
            children={() => (
              <>
                <RowComponent>
                  {menuItems.map((menu, index) => (
                    <>
                      {Array.isArray(menu.children) &&
                        menu.children.length > 0 && (
                          <ColComponent
                            key={index}
                            responsive={{ "2xl": 4, xl: 6 }}
                          >
                            <div className="shadow-lg m-2 border-2 rounded-md border-gray-300  ">
                              <Typography
                                className="w-full text-zinc-700 shadow-sm text-center border-2 mb-1 bg-teal-50 p-2 "
                                size="lg"
                                variant="h3"
                                weight="bold"
                              >
                                {menu.Menu}
                              </Typography>
                              <div className="px-2">
                                {Array.isArray(menu.children) &&
                                  menu.children.length > 0 &&
                                  menu.children.map((child, index) => (
                                    <>
                                      <FormikSwitch
                                        label={child.Menu}
                                        name={child.IdMenu}
                                      />
                                    </>
                                  ))}
                              </div>
                            </div>
                          </ColComponent>
                        )}
                    </>
                  ))}
                </RowComponent>
                <div className="w-full px-10 text-center mt-2">
                  <Button
                    type="submit"
                    color={"blue"}
                    variant={"solid"}
                    size="small"
                  >
                    Guardar cambios
                  </Button>
                </div>
              </>
            )}
          ></FormikForm>
        )}
      </ModalComponent>
    </>
  );
};
export default MenuComponent;
