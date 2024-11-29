import { memo, useEffect, useState } from "react";
import { ModalComponent } from "../components/modal/Modal";
import Typography from "../components/typografy/Typografy";
import FormikForm from "../components/formik/Formik";
import { FormikSwitch } from "../components/formik/FormikInputs/FormikInput";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { GetAxios } from "../axios/Axios";
import Spinner from "../loading/Loading";
import { ColComponent, RowComponent } from "../responsive/Responsive";
import Button from "../components/form/Button";
import { BiSolidSend } from "react-icons/bi";

type MenuComponentType = {
  Usuario: string;
  fullName: string;
};
interface MenuItem {
  Id: number;
  IdMenu: string;
  Menu: string;
  MenuPadre: number | null;
  children?: MenuItem[]; // Los menús hijos, que pueden ser opcionales
  State?:boolean;
}
const MenuComponent: React.FC<MenuComponentType> = ({ Usuario, fullName }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [initialValues, setInitialValues] = useState<Record<string, any>>({});
    const queryClient = useQueryClient();
  const queries = useQueries({
    queries: [
      {
        queryKey: ["menu/index"],
        queryFn: () => GetAxios(`menu/index/${Usuario}`),
        refetchOnWindowFocus: true,
        
      },
    ],
  });
  const [menus] = queries;
  const groupMenuByParent = (data: any[]): MenuItem[] => {
    const menuMap: { [key: string]: any } = {};
    data.forEach((item) => {
      menuMap[item.Id] = { ...item, children: [] };
    });
    const result: any[] = [];
    data.forEach((item) => {
      if (item.MenuPadre) {
        menuMap[item.MenuPadre].children.push(menuMap[item.Id]);
      } else {
        result.push(menuMap[item.Id]);
      }
    });

    return result;
  };

  useEffect(() => {
    setInitialValues([])
    queryClient.resetQueries({
        queryKey: ["menu/index"], // Especifica explícitamente queryKey
      });
        }, [Usuario]); // El efecto se ejecuta cuando cambia el Usuario
  
  useEffect(() => {
    console.log("aqui  isSuccess");
    if (menus.isSuccess) {
        setOpen(true)
        const transformedMenus = groupMenuByParent(menus.data.data);
        setMenuItems(transformedMenus);
       
        const menuEntries = transformedMenus.flatMap(
          (item) =>
              item.children?.map((child) => [child.IdMenu, child.State ]) || []
        );
        setInitialValues(Object.fromEntries(menuEntries));
        
    }
  }, [menus.isSuccess]);

  const onSumbit = (values: Record<string, any>) => {
    console.log("valores", values);
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
