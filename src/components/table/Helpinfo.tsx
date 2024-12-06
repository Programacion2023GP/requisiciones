import { FiFilter } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

const HelpModal = () => {
  return (
    <div className="space-y-8 container p-8">
      {/* General Search */}
      <section>
        <h3 className="text-2xl font-semibold text-gray-900">1. Búsqueda por Columna</h3>
        <p className="text-lg text-gray-700">
          Si quieres realizar una búsqueda específica en una columna, puedes usar los filtros de la cabecera.
        </p>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <FiFilter className="text-white w-6 h-6" />
          <p className="text-xl font-semibold">
            **¿Cómo identificarlo?** Haz clic en el ícono de flecha hacia abajo en la cabecera de cualquier columna.
          </p>
        </div>
        <ul className="list-disc pl-6 text-gray-800 mt-4">
          <li>
            Si seleccionas una columna de texto (por ejemplo, "Nombre"), podrás elegir entre varias opciones de filtrado:
            <ul className="list-disc pl-6">
              <li><strong>Contiene:</strong> Encuentra todas las filas que contengan las palabras que escribas.</li>
              <li><strong>Empieza con:</strong> Encuentra valores que comienzan con un texto específico.</li>
              <li><strong>Es igual a:</strong> Busca filas donde el valor sea exactamente igual al ingresado.</li>
            </ul>
          </li>
          <li>
            Si seleccionas una columna de fecha, las opciones incluyen:
            <ul className="list-disc pl-6">
              <li><strong>Rango de fechas:</strong> Filtra entre dos fechas específicas.</li>
              <li><strong>Fecha exacta:</strong> Filtra para encontrar un valor de fecha exacto.</li>
              <li><strong>Antes de:</strong> Muestra filas con fechas anteriores a la fecha seleccionada.</li>
            </ul>
          </li>
        </ul>
        <p className="mt-2 text-gray-800">
          📍 **Ejemplo**: Si buscas un nombre, haz clic en el filtro de la columna "Nombre", selecciona "Contiene", y escribe "Ana". Así verás todas las filas con "Ana" en el nombre.
        </p>
      </section>

      {/* Filters */}
      <section>
        <h3 className="text-2xl font-semibold text-gray-900">2. Buscador General y Específicos</h3>
        <p className="text-lg text-gray-700">
          Aplica filtros más detallados desde un panel lateral que te permite refinar la búsqueda.
        </p>
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <FiFilter className="text-white w-6 h-6" />
          <p className="text-xl font-semibold">
            🔍 **¿Cómo acceder?** Busca el botón "Buscador y filtros" en la parte superior de la tabla.
          </p>
        </div>
        <ol className="list-decimal pl-6 text-gray-800 mt-4">
          <li>Haz clic en el botón **"Buscador y filtros"** para abrir el panel lateral.</li>
          <li>Verás un conjunto de columnas con opciones para elegir los valores a filtrar.</li>
          <li>Selecciona los valores deseados o ingresa un término específico para realizar la búsqueda.</li>
        </ol>
        <p className="mt-2 text-gray-800">
          📍 **Ejemplo**: En la columna "Ciudad", marca el valor "Madrid" para ver solo las filas correspondientes a Madrid.
        </p>
      </section>

      {/* Pagination */}
      <section>
        <h3 className="text-2xl font-semibold text-gray-900">3. Paginación</h3>
        <p className="text-lg text-gray-700">
          Navega entre las páginas de resultados utilizando los controles de paginación.
        </p>
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <IoIosArrowBack className="text-white w-6 h-6" />
          <IoIosArrowForward className="text-white w-6 h-6" />
          <p className="text-xl font-semibold">
            **¿Cómo identificarlo?** Encuentra los controles de paginación en la parte inferior de la tabla.
          </p>
        </div>
        <ul className="list-disc pl-6 text-gray-800 mt-4">
          <li>Usa las flechas (<strong>← →</strong>) para avanzar o retroceder entre las páginas de resultados.</li>
          <li>Cambia el número de filas visibles seleccionando una opción en el menú desplegable (por ejemplo, 10, 25, 50, 100).</li>
        </ul>
        <p className="mt-2 text-gray-800">
          📍 **Ejemplo**: Cambia el número de filas a 50 para ver más resultados sin cambiar de página constantemente.
        </p>
      </section>

      {/* Column Visibility */}
      <section>
        <h3 className="text-2xl font-semibold text-gray-900">4. Columnas</h3>
        <p className="text-lg text-gray-700">
          Mostrar u ocultar columnas en la tabla usando los checkboxes.
        </p>
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <input
            type="checkbox"
            checked={true}
            // onChange={() => toggleColumnVisibility(col.field)}
            className="w-5 mb-1 h-5 cursor-pointer text-teal-600 bg-gray-200 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 transition duration-200 ease-in-out"
          />
          <p className="text-xl font-semibold">
            **¿Cómo identificarlo?** Encuentra los controles en las columnas.
          </p>
        </div>

        <ul className="list-disc pl-6 text-gray-800 mt-4">
          <li>
            Usa los checkboxes para mostrar u ocultar las columnas en la tabla. Cada vez que marques o desmarques una columna, esta se mostrará o desaparecerá.
          </li>
        </ul>

        <p className="mt-2 text-gray-800">
          📍 **Ejemplo**: Presiona el checkbox junto a cada columna para mostrarla o quitarla de la vista en la tabla.
        </p>
      </section>

    </div>
  );
};

export default HelpModal;
