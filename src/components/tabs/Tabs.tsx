import React, { useState } from "react";
import { TabsInterface } from './TabsInterface'; // Asegúrate de que la ruta sea correcta

export const TabsComponent: React.FC<TabsInterface> = ({ children }) => {
  // Convierte children en un array y verifica que no esté vacío
  const childrenArray = React.Children.toArray(children);
  const firstChild = React.isValidElement(childrenArray[0]) ? childrenArray[0] : null;

  // Si no hay hijos, puedes manejarlo como desees (por ejemplo, mostrando un mensaje)
  const [activeTab, setActiveTab] = useState(firstChild ? firstChild.props.title : '');

  const renderContent = () => {
    const activeTabElement = childrenArray.find((child) =>
      React.isValidElement(child) && child.props.title === activeTab
    );

    // Verifica que activeTabElement sea un elemento válido antes de acceder a props
    return React.isValidElement(activeTabElement) ? (
      <div className="p-4">{activeTabElement.props.children}</div>
    ) : null;
  };

  return (
    <>
      <div className="border-b-2 border-gray-300">
        <ul className="flex cursor-pointer">
          {React.Children.map(children, (child) => (
            React.isValidElement(child) && (
              <li
                key={child.props.title}
                onClick={() => setActiveTab(child.props.title)}
                className={`py-2 px-6 rounded-t-md -mb-2 border border-b-0 text-gray-700  ${
                  activeTab === child.props.title
                    ? "bg-white border-gray-300"
                    : "bg-gray-100 text-gray-500 hover:bg-white hover:text-gray-700"
                }`}
              >
                {child.props.title}
              </li>
            )
          ))}
        </ul>
      </div>
      <div className="bg-gray-50 p-4 border border-gray-300 rounded-b-md">
        {renderContent()}
      </div>
    </>
  );
};

// Componente TabElement
export const TabElement: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  return (
    <div>
      {children}
    </div>
  );
};
