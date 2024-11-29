import { Children, ReactElement, cloneElement, isValidElement, useEffect } from "react";
import Typography from "../typografy/Typografy";
import { ColComponent, RowComponent } from "../../responsive/Responsive";

type DualistBoxType = {
  children: React.ReactNode;
};
type DualListSectionType = {
    id?: number | string,
    handleClick? :()=>void;
  data: {
    title: string;
    data: Array<{ label: string; id: number | string }>;
  };
};
type DualListType = {
    id?: number | string,
    handleAction? :()=>void;
  title: string;
  children: React.ReactNode;
};
export const DualListSection: React.FC<DualListSectionType> = ({ data,handleClick,id }) => {
  return (
      <div onClick={
        ()=>{
            console.log(id)
        }
      }  className=" p-4 bg-white shadow-md rounded-md border border-gray-200 hover:shadow-lg transition-shadow">
      <Typography weight="semibold" size="lg" color="black" variant="body">
        {data.title}
      </Typography>
      {Array.isArray(data.data) &&
        data.data.map((item) => {
          return (
             <Typography
              key={item.id}
              weight="light"
              size="base"
              color="black"
              variant="body"
            >
              {item.label}
            </Typography>
          );
        })}
        </div>
    
  );
};
export const DualList: React.FC<DualListType> = ({ children,title,handleAction,id }) => {
  useEffect(() => {}, [children]);

  const handleClick = () => {
    console.log('Acción ejecutada');
  };

  const lists = Children.map(children, (child, index) => {
    if (isValidElement(child) && child.type === DualListSection) {
      // Asegúrate de que `child` sea un `ReactElement` que acepte las props adecuadas.
      return cloneElement(child as ReactElement<any>, {
        id: `dual-section-${id}-${index}`,
        handleClick,
      });
    }
    return null;
  });
  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 shadow-lg border border-gray-300 rounded-lg mt-4 mb-4 p-6">
    <div className="text-center mb-4">
      <Typography
        color="black"
        size="xl"
        weight="bold"
        variant="h3"
        className="tracking-wide"
      >
        {title}
      </Typography>
      <div className="h-1 bg-gradient-to-r from-blue-400 to-cyan-500 mx-auto w-16 rounded mt-2"></div>
    </div>
    <div className="space-y-4">
      {lists?.map((list, index) => (
        <div
          key={index}

        >
          {list}
        </div>
      ))}
    </div>
  </div>
  
  );
};
export const DualListBox: React.FC<DualistBoxType> = ({ children }) => {
    const handleAction = () => {
      console.log('Acción ejecutada');
    };
  
    const lists = Children.map(children, (child, index) => {
      if (isValidElement(child) && child.type === DualList) {
        // Asegúrate de que `child` sea un `ReactElement` que acepte las props adecuadas.
        return cloneElement(child as ReactElement<any>, {
          id: `dual-list-${index}`,
          handleAction,
        });
      }
      return null;
    });
  
    return (
      <div className="shadow-sm bg-slate-100 border-2 mt-10">
        <RowComponent>
          {lists?.map((list, index) => (
            <ColComponent
              key={index}
              responsive={{ "2xl": 6, lg: 6, md: 12, sm: 12, xl: 12 }}
            >
              {list}
            </ColComponent>
          ))}
        </RowComponent>
      </div>
    );
  };
  
