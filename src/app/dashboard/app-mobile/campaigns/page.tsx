"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import { CampaignTable, CampaignForm } from "../../components/app-mobile/campaigns/index";
import { ChangeEvent, MouseEvent } from "react";
import PageContent from "../../components/dashboard/pageContent";
import GlassCard from "../../components/dashboard/glassCard";
import { MobileCampaign } from "@interfaces/MobileCampaign";

const CategoryPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<MobileCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsedit] = useState(true);
  const [campaign, setCampaign] = useState<MobileCampaign | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const port = process.env.NEXT_PUBLIC_PORT;
  const UPLOAD_IMAGE_ENDPOINT = `${baseUrl}:${port}/mobile-campaigns/upload-image`;

  // **IMPORTANTE:** Define una URL de imagen por defecto real y válida aquí
  // Esta URL DEBE apuntar a una imagen existente y accesible en tu servidor o un servicio de imágenes.
  // Ejemplo: Podría ser un logo por defecto, o una imagen genérica.
  const DEFAULT_IMAGE_URL = "https://via.placeholder.com/150"; // Usando un placeholder público como ejemplo

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}:${port}/mobile-campaigns`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Error HTTP! estado: ${response.status}, mensaje: ${
              errorText || "No hay mensaje"
            }`
          );
        }
        const jsonData = await response.json();
        setCampaigns(jsonData);
      } catch (err: any) {
        setError(err.message);
        console.error("Error al obtener datos:", err);
        showSnackbar(`Error al cargar la Campaña: ${err.message}`, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (campaign: MobileCampaign) => {
    setCampaign(campaign);
    setIsedit(true);
    setOpen(true);
  };

  const handleCreate = () => {
    setCampaign(null);
    setIsedit(true);
    setOpen(true);
  };

  const handleView = (campaign: MobileCampaign) => {
    setIsedit(false);
    setCampaign(campaign);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${baseUrl}:${port}/mobile-campaigns/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error HTTP! estado: ${response.status}`);
      }

      setCampaigns(campaigns.filter((campaign) => campaign.campaignsId !== id));
      showSnackbar("Campaña eliminada exitosamente", "success");
    } catch (error: any) {
      console.error("Error al eliminar Campaña: ", error);
      showSnackbar("Error al eliminar Campaña", "error");
    }
  };

  const handleSave = async (campaignData: MobileCampaign, imageFile?: File | null) => {
    try {
      const method = campaignData.campaignsId ? "PATCH" : "POST";
      const url = method === 'POST'
        ? `${baseUrl}:${port}/mobile-campaigns/`
        : `${baseUrl}:${port}/mobile-campaigns/${campaignData.campaignsId}`;

      let bodyData;

      // Lógica para determinar el imageUrl a enviar en la solicitud principal
      let imageUrlToUse: string | null = null;

      if (method === 'POST') {
        // Para nuevas campañas: si se sube un archivo, no necesitamos el placeholder aquí, pero si no, mandamos el default.
        // Si el backend es estricto y el campo `imageUrl` es OBLIGATORIO Y DEBE SER VÁLIDO en la primera petición (POST),
        // entonces siempre debemos enviar una URL válida, incluso si es una temporal o por defecto.
        imageUrlToUse = imageFile ? null : DEFAULT_IMAGE_URL; // Si hay archivo, no mandes URL inicial (se subirá luego). Si no, manda la URL por defecto.
                                                              // PERO, si el backend dice "obligatorio", es mejor mandar el DEFAULT_IMAGE_URL siempre
                                                              // y que se sobrescriba luego.

        // Reevaluando la lógica, si el backend *siempre* espera una URL válida en la primera petición,
        // incluso si la imagen se sube después, la única forma de evitar el 400 es mandar una URL válida
        // que será reemplazada más tarde por la real.
        imageUrlToUse = DEFAULT_IMAGE_URL; // Siempre enviar una URL válida para POST
      } else { // PATCH
        // Para actualizaciones: usar la URL existente de la campaña o el placeholder si la URL existente es nula
        imageUrlToUse = campaignData.imageUrl || DEFAULT_IMAGE_URL;
        // Si se seleccionó un nuevo archivo, el backend debería actualizar la URL después de la subida,
        // así que la URL que enviamos aquí para PATCH será la existente (o el placeholder)
        // y se actualizará si hay una nueva subida.
      }

      // Asegurarse de que imageUrlToUse nunca sea null si el backend es estricto con "obligatorio"
      if (!imageUrlToUse) {
          // Esto puede ocurrir si imageFile es true en un POST y imageUrlToUse se setea a null.
          // Si el backend requiere una URL inicial válida, esto es un problema.
          // Forzamos el uso de la URL por defecto en este escenario también.
          imageUrlToUse = DEFAULT_IMAGE_URL;
      }


      if (method === 'POST') {
        bodyData = {
          title: campaignData.title,
          description: campaignData.description,
          imageUrl: imageUrlToUse, // Envía la URL de la imagen por defecto
          startDate: campaignData.startDate,
          endDate: campaignData.endDate,
          isActive: campaignData.isActive,
        };
      } else { // PATCH
        bodyData = {
          campaignsId: campaignData.campaignsId,
          title: campaignData.title,
          description: campaignData.description,
          imageUrl: imageUrlToUse, // Envía la URL existente o por defecto para actualizaciones
          startDate: campaignData.startDate,
          endDate: campaignData.endDate,
          isActive: campaignData.isActive,
        };
      }

      // 1. Guardar/Actualizar Detalles de la Campaña
      const campaignResponse = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (!campaignResponse.ok) {
        const errorText = await campaignResponse.text();
        throw new Error(
          `Error HTTP! estado: ${campaignResponse.status}, mensaje: ${
            errorText || "No hay mensaje"
          }`
        );
      }

      const savedCampaign: MobileCampaign = await campaignResponse.json();
      let finalCampaign: MobileCampaign = savedCampaign;

      // 2. Subir Imagen (si se seleccionó un archivo)
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadResponse = await fetch(`${UPLOAD_IMAGE_ENDPOINT}/${savedCampaign.campaignsId}`, {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error(`Error al subir la imagen para la campaña ${savedCampaign.campaignsId}:`, errorText);
          showSnackbar(`Campaña guardada, pero la subida de imagen falló: ${errorText}`, 'warning');
        } else {
            const uploadedImageData = await uploadResponse.json();
            // Asumiendo que el backend devuelve la campaña actualizada o al menos la nueva imageUrl
            finalCampaign = { ...savedCampaign, imageUrl: uploadedImageData.imageUrl || savedCampaign.imageUrl };
            showSnackbar('Imagen subida exitosamente!', 'success');
        }
      } else if (method === 'PATCH' && campaignData.imageUrl === null && finalCampaign.imageUrl !== null) {
          // Esto se mantiene para asegurar que el estado local refleje un borrado de imagen si el backend lo permite
          // y devuelve una URL nula en la respuesta de PATCH para la campaña principal.
          finalCampaign = { ...finalCampaign, imageUrl: null };
      }

      // Actualizar estado con la campaña (incluyendo potencialmente la nueva imageUrl)
      if (method === "POST") {
        setCampaigns([...campaigns, finalCampaign]);
        showSnackbar("Campaña creada exitosamente", "success");
      } else {
        setCampaigns(
          campaigns.map((p) =>
            p.campaignsId === finalCampaign.campaignsId ? finalCampaign : p
          )
        );
        showSnackbar("Campaña actualizada exitosamente", "success");
      }

      setOpen(false);
      setCampaign(null);
    } catch (error: any) {
      console.error("Error al guardar la Campaña: ", error);
      showSnackbar(`Error al guardar la Campaña: ${error.message}`, "error");
    }
  };

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const lowerCaseSearch = searchQuery.toLowerCase();
    const nameMatch = campaign.title.toLowerCase().includes(lowerCaseSearch);

    return nameMatch;
  });

  const theme = useTheme();

  return (
    <PageContent>
      <GlassCard>
        <Box sx={{ width: "100%", minHeight: 200, overflowY: "auto", p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5" component="h2">
              Campañas
            </Typography>
            <Button variant="contained" onClick={() => handleCreate()}>
              Agregar Nueva Campaña
            </Button>
          </Box>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <FaSearch style={{ marginRight: 8 }} />,
            }}
            sx={{ mb: 2 }}
          />

          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <CampaignTable
              campaigns={filteredCampaigns}
              onEdit={handleEdit}
              onView={handleView}
              onDelete={handleDelete}
              orderBy={orderBy}
              order={order}
              handleSort={handleSort}
              page={page}
              rowsPerPage={rowsPerPage}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              searchQuery={searchQuery}
            />
          )}

          <CampaignForm
            open={open}
            isEdit={isEdit}
            onClose={() => setOpen(false)}
            campaign={campaign}
            onSave={handleSave}
          />

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbarSeverity}
              sx={{ width: "auto", minWidth: 300, fontSize: "1.2rem", padding: "1rem" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </GlassCard>
    </PageContent>
  );
};

export default CategoryPage;