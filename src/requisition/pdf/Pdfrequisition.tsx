import React, { useState } from "react";
import ModalComponent from "../../components/modal/Modal";
import { Document, Page,StyleSheet, Text, View } from "@react-pdf/renderer";
import PdfViewer from "./PdfPrueba";

type PdfRequisitionType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filePath?: string;
};

const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#E4E4E4'
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1
    }
  });


const PdfRequisition: React.FC<PdfRequisitionType> = ({ open, setOpen, filePath }) => {
  return (
    <ModalComponent title="Requisición" open={open} setOpen={setOpen}>
      <div className="container mx-auto p-5">
    
        <PdfViewer  />
    
    </div>
    </ModalComponent>
  );
};

export default PdfRequisition;
