// Spinner.tsx con fondo oscuro
const Spinner = () => {
    return (
      <div className="fixed z-[3000] inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-white border-dashed rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  };
  
  export default Spinner;
  