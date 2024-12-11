import React, { useState, useEffect } from "react";
import jsPDF from "jspdf"; // Importación del módulo jsPDF desde npm

const PdfViewer: React.FC = () => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    useEffect(() => {
        // Función para crear un PDF simple usando jsPDF
        const createPdf = () => {
            const doc = new jsPDF();

            // Crear contenido usando Tailwind CSS como texto
            const content = `
                <div class="p-5 bg-blue-500 text-white rounded-lg shadow-lg">
                    <h1 class="text-2xl font-bold">PDF con Tailwind CSS</h1>
                    <p>Este es un ejemplo de cómo usar Tailwind CSS en un PDF generado con jsPDF.</p>
                </div>
            `;
             doc.html(content);
            // Añadir contenido como texto al PDF

            const file = doc.output("blob");
            const url = URL.createObjectURL(file);
            setPdfUrl(url);
        };

        createPdf();
    }, []);

    return (
     
                 
                        <iframe
                            src={`${pdfUrl}`}
                            title="PDF generado"
                            className="w-full h-[500px] border-none"
                            allowFullScreen
                        ></iframe>
                 
           
    );
};

export default PdfViewer;
